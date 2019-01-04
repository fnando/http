import http from "http";
import https from "https";
import querystring from "querystring";
import { URL } from "url";

import {
  buildUrl,
  prepareOptions,
  handleRequestError,
  normalizeHeaders,
  runMiddleware
} from "../utils";

import {
  BODY
} from "../constants";

import basicAuthMiddleware from "../middleware/basic_auth_middleware";
import bodyMiddleware from "../middleware/body_middleware";
import jsonBodyMiddleware from "../middleware/json_body_middleware";
import jsonResponseMiddleware from "../middleware/json_response_middleware";
import responseStatusMiddleware from "../middleware/response_status_middleware";

function handleResponse(request, method, middleware, resolve, response) {
  let responseBody = Buffer.from([]);

  response.on("data", chunk => {
    responseBody = Buffer.concat([responseBody, Buffer.from(chunk)]);
  });

  response.on("end", () => {
    let returnValue = {
      body: responseBody,
      status: response.statusCode,
      request,
      response,
      method,
      headers: response.headers
    };

    returnValue = runMiddleware(middleware, returnValue);

    resolve(returnValue);
  });
}

function handleError(request, middleware, reject, error) {
  handleRequestError(error, middleware, request, reject);
}

function handleTimeout(request, middleware, reject) {
  const error = new Error("Request timed out");
  error.timeout = true;

  handleRequestError(error, middleware, request, reject);
  request.abort();
}

function handleAbort(request, middleware, reject) {
  const error = new Error("Aborted request");
  error.aborted = true;
  handleRequestError(error, middleware, request, reject);
}

function buildRequest(url, method, headers, timeout) {
  const uri = new URL(url);
  const engine = uri.protocol === "http:" ? http : https;

  const request = engine.request(uri, {
    method,
    headers,
    timeout
  });

  return request;
}

/**
 * Perform http requests using [http](https://nodejs.org/api/http.html) and [https](https://nodejs.org/api/https.html).
 *
 * ```js
 * client
 *   .get("https://example.com")
 *   .then((response, request) => console.log(response, request))
 *   .catch(error => console.log(error, error.request, error.aborted));
 * ```
 *
 * @param  {String} method           The HTTP request method.
 * @param  {Object} middlewares      The middleware chain.
 * @param  {String} url              The request url.
 * @param  {Object} params           The request params.
 * @param  {Object} options.auth     An object representing the basic authentication credentials.
 *                                   It must be something like `{username, password}`.
 * @param  {Object} options.headers  The request headers. Header names should be defined in lowercase form.
 * @param  {Object} options.timeout  The request timeout. Default to 0 (never times out).
 * @param  {Object} options.body     The request body. In case you want to specify it manually.
 * @return {Promise}                 A custom response promise that has an additional `.abort()`
 *                                   method that aborts the in-flight request. Aborted requests will
 *                                   reject the promise.
 */
export function adapter(method, middlewares, url, params, options) {
  params = params || {};
  options = prepareOptions(options);

  options = runMiddleware(middlewares.request, {...options, params, method, url});
  options.headers = normalizeHeaders(options.headers);
  options.url = buildUrl(options.url, options.params, BODY[options.method].request, querystring.stringify);

  const request = buildRequest(options.url, options.method, options.headers, options.timeout);

  const promise = new Promise(function(resolve, reject) {
    request.once("response", handleResponse.bind(null, request, options.method, middlewares.response, resolve));
    request.once("abort", handleAbort.bind(null, request, middlewares.error, reject));
    request.on("timeout", handleTimeout.bind(null, request, middlewares.error, reject));
    request.on("error", handleError.bind(null, request, middlewares.error, reject));

    if (options.body) {
      request.write(options.body);
    }

    request.end();
  });

  promise.abort = () => {
    request.emit("abort");
    request.abort();
  };

  return promise;
}

adapter.setup = client => {
  client.middleware("request", basicAuthMiddleware);
  client.middleware("request", jsonBodyMiddleware); // must be added before bodyMiddleware
  client.middleware("request", bodyMiddleware.bind(null, querystring.stringify));
  client.middleware("response", jsonResponseMiddleware);
  client.middleware("response", responseStatusMiddleware);
};

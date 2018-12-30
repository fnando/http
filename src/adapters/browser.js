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

export default function encodeParams(params) {
  return Object
          .keys(params)
          .map(key => (encodeURIComponent(key) + "=" + encodeURIComponent(params[key])))
          .join("&");
}

function parseResponseHeaders(rawHeaders) {
  const lines = rawHeaders.split(/\r?\n/).filter(line => !!line);
  return lines.reduce((buffer, row) => {
    const [_, name, value] = row.match(/^(.*?):\s*(.*?)$/);

    buffer[name.toLowerCase()] = value;
    return buffer;
  }, {});
}

function handleOnload(method, request, middleware, resolve) {
  let response = {
    body: request.responseText,
    status: request.status,
    request,
    response: request,
    method: method,
    headers: parseResponseHeaders(request.getAllResponseHeaders())
  };

  response = runMiddleware(middleware, response);

  resolve(response);
}

function handleTimeout(request, middleware, reject) {
  const error = new Error("Request timed out");
  error.timeout = true;

  handleRequestError(error, middleware, request, reject);
}

function handleError(request, middleware, reject) {
  const error = new Error("Request errored out");

  handleRequestError(error, middleware, request, reject);
}

function handleAbort(request, middleware, reject) {
  const error = new Error("Aborted request");
  error.aborted = true;

  handleRequestError(error, middleware, request, reject);
}

/**
 * Perform http requests using [XMLHttpRequest](https://developer.mozilla.org/en-US/docs/Web/API/XMLHTTPRequest).
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

  const request = new XMLHttpRequest();

  const promise = new Promise((resolve, reject) => {
    options = runMiddleware(middlewares.request, {...options, params, method, url});
    options.headers = normalizeHeaders(options.headers);
    options.url = buildUrl(options.url, options.params, BODY[options.method].request, encodeParams);

    request.open(options.method, options.url, true);

    Object.keys(options.headers).forEach(key => {
      request.setRequestHeader(key, options.headers[key]);
    });

    request.withCredentials = true;
    request.timeout = options.timeout;
    request.send(options.body);

    request.onload = handleOnload.bind(null, options.method, request, middlewares.response, resolve);
    request.ontimeout = handleTimeout.bind(null, request, middlewares.error, reject);
    request.onerror = handleError.bind(null, request, middlewares.error, reject);
    request.onabort = handleAbort.bind(null, request, middlewares.error, reject);
  });

  promise.abort = () => {
    request.abort();
  };

  return promise;
}

adapter.setup = (client) => {
  client.middleware("request", basicAuthMiddleware);
  client.middleware("request", jsonBodyMiddleware); // must be added before bodyMiddleware
  client.middleware("request", bodyMiddleware.bind(null, encodeParams));
  client.middleware("response", jsonResponseMiddleware);
  client.middleware("response", responseStatusMiddleware);
};

![@fnando/http: Simple HTTP client for both Node.js and the browser.](https://github.com/fnando/http/raw/main/http.png)

<p align="center">
  <a rel="noreferrer noopener" href="https://travis-ci.org/fnando/http"><img src="https://travis-ci.org/fnando/http.svg" alt="Travis-CI" /></a>
  <a rel="noreferrer noopener" href="https://www.npmjs.com/package/@fnando/http"><img src="https://img.shields.io/npm/v/@fnando/http.svg" alt="NPM Package Version"></a>
  <a href="https://codeclimate.com/github/fnando/http"><img src="https://codeclimate.com/github/fnando/http/badges/gpa.svg" alt="Code Climate"></a>
  <a href="https://codeclimate.com/github/fnando/http/coverage"><img src="https://codeclimate.com/github/fnando/http/badges/coverage.svg" alt="Test Coverage"></a>
  <img src="https://img.shields.io/badge/license-MIT-orange.svg" alt="License: MIT">
  <img src="http://img.badgesize.io/fnando/http/master/dist/http.js.svg?label=min+size" alt="Minified size">
  <img src="http://img.badgesize.io/fnando/http/master/dist/http.js.svg?compression=gzip&label=min%2Bgzip+size" alt="Minified+gzip size">
</p>

## Instalation

This lib is available as a NPM package. To install it, use the following command:

```
npm install @fnando/http --save
```

If you're using Yarn (and you should):

```
yarn add @fnando/http
```

## Importing HTTP

If you're using `import`:

```js
import http from "@fnando/http";

const client = http.client(http.adapter);

client
  .get("/me")
  .then(response => console.log(response))
  .catch(error => console.log(error));
```

## More examples

```js
import { client, adapter } from "@fnando/http";
const http = client(adapter);

// The request middleware can modify the options
// that represent the request.
http.middleware("request", options => {
  options.headers["user-agent"] = "reporteo";
  return options;
});

// The response middleware can modify the response
// object.
http.middleware("response", response => {
  response.passedByMiddleware = true;
  return response;
});

// The error middleware will receive the error object.
// The request object is available under `error.request`.
http.middleware("error", err => {
  console.log("ERROR HANDLED BY MIDDLEWARE:", err);
});

function success(description) {
  return function(response) {
    console.log(description, response.data);
  };
}

function error(description) {
  return function(err) {
    console.log(description, err);
  };
}

http
  .get("https://httpbin.org/get", {number: 42, message: "hello there!"})
  .then(success("GET with query string"))
  .catch(error("GET with query string"));

http
  .get("https://httpbin.org/get")
  .then(success("GET"))
  .catch(error("GET"));

http
  .post("https://httpbin.org/post", {number: 42, message: "hello there!"})
  .then(success("POST"))
  .catch(error("POST"));

http
  .post("https://httpbin.org/post", {message: "hello from json"}, {headers: {"content-type": "application/json"}})
  .then(success("POST with JSON body"))
  .catch(error("POST with JSON body"));

const formData = new FormData();
formData.append("description", "Using FormData");
formData.append("file", new Blob(["a file upload"], {type: "text/plain"}), "readme.txt");

http
  .post("https://httpbin.org/post", formData)
  .then(success("POST with Form Data"))
  .catch(error("POST with Form Data"));

http
  .put("https://httpbin.org/put", {name: "John Doe"})
  .then(success("PUT"))
  .catch(error("PUT"));

http
  .patch("https://httpbin.org/patch", {name: "John Doe"})
  .then(success("PATCH"))
  .catch(error("PATCH"));

http
  .delete("https://httpbin.org/delete", {name: "John Doe"}, {headers: {"user-agent": "reporteo - delete"}})
  .then(success("DELETE"))
  .catch(error("DELETE"));

// To abort an in-flight request, you call `.abort()` on
// the response object.
const response = http.get("https://httpbin.org/get");
                     .catch(error => console.log(error, error.aborted));
response.abort();
```

## Node.js

Install <https://github.com/evanw/node-source-map-support> to enable sourcemaps support in Node.js.

```console
$ yarn add -DE source-map-support
```

## API

### Response

The `response` object will carry the following attributes:

- `body`: The response's body string as it is.
- `status`: The status code (integer).
- `request`: The request object (`XMLHttpRequest` for browser, `http.ClientRequest` for Node.js).

Middleware chain may modify this objects and add/remove properties. By default, _http_ will add a few middleware functions that change the response. Read more about it under "Default middleware chain".

### Middleware

_http_ comes with three distinct middleware chains: `request`, `response`, and `error`.

#### `request` middleware functions

Before performing a request, the `request` chain will be executed with the `options` object that represents that request. A middleware function may add headers, change parameters, change the request body, modify the request timeout, and change the URL.

A middleware function must have the following signature:

```js
function requestMiddlewareFunction(options) {
  return options;
}
```

`options` will have the following properties by default:

- `options.auth`: An object like `{username, password}` that will be used for basic authentication.
- `options.body`: A string that represents the request body.
- `options.headers`: An object representing the request headers. The recommended form for header names is lowercase (e.g. `content-type`).
- `options.method`: A string representing the request method (e.g. `get`).
- `options.params`: The params for that given request. When performing `GET`/`HEAD`/`DELETE` requests, parameters will be appended to the URL. The middleware function `bodyMiddleware` will set the body out of the `params` object. The `jsonBodyMiddleware` will set the body to `JSON.stringify(params)` if your `content-type` header is `application/json`.
- `options.timeout`: The request timeout in milliseconds. Defaults to `0` (no timeout).
- `options.url`: A string representing the request URL.

#### `response` middleware functions

After performing a request, the `response` chain will be executed with an object representing the response. A middleware function may add new properties, modify the response body, serialize the response body, and change the response status code.

A middleware function must have the following signature:

```js
function responseMiddlewareFunction(response) {
  return response;
}
```

`response` will have the following properties by default:

- `response.status`: An integer representing the response status code.
- `response.body`: A string representing the response body.
- `response.method`: A string representing the request method (this is added for convenience, as the request method is not available on the request object in any form).
- `response.headers`: An object representing the response headers.
- `response.request`: The object that represents the request.
- `response.response`: The object that represents the response. For client-side, this will be the same object as `response.request`.

#### `error` middleware functions

When a request fails (e.g. timeout), the `error` chain will be executed with an error object. A middleware function may instantiate a new error, add new properties, etc.

A middleware function must have the following signature:

```js
function errorMiddlewareFunction(error) {
  return error;
}
```

`error` may have the following properties, depending on the error:

- `error.request`: The request object.
- `error.timeout`: A boolean signaling that the error comes from a timed out request.
- `error.aborted`: A boolean signaling that the error comes from an aborted request.

Notice that client-side won't have the original error object because `XMLHttpRequest` doesn't make it available; `new Error("Request errored out")` will be returned instead.

#### Default Middleware chain

`request` chain:

- `basicAuthMiddleware`: set `Authorization` header out of `{auth: {username, password}` option.
- `jsonBodyMiddleware`: set the request body to the string representation of `params` when `{headers: {"content-type": "application/json"}}` is set.
- `bodyMiddleware`: set the request body based on the request method and the `params` object. `FormData` objects will be sent as it is. This will also set `Content-Type` header to `application/x-www-form-urlencoded` if not previously defined to anything else.

`response` chain:

- `jsonResponseMiddleware`: parses the response body with `JSON.parse(body)` and sets `request.data` to it whenever the response's `Content-Type` header matches `application/json`.
- `responseStatusMiddleware`: sets `success` to status codes that range from 2xx-3xx. Also set `response.redirect` and `response.location` when 3xx status is returned.

## Icon

Icon made by [xnimrodx](https://www.flaticon.com/authors/xnimrodx) from [Flaticon](https://www.flaticon.com/) is licensed by Creative Commons BY 3.0.

## License

(The MIT License)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

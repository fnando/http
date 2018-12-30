export function runMiddleware(chain, target) {
  return chain.reduce((buffer, middleware) => middleware(buffer), target);
}

export function normalizeHeaders(headers) {
  return Object.keys(headers).reduce((buffer, key) => (
    Object.assign(buffer, {[key.toLowerCase()]: headers[key]})
  ), {});
}

export function handleRequestError(error, middleware, request, reject) {
  error.request = request;
  error = runMiddleware(middleware, error);
  reject(error);
}

export function buildUrl(url, params, requestHasBody, encode) {
  if (!requestHasBody && Object.keys(params).length > 0) {
    url += url.includes("?") ? "&" : "?";
    url += encode(params);
  }

  return url;
}

export function prepareOptions(options) {
  return Object.assign({headers: {},
                        auth: {},
                        body: null,
                        method: null,
                        timeout: 0}, options || {});
}

export function client(adapter) {
  if (!adapter) {
    throw new Error("Adapter is required");
  }

  const middlewares = {request: [], response: [], error: []};
  const del     = (...args) => adapter("delete", middlewares, ...args);
  const get     = (...args) => adapter("get", middlewares, ...args);
  const head    = (...args) => adapter("head", middlewares, ...args);
  const options = (...args) => adapter("options", middlewares, ...args);
  const patch   = (...args) => adapter("patch", middlewares, ...args);
  const post    = (...args) => adapter("post", middlewares, ...args);
  const put     = (...args) => adapter("put", middlewares, ...args);

  const middleware = (chain, callback) => {
    if (callback) {
      middlewares[chain].push(callback);
    }

    return middlewares;
  };

  const httpClient = {get, post, put, patch, head, options, del, delete: del, middleware};

  adapter.setup(httpClient);

  return httpClient;
}

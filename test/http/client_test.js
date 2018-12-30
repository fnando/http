import assert from "assert";
import { JSDOM } from "jsdom";
import sinon from "sinon";

import { client as Client } from "../../src/client";

suite("client()", () => {
  test("raises when no adapter is provided", () => {
    assert.throws(() => { Client(); }, /Adapter is required/);
  });

  test("returns client", () => {
    const adapter = () => {};
    adapter.setup = () => {};

    const client = Client(adapter);

    assert.equal(typeof client.get, "function");
    assert.equal(typeof client.post, "function");
    assert.equal(typeof client.patch, "function");
    assert.equal(typeof client.put, "function");
    assert.equal(typeof client.del, "function");
    assert.equal(typeof client.delete, "function");
    assert.equal(typeof client.middleware, "function");
  });

  test("sets up client", () => {
    const adapter = () => {};
    adapter.setup = sinon.fake();

    const client = Client(adapter);

    assert(adapter.setup.calledWith(client));
  });

  [
    ["get", "get"],
    ["post", "post"],
    ["patch", "patch"],
    ["put", "put"],
    ["del", "delete"],
    ["delete", "delete"],
    ["head", "head"],
    ["options", "options"]
  ].forEach(([name, method]) => {
    test(`calls to http.${name}() performs ${method} requests`, () => {
      const adapter = sinon.fake();
      adapter.setup = sinon.fake();

      const client = Client(adapter);
      const middlewares = client.middleware();
      const url = "URL";
      const params = "PARAMS";
      const options = "OPTIONS";

      client[name](url, params, options);

      assert(adapter.calledWith(method, middlewares, url, params, options));
    });
  });

  test("adds response middleware", () => {
    const adapter = sinon.fake();
    adapter.setup = sinon.fake();

    const callback = () => {};
    const client = Client(adapter);
    const middlewares = client.middleware();

    client.middleware("response", callback);

    assert(middlewares.response.includes(callback));
  });

  test("adds request middleware", () => {
    const adapter = sinon.fake();
    adapter.setup = sinon.fake();

    const callback = () => {};
    const client = Client(adapter);
    const middlewares = client.middleware();

    client.middleware("request", callback);

    assert(middlewares.request.includes(callback));
  });

  test("adds error middleware", () => {
    const adapter = sinon.fake();
    adapter.setup = sinon.fake();

    const callback = () => {};
    const client = Client(adapter);
    const middlewares = client.middleware();

    client.middleware("error", callback);

    assert(middlewares.error.includes(callback));
  });
});

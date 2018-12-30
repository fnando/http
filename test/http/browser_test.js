import assert from "assert";
import sinon from "sinon";

import XMLHttpRequestMock from "../support/xml_http_request_mock";

import { client as Client } from "../../src/client";
import { adapter } from "../../src/adapters/browser";

function ok(xhr) {
  xhr.responseHeaders["content-type"] = "text/plain";
  xhr.status = 200;
  xhr.responseText = "hello";
  xhr.onload();
}

suite("browser adapter", () => {
  let client;

  suiteSetup(() => {
    global.XMLHttpRequest = XMLHttpRequestMock;
    global.FormData = () => {};
    global.atob = value => Buffer.from(value).toString("base64");
  });

  suiteTeardown(() => {
    delete global.XMLHttpRequest;
    delete global.FormData;
    delete global.atob;
  });

  setup(() => {
    XMLHttpRequestMock.request = null;
    XMLHttpRequestMock.responses.length = 0;

    client = Client(adapter);
  });

  teardown(() => {
    sinon.restore();
  });

  test("performs request", async () => {
    XMLHttpRequestMock.respond(ok);

    const response = await client.get("http://example.com/get");

    assert.equal(XMLHttpRequestMock.request.url, "http://example.com/get");
    assert.equal(XMLHttpRequestMock.request.method, "get");

    assert.equal(response.body, "hello");
    assert.equal(response.status, 200);
    assert.equal(response.method, "get");
    assert.equal(response.request, XMLHttpRequestMock.request);
    assert.equal(response.response, XMLHttpRequestMock.request);
    assert.deepEqual(response.headers, {"content-type": "text/plain"});
  });

  test("runs error middleware", done => {
    XMLHttpRequestMock.respond(xhr => {
      xhr.onerror();
    });

    let error;

    client.middleware("error", e => error = e);

    client
      .get("http://example.com/get")
      .catch(e => {
        assert(error);
        assert(e);
        assert.equal(error, e);
        done();
      });
  });

  test("runs XMLHttpRequestMock.request middleware", done => {
    let middlewareReq;

    XMLHttpRequestMock.respond(ok);

    const chain = client.middleware();
    chain.request.length = 0;

    client.middleware("request", req => (middlewareReq = req));

    client
      .get("http://example.com/get")
      .then(response => {
        const keys = Object.keys(middlewareReq);
        keys.sort();

        assert.deepEqual(keys, ["auth", "body", "headers", "method", "params", "timeout", "url"]);
        done();
      });
  });

  test("runs response middleware", done => {
    let middlewareRes;

    XMLHttpRequestMock.respond(ok);

    const chain = client.middleware();
    chain.response.length = 0;

    client.middleware("response", res => (middlewareRes = res));

    client
      .get("http://example.com/get")
      .then(response => {
        const keys = Object.keys(middlewareRes);
        keys.sort();

        assert.deepEqual(keys, ["body", "headers", "method", "request", "response", "status"]);
        done();
      });
  });

  test("handles error request", done => {
    XMLHttpRequestMock.respond(xhr => {
      xhr.onerror();
    });

    client
      .get("http://example.com/get")
      .catch(error => {
         assert.equal(error.message, "Request errored out");
         assert.equal(error.request, XMLHttpRequestMock.request);
         done();
      });
  });

  test("handles timed out request", done => {
    XMLHttpRequestMock.respond(xhr => {
      xhr.ontimeout();
    });

    client
      .get("http://example.com/get")
      .catch(error => {
         assert.equal(error.message, "Request timed out");
         assert(error.timeout);
         assert.equal(error.request, XMLHttpRequestMock.request);
         done();
      });
  });

  test("aborts request", done => {
    const response = client.get("http://example.com/abort")

    response.catch(error => {
       assert.equal(error.message, "Aborted request");
       assert.equal(error.request, XMLHttpRequestMock.request);
       assert(error.aborted);
       done();
    });

    response.abort();
  });

  test("normalizes header names", async () => {
    XMLHttpRequestMock.respond(ok);

    const response = await client.get("http://example.com/headers", null, {headers: {"USER-AGENT": "myapp"}})

    assert.equal(XMLHttpRequestMock.request.headers["user-agent"], "myapp");
  });

  test("parses json response", async () => {
    XMLHttpRequestMock.respond(xhr => {
      xhr.responseHeaders["content-type"] = "application/json";
      xhr.status = 200;
      xhr.responseText = JSON.stringify({message: "this is json"});
      xhr.onload();
    });

    const response = await client.get("http://example.com/json");

    assert.deepEqual(response.data, {message: "this is json"});
  });

  test("sets authentication header", async () => {
    XMLHttpRequestMock.respond(ok);

    const response = await client.get("http://example.com/auth", {}, {auth: {username: "u", password: "p"}});

    assert.equal(XMLHttpRequestMock.request.headers["authorization"], "Basic " + atob("u:p"));
  });

  test("sets timeout", async () => {
    XMLHttpRequestMock.respond(ok);

    const response = await client.get("http://example.com/timeout", {}, {timeout: 1234});

    assert.equal(XMLHttpRequestMock.request.timeout, 1234);
  });

  test("makes requests with credentials", async () => {
    XMLHttpRequestMock.respond(ok);

    const response = await client.get("http://example.com/creds");

    assert(XMLHttpRequestMock.request.withCredentials);
  });

  test("sets response status (2xx)", async () => {
    XMLHttpRequestMock.respond(xhr => {
      xhr.status = 200;
      xhr.responseHeaders["content-type"] = "text/plain";
      xhr.onload();
    });

    const response = await client.get("http://example.com/status");

    assert(response.success);
  });

  test("sets response status (3xx)", async () => {
    XMLHttpRequestMock.respond(xhr => {
      xhr.status = 301;
      xhr.responseHeaders["content-type"] = "text/plain";
      xhr.responseHeaders["location"] = "http://example.com/redirect";
      xhr.onload();
    });

    const response = await client.get("http://example.com/status");

    assert(response.success);
    assert(response.redirect);
    assert.equal(response.location, "http://example.com/redirect");
  });

  test("sets response status (4xx)", async () => {
    XMLHttpRequestMock.respond(xhr => {
      xhr.status = 401;
      xhr.responseHeaders["content-type"] = "text/plain";
      xhr.onload();
    });

    const response = await client.get("http://example.com/status");

    assert(!response.success);
  });

  test("sets response status (5xx)", async () => {
    XMLHttpRequestMock.respond(xhr => {
      xhr.status = 500;
      xhr.responseHeaders["content-type"] = "text/plain";
      xhr.onload();
    });

    const response = await client.get("http://example.com/status");

    assert(!response.success);
  });

  suite("GET", () => {
    test("performs request", async () => {
      XMLHttpRequestMock.respond(ok);

      const response = await client.get("http://example.com/get");

      assert.equal(XMLHttpRequestMock.request.url, "http://example.com/get");
      assert.equal(XMLHttpRequestMock.request.method, "get");
    });

    test("appends params to the url", async () => {
      XMLHttpRequestMock.respond(ok);

      const response = await client.get("http://example.com/get", {message: "hello there", number: 42});

      assert.equal(XMLHttpRequestMock.request.url, "http://example.com/get?message=hello%20there&number=42");
    });

    test("considers existing params", async () => {
      XMLHttpRequestMock.respond(ok);

      const response = await client.get("http://example.com/get?number=42", {message: "hello there", id: 37});

      assert.equal(XMLHttpRequestMock.request.url, "http://example.com/get?number=42&message=hello%20there&id=37");
    });
  });

  suite("POST", () => {
    test("performs request", async () => {
      XMLHttpRequestMock.respond(ok);

      const response = await client.post("http://example.com/post");

      assert.equal(XMLHttpRequestMock.request.url, "http://example.com/post");
      assert.equal(XMLHttpRequestMock.request.method, "post");
    });

    test("sets content type", async () => {
      XMLHttpRequestMock.respond(ok);

      const response = await client.post("http://example.com/post");

      assert.equal(XMLHttpRequestMock.request.headers["content-type"], "application/x-www-form-urlencoded");
    });

    test("sends body", async () => {
      XMLHttpRequestMock.respond(ok);


      const response = await client.post("http://example.com/post", {message: "hello there", number: 42});

      assert.equal(XMLHttpRequestMock.request.body, "message=hello%20there&number=42");
      assert.equal(XMLHttpRequestMock.request.headers["content-type"], "application/x-www-form-urlencoded");
    });

    test("sends form data body", async () => {
      XMLHttpRequestMock.respond(ok);

      const formData = new FormData();
      const response = await client.post("http://example.com/post", formData);

      assert.equal(XMLHttpRequestMock.request.body, formData);
      assert.notEqual(XMLHttpRequestMock.request.headers["content-type"], "application/x-www-form-urlencoded");
    });

    test("sends json body", async () => {
      XMLHttpRequestMock.respond(ok);

      const response = await client.post("http://example.com/post", {message: "hello there", number: 42}, {headers: {"content-type": "application/json"}});

      assert.equal(XMLHttpRequestMock.request.body, `{"message":"hello there","number":42}`);
      assert.equal(XMLHttpRequestMock.request.headers["content-type"], "application/json");
    });

    test("keeps existing body", async () => {
      XMLHttpRequestMock.respond(ok);

      const response = await client.post("http://example.com/body", {}, {body: "BODY"});

      assert.equal(XMLHttpRequestMock.request.body, "BODY");
    });

    test("keeps existing content type", async () => {
      XMLHttpRequestMock.respond(ok);

      const response = await client.post("http://example.com/body", {}, {headers: {"content-type": "multipart/form-data"}});

      assert.equal(XMLHttpRequestMock.request.headers["content-type"], "multipart/form-data");
    });

    test("ignores empty params", async () => {
      XMLHttpRequestMock.respond(ok);

      const response = await client.post("http://example.com/body", null);

      assert.equal(XMLHttpRequestMock.request.body, "");
    });
  });

  suite("PATCH", () => {
    test("performs request", async () => {
      XMLHttpRequestMock.respond(ok);

      const response = await client.patch("http://example.com/patch");

      assert.equal(XMLHttpRequestMock.request.url, "http://example.com/patch");
      assert.equal(XMLHttpRequestMock.request.method, "patch");
    });

    test("sets content type", async () => {
      XMLHttpRequestMock.respond(ok);

      const response = await client.patch("http://example.com/patch");

      assert.equal(XMLHttpRequestMock.request.headers["content-type"], "application/x-www-form-urlencoded");
    });

    test("sends body", async () => {
      XMLHttpRequestMock.respond(ok);

      const response = await client.patch("http://example.com/patch", {message: "hello there", number: 42});

      assert.equal(XMLHttpRequestMock.request.body, "message=hello%20there&number=42");
      assert.equal(XMLHttpRequestMock.request.headers["content-type"], "application/x-www-form-urlencoded");
    });

    test("sends form data body", async () => {
      XMLHttpRequestMock.respond(ok);

      const formData = new FormData();
      const response = await client.patch("http://example.com/patch", formData);

      assert.equal(XMLHttpRequestMock.request.body, formData);
      assert.notEqual(XMLHttpRequestMock.request.headers["content-type"], "application/x-www-form-urlencoded");
    });

    test("sends json body", async () => {
      XMLHttpRequestMock.respond(ok);

      const response = await client.patch("http://example.com/patch", {message: "hello there", number: 42}, {headers: {"content-type": "application/json"}});

      assert.equal(XMLHttpRequestMock.request.body, `{"message":"hello there","number":42}`);
      assert.equal(XMLHttpRequestMock.request.headers["content-type"], "application/json");
    });
  });

  suite("PUT", () => {
    test("performs request", async () => {
      XMLHttpRequestMock.respond(ok);

      const response = await client.put("http://example.com/put");

      assert.equal(XMLHttpRequestMock.request.url, "http://example.com/put");
      assert.equal(XMLHttpRequestMock.request.method, "put");
    });

    test("sets content type", async () => {
      XMLHttpRequestMock.respond(ok);

      const response = await client.put("http://example.com/put");

      assert.equal(XMLHttpRequestMock.request.headers["content-type"], "application/x-www-form-urlencoded");
    });

    test("sends body", async () => {
      XMLHttpRequestMock.respond(ok);

      const response = await client.put("http://example.com/put", {message: "hello there", number: 42});

      assert.equal(XMLHttpRequestMock.request.body, "message=hello%20there&number=42");
      assert.equal(XMLHttpRequestMock.request.headers["content-type"], "application/x-www-form-urlencoded");
    });

    test("sends form data body", async () => {
      XMLHttpRequestMock.respond(ok);

      const formData = new FormData();
      const response = await client.put("http://example.com/put", formData);

      assert.equal(XMLHttpRequestMock.request.body, formData);
      assert.notEqual(XMLHttpRequestMock.request.headers["content-type"], "application/x-www-form-urlencoded");
    });

    test("sends json body", async () => {
      XMLHttpRequestMock.respond(ok);

      const response = await client.put("http://example.com/put", {message: "hello there", number: 42}, {headers: {"content-type": "application/json"}});

      assert.equal(XMLHttpRequestMock.request.body, `{"message":"hello there","number":42}`);
      assert.equal(XMLHttpRequestMock.request.headers["content-type"], "application/json");
    });
  });

  suite("HEAD", () => {
    test("performs request", async () => {
      XMLHttpRequestMock.respond(ok);

      const response = await client.head("http://example.com/head");

      assert.equal(XMLHttpRequestMock.request.url, "http://example.com/head");
      assert.equal(XMLHttpRequestMock.request.method, "head");
    });

    test("appends params to the url", async () => {
      XMLHttpRequestMock.respond(ok);

      const response = await client.head("http://example.com/head", {message: "hello there", number: 42});

      assert.equal(XMLHttpRequestMock.request.url, "http://example.com/head?message=hello%20there&number=42");
    });

    test("considers existing params", async () => {
      XMLHttpRequestMock.respond(ok);

      const response = await client.head("http://example.com/head?number=42", {message: "hello there", id: 37});

      assert.equal(XMLHttpRequestMock.request.url, "http://example.com/head?number=42&message=hello%20there&id=37");
    });
  });

  suite("DELETE", () => {
    test("performs request", async () => {
      XMLHttpRequestMock.respond(ok);

      const response = await client.delete("http://example.com/delete");

      assert.equal(XMLHttpRequestMock.request.url, "http://example.com/delete");
      assert.equal(XMLHttpRequestMock.request.method, "delete");
    });

    test("appends params to the url", async () => {
      XMLHttpRequestMock.respond(ok);

      const response = await client.delete("http://example.com/delete", {message: "hello there", number: 42});

      assert.equal(XMLHttpRequestMock.request.url, "http://example.com/delete?message=hello%20there&number=42");
    });

    test("considers existing params", async () => {
      XMLHttpRequestMock.respond(ok);

      const response = await client.delete("http://example.com/delete?number=42", {message: "hello there", id: 37});

      assert.equal(XMLHttpRequestMock.request.url, "http://example.com/delete?number=42&message=hello%20there&id=37");
    });
  });

  suite("OPTIONS", () => {
    test("performs request", async () => {
      XMLHttpRequestMock.respond(ok);

      const response = await client.options("http://example.com/delete");

      assert.equal(XMLHttpRequestMock.request.url, "http://example.com/delete");
      assert.equal(XMLHttpRequestMock.request.method, "options");
    });

    test("appends params to the url", async () => {
      XMLHttpRequestMock.respond(ok);

      const response = await client.delete("http://example.com/options", {message: "hello there", number: 42});

      assert.equal(XMLHttpRequestMock.request.url, "http://example.com/options?message=hello%20there&number=42");
    });

    test("considers existing params", async () => {
      XMLHttpRequestMock.respond(ok);

      const response = await client.delete("http://example.com/options?number=42", {message: "hello there", id: 37});

      assert.equal(XMLHttpRequestMock.request.url, "http://example.com/options?number=42&message=hello%20there&id=37");
    });
  });
});

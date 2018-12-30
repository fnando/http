import assert from "assert";
import sinon from "sinon";
import http from "http";
import https from "https";
import EventEmitter from "events";

import { client as Client } from "../../src/client";
import { adapter } from "../../src/adapters/node";

function ok(requestMock, responseMock) {
  responseMock.headers["content-type"] = "text/plain";
  requestMock.emit("response", responseMock);
  responseMock.statusCode = 200;
  responseMock.emit("data", "hello");
  responseMock.emit("end");
}

const FakeRequest = {
  respond(callback) {
    this.requests.push(callback);
  },

  requests: []
};

suite("node adapter", () => {
  let client;
  let requestMock;
  let responseMock;
  let request;

  setup(() => {
    requestMock = new EventEmitter();
    responseMock = new http.IncomingMessage({readable: false});

    sinon.stub(http, "request").callsFake((url, options) => {
      request = {url, ...options};
      return requestMock;
    });

    sinon.stub(https, "request").callsFake((url, options) => {
      request = {url, ...options};
      return requestMock;
    });

    requestMock.write = body => (request.body = body);
    requestMock.abort = sinon.fake();
    requestMock.getHeader = name => request.headers[name];

    requestMock.end = () => {
      setTimeout(() => {
        const response = FakeRequest.requests.shift();
        response && response(requestMock, responseMock);
      });
    };

    client = Client(adapter);
  });

  teardown(() => {
    sinon.restore();
  });

  test("performs http request", async () => {
    FakeRequest.respond(ok);

    const response = await client.get("http://example.com/get");

    assert(http.request.calledOnce);
    assert(!https.request.calledOnce);

    assert.equal(request.url, "http://example.com/get");
    assert.equal(request.method, "get");

    assert.equal(response.body.toString(), "hello");
    assert.equal(response.status, 200);
    assert.equal(response.method, "get");
    assert.equal(response.request, requestMock);
    assert.equal(response.response, responseMock);
    assert.deepEqual(response.headers, {"content-type": "text/plain"});
  });

  test("performs https request", async () => {
    FakeRequest.respond(ok);

    const response = await client.get("https://example.com/get");

    assert(https.request.calledOnce);
    assert(!http.request.calledOnce);

    assert.equal(request.url, "https://example.com/get");
    assert.equal(request.method, "get");

    assert.equal(response.body.toString(), "hello");
    assert.equal(response.status, 200);
    assert.equal(response.method, "get");
    assert.equal(response.request, requestMock);
    assert.equal(response.response, responseMock);
    assert.deepEqual(response.headers, {"content-type": "text/plain"});
  });

  test("runs error middleware", done => {
    let expectedError = new Error("oh noes");
    let middlewareError;

    FakeRequest.respond(() => {
      requestMock.emit("error", expectedError);
      responseMock.emit("end");
    });

    client.middleware("error", error => (middlewareError = error));

    client
      .get("http://example.com/get")
      .catch(error => {
        assert(error);
        assert(middlewareError);
        assert.equal(middlewareError, expectedError);
        assert.equal(error, expectedError);
        assert.equal(error.request, requestMock);
        done();
      });
  });

  test("runs request middleware", done => {
    let middlewareReq;

    FakeRequest.respond(ok);

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

    FakeRequest.respond(ok);

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
    const expectedError = new Error("oh noes");

    FakeRequest.respond(() => {
      requestMock.emit("error", expectedError);
      responseMock.emit("end");
    });

    client
      .get("http://example.com/get")
      .catch(error => {
         assert.equal(error, expectedError);
         assert.equal(error.request, requestMock);
         done();
      });
  });

  test("handles timed out request", done => {
    FakeRequest.respond(() => {
      requestMock.emit("timeout");
      responseMock.emit("end");
    });

    client
      .get("http://example.com/get")
      .catch(error => {
         assert.equal(error.message, "Request timed out");
         assert.equal(error.request, requestMock);
         assert(error.timeout);
         done();
      });
  });

  test("aborts request", done => {
    const response = client.get("http://example.com/abort")

    response.catch(error => {
       assert.equal(error.message, "Aborted request");
       assert.equal(error.request, requestMock);
       assert(error.aborted);
       done();
    });

    response.abort();
  });

  test("normalizes header names", async () => {
    FakeRequest.respond(ok);

    await client.get("http://example.com/headers", {}, {headers: {"USER-AGENT": "myapp"}});

    assert.equal(http.request.lastCall.args[1].headers["user-agent"], "myapp");
  });

  test("parses json response", async () => {
    FakeRequest.respond(() => {
      responseMock.headers["content-type"] = "application/json";
      requestMock.emit("response", responseMock);
      responseMock.statusCode = 200;
      responseMock.emit("data", JSON.stringify({message: "this is json"}));
      responseMock.emit("end");
    });

    const response = await client.get("http://example.com/json");

    assert.deepEqual(response.data, {message: "this is json"});
  });

  test("sets authentication header", async () => {
    FakeRequest.respond(ok);

    const response = await client.get("http://example.com/auth", {}, {auth: {username: "u", password: "p"}});
    assert.equal(request.headers["authorization"], "Basic " + Buffer.from("u:p").toString("base64"));
  });

  test("sets timeout", async () => {
    FakeRequest.respond(ok);

    const response = await client.get("http://example.com/timeout", {}, {timeout: 1234});

    assert.equal(request.timeout, 1234);
  });

  test("sets response status (2xx)", async () => {
    FakeRequest.respond(ok);

    const response = await client.get("http://example.com/status");

    assert(response.success);
  });

  test("sets response status (3xx)", async () => {
    FakeRequest.respond(() => {
      responseMock.statusCode = 301;
      responseMock.headers["content-type"] = "text/plain";
      responseMock.headers["location"] = "http://example.com/redirect";

      requestMock.emit("response", responseMock);
      responseMock.emit("end");
    });

    const response = await client.get("http://example.com/status");

    assert(response.success);
    assert(response.redirect);
    assert.equal(response.location, "http://example.com/redirect");
  });

  test("sets response status (4xx)", async () => {
    FakeRequest.respond(() => {
      responseMock.statusCode = 401;
      responseMock.headers["content-type"] = "text/plain";

      requestMock.emit("response", responseMock);
      responseMock.emit("end");
    });

    const response = await client.get("http://example.com/status");

    assert(!response.success);
  });

  test("sets response status (5xx)", async () => {
    FakeRequest.respond(() => {
      responseMock.statusCode = 500;
      responseMock.headers["content-type"] = "text/plain";

      requestMock.emit("response", responseMock);
      responseMock.emit("end");
    });

    const response = await client.get("http://example.com/status");

    assert(!response.success);
  });

  suite("GET", () => {
    test("performs request", async () => {
      FakeRequest.respond(ok);

      const response = await client.get("http://example.com/get");

      assert.equal(request.url, "http://example.com/get");
      assert.equal(request.method, "get");
    });

    test("appends params to the url", async () => {
      FakeRequest.respond(ok);

      const response = await client.get("http://example.com/get", {message: "hello there", number: 42});

      assert.equal(request.url, "http://example.com/get?message=hello%20there&number=42");
    });

    test("considers existing params", async () => {
      FakeRequest.respond(ok);

      const response = await client.get("http://example.com/get?number=42", {message: "hello there", id: 37});

      assert.equal(request.url, "http://example.com/get?number=42&message=hello%20there&id=37");
    });
  });

  suite("POST", () => {
    test("performs request", async () => {
      FakeRequest.respond(ok);

      const response = await client.post("http://example.com/post");

      assert.equal(request.url, "http://example.com/post");
      assert.equal(request.method, "post");
    });

    test("sets content type", async () => {
      FakeRequest.respond(ok);

      const response = await client.post("http://example.com/post");

      assert.equal(request.headers["content-type"], "application/x-www-form-urlencoded");
    });

    test("sends body", async () => {
      FakeRequest.respond(ok);

      const response = await client.post("http://example.com/post", {message: "hello there", number: 42});

      assert.equal(request.body, "message=hello%20there&number=42");
      assert.equal(request.headers["content-type"], "application/x-www-form-urlencoded");
    });

    test("sends params as the body", async () => {
      FakeRequest.respond(ok);

      const response = await client.post("http://example.com/post", "message=hello%20there&number=42");

      assert.equal(request.body, "message=hello%20there&number=42");
    });

    test("sends json body", async () => {
      FakeRequest.respond(ok);

      const response = await client.post("http://example.com/post", {message: "hello there", number: 42}, {headers: {"content-type": "application/json"}});

      assert.equal(request.body, `{"message":"hello there","number":42}`);
      assert.equal(request.headers["content-type"], "application/json");
    });

    test("keeps existing body", async () => {
      FakeRequest.respond(ok);

      const response = await client.post("http://example.com/body", {}, {body: "BODY"});

      assert.equal(request.body, "BODY");
    });

    test("keeps existing content type", async () => {
      FakeRequest.respond(ok);

      const response = await client.post("http://example.com/body", {}, {headers: {"content-type": "multipart/form-data"}});

      assert.equal(request.headers["content-type"], "multipart/form-data");
    });

    test("ignores empty params", async () => {
      FakeRequest.respond(ok);

      const response = await client.post("http://example.com/body", null);

      assert.equal(request.body, undefined);
    });
  });

  suite("PATCH", () => {
    test("performs request", async () => {
      FakeRequest.respond(ok);

      const response = await client.patch("http://example.com/patch");

      assert.equal(request.url, "http://example.com/patch");
      assert.equal(request.method, "patch");
    });

    test("sets content type", async () => {
      FakeRequest.respond(ok);

      const response = await client.patch("http://example.com/patch");

      assert.equal(request.headers["content-type"], "application/x-www-form-urlencoded");
    });

    test("sends body", async () => {
      FakeRequest.respond(ok);

      const response = await client.patch("http://example.com/patch", {message: "hello there", number: 42});

      assert.equal(request.body, "message=hello%20there&number=42");
      assert.equal(request.headers["content-type"], "application/x-www-form-urlencoded");
    });

    test("sends json body", async () => {
      FakeRequest.respond(ok);

      const response = await client.patch("http://example.com/patch", {message: "hello there", number: 42}, {headers: {"content-type": "application/json"}});

      assert.equal(request.body, `{"message":"hello there","number":42}`);
      assert.equal(request.headers["content-type"], "application/json");
    });
  });

  suite("PUT", () => {
    test("performs request", async () => {
      FakeRequest.respond(ok);

      const response = await client.put("http://example.com/put");

      assert.equal(request.url, "http://example.com/put");
      assert.equal(request.method, "put");
    });

    test("sets content type", async () => {
      FakeRequest.respond(ok);

      const response = await client.put("http://example.com/put");

      assert.equal(request.headers["content-type"], "application/x-www-form-urlencoded");
    });

    test("sends body", async () => {
      FakeRequest.respond(ok);

      const response = await client.put("http://example.com/put", {message: "hello there", number: 42});

      assert.equal(request.body, "message=hello%20there&number=42");
      assert.equal(request.headers["content-type"], "application/x-www-form-urlencoded");
    });

    test("sends json body", async () => {
      FakeRequest.respond(ok);

      const response = await client.put("http://example.com/put", {message: "hello there", number: 42}, {headers: {"content-type": "application/json"}});

      assert.equal(request.body, `{"message":"hello there","number":42}`);
      assert.equal(request.headers["content-type"], "application/json");
    });
  });

  suite("HEAD", () => {
    test("performs request", async () => {
      FakeRequest.respond(ok);

      const response = await client.head("http://example.com/head");

      assert.equal(request.url, "http://example.com/head");
      assert.equal(request.method, "head");
    });

    test("appends params to the url", async () => {
      FakeRequest.respond(ok);

      const response = await client.head("http://example.com/head", {message: "hello there", number: 42});

      assert.equal(request.url, "http://example.com/head?message=hello%20there&number=42");
    });

    test("considers existing params", async () => {
      FakeRequest.respond(ok);

      const response = await client.head("http://example.com/head?number=42", {message: "hello there", id: 37});

      assert.equal(request.url, "http://example.com/head?number=42&message=hello%20there&id=37");
    });
  });

  suite("DELETE", () => {
    test("performs request", async () => {
      FakeRequest.respond(ok);

      const response = await client.delete("http://example.com/delete");

      assert.equal(request.url, "http://example.com/delete");
      assert.equal(request.method, "delete");
    });

    test("appends params to the url", async () => {
      FakeRequest.respond(ok);

      const response = await client.delete("http://example.com/delete", {message: "hello there", number: 42});

      assert.equal(request.url, "http://example.com/delete?message=hello%20there&number=42");
    });

    test("considers existing params", async () => {
      FakeRequest.respond(ok);

      const response = await client.delete("http://example.com/delete?number=42", {message: "hello there", id: 37});

      assert.equal(request.url, "http://example.com/delete?number=42&message=hello%20there&id=37");
    });
  });

  suite("OPTIONS", () => {
    test("performs request", async () => {
      FakeRequest.respond(ok);

      const response = await client.options("http://example.com/options");

      assert.equal(request.url, "http://example.com/options");
      assert.equal(request.method, "options");
    });

    test("appends params to the url", async () => {
      FakeRequest.respond(ok);

      const response = await client.options("http://example.com/options", {message: "hello there", number: 42});

      assert.equal(request.url, "http://example.com/options?message=hello%20there&number=42");
    });

    test("considers existing params", async () => {
      FakeRequest.respond(ok);

      const response = await client.options("http://example.com/options?number=42", {message: "hello there", id: 37});

      assert.equal(request.url, "http://example.com/options?number=42&message=hello%20there&id=37");
    });
  });
});

export default class XMLHttpRequestMock {
  static responses = [];

  static respond(callback) {
    XMLHttpRequestMock.responses.push(callback);
  }

  constructor() {
    this.responseHeaders = {};
    this.headers = {};
    XMLHttpRequestMock.request = this;
  }

  open(method, url, async) {
    this.method = method;
    this.url = url;
    this.async = async;
  }

  abort() {
    this.onabort();
  }

  send(body) {
    this.body = body;

    setTimeout(() => {
      const callback = XMLHttpRequestMock.responses.shift();
      callback && callback(this);
    });
  }

  setRequestHeader(header, value) {
    this.headers[header] = value;
  }

  getAllResponseHeaders() {
    return Object
            .keys(this.responseHeaders)
            .map(key => [key, this.responseHeaders[key]].join(": "))
            .join("\n");
  }
}

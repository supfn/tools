class Context {
  constructor(req, res) {
    this.req = req;
    this.res = res;
    this.request = new Request(req);
    this.response = new Response(res);
  }

  get url() {
    return this.request.url
  }
  get body() {
    return this.response.body
  }
  set body(val) {
    this.response.body = val
  }
  get method() {
    return this.request.method
  }
}


class Request {
  constructor(req) {
    this.req = req;
  }

  get url() {
    return this.req.url
  }

  get method() {
    return this.req.method.toLowerCase()
  }
}

class Response {
  constructor(res) {
    this.res = res;
  }

  get body() {
    return this._body
  }

  set body(val) {
    this._body = val
  }
}


module.exports = Context;
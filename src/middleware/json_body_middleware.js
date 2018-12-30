import { BODY } from "../constants";

export default function jsonBodyMiddleware(options) {
  if (!BODY[options.method].request) {
    delete options.body;
    return options;
  }

  if (options.body) {
    return options;
  }

  const contentType = options.headers["content-type"];

  if (!contentType || !contentType.includes("application/json")) {
    return options;
  }

  options.body = JSON.stringify(options.params);

  return options;
}

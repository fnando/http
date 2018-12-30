import { BODY } from "../constants";

function isFormData(object) {
  return typeof FormData === "function" && object instanceof FormData;
}

export default function bodyMiddleware(encode, options) {
  if (!BODY[options.method].request) {
    delete options.body;
    return options;
  }

  if (options.body) {
    return options;
  }

  if (options.params.constructor === Object) {
    options.body = encode(options.params);
  } else {
    options.body = options.params;
  }

  if (!options.headers["content-type"] && !isFormData(options.body)) {
    options.headers["content-type"] = "application/x-www-form-urlencoded";
  }

  return options;
}

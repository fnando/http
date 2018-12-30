function base64(string) {
  if (typeof atob === "function") {
    return atob(string);
  } else {
    return Buffer.from(string).toString("base64");
  }
}

export default function basicAuthMiddleware(options) {
  let { username, password } = options.auth;

  if (username || password) {
    options.headers["authorization"] = "Basic " + base64(`${username}:${password}`);
  }

  return options;
}

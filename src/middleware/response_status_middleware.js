export default function responseStatusMiddleware(response) {
  const status = String(response.status);

  response.success = !!(status[0].match(/^[2-3]/));
  response.redirect = status[0] === "3";

  if (response.redirect) {
    response.location = response.headers.location;
  }

  return response;
}

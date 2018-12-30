export default function jsonResponseMiddleware(response) {
  if (!response.headers["content-type"].includes("application/json")) {
    return response;
  }

  try {
    response.data = JSON.parse(response.body);
  } catch (error) {

  }

  return response;
}

addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request));
});

const BACKEND_URL = process.env.BACKEND_URL;

async function handleRequest(request) {
  if (!BACKEND_URL) {
    return new Response(JSON.stringify({ error: "BACKEND_URL is not configured." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const url = new URL(request.url);
  const apiUrl = `${BACKEND_URL}${url.pathname}${url.search}`;

  const response = await fetch(apiUrl, {
    method: request.method,
    headers: request.headers,
    body: request.body,
    redirect: "follow",
  });

  const responseHeaders = new Headers(response.headers);
  responseHeaders.set("Access-Control-Allow-Origin", "*");
  responseHeaders.set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  responseHeaders.set("Access-Control-Allow-Headers", "Content-Type,Authorization");

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: responseHeaders,
  });
}

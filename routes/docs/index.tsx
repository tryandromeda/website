export function handler(): Response {
  // Redirect /docs to /docs/index
  return new Response(null, {
    status: 302,
    headers: {
      Location: "/docs/index",
    },
  });
}

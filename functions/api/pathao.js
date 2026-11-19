export async function onRequestGet({ request }) {
  const url = new URL(request.url);
  const endpoint = url.searchParams.get("endpoint");
  const id = url.searchParams.get("id");

  if (!id || !["ride", "path"].includes(endpoint)) {
    return new Response(JSON.stringify({ error: "Invalid parameters" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  const upstream =
    endpoint === "ride"
      ? `https://pages.pathao.com/api/ride?id=${encodeURIComponent(id)}`
      : `https://pages.pathao.com/api/ride/path?id=${encodeURIComponent(id)}`;

  const res = await fetch(upstream, {
    headers: {
      "User-Agent": "Mozilla/5.0",
      "Accept": "application/json",
      "Referer": `https://pages.pathao.com/share-ride/${encodeURIComponent(id)}`
    }
  });

  const body = await res.text();
  return new Response(body, {
    status: res.status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "no-store, no-cache, must-revalidate"
    }
  });
}

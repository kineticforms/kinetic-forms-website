import type { APIRoute } from "astro";

export const prerender = false;

const POSTHOG_HOST = "https://eu.i.posthog.com";
const POSTHOG_ASSETS = "https://eu-assets.i.posthog.com";

export const ALL: APIRoute = async ({ params, request }) => {
  const path = params.path || "";

  // Route static assets (posthog-js) to the assets CDN
  const targetBase = path.startsWith("static/") ? POSTHOG_ASSETS : POSTHOG_HOST;
  const targetUrl = `${targetBase}/${path}`;

  const headers = new Headers(request.headers);
  headers.delete("host");
  headers.delete("cf-connecting-ip");
  headers.delete("cf-ray");

  const response = await fetch(targetUrl, {
    method: request.method,
    headers,
    body: request.method !== "GET" && request.method !== "HEAD" ? request.body : undefined,
    // @ts-ignore - duplex needed for streaming body
    duplex: request.method !== "GET" && request.method !== "HEAD" ? "half" : undefined,
  });

  const responseHeaders = new Headers(response.headers);
  responseHeaders.delete("set-cookie");
  responseHeaders.set("access-control-allow-origin", "*");

  return new Response(response.body, {
    status: response.status,
    headers: responseHeaders,
  });
};

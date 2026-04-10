import type { APIRoute } from "astro";

export const prerender = false;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || !EMAIL_REGEX.test(email)) {
      return new Response(
        JSON.stringify({ error: "That doesn't look like an email." }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const KIT_API_KEY = import.meta.env.KIT_API_KEY;
    if (!KIT_API_KEY) {
      console.error("KIT_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Something broke. Try again in a moment." }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }

    const kitRes = await fetch("https://api.convertkit.com/v4/subscribers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${KIT_API_KEY}`,
      },
      body: JSON.stringify({
        email_address: email,
      }),
    });

    if (kitRes.status === 429) {
      return new Response(
        JSON.stringify({ error: "Too many signups. Try again later." }),
        { status: 429, headers: { "Content-Type": "application/json" } },
      );
    }

    if (!kitRes.ok) {
      const errorData = await kitRes.text();
      console.error("Kit API error:", kitRes.status, errorData);
      return new Response(
        JSON.stringify({ error: "Something broke. Try again in a moment." }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("Subscribe error:", err);
    return new Response(
      JSON.stringify({ error: "Something broke. Try again in a moment." }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
};

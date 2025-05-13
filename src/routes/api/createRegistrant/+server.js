// +server.js or +server.ts in /api/createRegistrant

import { json } from '@sveltejs/kit';
import { createRegistrant } from '$lib/notion';

export async function POST({ request }) {
  try {
    const data = await request.json();
    const notionResponse = await createRegistrant(data);

    return new Response(JSON.stringify({notion: notionResponse}), { status: 200 });
  } catch (error) {
    console.error("Server error:", error);
    return new Response("Failed to create registrant", { status: 500 });
  }
}

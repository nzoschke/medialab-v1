import type { APIRoute } from "astro";

const urls: Record<string, string> = {
  "docks.mp3": "https://archive.org/download/super-mario-64-soundtrack/Super%20Mario%2064%20%28Soundtrack%29/1-09%20Dire%2C%20Dire%20Docks.mp3",
  "pokemon.mp4":
    "https://archive.org/download/pokemon-indigo-league-the-complete-collection/Pok%C3%A9mon%20-%20001%20-%20Pokemon%20-%20I%20Choose%20You%20%20%20%5BDarkDream%5D.mp4",
};

export const GET: APIRoute = ({ params, redirect }) => {
  const { slug } = params;

  if (!slug || !urls[slug]) {
    return new Response(null, {
      status: 404,
      statusText: "Not found",
    });
  }

  return redirect(urls[slug], 307);
};

// Cloudflare Pages Functions
export async function onRequest(context) {
  // This file ensures Cloudflare Pages recognizes this as a SvelteKit project
  return new Response('LaufplanerPro is running!', {
    headers: { 'content-type': 'text/plain' }
  });
}

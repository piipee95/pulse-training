// Isolated, deliberately non-authenticating proof of concept.
// No registration, tokens, profiles or personalized endpoints are exposed.
// Never connect this Worker to the production site before the authentication gate.
const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store',
    'x-content-type-options': 'nosniff' },
})
export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    if (url.pathname !== '/health' || request.method !== 'GET') {
      return json({ error: 'not-found' }, 404)
    }
    if (!env.DB) return json({ status: 'unavailable' }, 503)
    try {
      await env.DB.prepare('SELECT 1 AS alive').first()
      return json({ status: 'ok' })
    } catch {
      // Do not reveal SQL or internal infrastructure details to clients.
      return json({ status: 'unavailable' }, 503)
    }
  },
}

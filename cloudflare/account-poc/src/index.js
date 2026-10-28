// PULSE account gateway: staging-only surface. No registration/login exposed until security gate.
// Never route production traffic here until end-to-end authentication has been verified.
const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'x-content-type-options': 'nosniff',
    'referrer-policy': 'no-referrer',
    'x-frame-options': 'DENY',
  },
})
const unavailable = () => json({ status: 'unavailable' }, 503)
export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    // Explicit allowlist; unknown routes and methods never process credentials or data.
    if (url.pathname !== '/health' || request.method !== 'GET') {
      return json({ error: 'not-found' }, 404)
    }
    if (!env.DB) return unavailable()
    try {
      // Query is read-only and cannot disclose user records.
      const row = await env.DB.prepare('SELECT 1 AS alive').first()
      return row?.alive === 1 ? json({ status: 'ok' }) : unavailable()
    } catch {
      return unavailable()
    }
  },
}

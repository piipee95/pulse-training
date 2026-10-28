// Staging-only session gateway. No registration or password endpoints yet.
// Sessions are opaque tokens created only by a future audited login process.
const headers = { 'content-type':'application/json; charset=utf-8', 'cache-control':'no-store',
  'x-content-type-options':'nosniff', 'referrer-policy':'no-referrer', 'x-frame-options':'DENY' }
const json = (body,status=200,extra={}) => new Response(JSON.stringify(body),{status,headers:{...headers,...extra}})
const unavailable = () => json({status:'unavailable'},503)
const unauthorized = () => json({error:'unauthorized'},401)
const encodeHex = bytes => [...new Uint8Array(bytes)].map(x=>x.toString(16).padStart(2,'0')).join('')
const hashToken = async token => encodeHex(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(token)))
function sessionToken(request) {
  const cookies = request.headers.get('cookie')||''
  const values = cookies.split(';').map(x=>x.trim()).filter(x=>x.startsWith('__Host-pulse_session='))
  if(values.length!==1)return null
  const token=values[0].slice('__Host-pulse_session='.length)
  return /^[A-Za-z0-9_-]{43}$/.test(token)?token:null
}
async function identity(request,db) {
  const token=sessionToken(request)
  if(!token)return null
  const hash=await hashToken(token)
  return db.prepare(`SELECT a.id,a.display_name FROM sessions s
    JOIN accounts a ON a.id=s.account_id
    WHERE s.token_hash=? AND s.expires_at>? AND a.disabled_at IS NULL`)
    .bind(hash,Math.floor(Date.now()/1000)).first()
}
export default {
  async fetch(request,env) {
    const {pathname}=new URL(request.url)
    const isHealth=pathname==='/health' && request.method==='GET'
    const isMe=pathname==='/api/me' && request.method==='GET'
    const isProfile=pathname==='/api/profile' && request.method==='GET'
    if(!isHealth&&!isMe&&!isProfile)return json({error:'not-found'},404)
    if(!env.DB)return unavailable()
    try {
      if(isHealth) {
        const row=await env.DB.prepare('SELECT 1 AS alive').first()
        return row?.alive===1?json({status:'ok'}):unavailable()
      }
      const user=await identity(request,env.DB)
      if(!user)return unauthorized()
      if(isMe)return json({id:user.id,displayName:user.display_name})
      // Ownership is derived exclusively from authenticated session, never URL/body.
      const profile=await env.DB.prepare('SELECT revision,data_json FROM training_profiles WHERE account_id=?')
        .bind(user.id).first()
      if(!profile)return json({revision:0,data:{}},200)
      return json({revision:profile.revision,data:JSON.parse(profile.data_json)})
    }catch{return unavailable()}
  },
}

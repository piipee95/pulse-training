// Private Access-protected profile API. Staging only until Access is enabled and audited.
// Cloudflare's verified ctx.access identity is authoritative; untrusted headers are ignored.
const common={'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff','referrer-policy':'no-referrer'}
const json=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:common})
const allowedEmail=(email,configured)=>typeof email==='string' && typeof configured==='string' && configured.trim().length>0 && email.trim().toLowerCase()===configured.trim().toLowerCase()
const uuidFromEmail=async email=>{
  const input=new TextEncoder().encode('pulse-access-account-v1:'+email.trim().toLowerCase())
  const digest=await crypto.subtle.digest('SHA-256',input)
  return 'access-'+[...new Uint8Array(digest)].map(x=>x.toString(16).padStart(2,'0')).join('').slice(0,48)
}
async function owner(ctx,env) {
  if(!ctx?.access || !env?.ACCESS_ALLOWED_EMAIL || !env?.ACCESS_AUD) return null
  if(ctx.access.aud!==env.ACCESS_AUD)return null
  const id=await ctx.access.getIdentity()
  if(!allowedEmail(id?.email,env.ACCESS_ALLOWED_EMAIL))return null
  return {id:await uuidFromEmail(id.email),email:id.email.trim().toLowerCase()}
}
export default {
 async fetch(request,env,ctx){
  const url=new URL(request.url),method=request.method,path=url.pathname
  if(!['/api/account','/api/profile'].includes(path) || !['GET','PUT'].includes(method) || (method==='PUT'&&path!=='/api/profile'))return json({error:'not-found'},404)
  const user=await owner(ctx,env)
  if(!user)return json({error:'unauthorized'},401)
  if(!env.DB)return json({error:'unavailable'},503)
  try{
   // Do not insert accounts on GET. First authenticated PUT creates the profile.
   const row=await env.DB.prepare('SELECT revision,data_json FROM training_profiles WHERE account_id=?').bind(user.id).first()
   if(method==='GET'){
    if(path==='/api/account')return json({id:user.id})
    return json({revision:row?.revision??0,data:row?JSON.parse(row.data_json):{}})
   }
   if(request.headers.get('origin')!==url.origin)return json({error:'forbidden'},403)
   if(!request.headers.get('content-type')?.toLowerCase().startsWith('application/json'))return json({error:'unsupported-media-type'},415)
   if(Number(request.headers.get('content-length'))>524288)return json({error:'too-large'},413)
   const input=await request.text()
   if(input.length>524288)return json({error:'too-large'},413)
   const payload=JSON.parse(input)
   if(!payload || !Number.isSafeInteger(payload.revision)||payload.revision<0 || !payload.data || typeof payload.data!=='object' || Array.isArray(payload.data))return json({error:'invalid-profile'},400)
   // Revision check is atomic. No other owner can be selected in request payload.
   const data=JSON.stringify(payload.data)
   if(data.length>500000)return json({error:'too-large'},413)
   const now=Math.floor(Date.now()/1000)
   // Account auto-provisioning is restricted to the email in Cloudflare Access identity.
   await env.DB.prepare('INSERT OR IGNORE INTO accounts(id,display_name,created_at) VALUES(?,?,?)').bind(user.id,'PULSE',now).run()
   let result
   if(payload.revision===0) {
     // First writer wins; a repeated creation cannot overwrite an existing profile.
     result=await env.DB.prepare(`INSERT OR IGNORE INTO training_profiles(account_id,revision,data_json,updated_at) VALUES(?,1,?,?) RETURNING revision`)
       .bind(user.id,data,now).first()
   } else {
     // Atomic compare-and-swap preserves concurrent updates across devices.
     result=await env.DB.prepare(`UPDATE training_profiles SET revision=revision+1,data_json=?,updated_at=?
       WHERE account_id=? AND revision=? RETURNING revision`)
       .bind(data,now,user.id,payload.revision).first()
   }
   if(!result)return json({error:'revision-conflict'},409)
   return json({revision:result.revision})
  }catch{return json({error:'unavailable'},503)}
 }
}

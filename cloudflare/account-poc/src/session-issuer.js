// Internal session issuance only. Never expose as a public route without verified authentication.
// Only call after a separate, audited authentication step establishes the account identity.
const hex=buf=>[...new Uint8Array(buf)].map(b=>b.toString(16).padStart(2,'0')).join('')
const digest=async value=>hex(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value)))
const b64url=bytes=>btoa(String.fromCharCode(...bytes)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')
export async function issueSession(db,accountId,now=Math.floor(Date.now()/1000)) {
  if(typeof accountId!=='string'||!accountId||!Number.isSafeInteger(now)||now<=0)throw Error('invalid-session-input')
  const owner=await db.prepare('SELECT id FROM accounts WHERE id=? AND disabled_at IS NULL').bind(accountId).first()
  if(!owner)throw Error('account-unavailable')
  const random=new Uint8Array(32)
  crypto.getRandomValues(random)
  const token=b64url(random)
  const tokenHash=await digest(token)
  const expiresAt=now+60*60*24*30
  // Conditional INSERT avoids issuing a session if the account is concurrently disabled/deleted.
  const row=await db.prepare(`INSERT INTO sessions(token_hash,account_id,expires_at,created_at)
    SELECT ?,id,?,? FROM accounts WHERE id=? AND disabled_at IS NULL RETURNING token_hash`)
    .bind(tokenHash,expiresAt,now,accountId).first()
  if(!row||row.token_hash!==tokenHash)throw Error('account-unavailable')
  return {cookie:`__Host-pulse_session=${token}; Path=/; Secure; HttpOnly; SameSite=Strict; Max-Age=2592000`,expiresAt}
}

import test from 'node:test'
import assert from 'node:assert/strict'
import { webcrypto } from 'node:crypto'
import { issueSession } from '../src/session-issuer.js'
if (!globalThis.crypto)globalThis.crypto=webcrypto
test('issues cryptographically random, opaque host-only cookie, stores only hash',async()=>{
 let bound
 const db={prepare(sql){
  if(sql.startsWith('SELECT id FROM accounts'))return {bind(id){assert.equal(id,'user-1');return {first:async()=>({id})}}}
  if(sql.startsWith('INSERT INTO sessions'))return {bind(...args){bound=args;return {first:async()=>({token_hash:args[0]})}}}
  throw Error('unexpected SQL')
 }}
 const r=await issueSession(db,'user-1',1_800_000_000)
 const token=r.cookie.match(/^__Host-pulse_session=([A-Za-z0-9_-]{43});/)[1]
 assert.match(r.cookie,/Secure; HttpOnly; SameSite=Strict/)
 assert.equal(bound[0],Buffer.from(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(token))).toString('hex'))
 assert.equal(bound[1],r.expiresAt)
 assert.equal(bound[3],'user-1')
 assert.equal(r.expiresAt,1_800_000_000+2592000)
})
test('inactive account cannot issue session',async()=>{
 const db={prepare(){return {bind(){return {first:async()=>null}}}}}
 await assert.rejects(issueSession(db,'disabled',1_800_000_000),/account-unavailable/)
})
test('concurrently disabled account cannot get cookie',async()=>{
 const db={prepare(sql){return {bind(){return {first:async()=>sql.startsWith('SELECT')?{id:'user-1'}:null}}}}}
 await assert.rejects(issueSession(db,'user-1',1_800_000_000),/account-unavailable/)
})
test('rejects absent account and invalid timestamp',async()=>{
 const db={prepare(){throw Error('should not query')}}
 await assert.rejects(issueSession(db,'',1_800_000_000),/invalid-session-input/)
 await assert.rejects(issueSession(db,'abc',NaN),/invalid-session-input/)
})

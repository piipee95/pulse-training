import test from 'node:test'
import assert from 'node:assert/strict'
import worker from '../src/index.js'
import { webcrypto } from 'node:crypto'
if(!globalThis.crypto)globalThis.crypto=webcrypto
const token='A'.repeat(43)
const cookie='__Host-pulse_session='+token
const hash=Buffer.from(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(token))).toString('hex')
const db={
 prepare(sql) {
  if(sql.includes('FROM sessions'))return {bind(got,now){assert.equal(got,hash);assert.ok(now>0);return {first:async()=>({id:'account-a',display_name:'User A'})}}}
  if(sql.includes('FROM training_profiles'))return {bind(id){assert.equal(id,'account-a');return {first:async()=>({revision:2,data_json:'{"owner":"account-a"}'})}}}
  throw new Error('Unexpected SQL')
 }
}
const call=(path,cookies,env={DB:db})=>worker.fetch(new Request('https://staging.example'+path,{headers:cookies?{cookie:cookies}:{}}),env)
test('all private routes reject missing or malformed cookies',async()=>{
 for(const path of ['/api/me','/api/profile']){
  for(const cookies of [null,'__Host-pulse_session=x','__Host-pulse_session='+token+'; __Host-pulse_session='+token]){
   const res=await call(path,cookies)
   assert.equal(res.status,401)
  }
 }
})
test('verified session reads own identity and data',async()=>{
 const me=await call('/api/me',cookie)
 assert.deepEqual(await me.json(),{id:'account-a',displayName:'User A'})
 const prof=await call('/api/profile',cookie)
 assert.deepEqual(await prof.json(),{revision:2,data:{owner:'account-a'}})
 assert.equal(prof.headers.get('cache-control'),'no-store')
})
test('caller cannot select someone else by URL or body',async()=>{
 const p=await call('/api/profile?account_id=account-b',cookie)
 assert.equal((await p.json()).data.owner,'account-a')
 assert.equal((await call('/api/profile/account-b',cookie)).status,404)
 assert.equal((await worker.fetch(new Request('https://staging.example/api/profile',{method:'POST',headers:{cookie},body:'{"account_id":"account-b"}'}),{DB:db})).status,404)
})
test('unexpected D1 failure fails closed without leaking internals',async()=>{
 const r=await call('/api/me',cookie,{DB:{prepare(){throw new Error('SQL password')}}})
 assert.equal(r.status,503)
 assert.deepEqual(await r.json(),{status:'unavailable'})
})

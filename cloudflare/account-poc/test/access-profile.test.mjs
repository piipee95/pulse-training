import test from 'node:test'
import assert from 'node:assert/strict'
import {webcrypto} from 'node:crypto'
import app from '../src/access-profile.js'
if(!globalThis.crypto)globalThis.crypto=webcrypto
const env={ACCESS_AUD:'expected-aud',ACCESS_ALLOWED_EMAIL:'owner@example.test',DB:{prepare(sql){
 if(sql.startsWith('SELECT revision'))return {bind(){return {first:async()=>null}}}
 if(sql.startsWith('INSERT OR IGNORE'))return {bind(){return {run:async()=>({})}}}
 if(sql.startsWith('INSERT OR IGNORE INTO training_profiles'))return {bind(...args){assert.match(args[0],/^access-/);return {first:async()=>({revision:1})}}}
 if(sql.startsWith('UPDATE training_profiles'))return {bind(){return {first:async()=>({revision:2})}}}
 throw Error('unexpected query')
}}}
const ctx=(email='owner@example.test',aud='expected-aud')=>({access:{aud,getIdentity:async()=>({email})}})
const request=(path,method='GET',opts={})=>new Request('https://test.example'+path,{method,...opts})
test('fails closed without verified Cloudflare access context',async()=>{
 for(const c of [undefined,{},ctx('outsider@example.test'),ctx('owner@example.test','wrong')]){
  const r=await app.fetch(request('/api/profile'),env,c);assert.equal(r.status,401)
 }
})
test('profile and account are scoped to verified owner',async()=>{
 const a=await app.fetch(request('/api/account'),env,ctx());assert.equal(a.status,200);assert.match((await a.json()).id,/^access-[a-f0-9]{48}$/)
 const p=await app.fetch(request('/api/profile?account_id=someone-else'),env,ctx());assert.equal(p.status,200);assert.deepEqual(await p.json(),{revision:0,data:{}})
})
test('rejects unsafe or invalid writes',async()=>{
 const options={method:'PUT',headers:{'content-type':'application/json'},body:JSON.stringify({revision:0,data:{x:1}})}
 assert.equal((await app.fetch(request('/api/profile','PUT',options),env,ctx())).status,403)
 for(const data of [{revision:-1,data:{}},{revision:0,data:[]}]){
  const r=await app.fetch(request('/api/profile','PUT',{headers:{origin:'https://test.example','content-type':'application/json'},body:JSON.stringify(data)}),env,ctx())
  assert.equal(r.status,400)
 }
})
test('valid owner PUT creates revision 1 without trusting user id',async()=>{
 const r=await app.fetch(request('/api/profile','PUT',{headers:{origin:'https://test.example','content-type':'application/json'},body:JSON.stringify({revision:0,data:{routine:'qa'},account_id:'other'})}),env,ctx())
 assert.equal(r.status,200);assert.deepEqual(await r.json(),{revision:1})
})

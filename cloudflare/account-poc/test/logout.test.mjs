import test from 'node:test'
import assert from 'node:assert/strict'
import worker from '../src/index.js'
import { webcrypto } from 'node:crypto'
if (!globalThis.crypto) globalThis.crypto=webcrypto
const token='A'.repeat(43)
let removed=false
const db={prepare(sql){
 if(sql.includes('FROM sessions'))return {bind(){return {first:async()=>({id:'acc',display_name:'QA'})}}}
 if(sql.startsWith('DELETE FROM sessions'))return {bind(hash,id){assert.equal(id,'acc');assert.match(hash,/^[0-9a-f]{64}$/);return {run:async()=>{removed=true}}}}
 throw Error('unexpected SQL')
}}
const req=(origin,method='POST')=>new Request('https://staging.example/api/logout',{method,headers:{cookie:'__Host-pulse_session='+token,...(origin?{origin}:{})}})
test('logout disallows cross-origin and missing Origin',async()=>{
 for(const origin of [null,'https://attacker.example']){removed=false;const r=await worker.fetch(req(origin),{DB:db});assert.equal(r.status,403);assert.equal(removed,false)}
})
test('logout revokes token and clears host-only session cookie',async()=>{
 removed=false
 const r=await worker.fetch(req('https://staging.example'),{DB:db})
 assert.equal(r.status,200);assert.equal(removed,true)
 assert.match(r.headers.get('set-cookie'),/__Host-pulse_session=;/)
 assert.match(r.headers.get('set-cookie'),/HttpOnly/)
 assert.match(r.headers.get('set-cookie'),/Max-Age=0/)
})
test('logout refuses GET',async()=>{assert.equal((await worker.fetch(req('https://staging.example','GET'),{DB:db})).status,404)})

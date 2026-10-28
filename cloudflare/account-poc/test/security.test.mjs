import test from 'node:test'
import assert from 'node:assert/strict'
import worker from '../src/index.js'

const env = { DB: { prepare(sql) { assert.equal(sql, 'SELECT 1 AS alive'); return { first: async () => ({ alive: 1 }) } } } }
test('health returns only status and security headers', async () => {
  const r = await worker.fetch(new Request('https://staging.example/health'), env)
  assert.equal(r.status, 200)
  assert.deepEqual(await r.json(), { status: 'ok' })
  assert.equal(r.headers.get('cache-control'), 'no-store')
  assert.equal(r.headers.get('x-content-type-options'), 'nosniff')
})
test('no public registration, login, account or profile endpoints', async () => {
  for (const [method, path] of [['POST','/register'],['POST','/login'],['GET','/profile'],['POST','/api/register'],['GET','/api/account'],['POST','/health']]) {
    const r = await worker.fetch(new Request('https://staging.example'+path, {method}), env)
    assert.equal(r.status,404,method+' '+path)
  }
})
test('unbound, broken or inconsistent D1 fails closed',async()=>{
  const request = new Request('https://staging.example/health')
  for(const e of [{},{DB:{prepare(){throw new Error('secret')}}},{DB:{prepare(){return {first:async()=>null}}}}]){
    const r=await worker.fetch(request,e)
    assert.equal(r.status,503)
    assert.deepEqual(await r.json(),{status:'unavailable'})
  }
})

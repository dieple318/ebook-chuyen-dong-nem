import assert from'node:assert/strict';import{createHandler}from'../server/netlify-api.js';
const map=new Map();let serial=0;const store={async getWithMetadata(k){const e=map.get(k);return e?structuredClone(e):null},async setJSON(k,v,o){const e=map.get(k);if(o?.onlyIfNew&&e||o?.onlyIfMatch&&e?.etag!==o.onlyIfMatch)return {modified:false};const etag=String(++serial);map.set(k,{data:structuredClone(v),etag});return {modified:true,etag}}};
const handle=createHandler({store,password:'test-password-not-for-production',secret:'test-only-signing-key-32-characters-long'});let cookie='';async function hit(path,body,auth=false){const r=await handle(new Request('https://ebook.test'+path,{method:body?'POST':'GET',headers:{...(body?{'Content-Type':'application/json'}:{}),...(auth?{cookie}:{})},...(body?{body:JSON.stringify(body)}:{})}),{ip:'local-test'});return {status:r.status,data:await r.json(),cookie:r.headers.get('set-cookie')}}
assert.equal((await hit('/api/classroom?subject=2')).status,403);assert.equal((await hit('/api/teacher/guide?subject=2')).status,403);assert.equal((await hit('/api/teacher/gate',{subject:2,phase:'class'})).status,403);
let login=await hit('/api/login',{password:'test-password-not-for-production'});assert.equal(login.status,200);cookie=login.cookie.split(';')[0];assert.equal((await hit('/api/state?subject=2',null,true)).data.teacher,true);
const payload={subject:2,learner_code:'TEST',class_code:'QA',answers:{observation:'Observation test',question:'Question test',report:'Report test'}};
const rs=await Promise.all([hit('/api/submit',payload),hit('/api/submit',payload)]);assert.deepEqual(rs.map(x=>x.status).sort(),[201,409]);
assert.equal((await hit('/api/teacher/submissions?subject=2',null,true)).data.rows.length,1);
assert.equal((await hit('/api/teacher/gate',{subject:2,phase:'class'},true)).status,200);assert.equal((await hit('/api/classroom?subject=2')).status,200);assert.equal((await hit('/api/submit',{...payload,learner_code:'OTHER'})).status,403);assert.equal((await hit('/api/classroom?subject=1')).status,403);
assert.equal((await hit('/api/logout',{},true)).status,200);
console.log('Passed: login, teacher-only access, concurrent duplicate lock, closed-phase rejection, subject isolation.');
// Private preview must not change the public gate.
assert.equal((await hit('/api/classroom?subject=1',null,true)).status,200);
assert.equal((await hit('/api/state?subject=1')).data.phase,'pre');
assert.equal((await hit('/api/classroom?subject=1')).status,403);
const optional={...payload,subject:1,learner_code:'OPTIONAL',answers:{observation:'A meaningful observation',report:'An issue to discuss',question:''}};
assert.equal((await hit('/api/submit',optional)).status,201);
const receipt=(await hit('/api/receipt',{subject:1,learner_code:'OPTIONAL',class_code:'QA'})).data.receipt;
assert.ok(receipt.id);assert.equal(Object.hasOwn(receipt,'answers'),false);
assert.equal((await hit('/api/submit',{...optional,learner_code:'EMPTY',answers:{observation:'',report:'Report',question:''}})).status,400);
assert.equal((await hit('/api/teacher/gate',{subject:1,phase:'closed'},true)).status,200);
assert.equal((await hit('/api/submit',{...optional,learner_code:'LATE'})).status,403);
assert.equal((await hit('/api/teacher/gate',{subject:1,phase:'pre'},true)).status,200);
assert.equal((await hit('/api/submit',optional)).status,409);
console.log('Passed: private preview, optional question, receipt privacy, required answers, closed gate, immutable submission after reopening.');

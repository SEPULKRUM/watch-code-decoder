const compact=s=>String(s).toUpperCase().replace(/[^A-Z0-9]/g,'');
const indexedReferences=new WeakMap();
function referenceIndex(data){if(!indexedReferences.has(data)){const rows=Object.values(data.models).map(model=>({model,key:compact(model.id)})),exact=new Map();for(const row of rows){if(!exact.has(row.key))exact.set(row.key,[]);exact.get(row.key).push(row.model)}indexedReferences.set(data,{rows,exact})}return indexedReferences.get(data)}
const statuses=new Set(['index_checked','supplied_transcription','machine_candidate']);
export function validateReferences(data){
 if(data?.schema_version!==1||!data.models||!data.sources||!data.counts)throw Error('Invalid model-reference library');
 for(const [id,m] of Object.entries(data.models)){
  if(m.id!==id||!/^[A-Z0-9-]{1,40}$/.test(id)||!statuses.has(m.status)||!Array.isArray(m.reading_flags)||!Array.isArray(m.observations)||!m.observations.length)throw Error('Invalid research reference');
  for(const o of m.observations)if(!data.sources[o.source_id]||typeof data.sources[o.source_id].filename!=='string')throw Error('Missing reference source');
 }
 if(data.counts.model_strings!==Object.keys(data.models).length)throw Error('Reference count mismatch');
 return data;
}
export function referenceStatus(m){return m.status==='index_checked'?'Index identifier checked · secondary source':m.status==='supplied_transcription'?'Supplied transcription · unverified':'Machine candidate · unverified'}
export function exactReferences(data,input){if(!data)return [];const key=compact(input);return referenceIndex(data).exact.get(key)||[]}
export function findReferences(data,input,limit=12){
 if(!data||!compact(input))return {total:0,models:[]};const key=compact(input);
 const rank=m=>m.status==='index_checked'?0:m.status==='supplied_transcription'?1:2;
 const matches=referenceIndex(data).rows.filter(row=>row.key.includes(key)).map(row=>row.model).sort((a,b)=>(compact(b.id)===key)-(compact(a.id)===key)||rank(a)-rank(b)||a.id.localeCompare(b.id));
 return {total:matches.length,models:matches.slice(0,limit)};
}

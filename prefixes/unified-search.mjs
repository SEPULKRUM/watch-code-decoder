import {groupRegionalMatches,isBaseReference} from './regional-models.mjs?v=jr-grouping-20261117';
import {englishText} from './english.mjs';
import {moduleIds} from './core.mjs';
const compact=value=>String(value).toUpperCase().replace(/[^A-Z0-9]/g,'');
const categories=new Set(['watch','family','clock','fitment','uncertain','package']);
const cache=new WeakMap(),identityCache=new WeakMap();
function identities(index){if(!identityCache.has(index)){const byId=new Map(),byCompact=new Map();for(const row of index.records){byId.set(row.id,row);const key=compact(row.id);if(!byCompact.has(key))byCompact.set(key,[]);byCompact.get(key).push(row)}identityCache.set(index,{byId,byCompact})}return identityCache.get(index)}
const collator=new Intl.Collator('en',{numeric:true,sensitivity:'variant'});
export function validateSearchIndex(index,catalog){
 if(index?.schema_version!==1||!Array.isArray(index.records)||!Array.isArray(index.sources)||!index.counts||index.counts.all_records!==index.records.length)throw Error('Invalid unified search index');
 const ids=new Set(),counts={};
 for(const row of index.records){
  if(typeof row.id!=='string'||!row.id||ids.has(row.id)||!categories.has(row.category)||!Array.isArray(row.origins)||!row.origins.length||!Array.isArray(row.module_ids))throw Error('Invalid or duplicate indexed identifier');
  ids.add(row.id);counts[row.category]=(counts[row.category]||0)+1;
  if(row.origins.some(o=>!index.sources[o[0]]||typeof o[1]!=='string'))throw Error('Missing indexed source');
  if(row.catalog_id&&(row.catalog_id!==row.id||!catalog.models[row.catalog_id]))throw Error('Index does not match catalog');
 }
 for(const category of categories)if((counts[category]||0)!==(index.counts[category]||0))throw Error('Search category count mismatch');
 for(const id of Object.keys(catalog.models))if(!ids.has(id))throw Error('Catalog identifier omitted from unified search');
 for(const resolution of index.fitment_resolutions||[]){
  const combined=index.records.find(r=>r.id===resolution.model_id);
  if(combined?.category!=='fitment'||!Array.isArray(resolution.related_models)||!resolution.related_models.length||new Set(resolution.related_models).size!==resolution.related_models.length||resolution.related_models.some(id=>!ids.has(id)||index.records.find(r=>r.id===id)?.category!=='watch'))throw Error('Invalid fitment member links');
 }
 return index;
}
export function inSearchMode(row,mode='models'){
 if(mode==='models')return row.category==='watch'||row.category==='family'||row.category==='package';
 if(mode==='all')return true;
 if(mode==='specifications')return row.category==='watch'&&row.has_specifications;
 if(mode==='reference-only')return row.category==='watch'&&!row.has_specifications;
 return row.category===mode;
}
function prepared(index,catalog,master){
 let saved=cache.get(index);
 if(!saved||saved.catalog!==catalog||saved.master!==master){
  const byId=new Map(),exact=new Map();
  const rows=index.records.map(row=>{
   const model=row.catalog_id?catalog.models[row.catalog_id]:null,key=compact(row.id);
   const ownFacts=model?Object.fromEntries(Object.entries(model.specs).map(([k,f])=>[k,f.value])):{};
   const checkedFacts=model?Object.fromEntries(Object.entries(model.specs).filter(([,f])=>f.status==='verified').map(([k,f])=>[k,f.value])):{};
   const candidate=master&&row.master_row!==undefined?master.models[row.master_row]:null;const raw=candidate?.model_id===row.id?candidate:null;
   const modules=row.module_ids.map(id=>catalog.modules[id]?.specs).filter(Boolean);
   const item={row,key,text:englishText(row.id+' '+row.family+' '+row.module_ids.join(' ')+' '+JSON.stringify(ownFacts)+' '+JSON.stringify(raw||{})+' '+JSON.stringify(modules)).toUpperCase(),checkedText:englishText(row.id+' '+JSON.stringify(checkedFacts)).toUpperCase()};
   byId.set(row.id,row);if(!exact.has(key))exact.set(key,[]);exact.get(key).push(row);return item;
  }).sort((a,b)=>collator.compare(a.row.id,b.row.id));
  saved={catalog,master,rows,byId,exact};cache.set(index,saved);
 }
 return saved;
}
export function indexedModel(index,id){return index?identities(index).byId.get(id)||null:null}
export function exactIndexedModels(index,input){if(!index)return [];const literal=String(input).trim().toUpperCase(),key=compact(input),maps=identities(index),exact=maps.byId.get(literal);return exact?[exact]:maps.byCompact.get(key)||[]}
export function fitmentContext(index,id){return (index.fitment_resolutions||[]).filter(r=>r.model_id===id||r.related_models.includes(id))}
export function searchUnified(index,catalog,{query='',family='',verified=false,mode='models',page=1,pageSize=50,groupRegional=false}={},master=null){
 const q=String(query).trim().toUpperCase(),terms=q.split(/\s+/).filter(Boolean),key=compact(q);
 const explicitMembers=new Set((index.fitment_resolutions||[]).filter(r=>key&&compact(r.model_id)===key).flatMap(r=>r.related_models));
 const size=[25,50,100].includes(Number(pageSize))?Number(pageSize):50;
 const saved=prepared(index,catalog,master),identifierQuery=terms.length===1&&/[A-Z]/.test(q)&&/[0-9]/.test(q)&&saved.rows.some(item=>item.key.startsWith(key)||item.row.id.toUpperCase()===q);
 const literalIdentifierQuery=identifierQuery&&q.includes('-')&&saved.rows.some(item=>item.row.id.toUpperCase().startsWith(q));
 let found=saved.rows.filter(item=>(inSearchMode(item.row,mode)||groupRegional&&mode==='family'&&isBaseReference(index,catalog,item.row.id))&&(!family||item.row.family===family)&&(!verified||item.row.has_checked_fields)&&(explicitMembers.has(item.row.id)||terms.every(term=>{const text=verified?item.checkedText:item.text;return identifierQuery?(literalIdentifierQuery?item.row.id.toUpperCase().startsWith(q):item.key.startsWith(key)||item.row.id.toUpperCase()===q):text.includes(term)||compact(term)&&item.key.includes(compact(term))})));
 if(q){const exact=[],rest=[];for(const item of found)(item.row.id.toUpperCase()===q||item.key===key?exact:rest).push(item);found=exact.concat(rest)}
 const referenceTotal=found.length;if(groupRegional)found=groupRegionalMatches(index,catalog,found.map(item=>item.row),{verified}).map(row=>({row}));
 const pageCount=Math.max(1,Math.ceil(found.length/size)),current=Math.min(pageCount,Math.max(1,Math.floor(Number(page)||1))),offset=(current-1)*size;
 return {total:found.length,referenceTotal,records:found.slice(offset,offset+size).map(item=>item.row),page:current,pageCount,pageSize:size,offset};
}
export function unifiedFamilyCounts(index,mode='models',catalog=null){
 const filtered=index.records.filter(row=>inSearchMode(row,mode)||catalog&&mode==='family'&&isBaseReference(index,catalog,row.id)),rows=catalog?groupRegionalMatches(index,catalog,filtered):filtered;const counts={};for(const row of rows)counts[row.family]=(counts[row.family]||0)+1;return counts;
}
export function indexedStatus(row){
 if(row.category==='watch')return row.has_checked_fields?'Selected facts source checked · other fields pending':'Specifications pending verification';
 return {package:'Documented retail package · not an additional watch design',family:'Family / base reference · not an exact variant',clock:'Clock reference',fitment:'Combined parts-fitment reference · not one watch',uncertain:'Uncertain source reading · verification required'}[row.category];
}
export function modelForDetail(index,catalog,id){
 const row=indexedModel(index,id);if(!row)return null;
 // Reference-only records receive no physical or module facts from another watch.
 return {entry:row,model:row.catalog_id?catalog.models[row.catalog_id]:{id:row.id,specs:{}},module_ids:row.catalog_id?moduleIds(catalog.models[row.catalog_id]):row.module_ids};
}

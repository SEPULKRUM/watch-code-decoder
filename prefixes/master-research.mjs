// Supplied research intake: identifier recognition does not authenticate a watch.
const modelPattern=/(?:[A-Z]{1,5}-?[A-Z]{0,3}\d{1,5}[A-Z0-9]*(?:-[A-Z0-9]+){0,3}|\d{2,3}[A-Z]{1,4}-[A-Z0-9]+(?:-[A-Z0-9]+)?)$/;
const compact=s=>String(s).toUpperCase().replace(/[^A-Z0-9]/g,'');
const cached=new WeakMap();
export function masterCategory(note,row){
 const type=row.reference_type??note.model_defaults.reference_type;
 if(type.includes('combined/parts'))return 'fitment';
 return modelPattern.test(row.model_id)&&modelPattern.exec(row.model_id)?.index===0?'individual':'unresolved';
}
export function expandMasterModel(note,row){return Object.fromEntries(note.model_columns.map(k=>[k,row[k]??note.model_defaults[k]??'']))}
export function validateMaster(note){
 if(note?.type!=='user_watch_specifications'||!Array.isArray(note.models)||!Array.isArray(note.modules)||!Array.isArray(note.relationships)||!Array.isArray(note.source_register)||!Array.isArray(note.model_columns)||!note.model_defaults||note.models.length!==note.counts?.raw_references)throw Error('Invalid supplied master research');
 const ids=new Set();
 for(const row of note.models){if(typeof row.model_id!=='string'||!row.model_id||ids.has(row.model_id))throw Error('Invalid or duplicate raw master reference');ids.add(row.model_id)}
 if(note.relationships.some(r=>!ids.has(r.model_id)||!/^\d{2,4}$/.test(r.module_reference_number)))throw Error('Invalid supplied module relationship');
 if(note.modules.length!==note.counts.module_profiles||note.relationships.length!==note.counts.relationships)throw Error('Master source count mismatch');
 return note;
}
function index(note){
 const mapped=new Set(note.relationships.map(r=>r.model_id));
 if(!cached.has(note))cached.set(note,note.models.map((row,i)=>({row,csvRow:i+2,category:masterCategory(note,row),hasModule:Boolean(row.module_reference_number)||mapped.has(row.model_id),key:compact(row.model_id),text:Object.values(row).join(' ').toUpperCase()})));
 return cached.get(note);
}
export function searchMaster(note,query='',category='all',offset=0,limit=40){
 if(!note)return {total:0,rows:[],offset:0,limit};
 const q=String(query).trim().toUpperCase(),key=compact(q),start=Math.max(0,Math.floor(offset)),size=Math.max(1,Math.floor(limit));
 const matches=index(note).filter(x=>(category==='all'||x.category===category||category==='module'&&x.hasModule||category==='enriched'&&Boolean(x.row.case_spec_evidence))&&(!q||x.row.model_id.toUpperCase().includes(q)||key&&x.key.includes(key)||x.text.includes(q)));
 return {total:matches.length,rows:matches.slice(start,start+size),offset:start,limit:size};
}
export function mergeMasterReferences(base,note){
 if(!note)return base;
 const sourceId='master_research_2026',models={...base.models};
 for(const item of index(note)){
  if(item.category!=='individual')continue;
  const id=item.row.model_id,existing=models[id];
  const observation={source_id:sourceId,role:'supplied_master_identifier',csv_row:item.csvRow,reading_scope:'unverified_identifier_not_authenticated'};
  const observations=existing?.observations||[];
  models[id]={...(existing||{id,prefix:id.match(/^[A-Z]+/)?.[0]||'',status:'machine_candidate',evidence_status:'unverified',reading_flags:[]}),observations:observations.some(o=>o.source_id===sourceId)?observations:[...observations,observation]};
 }
 const counts={...base.counts,model_strings:Object.keys(models).length};
 for(const status of ['index_checked','supplied_transcription','machine_candidate'])counts[status]=Object.values(models).filter(r=>r.status===status).length;
 return {...base,models,counts,sources:{...base.sources,[sourceId]:{filename:'Casio_Models_Master_Enriched.csv',availability:'received_research_master',sha256:note.members['Casio_Models_Master_Enriched.csv'].sha256}}};
}

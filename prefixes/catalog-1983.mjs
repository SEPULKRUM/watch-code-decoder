import {catalog1983} from './catalog-1983-data.mjs?v=seven-special-20261117';
import {moduleIds} from './core.mjs?v=seven-special-20261117';
export {catalog1983};

// A bounded source addendum lets production retain its existing base artifacts.
// Base checksums are validated before composition; source claims never overwrite
// existing facts, and the composed reconciliation explicitly identifies its inputs.
export function applyCatalog1983(catalog,index,report,patch=catalog1983,evidenceField="catalog_1983_evidence"){
 const raw=typeof index._sha256==='string'&&index._sha256===report.index_sha256;
 const prior=index.source_composition;
 const composed=prior&&typeof prior.base_index_sha256==='string'&&prior.base_index_sha256.length>0&&Array.isArray(prior.addenda)&&prior.addenda.length>0&&JSON.stringify(prior)===JSON.stringify(report.source_composition)&&!index._sha256&&!report.index_sha256;
 if((!raw&&!composed)||report.missing_model_count!==0||index.counts.watch!==report.distinct_individual_watch_identifiers)throw Error('Invalid base reconciliation for catalog addendum');
 if(patch.records.every(r=>catalog[r.kind==='module'?'modules':'models'][r.id]?.specs[evidenceField])&&Object.entries(patch.category_resolutions||{}).every(([id,c])=>index.records.some(r=>r.id===id&&r.category===c)))return {catalog,index,report};
 const next=structuredClone(catalog),search=structuredClone(index),summary=structuredClone(report);
 const clocks=new Set(patch.clock_identifiers),watches=new Set(patch.watch_identifiers),uncertain=new Set(patch.uncertain_identifiers||[]);
 const sourceIndex=search.sources.length;search.sources.push({path:patch.source_reference,sha256:patch.source_file_sha256});
 const byId=new Map(search.records.map(row=>[row.id,row]));
 const withheld=[];
 for(const record of patch.records){
  const bucket=record.kind==='module'?next.modules:next.models;
  const target=bucket[record.id]??={id:record.id,specs:{}};
  for(const [field,value]of Object.entries(record.specs)){
   if(field==='module_id'&&(target.module&&String(target.module)!==String(value)||target.specs.module_candidates))continue;
   const current=target.specs[field];
   if(current){if(JSON.stringify(current.value)!==JSON.stringify(value))withheld.push({kind:record.kind,id:record.id,field});continue;}
   target.specs[field]={value,status:'pending_review',uncertainty:evidenceField!=='catalog_1983_evidence'?'Owner-supplied technical research; pending independent verification; retain exact model, estimate and fitment scope.':'Supplied catalog transcription; not independently archive-verified. Exact printed model scope only.',sources:[{kind:'user_provided',provided_by:'SEPULKRUM',permission:'user_provided',reference:patch.source_reference,source_sha256:patch.source_sha256,accessed:patch.received,locator:record.kind==='module'?`Module ${record.id} technical table; see scoped page references`:`${record.id} caption; see scoped image/page references`,evidence:`${record.id}: ${field} = ${JSON.stringify(value)}`} ]};
  }
  if(record.kind==='module')continue;
  let row=byId.get(record.id);
  if(!row){row={id:record.id,family:record.specs.series||(/^([DG]|AWG)/.test(record.id)?'G-SHOCK':record.id.startsWith('LCW-')?'LINEAGE':clocks.has(record.id)?'Clocks':'Standard / Vintage'),category:clocks.has(record.id)?'clock':'watch',catalog_id:record.id,module_ids:[],origins:[],has_specifications:false};search.records.push(row);byId.set(row.id,row);}
  if(uncertain.has(record.id))row.category='uncertain';
  else if(clocks.has(record.id))row.category='clock';
  else if(row.category==='uncertain'&&watches.has(record.id))row.category='watch';
  row.catalog_id=record.id;
  row.module_ids=[...new Set([...row.module_ids,...moduleIds(target)])];
  row.has_specifications=Boolean(row.has_specifications||record.specs.catalog_material_finish!==undefined||record.specs.water_resistance_m!==undefined||record.specs.dimensions_mm!==undefined||record.specs.color!==undefined);
  row.origins.push([sourceIndex,'/records/'+record.id,'supplied_catalog_caption',row.category]);
 }
 for(const pending of patch.unresolved_records||[]){let row=byId.get(pending.id);if(!row){row={id:pending.id,family:'G-SHOCK',category:'uncertain',catalog_id:null,module_ids:[],origins:[],has_specifications:false};search.records.push(row);byId.set(row.id,row)}row.origins.push([sourceIndex,'/unresolved_records/'+pending.id,'unconfirmed_source_label','uncertain']);}
 for(const id of uncertain)if(byId.get(id)?.category!=='uncertain')throw Error('Unconfirmed identifier miscategorized: '+id);
 for(const [id,category]of Object.entries(patch.category_resolutions||{})){const row=byId.get(id);if(!row||!['watch','package','uncertain'].includes(category))throw Error('Invalid source category resolution: '+id);row.category=category;}
 for(const id of patch.package_identifiers||[])if(byId.get(id)?.category!=='package')throw Error('Retail package miscategorized: '+id);
 for(const id of watches)if(!byId.has(id)||!['watch','family'].includes(byId.get(id).category))throw Error('Catalog watch omitted: '+id);
 for(const id of clocks)if(byId.get(id)?.category!=='clock')throw Error('Catalog clock not categorized: '+id);
 const counts={all_records:search.records.length,watch:0,family:0,clock:0,fitment:0,uncertain:0,package:0};
 for(const row of search.records)counts[row.category]++;
 counts.watch_with_specifications=search.records.filter(r=>r.category==='watch'&&r.has_specifications).length;
 counts.watch_reference_only=counts.watch-counts.watch_with_specifications;
 counts.catalog_records=Object.keys(next.models).length;counts.catalog_watch_records=search.records.filter(r=>r.category==='watch'&&r.catalog_id).length;
 search.counts=counts;search.records.sort((a,b)=>a.id.localeCompare(b.id));
 const lineage={base_index_sha256:prior?.base_index_sha256||index._sha256,addenda:[...(prior?.addenda||[]),{addendum_file_sha256:patch.source_file_sha256,source_reference:patch.source_reference}]};
 search.source_composition=lineage;delete search._sha256;
 summary.source_composition=lineage;delete summary.index_sha256;
 summary.total_imported_identifiers+=patch.identifier_occurrences.length;
 summary.distinct_raw_identifiers=search.records.length;
 summary.distinct_individual_watch_identifiers=counts.watch;
 summary.models_with_specifications=counts.watch_with_specifications;summary.reference_only_models=counts.watch_reference_only;
 summary.unresolved_identifiers=counts.uncertain;summary.category_counts=Object.fromEntries(['watch','family','clock','fitment','uncertain','package'].map(k=>[k,counts[k]]));
 summary.duplicate_exact_identifiers=summary.total_imported_identifiers-summary.distinct_raw_identifiers;
 const duplicates=new Map((summary.duplicate_identifier_details||[]).map(row=>[row.id,row.occurrences]));
 const originalIds=new Set(index.records.map(row=>row.id));
 for(const id of patch.identifier_occurrences)duplicates.set(id,(duplicates.get(id)??(originalIds.has(id)?1:0))+1);
 summary.duplicate_identifier_details=[...duplicates].filter(([,n])=>n>1).map(([id,occurrences])=>({id,occurrences}));summary.identifiers_with_exact_duplicates=summary.duplicate_identifier_details.length;
 summary.expected_eligible_individual_identifiers=search.records.filter(r=>r.category==='watch').map(r=>r.id);
 summary.models_missing_from_published_search_index=[];summary.missing_model_count=0;
 const addendumSummary={watch_references:watches.size,clocks:clocks.size,modules:patch.records.filter(r=>r.kind==='module').length,retained_existing_scalar_values:withheld};
 summary.source_addenda=[...(summary.source_addenda||[]),{source_reference:patch.source_reference,...addendumSummary}];
 if(evidenceField==='catalog_1983_evidence')summary.catalog_addendum=addendumSummary;
 return {catalog:next,index:search,report:summary};
}

export function catalog1983EvidenceForModel(id){
 const model=catalog1983.records.find(r=>r.kind==='model'&&r.id===id);
 if(!model)return null;
 const own=model.specs.catalog_1983_evidence;
 const module=model.specs.module_id||own?.observations?.[0]?.module_id;
 return {source_reference:catalog1983.source_reference,date_scope:catalog1983.date_scope,model:own,module:catalog1983.records.find(r=>r.kind==='module'&&r.id===module)?.specs.catalog_1983_evidence};
}

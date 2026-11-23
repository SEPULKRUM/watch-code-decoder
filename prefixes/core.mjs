import {englishText} from './english.mjs?v=0dbd25b722fbd8b7';
export const value=(record,key)=>record?.specs?.[key]?.value ?? null;
export const compact=s=>String(s).toLowerCase().replace(/[^a-z0-9]/g,'');
export function moduleIds(model){return value(model,'module_candidates') || [value(model,'module_id') || model.module].filter(Boolean).map(String)}
export function findModels(data,{query='',family='',verified=false}={}){
 const terms=query.toLowerCase().trim().split(/\s+/).filter(Boolean);
 return Object.values(data.models).filter(m=>{
  if(family && value(m,'series')!==family)return false;
  if(verified&&!Object.values(m.specs).some(f=>f.status==='verified'))return false;
  const facts=Object.fromEntries(Object.entries(m.specs).filter(([,f])=>!verified||f.status==='verified').map(([k,f])=>[k,f.value]));
  const mods=verified?[]:moduleIds(m).map(id=>data.modules[id]);
  const text=englishText(m.id+' '+JSON.stringify(facts)+' '+JSON.stringify(mods?.map(r=>r?.specs))).toLowerCase();
  return terms.every(t=>text.includes(t)||compact(m.id).includes(compact(t)));
 }).sort((a,b)=>a.id.localeCompare(b.id,undefined,{numeric:true}));
}
export function stats(data){
 const families={};let fields=0,pending=0;
 for(const m of Object.values(data.models)){const f=value(m,'series')||'Unclassified';families[f]=(families[f]||0)+1}
 for(const bucket of ['models','modules'])for(const r of Object.values(data[bucket]))for(const f of Object.values(r.specs)){fields++;if(f.status==='pending_review')pending++}
 return {models:Object.keys(data.models).length,modules:Object.keys(data.modules).length,fields,pending,families};
}
export function safeUrl(s){try{const u=new URL(s);return u.protocol==='https:'&&!u.username&&!u.password?u.href:null}catch{return null}}
export function validateData(d){if(d?.schema_version!==1||!d.models||!d.modules||!Object.keys(d.models).length)throw Error('The catalog format could not be read.');for(const r of [...Object.values(d.models),...Object.values(d.modules)])if(typeof r.id!=='string'||!r.specs||typeof r.specs!=='object')throw Error('A catalog record is incomplete.');return d}
const titles={master_research_reference:'Supplied 2026 model research and scope',master_module_reference:'Supplied 2026 module functions and scope',catalog_source_references:'Catalog listings and scoped series descriptions',reference_scope:'Reference scope',catalog_2011_reference:'2011 catalog index entry and source scope',indexed_dimensions_mm:'Indexed family dimensions · mm (not every SKU)',indexed_weight_g:'Indexed family mass · g (scope shown)',catalog_2011_associations:'2011 index module associations (not a function table)',protrek_source_reference:'Pro Trek source reference and scope',supplied_model_details:'Supplied model / variant details',supplied_family_specifications:'Supplied family reference (scope shown)',supplied_module_specifications:'Supplied module functions and cautions',supplied_aliases:'Supplied regional / shortened aliases',reported_measurements:'Measurement claims and source scope',module_chronology:'Module chronology / generation evidence',reported_module_claim:'Reported module claim (unconfirmed)',battery_runtime:'Battery estimates by usage setting',catalog_year:'Catalog year (not release date)',catalog_description:'Printed section / model details',catalog_material_finish:'Printed material / finish (component unspecified)',catalog_reference:'Historical model associations (not a function table)',catalog_features:'Historical module table notes',series:'Family',dimensions_mm:'Case size · L × W × H',weight_g:'Weight',case_material:'Case & bezel material',case_finish:'Case finish',band_material:'Band material',glass:'Glass',water_resistance_rating:'Water resistance',water_resistance_m:'Water resistance · meters',water_resistance_bar:'Water resistance · bar',water_resistance:'Water resistance',color:'Color',promotional_thickness_mm:'Thickness · promotional description',technical_table_thickness_mm:'Thickness · technical table',display_polarity:'LCD polarity',accuracy_seconds_per_month:'Accuracy · seconds per month',accuracy_condition:'Accuracy condition',power_supply:'Power supply',alarm_count:'Alarms',snooze_alarm:'Snooze alarm',calendar:'Calendar',world_time_cities:'World time · cities',world_time_zones:'World time · zones',stopwatch:'Stopwatch',timer:'Countdown timer',illumination:'Illumination',radio_reception:'Radio reception',module_id:'Module reference',module_candidates:'Unresolved module references',resolution_seconds:'Resolution (seconds)',max_display_seconds:'Maximum display (seconds)',max_countdown_seconds:'Maximum countdown (seconds)',min_countdown_seconds:'Minimum countdown (seconds)',elapsed_seconds_below:'Elapsed time below (seconds)',elapsed_seconds_at_least:'Elapsed time from (seconds)',battery_type:'Battery type',count:'Count'};
export const label=k=>titles[k]||k.replace(/_/g,' ').replace(/^./,s=>s.toUpperCase());
export function display(v,k=''){
 if(v===null||v===undefined)return 'Not recorded';
 if(typeof v==='boolean')return v?'Yes':'No';
 if(k==='dimensions_mm'||k==='indexed_dimensions_mm')return `${v.length} × ${v.width} × ${v.thickness} mm`;
 if(k==='weight_g'||k==='indexed_weight_g')return `${v} g`;
 if(k.endsWith('thickness_mm'))return `${v} mm`;
 if(k==='display_polarity')return v==='positive'?'Positive · dark figures on light':'Negative · light figures on dark';
 return typeof v==='string'?englishText(v.replace(/_/g,' ')):String(v);
}

// Evidence provenance and verification are separate: a Casio URL does not verify a transcription.
export function evidenceLabel(f){
 const note=f?.uncertainty||'';
 if(/different values|source discrepancy|source error/i.test(note)||['conflict','conflicting'].includes(f?.status))return 'Conflicting evidence';
 if(f?.status==='verified')return f.review?.method==='automated_source_cross_check'?'Source checked · automated':'Verified';
 const sources=f?.sources||[];
 const official=sources.some(s=>{const u=safeUrl(s.original_url||s.url);if(!u)return false;const h=new URL(u).hostname;return ['casio.com','casio.jp','casio-europe.com'].some(d=>h===d||h.endsWith('.'+d))});
 if(official)return sources.some(s=>s.archive_timestamp)?'Archived Casio source':'Official Casio source';
 if(sources.some(s=>{const u=safeUrl(s.original_url||s.url);return s.archive_timestamp&&u&&new URL(u).hostname==='store.united-arrows.co.jp'}))return 'Archived collaboration source';
 if(sources.some(s=>s.kind==='user_provided'))return 'Owner-supplied evidence';
 return sources.length?'Other source · unverified':'Unverified';
}
export function recordEvidenceLabel(record){
 const facts=Object.values(record?.specs||{});
 if(!facts.length)return 'No evidence recorded';
 const labels=new Set(facts.map(evidenceLabel));
 if(labels.has('Conflicting evidence'))return 'Contains conflicting evidence';
 if(facts.every(f=>f.status==='verified'))return 'Verified';
 if(labels.size===1)return [...labels][0];
 return 'Mixed source evidence';
}

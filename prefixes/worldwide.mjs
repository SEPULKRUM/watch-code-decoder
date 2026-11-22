import {applySuppliedBreakdown,findBreakdownRow} from './scoped-breakdown.mjs?v=regional-search-20261122';
import {worldwide} from './worldwide-data.mjs?v=regional-search-20261122';
const compact=s=>String(s||'').toUpperCase().replace(/[^A-Z0-9]/g,'');
const models=new Map(worldwide.records.map(r=>[compact(r.id),r]));
export function applyWorldwideInterpretations(result){
 const record=models.get(compact(result.normalized));const rows=record?record.specs.worldwide_evidence.observations:worldwide.records.filter(r=>r.kind==='model').flatMap(r=>r.specs.worldwide_evidence.observations);const breakdown=findBreakdownRow(result,rows);if(!record)return breakdown?applySuppliedBreakdown(result,breakdown,'https://github.com/SEPULKRUM/casio-watch-specs/blob/main/'+worldwide.source_reference):result;
 const notes=[];
 for(const row of record.specs.worldwide_evidence.observations){
  const parts=row.model_code_breakdown||row.code_breakdown||row.individual_code_breakdown||[];
  if(parts&&!Array.isArray(parts))for(const [key,text]of Object.entries(parts))if(typeof text==='string'&&/interpretation|unverified_letter_meanings/.test(key))notes.push(`${key.replaceAll('_',' ')}: ${text}`);
  if(Array.isArray(parts))for(const p of parts)if(p.interpretation)notes.push(`${p.component||p.value||'Code'}: ${p.interpretation} (${p.classification||p.confidence||p.verification||'supplied interpretation'}).`);
  if(row.decoded_model_code)for(const p of Object.values(row.decoded_model_code))if(p?.meaning)notes.push(`${p.code||'Code'}: ${p.meaning}.`);
  if(row.family_specific_suffix_note)notes.push(row.family_specific_suffix_note);
  if(row.decoder_caveat)notes.push(row.decoder_caveat);
 }
 const source='https://github.com/SEPULKRUM/casio-watch-specs/blob/main/'+worldwide.source_reference;
 result.guideNotes=[...(result.guideNotes||[]),...[...new Set(notes)].map(text=>({text:'Supplied exact-model research — pending independent verification: '+text,source,status:'community_interpretation'}))];
 return breakdown?applySuppliedBreakdown(result,breakdown,source):result;
}

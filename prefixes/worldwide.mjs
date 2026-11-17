import {worldwide} from './worldwide-data.mjs';
const compact=s=>String(s||'').toUpperCase().replace(/[^A-Z0-9]/g,'');
const models=new Map(worldwide.records.map(r=>[compact(r.id),r]));
export function applyWorldwideInterpretations(result){
 const record=models.get(compact(result.normalized));if(!record)return result;
 const notes=[];
 for(const row of record.specs.worldwide_evidence.observations){
  const parts=row.model_code_breakdown||row.code_breakdown||row.individual_code_breakdown||[];
  if(Array.isArray(parts))for(const p of parts)if(p.interpretation)notes.push(`${p.component||p.value||'Code'}: ${p.interpretation} (${p.classification||p.confidence||p.verification||'supplied interpretation'}).`);
  if(row.decoded_model_code)for(const p of Object.values(row.decoded_model_code))if(p?.meaning)notes.push(`${p.code||'Code'}: ${p.meaning}.`);
  if(row.family_specific_suffix_note)notes.push(row.family_specific_suffix_note);
  if(row.decoder_caveat)notes.push(row.decoder_caveat);
 }
 const source='https://github.com/SEPULKRUM/casio-watch-specs/blob/main/'+worldwide.source_reference;
 result.guideNotes=[...(result.guideNotes||[]),...[...new Set(notes)].map(text=>({text:'Supplied exact-model research — pending independent verification: '+text,source,status:'community_interpretation'}))];
 return result;
}

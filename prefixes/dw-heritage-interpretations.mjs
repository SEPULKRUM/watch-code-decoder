import {dwHeritage} from './dw-heritage-data.mjs?v=dw-heritage-20261117';
const source='https://github.com/SEPULKRUM/casio-watch-specs/blob/main/'+dwHeritage.source_reference;
const compact=s=>String(s||'').toUpperCase().replace(/[^A-Z0-9]/g,'');
const records=[...dwHeritage.canonical_records,...dwHeritage.records.filter(r=>r.kind==='model'&&r.id==='DW-1983-1').map(r=>({id:r.id,kind:'watch',decoder_segments:r.specs.series_pdf_evidence.decoder_segments}))];
const table=new Map(records.map(r=>[compact(r.id),r]));
export function applyDwHeritageInterpretations(result){
 if(result.prefix!=='DW')return result;
 const key=compact(result.normalized),record=table.get(key)||table.get(key.replace(/(?:JF|ER|CR|DR|DF|JR)$/,''));if(!record)return result;
 const market=result.segments.find(s=>s.type==='market');
 result.segments=record.decoder_segments.map((s,i)=>({type:i===0?'prefix':i===1?'series':/primary color/i.test(s.role)?'variant':/color \/ design variation/i.test(s.role)?'order':'series-suffix',token:s.token,title:s.role,description:s.interpretation+(i>1&&!/primary color/i.test(s.role)?'. This is a model-specific reading, not an official universal suffix definition.':''),source,status:i===1?'Model identifier':'community_interpretation'}));
 if(market&&record.kind==='watch')result.segments.push(market);
 if(record.kind==='collector_label'){
  result.collectorLabel=true;result.referenceCategory='uncertain';result.guideNotes=[{text:'Honda is a collector/corporate descriptor, not a confirmed factory suffix or Casio SKU. Underlying module/family association is reported separately; quantities are unknown.'}];
 }
 return result;
}

import {applySuppliedBreakdown,findBreakdownRow} from './scoped-breakdown.mjs?v=official-audit-20261117';
import {master2026} from './master-2026-data.mjs';
import {applyCatalog1983} from './catalog-1983.mjs';
import {moduleIds} from './core.mjs';
export function applyMaster2026(catalog,index,report){
 const patch=applyCatalog1983(catalog,index,report,master2026,'master_2026_evidence');
 const next=structuredClone(patch.catalog),search=structuredClone(patch.index),summary=structuredClone(patch.report),history=[];
 for(const update of master2026.updates){const model=next.models[update.id],current=model.specs[update.field];if(current?.status==='verified'){if(JSON.stringify(current.value)!==JSON.stringify(update.fact.value))history.push({id:update.id,field:update.field,retained_source_checked:true});continue}if(current&&JSON.stringify(current.value)===JSON.stringify(update.fact.value))continue;if(current)history.push({id:update.id,field:update.field,superseded_fact:current});model.specs[update.field]={...structuredClone(update.fact),status:'pending_review'};if(update.field==='module_id')delete model.specs.module_candidates;}
 const technical=['dimensions_mm','weight_g','case_material','band_material','glass','water_resistance_rating','water_resistance_m','color'];
 const byId=new Map(search.records.map(r=>[r.id,r]));
 for(const id of [...master2026.current_identifiers,...master2026.regional_identifiers]){const row=byId.get(id),model=next.models[id];row.module_ids=moduleIds(model);row.has_specifications=Boolean(row.has_specifications||technical.some(f=>model.specs[f]));}
 search.counts.watch_with_specifications=search.records.filter(r=>r.category==='watch'&&r.has_specifications).length;search.counts.watch_reference_only=search.counts.watch-search.counts.watch_with_specifications;
 summary.models_with_specifications=search.counts.watch_with_specifications;summary.reference_only_models=search.counts.watch_reference_only;summary.master_2026_corrections={current_records:203,audited_models:36,dated_field_changes:78,source_reference:master2026.source_reference,superseded_or_retained:history};
 return {catalog:next,index:search,report:summary};
}
const compact=s=>String(s||'').toUpperCase().replace(/[^A-Z0-9]/g,'');
const table=new Map(master2026.records.filter(r=>r.kind==='model').map(r=>[compact(r.id),r.specs.master_2026_evidence.current_record]));
export function applyMaster2026Interpretations(result){const matched=table.get(compact(result.normalized));const row=(matched?.related_canonical_model?table.get(compact(matched.related_canonical_model)):matched)||findBreakdownRow(result,[...table.values()].filter(r=>r.decoded_model_code));if(!row)return result;const notes=[];for(const p of row.model_code_breakdown||[])if(p.interpretation)notes.push(`${p.component||p.kind}: ${p.interpretation} (${p.confidence||'source-qualified'}).`);for(const p of Object.values(row.decoded_model_code||{}))if(p?.meaning)notes.push(`${p.code||'Code'}: ${p.meaning}.`);if(row.decoder_caveat)notes.push(row.decoder_caveat);result.guideNotes=[...(result.guideNotes||[]).filter(n=>!n.text?.startsWith('Supplied exact-model research')),...[...new Set(notes)].map(text=>({text:'Updated 2026 master — model-specific interpretation: '+text,source:'https://github.com/SEPULKRUM/casio-watch-specs/blob/main/'+master2026.source_reference}))];return applySuppliedBreakdown(result,row,'https://github.com/SEPULKRUM/casio-watch-specs/blob/main/'+master2026.source_reference);}

export function canonical2026Reference(id){const key=compact(id);const match=Object.entries(master2026.aliases).find(([old])=>compact(old)===key);return match?match[1]:id;}

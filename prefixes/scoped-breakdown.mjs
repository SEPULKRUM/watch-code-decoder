// Use only source tokenizations that reconstruct an exact reference. This is not
// a universal acronym decoder; unsupported or inconsistent source splits are ignored.
export const compactCode=s=>String(s||'').toUpperCase().replace(/[^A-Z0-9]/g,'');
const roles={family_prefix:'prefix',prefix:'prefix',pre_series_modifier:'modifier',series_number:'series',series:'series',post_series_modifier:'series-suffix',color_design_code:'variant',colorway:'variant',regional_reference:'market',regional_suffix:'market'};
const titles={prefix:'Model family',modifier:'Feature / series modifier',series:'Model series','series-suffix':'Edition / configuration',variant:'Color / configuration',market:'Market suffix'};
function reference(row){return row.model||row.full_reference||row.model_reference||row.manufacturer_reference||''}
export function suppliedSegments(row){
 const id=compactCode(reference(row));if(!id)return null;
 const decoded=Object.entries(row.decoded_model_code||{}).filter(([key,v])=>roles[key]&&v?.code).map(([key,v])=>({type:roles[key],token:String(v.code),description:v.meaning||'Meaning not established for this exact model.',confidence:v.evidence||''}));
 if(decoded.length>1&&decoded.map(p=>compactCode(p.token)).join('')===id)return decoded;
 const raw=row.model_code_breakdown||row.code_breakdown||row.individual_code_breakdown;if(!Array.isArray(raw))return null;
 let afterSeries=false;const parts=raw.filter(p=>p.component||p.value).map((p,i)=>{const token=String(p.value||p.component);let type;if(i===0)type='prefix';else if(/^\d+$/.test(token)&&!afterSeries){type='series';afterSeries=true}else if(!afterSeries)type='modifier';else if(/^\d/.test(token))type='variant';else if(/^(?:JF|JR|ER|DR|CR|DF)$/.test(token))type='market';else type='series-suffix';return {type,token,description:p.interpretation||'Meaning not established for this exact model.',confidence:p.confidence||p.classification||p.verification||''}});
 return parts.length>1&&parts.map(p=>compactCode(p.token)).join('')===id?parts:null;
}
export function applySuppliedBreakdown(result,row,source){
 const parts=suppliedSegments(row);if(!parts)return result;
 const target=compactCode(result.normalized),full=compactCode(reference(row));let used=parts,isExample=false;
 if(target!==full){
  const region=(row.regional_references_verified||[]).find(r=>compactCode(r.model_reference)===target);
  if(region&&target.startsWith(full)&&/^(?:JF|JR|ER|DR|CR|DF)$/.test(target.slice(full.length))){used=[...parts,{type:'market',token:target.slice(full.length),description:`${region.region||'Documented'} market reference. Sales market does not establish manufacturing country.`}]}
  else{let joined='',end=0;for(const p of parts){joined+=compactCode(p.token);end++;if(joined===target)break}if(joined!==target||end<2)return result;used=parts.slice(0,end);isExample=true;}
 }
 if(target===full)result.normalized=reference(row);
 if(used[0]?.type==='prefix'&&compactCode(result.prefix)!==compactCode(used[0].token)){result.prefix=used[0].token;result.family=row.brand_line||row.family||row.brand||result.family;}
 result.recognized=true;delete result.reason;
 const old=result.segments||[];
 result.segments=used.flatMap(p=>{
  if(p.type==='series-suffix'){for(let start=0;start<old.length;start++){let joined='';const finer=[];for(let i=start;i<old.length&&['series-suffix','modifier'].includes(old[i].type);i++){joined+=compactCode(old[i].token);finer.push(old[i]);if(joined===compactCode(p.token)&&finer.length>1)return finer.map(s=>({...s,scopedInterpretation:true}));if(!compactCode(p.token).startsWith(joined))break}}}
  const prior=old.find(s=>s.type===p.type&&compactCode(s.token)===compactCode(p.token));const unresolved=/not established|unverified|not assumed|not formally|literal.*not|unresolved|not.*decoded|not.*confirmed/i.test(p.description);const keep=unresolved&&prior&&!/unverified|unresolved|not been established/i.test(prior.status||'')&&p.type!=='series';return [{...(p.type==='prefix'&&prior?{communityMeaning:prior.communityMeaning}:{}),type:p.type,token:p.token,title:titles[p.type],description:(keep?prior.description+' '+p.description:p.description)+(p.type==='series'?'':' Supplied model-specific interpretation; pending independent review.'),source,status:p.type==='series'?'Model identifier':'community_interpretation',scopedInterpretation:true}];});
 if(isExample)result.guideNotes=[...(result.guideNotes||[]),{text:`This base-code breakdown uses the documented example ${reference(row)}. Its color and market are not assigned to an unspecified variant.`,source}];
 return result;
}
export function findBreakdownRow(result,rows){
 const key=compactCode(result.normalized);const exact=rows.find(r=>compactCode(reference(r))===key);if(exact)return exact;
 const regional=rows.find(r=>(r.regional_references_verified||[]).some(a=>compactCode(a.model_reference)===key));if(regional)return regional;
 const candidates=rows.filter(r=>compactCode(reference(r)).startsWith(key)).map(r=>({row:r,parts:suppliedSegments(r)})).filter(x=>x.parts&&x.parts.length>1);
 const valid=candidates.filter(({parts})=>{let s='';return parts.some((p,i)=>{s+=compactCode(p.token);return i>=1&&s===key})});
 if(!valid.length)return null;const signature=parts=>{let s='';const selected=[];for(const p of parts){s+=compactCode(p.token);selected.push([p.type,compactCode(p.token)]);if(s===key)break}return JSON.stringify(selected)};
 return valid.every(x=>signature(x.parts)===signature(valid[0].parts))?valid[0].row:null;
}

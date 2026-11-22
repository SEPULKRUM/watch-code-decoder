// Use only source tokenizations that reconstruct an exact reference. This is not
// a universal acronym decoder; unsupported or inconsistent source splits are ignored.
export const compactCode=s=>String(s||'').toUpperCase().replace(/[^A-Z0-9]/g,'');
const roles={family_prefix:'prefix',prefix:'prefix',pre_series_modifier:'modifier',series_number:'series',series:'series',post_series_modifier:'series-suffix',color_design_code:'variant',colorway:'variant',regional_reference:'market',regional_suffix:'market'};
const marketNames={JF:'Japan',JR:'Japan',ER:'Europe',DR:'International',CR:'North America',DF:'International'};
function appendedMarket(target,row,parts){const full=compactCode(reference(row)),suffix=target.slice(full.length);return target.startsWith(full)&&marketNames[suffix]&&parts?.some(p=>p.type==='variant')&&!parts.some(p=>p.type==='market')?suffix:null}
const titles={prefix:'Model family',modifier:'Feature / series modifier',series:'Model series','series-suffix':'Edition / configuration',variant:'Color / configuration',market:'Market suffix'};
function reference(row){return row.model||row.full_reference||row.model_reference||row.manufacturer_reference||''}

function repairReferenceGrouping(row){
 const id=reference(row),split=id.lastIndexOf('-');if(split<0)return null;
 const body=id.slice(0,split),tail=id.slice(split+1);const main=body.match(/^([A-Z]+)-([A-Z]*)(\d+)([A-Z0-9]*)$/)||body.match(/^([A-Z]+?)(\d+)([A-Z0-9]*)$/);if(!main||!/^\d[A-Z0-9]*$/.test(tail))return null;
 const hyphen=main.length===5,prefix=main[1],modifier=hyphen?main[2]:'',number=hyphen?main[3]:main[2],suffix=hyphen?main[4]:main[3];
 const out=[{type:'prefix',token:prefix,description:'Model-family portion of the supplied exact reference; formal acronym expansion is not established.',syntaxDerived:true}];if(modifier)out.push({type:'modifier',token:modifier,description:'Feature / series modifier; meaning not established by this supplied grouping.',syntaxDerived:true});out.push({type:'series',token:number,description:'Numeric model series identifier, not a module number or production date.',syntaxDerived:true});if(suffix)out.push({type:'series-suffix',token:suffix,description:'Configuration / edition suffix; individual letter meanings are not established by this supplied grouping.',syntaxDerived:true});const region=tail.match(/^(.*?)(JF|JR|ER|DR|CR|DF)$/);if(region){if(region[1])out.push({type:'variant',token:region[1],description:'Complete color / configuration code; no individual letter expansion is assumed.',syntaxDerived:true});out.push({type:'market',token:region[2],description:'Documented retail-market suffix; this does not establish manufacturing country.',syntaxDerived:true})}else out.push({type:'variant',token:tail,description:'Color / configuration code; exact meaning requires model-specific evidence.',syntaxDerived:true});return out;
}

export function suppliedSegments(row){
 const id=compactCode(reference(row));if(!id)return null;
 const decoded=Object.entries(row.decoded_model_code||{}).filter(([key,v])=>roles[key]&&v?.code).map(([key,v])=>({type:roles[key],token:String(v.code),description:v.meaning||'Meaning not established for this exact model.',confidence:v.evidence||''}));
 if(decoded.length>1&&/^[A-Z]+(?:-[A-Z0-9]+)?$/.test(decoded[0].token)&&decoded.map(p=>compactCode(p.token)).join('')===id)return decoded;
 const raw=row.model_code_breakdown||row.code_breakdown||row.individual_code_breakdown;
 if(raw&&!Array.isArray(raw)&&Array.isArray(raw.full_reference_tokenization)){
  const [prefix,main,tail,...extra]=raw.full_reference_tokenization.map(String);const parsed=main?.match(/^([A-Z]*)(\d+)([A-Z]*)$/);
  if(!extra.length&&prefix&&/^[A-Z]+(?:-[A-Z]+)?$/.test(prefix)&&parsed&&tail){const out=[{type:'prefix',token:prefix,description:raw.family_prefix_interpretation||'Supplied model-family association; literal letter expansion unverified.'}];if(parsed[1])out.push({type:'modifier',token:parsed[1],description:'Model-specific feature / series modifier; literal meaning not established.'});out.push({type:'series',token:parsed[2],description:'Model series identifier, not a production year or module number.'});if(parsed[3])out.push({type:'series-suffix',token:parsed[3],description:'Edition / configuration marker; meaning not established by this source.'});const region=tail.match(/^(.*?)(JF|JR|ER|DR|CR|DF)$/);if(region){if(region[1])out.push({type:'variant',token:region[1],description:'Complete supplied color / configuration code; individual letter meanings are not assumed.'});out.push({type:'market',token:region[2],description:raw.regional_suffix_interpretation||'Documented market reference; not manufacturing country.'})}else out.push({type:'variant',token:tail,description:'Complete color / configuration code; meaning not established.'});if(out.map(p=>compactCode(p.token)).join('')===id)return out;}
 }
 if(!Array.isArray(raw))return null;
 const first=raw.find(p=>p.component||p.value);if(first&&/\d/.test(String(first.value||first.component)))return repairReferenceGrouping(row);
 let afterSeries=false;const parts=raw.filter(p=>p.component||p.value).map((p,i)=>{const token=String(p.value||p.component);let type;if(i===0)type='prefix';else if(/^\d+$/.test(token)&&!afterSeries){type='series';afterSeries=true}else if(!afterSeries)type='modifier';else if(/^\d/.test(token))type='variant';else if(/^(?:JF|JR|ER|DR|CR|DF)$/.test(token))type='market';else type='series-suffix';return {type,token,description:p.interpretation||'Meaning not established for this exact model.',confidence:p.confidence||p.classification||p.verification||''}});
 return parts.length>1&&/^[A-Z]+(?:-[A-Z]+)?$/.test(parts[0].token)&&parts.map(p=>compactCode(p.token)).join('')===id?parts:null;
}
export function applySuppliedBreakdown(result,row,source){
 const parts=suppliedSegments(row);if(!parts)return result;
 const target=compactCode(result.normalized),full=compactCode(reference(row));let used=parts,isExample=false,inferredMarket=false;
 if(target!==full){
  const region=(row.regional_references_verified||[]).find(r=>compactCode(r.model_reference)===target);
  if(region&&target.startsWith(full)&&/^(?:JF|JR|ER|DR|CR|DF)$/.test(target.slice(full.length))){used=[...parts,{type:'market',token:target.slice(full.length),description:`${region.region||'Documented'} market reference. Sales market does not establish manufacturing country.`}]}
  else if(appendedMarket(target,row,parts)){inferredMarket=true;const suffix=appendedMarket(target,row,parts);used=[...parts,{type:'market',token:suffix,description:`${marketNames[suffix]} market suffix (general catalog convention). This decodes the entered suffix only; this exact regional retail reference has not been verified by the supplied model evidence. It does not establish manufacturing country.`}]}
  else{let joined='',end=0;for(const p of parts){joined+=compactCode(p.token);end++;if(joined===target)break}if(joined!==target||end<2)return result;used=parts.slice(0,end);isExample=true;}
 }
 if(target===full)result.normalized=reference(row);
 if(used[0]?.type==='prefix'&&compactCode(result.prefix)!==compactCode(used[0].token)){result.prefix=used[0].token;result.family=row.brand_line||row.family||row.brand||result.family;}
 result.recognized=true;delete result.reason;
 const old=result.segments||[];
 result.segments=used.flatMap(p=>{
  if(inferredMarket&&p.type==='variant'){const finer=old.filter(s=>['variant','order'].includes(s.type));if(finer.length>1&&finer.map(s=>compactCode(s.token)).join('')===compactCode(p.token))return finer.map(s=>({...s,scopedInterpretation:true}));}
  if(p.type==='series-suffix'){for(let start=0;start<old.length;start++){let joined='';const finer=[];for(let i=start;i<old.length&&['series-suffix','modifier'].includes(old[i].type);i++){joined+=compactCode(old[i].token);finer.push(old[i]);if(joined===compactCode(p.token)&&finer.length>1)return finer.map(s=>({...s,scopedInterpretation:true}));if(!compactCode(p.token).startsWith(joined))break}}}
  const prior=old.find(s=>s.type===p.type&&compactCode(s.token)===compactCode(p.token));const unresolved=/not established|unverified|not assumed|not formally|literal.*not|unresolved|not.*decoded|not.*confirmed/i.test(p.description);const keep=unresolved&&prior&&!/unverified|unresolved|not been established/i.test(prior.status||'')&&p.type!=='series';return [{...(p.type==='prefix'&&prior?{communityMeaning:prior.communityMeaning}:{}),type:p.type,token:p.token,title:titles[p.type],description:(keep?prior.description+' '+p.description:p.description)+(p.type==='series'?'':' Supplied model-specific interpretation; pending independent review.'),source,status:p.type==='series'?'Model identifier':'community_interpretation',scopedInterpretation:true}];});
 if(used.some(p=>p.syntaxDerived))result.guideNotes=[...(result.guideNotes||[]),{text:'The supplied grouping did not separate the model family and numeric series. These positions are separated syntactically here; unsupported letter meanings remain unverified.',source}];
 if(isExample)result.guideNotes=[...(result.guideNotes||[]),{text:`This base-code breakdown uses the documented example ${reference(row)}. Its color and market are not assigned to an unspecified variant.`,source}];
 return result;
}
export function findBreakdownRow(result,rows){
 const key=compactCode(result.normalized);const exact=rows.filter(r=>compactCode(reference(r))===key);const decodedExact=exact.filter(r=>suppliedSegments(r)).sort((a,b)=>suppliedSegments(b).length-suppliedSegments(a).length);if(decodedExact.length)return decodedExact[0];
 const regional=rows.find(r=>(r.regional_references_verified||[]).some(a=>compactCode(a.model_reference)===key));if(regional)return regional;
 const marketBase=key.replace(/(?:JF|JR|ER|DR|CR|DF)$/,'');const marketBases=marketBase===key?[]:rows.filter(row=>compactCode(reference(row))===marketBase).map(row=>({row,parts:suppliedSegments(row)})).filter(x=>appendedMarket(key,x.row,x.parts));if(marketBases.length){const signature=x=>JSON.stringify(x.parts.map(p=>[p.type,compactCode(p.token),p.description]));if(marketBases.every(x=>signature(x)===signature(marketBases[0]))){const prior=result.segments||[],suffix=key.slice(marketBase.length);if(prior.some(p=>p.type==='market'&&compactCode(p.token)===suffix)&&compactCode(prior[0]?.token)===compactCode(marketBases[0].parts[0].token)&&prior.map(p=>compactCode(p.token)).join('')===key)return null;return marketBases[0].row;}}
 if(exact.length)return exact[0];
 const candidates=rows.filter(r=>compactCode(reference(r)).startsWith(key)).map(r=>({row:r,parts:suppliedSegments(r)})).filter(x=>x.parts&&x.parts.length>1);
 const valid=candidates.filter(({parts})=>{let s='';return parts.some((p,i)=>{s+=compactCode(p.token);return i>=1&&s===key})});
 if(!valid.length)return null;const signature=parts=>{let s='';const selected=[];for(const p of parts){s+=compactCode(p.token);selected.push([p.type,compactCode(p.token)]);if(s===key)break}return JSON.stringify(selected)};
 return valid.every(x=>signature(x.parts)===signature(valid[0].parts))?valid[0].row:null;
}

export function displaySuppliedRecord(row){const parts=suppliedSegments(row);if(!parts?.some(p=>p.syntaxDerived))return row;const current=Object.fromEntries(Object.entries(row).filter(([key])=>!['model_code_breakdown','code_breakdown','individual_code_breakdown','decoded_model_code'].includes(key)));current.applied_prefix_breakdown=parts.map(p=>({token:p.token,role:p.type,interpretation:p.description,status:'Syntactic position; unsupported letter meanings are not confirmed'}));current.prefix_grouping_note='The supplied full-reference grouping has been separated syntactically. Original source grouping is retained in the source record and history.';return current;}

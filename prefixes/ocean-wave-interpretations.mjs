// Family-scoped supplied research. No universal Casio suffix key is asserted.
const source='https://github.com/SEPULKRUM/casio-watch-specs/blob/main/research/supplied-oceanus5141-wave4319-2026-11-17.json';
export function applyOceanWaveInterpretations(result,{modifier,number,seriesTail}){
 if(result.historicalReference)return result;
 const ocean=result.prefix==='OCW'&&modifier==='T'&&(number==='1000'&&['','B','D','E','F'].includes(seriesTail)||number==='1010'&&['','B','G'].includes(seriesTail));
 const overland=result.prefix==='OAW'&&!modifier&&number==='100'&&seriesTail==='TDJ';
 const lineage=result.prefix==='LCW'&&!modifier&&number==='100'&&['DJ','TDJ'].includes(seriesTail);
 const wave=result.prefix==='WVA'&&!modifier&&number==='320'&&['J','DJ'].includes(seriesTail);
 const partial=!modifier&&(result.prefix==='LCW'&&number==='110'&&['','T'].includes(seriesTail)||result.prefix==='LIW'&&(number==='100'&&seriesTail==='TDJ'||number==='110'&&seriesTail==='T'));
 if(!ocean&&!overland&&!lineage&&!wave&&!partial)return result;
 const set=(s,description,title=s.title,status='community_interpretation')=>Object.assign(s,{description,title,source,status});
 const series=result.segments.find(s=>s.type==='series');if(series){series.token=number;series.description=`${number} identifies this model family / series, not a module number or production date.`;}
 const prefix=result.segments.find(s=>s.type==='prefix');if(prefix&&overland)set(prefix,'OAW is associated with the OVERLAND analog-digital family in the supplied OAW-100TDJ research. This is a model-family association, not an official universal letter key.','Model family');
 if(partial){
  if(prefix&&result.prefix==='LIW')set(prefix,'LIW is retained as supplied. These partial LIW references may be mislabeled LCW examples; the original factory prefix and module remain unresolved.','Unresolved reference family','unverified');
  for(const s of result.segments.filter(s=>s.type==='series-suffix'))set(s,'Incomplete family identifier: exact retail model, materials and individual letter expansion require factory evidence. No missing color suffix is inferred.','Unresolved partial-reference marker','unverified');
  result.guideNotes=[...(result.guideNotes||[]),{text:'This is a partial reference, not an individually verified retail SKU. Do not invent -1AJF or -7AJF endings, merge LCW/LIW, or infer an exact module.'}];return result;
 }
 result.segments=result.segments.filter(s=>s.type!=='series-suffix');const add=(token,title,description)=>({type:'series-suffix',token,title,description,source,status:'community_interpretation'});let suffixes=[];
 if(ocean){const t=result.segments.find(s=>s.type==='modifier'&&s.token==='T');if(t)set(t,'T identifies the OCEANUS T-series here. Its official universal letter expansion is not established; the titanium materials are separately recorded model specifications.','T-series designation');
  const meanings=number==='1000'?{B:'Black ion-plated titanium exterior',D:'Special deep-blue exterior configuration',E:'Aquamarine-blue production variant',F:'Special blue edition; production quantity unverified'}:{B:'Black-treated design details',G:'Rose-gold-colored details on OCW-T1010G'};
  if(seriesTail)suffixes=[add(seriesTail,'Series-specific configuration',meanings[seriesTail]+'. This is a supplied family-specific association, not a universal letter expansion.')];
 }else{
  if(seriesTail.includes('T'))suffixes.push(add('T','Titanium configuration','T is associated with titanium construction on these documented references. It does not establish every T model’s material or glass.'));
  if(seriesTail.includes('D'))suffixes.push(add('D','Metal bracelet configuration','D is read here as a metal bracelet marker. In TDJ, the documented bracelet is titanium; D does not imply a stainless-steel case.'));
  suffixes.push(add('J','Japan-associated series marker','J is a Japan-associated series designation in this supplied comparison. Its exact formal expansion is unresolved; it is separate from the final JF retail suffix.'));
 }
 result.segments.splice(result.segments.findIndex(s=>s.type==='series')+1,0,...suffixes);
 if(wave){const e=result.segments.find(s=>s.type==='order'&&s.token==='E');if(e)set(e,'E is the final variant / market character in the supplied WVA-320J / DJ -1E references. Its exact meaning is unresolved; it is not automatically an export code.','Unresolved final reference character','unverified');}
 if(lineage&&seriesTail==='TDJ'){
  const order=result.segments.find(s=>s.type==='order'&&s.token==='A2');if(order)set(order,'A2 is retained within the 2A2 navy / blue configuration of LCW-100TDJ-2A2JF. Its separate expansion is undocumented; it does not identify a different module.','Specific color / design variation');
 }
 const market=result.segments.find(s=>s.type==='market'&&s.token==='JF');if(market)set(market,'JF identifies a Japanese-market retail reference. It does not establish manufacturing country or packaging contents.','Market suffix');
 return result;
}

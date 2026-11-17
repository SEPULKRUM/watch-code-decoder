// Scoped readings from supplied technical PDFs; never a universal manufacturer key.
const source='https://github.com/SEPULKRUM/casio-watch-specs/blob/main/research/supplied-prw69-ocwg1200-2026-11-17.json';
export function applySeriesInterpretations(result,{modifier,number,seriesTail}){
 if(result.historicalReference)return result;
 const prw=result.prefix==='PRW'&&number==='69'&&['Y','YB','YT'].includes(seriesTail);
 const ocean=result.prefix==='OCW'&&modifier==='G'&&number==='1200'&&['','B','C','D'].includes(seriesTail);
 if(!prw&&!ocean)return result;
 const series=result.segments.find(s=>s.type==='series');if(!series)return result;
 Object.assign(series,{token:number,description:`${number} identifies this ${prw?'PRO TREK':'OCEANUS'} model series. It is not a module number or production year.`});
 if(ocean){const g=result.segments.find(s=>s.type==='modifier'&&s.token==='G');if(g)Object.assign(g,{title:'GPS generation association',description:'G is associated with the GPS-equipped OCW-G1200 generation. This is a series-specific interpretation, not an official universal Casio acronym key.',source,status:'community_interpretation'});}
 result.segments=result.segments.filter(s=>s.type!=='series-suffix');
 const add=(token,title,description)=>({type:'series-suffix',token,title,description,source,status:'community_interpretation'});
 const suffixes=prw?[add('Y','Outdoor-material association','Y is inferred as a specialized outdoor-material modifier from sibling and cross-series comparisons. Casio has not published a universal definition.'),...(seriesTail==='YB'?[add('B','Fabric-band configuration','B in PRW-69YB is associated with the flame-retardant CORDURA re/cor fabric band. This is not a universal B definition.')]:seriesTail==='YT'?[add('T','Titanium bracelet configuration','T in PRW-69YT is associated with its solid titanium bracelet. Y is retained; titanium does not imply that every T model has sapphire glass.')]:[])]:seriesTail?[add(seriesTail,'Series-specific configuration',{B:'B identifies the black DLC-treated titanium case/bracelet configuration in this series.',C:'C identifies the navy-leather 500-unit limited configuration in this series. C is not a universal leather code.',D:'D identifies the titanium/ceramic-link bracelet 1,000-unit limited configuration in this series. D is not a universal ceramic code.'}[seriesTail])]:[];
 result.segments.splice(result.segments.findIndex(s=>s.type==='series')+1,0,...suffixes);
 const variant=result.segments.find(s=>s.type==='variant');const colors=prw?{Y:{1:'Black'},YB:{3:'Green'},YT:{7:'Silver / light'}}[seriesTail]:{'1':'Dark dial','2':'Light-blue / blue-toned dial'};
 if(variant&&colors[variant.token])Object.assign(variant,{description:`${variant.token} is associated with ${colors[variant.token]} for the supplied exact reference. This is not a universal color guarantee.`,source,status:'community_interpretation'});
 return result;
}

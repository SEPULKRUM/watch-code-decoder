import {anniversaryDirectory} from './anniversary-data.mjs?v=7c8896384ae6cc00';
export {anniversaryDirectory};
const compact=s=>s.replace(/[^A-Z0-9]/g,'');
const source='https://github.com/SEPULKRUM/casio-watch-specs/blob/main/docs/anniversary-interpretations.md';
const feed='https://www.casio.com/content/casio/locales/jp/ja/products/product.data.GWF-D1035B-1.json';
export function normalizeAnniversary(key,fallback){const m=key.match(/^GWFD1035(B)?(?:([1-9][A-Z0-9]*))?$/);return m?`GWF-D1035${m[1]||''}${m[2]?'-'+m[2]:''}`:fallback}
export function applyAnniversary(result){
 if(result.historicalReference)return result;
 if(!result.normalized)return result;
 const key=compact(result.normalized),frog=/^GWFD1035B?(?:1(?:JR|CR|DR)?)?$/.test(key);
 const matches=anniversaryDirectory.filter(r=>compact(r.id)===key||['JR','CR','DR','ER','JF'].some(s=>key===compact(r.id)+s));
 result.editionNotes=matches.map(r=>({title:r.collection,description:r.description+' '+r.group+'. Owner-supplied directory claim; release date, production quantity and anniversary association require individual confirmation.',status:'secondary_reported',source}));
 if(!frog&&matches.length){
 const main=result.normalized.split('-').slice(0,-1).join('-')||result.normalized;
 const suffix=main.match(/([A-Z]+)$/)?.[1];
 if(suffix&&['SS','ZE','FR','GEM','PG','PS','RE','RX','UN','EH','TFB','TF'].includes(suffix)){
 const existing=result.segments.find(s=>s.type==='series-suffix'&&s.token===suffix);
 const description=`The supplied directory associates ${suffix} on this exact model with ${matches[0].collection}. This is a scoped edition reference, not a universal suffix definition.`;
 if(existing)Object.assign(existing,{title:'Commemorative edition suffix',description,status:'secondary_reported',source});
 else{const series=result.segments.find(s=>s.type==='series');if(series?.token.endsWith(suffix)){series.token=series.token.slice(0,-suffix.length);series.description=series.token+' series identifier; not a module or production date.';result.segments.splice(result.segments.indexOf(series)+1,0,{type:'series-suffix',token:suffix,title:'Commemorative edition suffix',description,status:'secondary_reported',source});}}
 }
 }
 if(!frog)return result;
 const i=result.segments.findIndex(s=>s.type==='modifier'&&s.token==='D');
 if(i>=0){const end=result.segments.findIndex((s,n)=>n>i&&s.type==='series');if(end>=0){const hasB=/^GWFD1035B/.test(key);result.segments.splice(i,end-i+1,
 {type:'series',token:'D10',title:'Depth-sensor base-series reference',description:'D10 is read here as the depth-sensor GWF-D1000 base-series reference within the commemorative D1035 designation. This is a scoped community segmentation, not a universal abbreviation rule.',status:'community_interpretation',source},
 {type:'anniversary',token:'35',title:'35th anniversary edition',description:'35 identifies this G-SHOCK 35th-anniversary commemorative edition. Gold Tornado was released in late 2017 ahead of the 1983–2018 milestone. This rule applies to GWF-D1035; other numbers ending in 35 are not automatically anniversary codes.',status:'official_observed',source:feed},
 ...(hasB?[{type:'series-suffix',token:'B',title:'Special-colour variant',description:'B is the supplied black / special-colour variant reading for this Gold Tornado edition. Gold hardware and LCD accents with a red inner band describe this model; B is not a universal black, Bluetooth or LCD-polarity code.',status:'community_interpretation',source}]:[]));}}
 const colour=result.segments.find(s=>s.type==='variant'&&s.token==='1');if(colour)Object.assign(colour,{description:'Primary black colourway, with gold and red accents. Casio lists gold, red and black for the Japanese GWF-D1035B-1JR SKU.',status:'official_observed',source:feed});
 result.editionNotes.push({title:'GWF-D1035B-1 — Gold Tornado',description:'Master of G – Sea FROGMAN; Casio confirms module 3445, 59.2 × 53.3 × 18.0 mm, 141 g, Tough Solar, Multi-Band 6 and ISO 200 m diving resistance in its Japanese support feed. Regional codes supplied by the owner: JR Japan, CR North America, DR export; those sales-region readings do not establish identical regional SKUs or manufacturing country.',status:'official_observed',source:feed});
 return result;
}
export function anniversaryReferenceSections(){const groups=[...new Set(anniversaryDirectory.map(r=>r.group))];return groups.map(group=>({title:'Supplied anniversary directory · '+group,items:anniversaryDirectory.filter(r=>r.group===group).map(r=>r.id+' — '+r.collection+': '+r.description+' Supplied research claim, not independently verified.')}))}

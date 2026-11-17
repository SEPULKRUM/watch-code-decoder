import {anniversaryDirectory} from './anniversary-data.mjs';
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
 if(existing){if(!existing.scopedInterpretation)Object.assign(existing,{title:'Commemorative edition suffix',description,status:'secondary_reported',source});}
 else{const series=result.segments.find(s=>s.type==='series');if(series?.token.endsWith(suffix)){series.token=series.token.slice(0,-suffix.length);series.description=series.token+' series identifier; not a module or production date.';result.segments.splice(result.segments.indexOf(series)+1,0,{type:'series-suffix',token:suffix,title:'Commemorative edition suffix',description,status:'secondary_reported',source});}}
 }
 }
 if(key==='GPW2000TFB1A'){
  const archive='https://web.archive.org/web/20171210224041/http://www.casio.com/products/watches/g-shock/gpw2000tfb-1a';
  const suffix=result.segments.find(s=>s.type==='series-suffix'&&s.token==='TFB');
  if(suffix)Object.assign(suffix,{title:'Gold Tornado edition',description:'TFB identifies this Gold Tornado 35th-anniversary edition on the archived GPW-2000TFB-1A page. A letter-by-letter expansion of TFB is not established.',status:'official_observed',source:archive});
  result.officialFeatures={source:archive,description:'The December 10, 2017 Casio edition page lists module 5502, Tough Solar, Bluetooth mobile link, GPS reception and Multi-Band atomic timekeeping. These are historical product-page claims, not an assessment of present-day connected services.'};
  result.editionNotes.push({title:'GPW-2000TFB-1A — archived specifications',description:'Archived Casio page: 200 m water resistance, 66.0 × 57.1 × 18.2 mm, 120 g, module 5502. Gold Tornado black/red/gold accents, anniversary case-back engraving, a star-emblem band keeper and special packaging. The size row is labeled GPW-2000 on this edition page; its measurements remain source claims, not independent measurements.',status:'official_observed',source:archive});
  result.editionNotes.push({title:'Additional 2017 G-SHOCK references',description:'The December 8, 2017 category snapshot contains 197 distinct product links. Listing-only identifiers are research discoveries; they do not establish technical specifications or 197 newly discovered physical watch variants.',status:'official_observed',source:'https://web.archive.org/web/20171208233205/http://www.casio.com/products/watches/g-shock'});
 }
 if(/^DW(?:5000|5200|5600)C(?:[0-9A-Z]*)$/.test(key)){
  const source='https://www.youtube.com/watch?v=1k5VMJY6Y-Y';
  const series=result.segments.find(s=>s.type==='series');
  if(series?.token.endsWith('C')){series.token=series.token.slice(0,-1);series.description=series.token+' series identifier; not a module or production date.';result.segments.splice(result.segments.indexOf(series)+1,0,{type:'series-suffix',token:'C',title:'Original generation / casing revision',description:'Owner interpretation: C identifies the original generation or casing revision in DW-5000C, DW-5200C and DW-5600C, associated with their early steel screw-back construction. This is not an official universal suffix definition.',status:'community_interpretation',source});}
  result.editionNotes.push({title:'DW and C — owner naming interpretation',description:'The owner reads DW as Digital Watch for these vintage battery-powered digital squares, and C as an original-generation / casing-revision suffix. Digital Water Resistant is another community reading of DW. No official universal letter-expansion key is established by these descriptions.',status:'community_interpretation',source});
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

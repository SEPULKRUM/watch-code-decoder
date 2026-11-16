import {englishText} from './english.mjs?v=7c8896384ae6cc00';
const waterFields=new Set(['water_resistance_rating','water_resistance_m','water_resistance_bar']);
function readings(text,unit){
 const expression=unit==='m'?/(\d+(?:\.\d+)?)\s*[- ]?\s*(?:meters?|metres?|m)\b/gi:/(\d+(?:\.\d+)?)\s*[- ]?\s*bars?\b/gi;
 return [...text.matchAll(expression)].map(match=>Number(match[1]));
}
export function waterResistanceFact(entries){
 const original=entries.map(([field,fact])=>({field,...fact}));
 const rating=englishText(entries.find(([field])=>field==='water_resistance_rating')?.[1].value??'');
 const meters=new Set(readings(rating,'m')),bars=new Set(readings(rating,'bar'));
 for(const [field,fact] of entries){if(field==='water_resistance_m')meters.add(Number(fact.value));if(field==='water_resistance_bar')bars.add(Number(fact.value))}
 const conflict=meters.size>1||bars.size>1||meters.size===1&&bars.size===1&&Math.abs([...meters][0]-[...bars][0]*10)>0.000001;
 const units=[...meters].map(n=>`${n} m`).concat([...bars].map(n=>`${n} bar`));
 const plainRating=rating.replace(/\d+(?:\.\d+)?/g,'').replace(/water\s*resistan(?:ce|t)|meters?|metres?|bars?|m/gi,'').replace(/[\s/()\-]/g,'')==='';
 let text=rating;
 if(!rating||plainRating&&units.length)text=meters.size===1&&bars.size===1&&!conflict?`${[...meters][0]} m (${[...bars][0]} bar)`:units.join(' / ');
 else{
  const extra=[...meters].filter(n=>!readings(rating,'m').includes(n)).map(n=>`${n} m`).concat([...bars].filter(n=>!readings(rating,'bar').includes(n)).map(n=>`${n} bar`));
  if(extra.length)text+=' · '+extra.join(' / ');
 }
 if(conflict)text+=' · conflicting claims';
 const sources=[],seen=new Set();
 for(const [,fact] of entries)for(const source of fact.sources||[]){const key=JSON.stringify(source,Object.keys(source).sort());if(!seen.has(key)){seen.add(key);sources.push(source)}}
 const notes=[...new Set(entries.map(([,fact])=>fact.uncertainty).filter(Boolean))];
 if(conflict)notes.unshift('Different values are recorded for water resistance; no claim has been silently selected.');
 const reviewed=entries.every(([,f])=>f.status==='verified'&&f.review?.method==='automated_source_cross_check');
 return {value:text||'Not recorded',status:conflict?'conflicting':entries.every(([,f])=>f.status==='verified')?'verified':'pending_review',sources,uncertainty:notes.join('\n'),components:original,...(reviewed?{review:entries[0][1].review}:{})};
}
export function presentationFacts(record,{excluded=[],verified=false}={}){
 const entries=Object.entries(record?.specs||{}).filter(([field,fact])=>!excluded.includes(field)&&(!verified||fact.status==='verified'));
 const water=entries.filter(([field])=>waterFields.has(field));let shown=false;
 return entries.flatMap(([field,fact])=>{if(!waterFields.has(field))return [[field,fact]];if(shown)return [];shown=true;return [['water_resistance',waterResistanceFact(water)]]});
}

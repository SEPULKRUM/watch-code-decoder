import {normalizeAnniversary} from './anniversary.mjs?v=7c8896384ae6cc00';
import {ownerPattern} from './owner-prefix-readings.mjs?v=7c8896384ae6cc00';
import {applyGuide} from './guide-interpretations.mjs?v=7c8896384ae6cc00';
import {prefixMeaning} from './prefix-meanings.mjs?v=7c8896384ae6cc00';
import {appearanceForModel,variantOrderInterpretation} from './variant-interpretations.mjs?v=7c8896384ae6cc00';
import {normalizeKnownModel,normalizeBCModel,modelRule,splitVariant,ruleSources} from './decoder-rules.mjs?v=7c8896384ae6cc00';
import {exactReferences} from './model-references.mjs?v=7c8896384ae6cc00';
import {entries} from './prefix-data.mjs?v=7c8896384ae6cc00';
export {entries};
export const referenceUrl='https://github.com/SEPULKRUM/watch-code-decoder/blob/main/prefixes/index.html';
const compact=s=>String(s).toUpperCase().replace(/[^A-Z0-9]/g,'');
export function decodeModel(input,data=null,references=null){
 const cleaned=String(input||'').trim().toUpperCase().replace(/[−–—]/g,'-').replace(/\s+/g,'');
 if(!cleaned)return {recognized:false,empty:true,segments:[]};
 if(!/^[A-Z0-9-]+$/.test(cleaned))return {recognized:false,reason:'Enter a Casio model or prefix using letters, numbers and hyphens.',segments:[]};
 const key=compact(cleaned),exact=data?(Object.values(data.models).find(m=>compact(m.id)===key)||Object.values(data.models).find(m=>(m.specs?.supplied_aliases?.value||[]).some(alias=>compact(alias)===key))):null;
 const matches=exactReferences(references,cleaned);
 if(exact?.specs?.reference_scope?.value==='2011_clock_index'){
  const prefix=exact.id.match(/^[A-Z]+/)?.[0]||'';
  return {recognized:true,prefix,family:'2011 CLOCK INDEX',normalized:exact.id,segments:[{type:'prefix',token:prefix,communityMeaning:null,title:'Clock index identifier',description:'Clock reference printed in the supplied 2011 index. Watch-prefix meanings and technical functions are not inferred.',status:'secondary_reported'},{type:'series',token:exact.id.slice(prefix.length).replace(/^-/,''),title:'Indexed clock designation',description:'Identifier as listed; no dimensions, mass, module or functions established by this extraction.',status:'secondary_reported'}],exact,references:matches,historicalReference:true};
 }
 if(exact?.specs?.catalog_year){
  const historicalPrefix=exact.id.match(/^[A-Z]+/)?.[0]||'',segments=[];
  if(historicalPrefix)segments.push({type:'prefix',token:historicalPrefix,title:'Historical model family',communityMeaning:null,description:`Historical Casio identifier in the supplied ${exact.specs.catalog_year.value} catalog extraction. Modern same-prefix letter interpretations are not applied.`,status:'secondary_reported',source:'https://github.com/SEPULKRUM/casio-watch-specs/blob/main/research/historical-catalog-1980-1989.json'});
  segments.push({type:'series',token:historicalPrefix?exact.id.slice(historicalPrefix.length).replace(/^-/,''):exact.id,title:'Historical model identifier',description:'Model designation as transcribed in the supplied extraction. No letter, colour, production-date or module meaning is inferred from its digits.',status:'secondary_reported'});
  return {recognized:true,prefix:historicalPrefix,family:'HISTORICAL CASIO',normalized:exact.id,segments,exact,references:matches,historicalReference:true};
 }

 if(/^\d{2,3}[A-Z]/.test(cleaned)&&matches.length)return {recognized:true,prefix:'',family:'HISTORICAL MODEL REFERENCE',normalized:cleaned,segments:[{type:'series',token:cleaned,title:'Historical numeric model identifier',description:'This source reference uses a numeric-leading designation. No alphabetical prefix or module assignment is inferred.',status:'Research reference · not a verified specification record'}],exact,references:matches,historicalReference:true};
 const suppliedPattern=ownerPattern(key);
 let family=[...entries].sort((a,b)=>b[1].length-a[1].length).find(e=>key===e[1]||(key.startsWith(e[1])&&/\d/.test(key.slice(e[1].length))));
 if(suppliedPattern){const suppliedFamily=suppliedPattern.code.split('-')[0];family=entries.find(e=>e[1]===suppliedFamily)||family;}
 if(!family)return {recognized:false,reason:'This prefix is not yet covered by the reference. The model may still be valid.',segments:[],exact};
 const historicalMatches=[...matches,...(references?Object.values(references.models).filter(m=>cleaned.startsWith(m.id+'-')):[])];
 const historicalReference=historicalMatches.some(m=>m.observations.some(o=>o.historical_context||['checked_compilation_index','supplied_transcription'].includes(o.role)));
 const historicalCollision=historicalReference&&(historicalMatches.some(m=>m.observations.some(o=>o.historical_context))||['GM','GMW','GD','GG','GR','BA'].includes(family[1]));
 if(historicalCollision)family=['HISTORICAL CASIO',family[1],'Historical use of this identifier appears in the compilation index. Features of the modern same-prefix family are not inferred.',family[3],{status:'secondary_reported',source:'https://github.com/SEPULKRUM/casio-watch-specs/blob/main/data/model-references.json'}];
 let normalized=normalizeBCModel(family[1],key,normalizeKnownModel(key,exact?.id||cleaned));
 if(/^PRWS3100(?:1JF)?$/.test(key))normalized=key==='PRWS3100'?'PRW-S3100':'PRW-S3100-1JF';
 if(/^GWGB1000(?:1A)?$/.test(key))normalized=key==='GWGB1000'?'GWG-B1000':'GWG-B1000-1A';
 if(/^GWM5610U?$/.test(key))normalized=key.endsWith('U')?'GW-M5610U':'GW-M5610';
 if(['LCW','LIW','LIN','MTP','LTP','CMK','MDV','MTD','MRW','WV','WVA','WVQ'].includes(family[1])&&!cleaned.includes('-')){const m=key.slice(family[1].length).match(/^([A-Z]*\d+[A-Z]*)([1-9][A-Z][A-Z0-9]*)?$/);if(m)normalized=family[1]+'-'+m[1]+(m[2]?'-'+m[2]:'');}
 if(suppliedPattern?.code.includes('-')&&!cleaned.includes('-')&&normalized===cleaned){const [base,mod]=suppliedPattern.code.split('-');normalized=base+'-'+mod+key.slice(base.length+mod.length);}
 normalized=normalizeAnniversary(key,normalized);
 const prefix=family[1],body=normalized.slice(0,prefix.length).replace(/-/g,'')===prefix?normalized.slice(prefix.length).replace(/^-/,''):key.slice(prefix.length);
 const communityPrefixMeaning=historicalReference?null:prefixMeaning(prefix);
 const segments=[{type:'prefix',token:prefix,communityMeaning:communityPrefixMeaning,title:'Model family',description:family[2],source:family[4]?.source||referenceUrl,status:family[4]?.status||'Established family reference'}];
 if(prefix==='DW'){segments[0].description='DW is commonly read by the watch community as Digital Water Resistant. It is used on G-SHOCK and non-G-SHOCK Casio watches. Check the exact model’s water-resistance rating; the prefix alone does not establish 200 m / 20 bar.';segments[0].status='community_interpretation';segments[0].source=ruleSources.dw291;}
 if(prefix==='GWN')Object.assign(segments[0],{description:'GULFMASTER — the marine-oriented G-SHOCK family. Casio describes GWN-1000 with Triple Sensor Version 3 and Smart Access. GWN remains a complete family code here: neither supplied guide defines its individual letters, and no official letter-by-letter expansion is established by the cited page.',status:'official_observed',source:'https://gshock.casio.com/europe/products/gulfmaster/gwn-1000/'});
 if(!historicalReference&&suppliedPattern?.code.includes('-')&&key===suppliedPattern.code.replace('-','')){const mod=suppliedPattern.code.split('-')[1];segments.push({type:'modifier',token:mod,title:'Feature / series modifier',description:suppliedPattern.meaning+'. '+suppliedPattern.context+' Owner-supplied community reading; exact-model evidence takes priority.',status:'community_interpretation',source:'https://github.com/SEPULKRUM/casio-watch-specs/blob/main/docs/owner-prefix-readings.md'});return {recognized:true,prefix,family:family[0],normalized:suppliedPattern.code,segments,exact,references:matches,historicalReference,prefixOnly:true};}
 if(key===prefix)return applyGuide({recognized:true,prefix,family:family[0],normalized,segments,exact,references:matches,historicalReference,prefixOnly:true},{modifier:'',number:'',seriesTail:'',tail:''});
 // Known lines are normalized above; other compact inputs do not receive invented variant boundaries.
 const split=body.split('-'),main=split.shift()||'',tail=split.join('-');
 const match=main.match(/^([A-Z]*)(\d+)([A-Z0-9]*)$/);
 if(!match){segments.push({type:'unknown',token:body,title:'Unresolved model portion',description:'This portion needs a documented model-specific interpretation.',status:'Unresolved'});return {recognized:true,prefix,family:family[0],normalized,segments,exact,references:matches,historicalReference}}
 const [,modifier,number,seriesTail]=match;
 const rule=historicalReference?null:modelRule(prefix,modifier,number);
 if(rule){if(rule.family)family=[rule.family,...family.slice(1)];segments[0].description=rule.prefixDescription;segments[0].source=rule.source;segments[0].status='Community reading · Casio features confirmed separately';}
 const scopedBlack=Boolean(rule?.braceletSuffix&&/^GWB5600BC1B(?:ER)?$/.test(key));
 const prwSpecific=prefix==='PRW'&&modifier==='S'&&number==='3100';
 const bcSuffix=seriesTail.endsWith('BC');
 const tailBeforeBC=bcSuffix?seriesTail.slice(0,-2):seriesTail;
 const updated5610=prefix==='GW'&&modifier==='M'&&number==='5610'&&tailBeforeBC==='U';
 const splitBC=bcSuffix&&!rule?.splitSuffix;
 const gwgSpecific=prefix==='GWG'&&modifier==='B'&&number==='1000';
 if(modifier)segments.push({type:'modifier',token:modifier,title:rule?.modifierDescription?'Feature / series modifier':'Series designation',description:rule?.modifierDescription?rule.modifierDescription:prwSpecific?'Real Material Series designation for this PRW-S3100 model, featuring enhanced materials.':gwgSpecific?'B1000 connected model-line designation. Casio confirms Bluetooth smartphone linking for GWG-B1000; this is not a universal meaning of B.':'Model-line modifier. Its feature meaning has not been established for this exact model.',status:rule?.modifierDescription?'community_interpretation':prwSpecific?'Your established model-specific reference':gwgSpecific?'Model-specific official evidence':'Unresolved modifier meaning',source:rule?.modifierDescription?rule.source:gwgSpecific?'https://www.casio.com/us/watches/gshock/product.GWG-B1000-1A/':null});
 segments.push({type:'series',token:updated5610||rule?.splitSuffix?number:splitBC?number+tailBeforeBC:number+seriesTail,title:'Model series',description:prwSpecific?'3100 series with STN LCD, as described in your supplied model-specific reference.':`${updated5610||rule?.splitSuffix?number:splitBC?number+tailBeforeBC:number+seriesTail} series / model designation. This is not a production date or a module number.`,status:prwSpecific?'Your established model-specific reference':'Model identifier'});
 if(rule?.splitSuffix&&seriesTail)segments.push({type:'series-suffix',token:seriesTail,title:'Series suffix / configuration',description:seriesTail==='BC'&&rule.braceletSuffix?rule.braceletSuffix:'Additional series configuration marker. Its exact material or feature meaning has not been established here.',status:seriesTail==='BC'&&rule.braceletSuffix?'community_interpretation':'unverified',source:seriesTail==='BC'&&rule.braceletSuffix?rule.source:null});
 if(splitBC&&!updated5610)segments.push({type:'series-suffix',token:'BC',title:'Series suffix / configuration',description:'BC is a separate configuration suffix. Bracelet / composite-band is a community reading used in some Casio lines; this exact model’s band configuration is unverified here.',status:'community_interpretation'});
 if(updated5610)segments.push({type:'modifier',token:'U',title:'Updated model',description:'U stands for Updated in the GW-M5610U line: module 3495 replaces module 3159 used in the older GW-M5610-1. This meaning is scoped to this model line.',status:'Owner-supplied model-specific reference'});
 const appearanceObservation=historicalReference?null:appearanceForModel(normalized);
 if(splitBC&&updated5610)segments.push({type:'series-suffix',token:'BC',title:'Series suffix / configuration',description:'BC is a separate configuration suffix. Bracelet / composite-band is a community reading used in some Casio lines; check the exact model’s band evidence.',status:'community_interpretation'});
 if(tail){const {variant,order,market}=splitVariant(tail);
  const orderRule=variantOrderInterpretation(variant,order,appearanceObservation);
  if(variant)segments.push({type:'variant',token:variant,title:'Colour / variant code',description:scopedBlack&&variant==='1'?'Black manufacturer colour category for GW-B5600BC-1B / European SKU GW-B5600BC-1BER.':prwSpecific&&variant==='1'?'Black colour variant for this PRW-S3100 model.':exact?.specs?.color?`Exact catalog model colour: ${exact.specs.color.value}. Variant meanings are model-specific.`:'Colour / configuration designation. Its exact colour is not inferred from the number alone.',status:scopedBlack&&variant==='1'?'official_observed':prwSpecific&&variant==='1'?'Your established model-specific reference':exact?.specs?.color?'Exact model catalog evidence':'Variant meaning unresolved',source:scopedBlack?rule.source:null});
  if(order)segments.push({type:'order',token:order,title:orderRule?.title||'Additional variant / order marker',description:orderRule?.description||'Additional variation within this colour/configuration code. Its precise display, finish or packaging meaning is unverified; B in this position is not automatically Bluetooth.',status:orderRule?.status||'unverified',source:orderRule?.source||null});
  if(market)segments.push({type:'market',token:market,title:'Market suffix',description:market==='ER'?'European-market suffix reference. This does not state the manufacturing country.':'Japanese-market model suffix. This does not state the manufacturing country.',status:'Market reference · secondary interpretation'});
 }
 const officialFeatures=rule?{...rule.officialFeatures,source:rule.source}:null;
 const scopedColor=scopedBlack?{digit:'1',label:'Black',source:rule.source,status:'official_observed',scope:'Casio colour metadata for GW-B5600BC-1B / European SKU GW-B5600BC-1BER'}:null;
 return applyGuide({recognized:true,prefix,family:family[0],normalized,segments,exact,references:matches,historicalReference,officialFeatures,scopedColor,appearanceObservation},{modifier,number,seriesTail,tail});
}

import {ownerPrefixMeaning} from './owner-prefix-readings.mjs?v=gbx-sfj-20261126';
// Whole-prefix community readings. The guide is secondary evidence, not a Casio acronym key.
const guide='https://github.com/SEPULKRUM/casio-watch-specs/blob/main/research/reference-supplements/guide-v3-2026-11-15.json';
const meanings={
 WV:['Digital Wave Ceptor',2],
 WVA:['Analog-digital Wave Ceptor',2],
 WVQ:['Analog chronograph Wave Ceptor',2],
 LCW:['Lineage Combo Wave Ceptor — analog-digital Lineage family',2],
 LIW:['Lineage analog Wave Ceptor family',2],
 LIN:['Earlier Lineage family',2],
 BG:['Original / classic digital BABY-G family',2],
 BGA:['Analog-digital BABY-G family',2],
 BGD:['Digital BABY-G family',2],
 BGS:['BABY-G fitness / step-tracker family association',2],
 BLX:['BABY-G G-LIDE / surf-and-sport family',2],
 MSG:['G-MS — upscale BABY-G family',2],
 F:['Basic resin classic-digital family',3],
 A:['Vintage / metal-tone digital family',3],
 W:['Standard sport-digital family',3],
 LA:['Compact / ladies’ vintage-digital family',3],
 CA:['Calculator-watch family',3],
 DB:['Data Bank / Telememo family',3],
 DBC:['Data Bank calculator-watch family',3],
 MQ:['Minimalist standard analog family, traditionally men’s models',3],
 LQ:['Compact standard analog family, traditionally ladies’ models',3],
 AE:['Digital multi-function / world-time family',3],
 AEQ:['Analog-digital world-time / Telememo family association',3],
 MDV:['Marine Diver / Duro marine-style family association',3],
 MTD:['Related marine-style Casio family association',3],
 MRW:['Related marine-style Casio family association',3],
 MTP:['Men’s Timepiece — standard analog family',4],
 LTP:['Ladies’ Timepiece — standard analog family',4],
 CMK:['Casio Mechanical / Casio Automatic family association',4]
};
const communityExamples={
 GPW:'G-Shock GPS Wave Ceptor — G-SHOCK GPS / positioning (Pilot alternative) and Wave Ceptor GRAVITYMASTER family association',
 GMW:'G-Shock Metal Wave Ceptor — Metal-construction G-SHOCK / Wave Ceptor association in the GMW-B5000 line',
 GW:'G-Shock Wave Ceptor — Tough Solar / radio atomic-timekeeping association; exact-model features vary',
 DW:'Digital Water Resistant — used across G-SHOCK and non-G-SHOCK models'
};
export function prefixMeaning(prefix){
 if(communityExamples[prefix])return {meaning:communityExamples[prefix],status:'community_interpretation',source:'https://github.com/SEPULKRUM/casio-watch-specs/blob/main/docs/decoder-rules.md',locator:'Scoped community interpretations and examples',note:'Community reading, not an official universal acronym key. Check exact-model features and water resistance.'};
 const supplied=ownerPrefixMeaning(prefix);if(supplied)return supplied;
 const item=meanings[prefix];
 return item?{meaning:item[0],status:'community_interpretation',source:guide,locator:`Supplied multi-line reference guide v3 · PDF page ${item[1]}`,note:'Community / supplied-guide reading. It is not an official universal acronym expansion; exact features and materials vary by model.'}:null;
}

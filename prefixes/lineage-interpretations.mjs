// Scoped owner/community readings. These are not a universal Casio acronym key.
const ownerSource='https://github.com/SEPULKRUM/casio-watch-specs/blob/main/research/lineage-suffix-interpretations-2026-11-17.json';
const manual4709='https://support.casio.jp/storage/pdf/002/qw4709.pdf';
const m100='https://www.casio.com/europe/watches/casio/product.LCW-M100DSE-2A/';
const m170='https://www.casio.com/europe/watches/casio/product.LCW-M170TD-1A/';
export const lineageConfigurations=[
 {suffix:'DJ',scope:'LCW-M200DJ',interpretation:'D: stainless-steel case/bracelet association; J: owner/community Japanese-market configuration reading. Mineral glass and the mid-2000s era come from model research, not an encoded date or a universal DJ glass rule.'},
 {suffix:'DE',scope:'LCW-M100DE',interpretation:'D: stainless-steel case/bracelet association; E: proposed owner/community export-market association, not a guarantee of the sales market. Mineral glass is reported in the supplied comparison and remains subject to exact-model confirmation.'},
 {suffix:'DSE',scope:'LCW-M100DSE',interpretation:'D: stainless-steel case/bracelet; S: sapphire association; E: proposed export-market association; the official letter expansion is unconfirmed. Casio confirms steel and anti-reflective sapphire for LCW-M100DSE-2A, without defining a universal letter key.'},
 {suffix:'TD',scope:'LCW-M170TD',interpretation:'T: titanium case/bracelet association. D is part of this configuration and is not read as a steel case. Casio lists sapphire with anti-reflective coating for LCW-M170TD-1A; TD alone is not a universal sapphire code.'}
];
export function applyLineageInterpretation(result,{modifier,number,seriesTail,tail}){
 if(result.historicalReference||result.prefix!=='LCW'||modifier!=='M')return result;
 const old200=number==='200'&&seriesTail==='DJ';
 const steel100=number==='100'&&['DE','DSE'].includes(seriesTail);
 const titanium170=number==='170'&&seriesTail==='TD';
 if(!old200&&!steel100&&!titanium170)return result;
 const set=(type,token,description,source=ownerSource,title=null,status='community_interpretation')=>{const s=result.segments.find(s=>s.type===type&&(token===null||s.token===token));if(s)Object.assign(s,{description,source,status,...(title?{title}:{})});};
 set('modifier','M',old200?'M is read as Multi-Band in this LCW-M200DJ line. Existing exact-model research associates module 4709 with Multi-Band 5, not Multi-Band 6. The M letter alone does not establish the transmitter count across all Lineage models.':'M is read as Multi-Band radio synchronization in this scoped Lineage comparison. The band count depends on the exact model: Casio explicitly describes LCW-M170TD-1A as Multi-Band 6; M alone does not guarantee five or six transmitters.',old200?manual4709:ownerSource,'Multi-Band reception');
 const series=result.segments.find(s=>s.type==='series');if(series)Object.assign(series,{token:number,description:`${number} identifies this Lineage series / design designation. It is not the module number, production date or a guarantee of interchangeable cases.`});
 // Replace generic suffix guesses only inside the documented Lineage configurations.
 result.segments=result.segments.filter(s=>s.type!=='series-suffix');
 const segment=(token,title,description,source=ownerSource,status='community_interpretation')=>({type:'series-suffix',token,title,description,source,status,scopedInterpretation:true});
 let suffixes;
 if(old200)suffixes=[segment('D','Steel configuration','D is associated here with the LCW-M200DJ stainless-steel case and bracelet. This reading does not mean every D in Lineage denotes a steel case.'),segment('J','Domestic configuration reading','J within DJ is an owner/community reading for the older Japanese-market configuration. It does not establish manufacturing country, glass type or a production year. Mineral glass is recorded separately in the LCW-M200DJ-2AJF research.')];
 else if(steel100)suffixes=[segment('D','Steel configuration','D is read as the stainless-steel case/bracelet configuration in this LCW-M100DE / DSE comparison; exact model specifications govern.',seriesTail==='DSE'?m100:ownerSource),...(seriesTail==='DSE'?[segment('S','Sapphire association','S is read as sapphire in this DSE configuration. Casio lists anti-reflective sapphire for LCW-M100DSE-2A; this does not make every S a sapphire code.',m100)]:[]),segment('E','Export configuration reading','E is proposed by the owner as an export-market configuration association in this LCW-M100DE / DSE comparison. Its official expansion is unconfirmed: E alone does not prove the sales market, manufacturing country or glass. Read the final JF / ER suffix separately for the retail market.')];
 else suffixes=[segment('T','Titanium configuration','T is associated here with titanium case and bracelet. Casio confirms titanium construction and anti-reflective sapphire for LCW-M170TD-1A; these are exact-model features, not a universal TD glass rule.',m170),segment('D','TD configuration marker','D is retained as part of the TD configuration; its separate expansion is not established here. Do not apply the steel-case reading from DJ / DE / DSE to this titanium model.',m170,'unverified')];
 const after=result.segments.findIndex(s=>s.type==='series')+1;result.segments.splice(after,0,...suffixes);
 if(old200&&/^2A(?:JF)?$/.test(tail)){
  set('variant','2','2 identifies the blue / dark-blue dial in this LCW-M200DJ-2A reference. It does not define every accent, hand color or case finish.');
  set('order','A','A is a variation / order marker within 2A, not a universal silver-tone accent or hand-color code. Existing LCW-M200DJ-2AJF research reports gold-tone accents; confirm the exact watch.');
 }
 set('market','JF','JF identifies the Japanese domestic retail market. The suffix alone does not certify manufacturing country, packaging contents or manual language.');
 return result;
}

// Scoped collaboration interpretation. No physical specifications are inherited.
export function decodeAwgM520ua(key,exact=null,references=[]){
 if(!/^AWGM520UA(?:1EJR)?$/.test(key))return null;
 const primary='https://store.united-arrows.co.jp/brand/by/data/special/2021gshock_awgm520ua/';
 const casio='https://www.casio.com/jp/watches/gshock/product.AWG-M520-1A/';
 const article='https://www.g-central.com/united-arrows-beauty-youth-x-g-shock-awg-m520ua-is-another-tribute-to-the-first-ua-collab/';
 const full=key.endsWith('1EJR');
 const segments=[
  {type:'prefix',token:'AWG',title:'Model family',description:'Analog-digital G-SHOCK family associated with solar power and radio-controlled timekeeping. Analog Water-resistant G-SHOCK is a watch-community expansion, not a universal Casio acronym definition.',status:'community_interpretation',source:casio},
  {type:'modifier',token:'M',title:'Function / series modifier',description:'Multi-Band 6 is the model-line community reading of M here. Casio confirms Multi-Band 6 for the AWG-M520 base line; G-Central reports it for this collaboration. This does not define M across all Casio families or establish every older AWG model as five-band.',status:'community_interpretation',source:casio},
  {type:'series',token:'520',title:'Model series',description:'AWG-M520 is the solar/radio revival of the AW-500 design, first introduced as a G-SHOCK analog-digital model in 1989. 520 is a series designation, not a module number or production date.',status:'official_observed',source:casio},
  {type:'series-suffix',token:'UA',title:'United Arrows collaboration',description:'UA stays together as UNITED ARROWS. The BEAUTY & YOUTH collaboration revives the colors of the original 1996 AW-500UA. U is not interpreted as Updated in this model.',status:'Collaboration brand source',source:primary}
 ];
 if(full)segments.push(
  {type:'variant',token:'1',title:'Primary color code',description:'Black is the general Casio color category for 1. The exact full -1EJR reference is owner-supplied; this does not independently verify every color or material detail of that identifier.',status:'community_interpretation',source:'https://casiosupport.zendesk.com/hc/en-us/articles/360000656711-Timepiece-Model-Number-Explanation'},
  {type:'order',token:'E',title:'Variant / order letter',description:'Additional configuration letter. The proposed fifth release wave meaning has not been established by the checked sources and is not presented as fact.',status:'unverified'},
  {type:'market',token:'JR',title:'Japanese-market suffix',description:'JR is retained as one Japanese-market suffix interpretation. R = Release or limited packaging is unverified. United Arrows confirms a special box, which does not establish the meaning of R.',status:'community_interpretation',source:primary}
 );
 return {recognized:true,prefix:'AWG',family:'G-SHOCK',normalized:full?'AWG-M520UA-1EJR':'AWG-M520UA',segments,exact,references,historicalReference:false,editionNotes:[
  {title:'United Arrows collaboration',description:'United Arrows confirms the 1996 AW-500UA tribute, radio/solar features, engraved case back and special box. The checked primary page uses AWG-M520UA; the complete -1EJR suffix remains an owner-supplied reference.',status:'Collaboration brand source',source:primary},
  {title:'G-Central collaboration report',description:'The October 29, 2021 report identifies BEAUTY & YOUTH, Tough Solar and Multi-Band 6, and reports a November 19 release in Japan. This is a secondary report, not an official letter-by-letter naming key.',status:'secondary_reported',source:article},
  {title:'My video: AWG-M520UA | The Modern Revival of the 1996 UNITED ARROWS G-Shock',description:'SEPULKRUM owner-supplied video. Linked as provided; its contents have not been independently transcribed or used to verify the unresolved E and R interpretations.',status:'Owner-supplied video',source:'https://www.youtube.com/watch?v=qJTOpZHMlnw',linkLabel:'Watch my video ↗'}
 ]};
}

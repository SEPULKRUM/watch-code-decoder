export const decoderDisclosure='Casio does not publish a complete, universal letter-by-letter decoding key in the sources reviewed here. Some suggested meanings follow watch-community naming patterns. We label community interpretations separately from features confirmed by Casio; meanings can vary by model, family and era.';
export const decoderRules=[
 "Supplied-guide structure: [Prefix]-[Series / Base Model][Material / Feature Modifier]-[Colour][Variation / Order][Market]. Actual naming conventions vary by family and era.",
 "Guide material / edition readings before the final hyphen: D steel bracelet; T titanium; L leather; B cloth / nylon or MDV bezel variant; C cloth / nylon or coloured ion plating; G gold-tone / two-tone; V Velcro / fabric; E expansion band or Lineage sapphire / slim trim; AR Arabic edition. These are contextual readings, not universal definitions.",
 "Guide colour digits: 1 black; 2 blue; 3 green; 4 red / pink; 5 brown / beige; 6 purple; 7 white / silver; 8 gray / silver; 9 gold / yellow. Following letters and digits distinguish variants; exact colours take precedence.",
 "Guide market suffixes: JF / J Japan; CR Americas; ER Europe; V / VER / DR / DF international / export. Trailing V differs from a pre-hyphen V fabric-strap modifier.",
 'Keep the longest family prefix together, such as AE, LCW or GPW. Show its whole-prefix community reading in the model-family row; do not split it into individual letter cards.',
 'An official feature is evidence about the watch, not proof of what a letter stands for. Community readings remain labelled even when the related feature is confirmed.',
 'Keep the family, feature modifier, series number, series suffix, colour digit, additional variant/order marker and market suffix separate. A series number is not a module number or production date.',
 'Use exact-model evidence before colour heuristics. Additional letters can distinguish configurations; their precise meaning may remain unknown.',
 'DW is used across G-SHOCK and non-G-SHOCK watches. Digital Water Resistant is shown as a community interpretation; water resistance must be checked for the exact model.',
 'Wave Ceptor is Casio radio-controlled timekeeping terminology. Multi-Band 6 is a specific radio-reception system; the names are not a universal letter key.',
 'B, BC, M and U are model-dependent. Do not apply Bluetooth, bracelet, metal or solar meanings universally. The established GW-M5610U Updated interpretation is preserved.',
 'In some digital lines, -1B marks a Blackout / Black Accent variation, often with a negative LCD. Treat this as a recurring community pattern; checked model examples and exceptions take priority.',
 'A market suffix describes a sales-market reference, not the manufacturing country. Unknown suffix meanings stay unverified.'
];
export const ruleSources={
 gpw1000:'https://support.casio.com/wat/hybrid/',
 gpw2000:'https://gshock.casio.com/europe/products/gravitymaster/gpw-2000/',
 gmw5000:'https://www.casio.com/intl/watches/gshock/product.GMW-B5000D-1/',
 gw5600bc:'https://www.casio.com/europe/watches/casio/product.GW-B5600BC-1B/',
 dw291:'https://www.casio.com/intl/watches/casio/product.DW-291H-1AV/'
};
export function normalizeKnownModel(key,fallback){
 const square=key.match(/^GWM(5600|5610)(U)?(BC)?([1-9][A-Z0-9]*)?$/);
 if(square)return `GW-M${square[1]}${square[2]||''}${square[3]||''}${square[4]?'-'+square[4]:''}`;
 for(const [pattern,prefix,series] of [
  [/^GWB5600(BC)?(?:([1-9])([A-Z0-9]*))?$/,'GW','B5600'],
  [/^GMWB5000([A-Z]*)(?:([1-9])([A-Z0-9]*))?$/,'GMW','B5000'],
  [/^GPW1000([A-Z]*)(?:([1-9])([A-Z0-9]*))?$/,'GPW','1000'],
  [/^GPW2000([A-Z]*)(?:([1-9])([A-Z0-9]*))?$/,'GPW','2000']
 ]){const match=key.match(pattern);if(match)return `${prefix}-${series}${match[1]||''}${match[2]?'-'+match[2]+(match[3]||''):''}`}
 return fallback;
}
export function modelRule(prefix,modifier,number){
 if(prefix==='GPW'&&!modifier&&['1000','2000'].includes(number))return {
  family:'G-SHOCK / GRAVITYMASTER',splitSuffix:true,
  prefixDescription:'GRAVITYMASTER model line with GPS and terrestrial radio time reception. The G / P / W breakdown is a watch-community interpretation, not an official acronym expansion.',
  source:number==='1000'?ruleSources.gpw1000:ruleSources.gpw2000,
  officialFeatures:{status:'official_observed',description:number==='1000'?'Casio identifies GPW-1000 with its GPS Hybrid Wave Ceptor technology.':'Casio identifies GPW-2000 with GPS, radio-controlled timekeeping, solar power and Bluetooth. Bluetooth is present even though this model prefix contains no B.',technologyName:'GPS Hybrid Wave Ceptor'}
 };
 if(prefix==='GMW'&&modifier==='B'&&number==='5000')return {
  splitSuffix:true,source:ruleSources.gmw5000,
  prefixDescription:'GMW-B5000 metal-construction G-SHOCK line with radio reception and solar power. M = metal and W = Wave Ceptor are scoped community associations, not an official universal letter key.',
  modifierDescription:'B is associated with Bluetooth smartphone linking in this GMW-B5000 line. Casio confirms the feature; the letter expansion remains a community interpretation.',
  officialFeatures:{status:'official_observed',description:'Casio confirms metal construction, Bluetooth smartphone linking, Multi-Band 6 and Tough Solar for the cited GMW-B5000D-1. Band material remains variant-specific.'}
 };
 if(prefix==='GW'&&modifier==='B'&&number==='5600')return {
  splitSuffix:true,source:ruleSources.gw5600bc,
  prefixDescription:'GW-B5600 G-SHOCK line with Tough Solar, radio-controlled timekeeping and Bluetooth. GW is commonly read as G-SHOCK / Wave Ceptor; that is a community interpretation.',
  modifierDescription:'B is associated with Bluetooth smartphone linking in this GW-B5600 line. Casio confirms the feature; this does not define every B in a Casio model number.',
  officialFeatures:{status:'official_observed',description:'For GW-B5600BC-1B (European SKU GW-B5600BC-1BER), Casio confirms Bluetooth, Multi-Band 6, Tough Solar and a stainless-steel/resin composite band.'},
  braceletSuffix:'BC is read as the bracelet / composite-band variant in this line. Casio confirms the cited BC model’s composite band; BC is not established here as a universal bracelet acronym.'
 };
 return null;
}
export function splitVariant(tail){
 let market='',rest=tail;
 for(const suffix of ['VER','ER','JF','JR','CR','DR','DF','J','V'])if(rest.endsWith(suffix)&&rest.length>suffix.length){market=suffix;rest=rest.slice(0,-suffix.length);break}
 const match=rest.match(/^([1-9])([A-Z][A-Z0-9]*)$/);
 return {variant:match?match[1]:rest,order:match?match[2]:'',market};
}
export function evidenceName(status){return ({official_explicit:'Explicit Casio definition',official_observed:'Casio source observation',community_interpretation:'Watch-community interpretation',secondary_reported:'Secondary / supplied reference',unverified:'Meaning unverified'})[status]||status}

export function normalizeBCModel(prefix,key,fallback){
 const match=key.slice(prefix.length).match(/^([A-Z]*)(\d+)([A-Z]*BC)([1-9][A-Z0-9]*)?$/);
 return match?`${prefix}-${match[1]}${match[2]}${match[3]}${match[4]?'-'+match[4]:''}`:fallback;
}

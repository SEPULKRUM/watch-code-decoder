// Owner-supplied, family-scoped readings; not a universal Casio acronym key.
const source='https://github.com/SEPULKRUM/casio-watch-specs/blob/main/research/supplied-mudmaster-frogman-2026-11-17.json';
export function applyMudFrogInterpretations(result,{modifier,number,seriesTail}){
 if(result.historicalReference)return result;
 const mud=result.prefix==='GWG'&&number==='1000'&&['','B'].includes(modifier);
 const frog=result.prefix==='GWF'&&['','D','T'].includes(modifier)&&['1000','1030','1035'].includes(number);
 if(!mud&&!frog)return result;
 // Preserve the existing, more specific D10 + 35 anniversary interpretation.
 if(result.segments.some(s=>s.type==='anniversary'))return result;
 const meanings=mud?(modifier==='B'?{EC:'Emergency Colors collection',TLC:'Team Land Cruiser / Toyota Auto Body collaboration',MG:'Magma Gold edition'}:{GB:'Gold-accent configuration in this GWG-1000 line; not a universal G/B definition',RD:'Rescue Red',DC:'Desert Camouflage',MH:'Maharishi British Bonsai Forest collaboration',WLP:'Wildlife Promising'}):modifier==='D'?{B:'Blue sensor/screw accents in GWF-D1000B; B is not a universal blue or rose-gold code',BC:'Tan Accents configuration with metal/resin composite bracelet; exact letter expansion unpublished',K:'ICERC / Love the Sea and the Earth',NV:'Master in Navy Blue',MB:'Master in Marine Blue',JCG:'Japan Coast Guard',ARR:'Antarctic Research ROV'}:{B:'Rose-gold details in GWF-1000B; B is not a universal blue code',G:'Gold-accent configuration',MM:'Mastermind collaboration',TM:'Takashi Murakami collaboration',RD:'Men in Burning Red',BP:'Men in Dark Purple',BS:'Black Stealth',NV:'Men in Navy',SR:'Men in Sunrise Purple',A:'30th Anniversary Rising Red titanium',E:'30th Anniversary Lightning Yellow titanium',F:'35th Anniversary Magma Ocean'};
 if(seriesTail&&!meanings[seriesTail])return result;
 const scoped=(s,description,title=s.title)=>Object.assign(s,{description,title,source,status:'community_interpretation'});
 const series=result.segments.find(s=>s.type==='series');if(series){series.token=number;series.description=`${number} identifies this ${mud?'MUDMASTER':'FROGMAN'} ${number==='1030'?'30th-anniversary':number==='1035'?'35th-anniversary':'model series'} designation. It is not a module number or production date.`;}
 if(modifier==='T'&&frog){const t=result.segments.find(s=>s.type==='modifier'&&s.token==='T');if(t)scoped(t,'T is associated with titanium construction in the listed GWF-T editions. Their individual weights must not be inherited from steel models.','Titanium configuration');}
 if(seriesTail){result.segments=result.segments.filter(s=>s.type!=='series-suffix');result.segments.splice(result.segments.findIndex(s=>s.type==='series')+1,0,{type:'series-suffix',token:seriesTail,title:'Series-specific edition / configuration',description:meanings[seriesTail]+'. Supplied research; pending archive verification. Do not generalize this suffix to other families.',source,status:'community_interpretation'});}
 const compact=String(result.normalized||'').replace(/[^A-Z0-9]/gi,'').toUpperCase();
 if(compact==='GWG1000GB1APRJ'){
  result.segments=result.segments.filter(s=>!['order','market'].includes(s.type));result.segments.push({type:'order',token:'A',title:'Variation marker',description:'A is retained within the 1A color/configuration code.',source,status:'community_interpretation'},{type:'series-suffix',token:'PRJ',title:'Collaboration reference suffix',description:'PRJ is associated with the 2022 Jurassic World China reference. Its exact letter expansion is unverified; the final J is not interpreted separately as a Japanese-market suffix.',source,status:'community_interpretation'});
 }
 if(compact==='GWFD10001ZBDR'){const z=result.segments.find(s=>s.type==='order');if(z)scoped(z,'ZB is associated with artist Zong Baik / Baek Jong-Yeol in this exact collaboration. The 30-unit quantity is independently reported, not factory-confirmed.','Zong Baik collaboration');const market=result.segments.find(s=>s.type==='market');if(market)scoped(market,'DR is associated with international/Asian export references; exact territory mapping is not officially resolved.','Regional reference');}
 if(compact==='GWFD1000B1LTD'){result.segments=result.segments.filter(s=>!['order','market'].includes(s.type));result.segments.push({type:'order',token:'LTD',title:'Collector package',description:'Limited collector set based on GWF-D1000B. Reported 350 numbered sets; not a new module or individual hardware model.',source,status:'community_interpretation'});}
 return result;
}

// Playlist placement only: these rules never validate a model or supply specs.
const compact=s=>String(s||'').toUpperCase().replace(/[^A-Z0-9]/g,'');
const patterns=new Map();
function line(code,base){
 if(!patterns.has(base))patterns.set(base,new RegExp('^(?:'+base+')(.*)$'));
 const m=code.match(patterns.get(base));
 return Boolean(m&&(!m[1]||/^[A-Z]/.test(m[1])||/^[1-9](?:[A-Z]|$)/.test(m[1])));
}
function prefix(code,base){return new RegExp('^(?:'+base+')(?:[A-Z]*[0-9]|$)').test(code)}
function named(family,name){return [name,'GSHOCK'+name,'CASIOGSHOCK'+name,'MASTEROFGLAND'+name,'MASTEROFGAIR'+name,'MASTEROFGSEA'+name].includes(family)}
export function videoGroupsForModel(model,family=''){
 const id=compact(model),f=compact(family),groups=[];
 const add=(name,yes)=>{if(yes)groups.push(name)};
 add('mudman',named(f,'MUDMAN')||line(id,'DW8400')||line(id,'(?:G|GW)(?:9000|9010|9025|930[01]|9330)')||line(id,'GW950[0-3]'));
 add('gravitymaster',named(f,'GRAVITYMASTER')||prefix(id,'GPW|GWR')||prefix(id,'GRB')||line(id,'GWA(?:1000|1030|1100|1130)')||line(id,'GW(?:2000|2500|3000|3500|4000)')||line(id,'G(?:1200|1250|1400|1500)')||line(id,'GA(?:1000|1100)'));
 const lineage=/^(?:LCW|LIW|LIN)/.test(id);
 add('oceanus',!lineage&&(prefix(id,'OCW')||line(id,'(?:OC|OCL)[0-9]{2,4}')||['OCEANUS','CASIOOCEANUS'].includes(f)));
 add('gshock-2100',line(id,'(?:GA|GM|GMA|GMC)[A-Z]{0,2}(?:2100|2110|2140)')||line(id,'MRGB2100'));
 add('gmw-bz5000',line(id,'GMWBZ5000'));
 add('gw-bx5600',line(id,'GWBX5600'));
 add('gbx-h5600',line(id,'GBXH5600'));
 add('mudmaster',named(f,'MUDMASTER')||prefix(id,'GWG')||line(id,'GG(?:1000|1035)')||prefix(id,'GGB')||line(id,'GSG100'));
 add('rangeman',named(f,'RANGEMAN')||prefix(id,'GPRB|GPRH')||line(id,'GW(?:940[0-9]|9430)'));
 add('wave-ceptor',!lineage&&(['WAVECEPTOR','CASIOWAVECEPTOR'].includes(f)||prefix(id,'WV|LWA|LWV|LWQ')));
 add('a168w',id==='A168'||/^A168W/.test(id));
 add('f91w',/^F91W/.test(id));
 add('dw5600',line(id,'DWB?5600'));
 add('frogman',named(f,'FROGMAN')||prefix(id,'GWF|MRGBF')||line(id,'GF(?:1000|820[0-9]|8230|8235|825[01])')||line(id,'DW(?:6300|820[0-9]|8250)')||line(id,'GW(?:20[0-9]|820[0-9]|8230|8235|825[01])'));
 return groups;
}

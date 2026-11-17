// Presentation grouping only. Original identifiers, categories, evidence and facts remain unchanged.
const cached=new WeakMap();
const fields=['dimensions_mm','weight_g','case_material','band_material','glass','color','display_polarity'];
const value=(catalog,row,field)=>catalog.models[row.catalog_id||row.id]?.specs?.[field]?.value;
const stable=x=>JSON.stringify(x,(_,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.entries(v).sort(([a],[b])=>a.localeCompare(b))):v);
const norm=x=>typeof x==='string'?x.trim().toLowerCase().replace(/\s+/g,' '):x;
function conflict(catalog,a,b){
 if(a.family!==b.family)return true;
 if(a.module_ids.length&&b.module_ids.length&&!a.module_ids.some(id=>b.module_ids.includes(id)))return true;
 return fields.some(f=>{const x=value(catalog,a,f),y=value(catalog,b,f);return x!==undefined&&y!==undefined&&stable(norm(x))!==stable(norm(y))});
}
function root(id){return id.match(/^(.+-[1-9][A-Z0-9]*?)(?:JF|ER|DR|CR|DF)$/)?.[1]||id;}
function score(catalog,row){return (row.has_checked_fields?100000:0)+(row.catalog_id?10000:0)+row.module_ids.length*100+Object.keys(catalog.models[row.catalog_id||row.id]?.specs||{}).length;}
function prepare(index,catalog){
 let saved=cached.get(index);if(saved?.catalog===catalog)return saved;
 const buckets=new Map(),byId=new Map(),groups=[],blocked=[];
 for(const row of index.records){const key=row.category+':'+(row.category==='watch'?root(row.id):row.id);if(!buckets.has(key))buckets.set(key,[]);buckets.get(key).push(row);}
 for(const [bucketKey,rows]of buckets){
  const key=bucketKey.slice(bucketKey.indexOf(':')+1);
  const unsafe=rows.some((a,i)=>rows.slice(i+1).some(b=>conflict(catalog,a,b)));
  if(unsafe&&rows.length>1)blocked.push({base_reference:key,identifiers:rows.map(r=>r.id),reason:'Different family, module or recorded physical facts; kept separate'});
  for(const members of unsafe?rows.map(row=>[row]):[rows]){
   const sorted=[...members].sort((a,b)=>score(catalog,b)-score(catalog,a)||a.id.localeCompare(b.id)),preferred=sorted[0];
   const group={key:members.length>1?key:preferred.id,preferred,members,display_id:members.some(r=>r.id===key)?key:preferred.id};groups.push(group);for(const row of members)byId.set(row.id,group);
  }
 }
 saved={catalog,groups,byId,blocked};cached.set(index,saved);return saved;
}
export function regionalGroupFor(index,catalog,id){return prepare(index,catalog).byId.get(id)||null;}
export function groupRegionalMatches(index,catalog,rows,{verified=false}={}){
 const table=prepare(index,catalog),seen=new Set(),result=[];
 for(const row of rows){const group=table.byId.get(row.id);if(seen.has(group))continue;seen.add(group);
  const preferred=verified?group.members.filter(r=>r.has_checked_fields).sort((a,b)=>score(catalog,b)-score(catalog,a))[0]||row:group.preferred;
  result.push({...preferred,display_id:group.display_id,regional_ids:group.members.map(r=>r.id),regional_group:group.key});
 }
 return result;
}
export function regionalModelSummary(index,catalog){const p=prepare(index,catalog);return {watch_groups:p.groups.filter(g=>g.preferred.category==='watch').length,watch_identifiers:index.records.filter(r=>r.category==='watch').length,regional_groups:p.groups.filter(g=>g.members.length>1).length,grouped_identifiers:p.groups.filter(g=>g.members.length>1).reduce((n,g)=>n+g.members.length,0),conflicting_groups_kept_separate:p.blocked.length,scope:'Search-result groups combine matching market-reference endings only. Original identifiers and evidence remain separate; categories and identifier counts are unchanged. Recorded physical or module conflicts prevent grouping.'};}

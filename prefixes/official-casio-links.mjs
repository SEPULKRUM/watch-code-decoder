import {officialCasioLinks} from './official-casio-links-data.mjs?v=official-audit-20261117';
import {regionalReferenceRoot} from './regional-models.mjs?v=official-audit-20261117';
const domains=['casio.com','casio.jp','casio.co.jp','casio.com.cn','casio-europe.com'];
export function officialCasioUrl(raw){try{const u=new URL(raw);return u.protocol==='https:'&&!u.username&&!u.password&&!u.port&&domains.some(d=>u.hostname===d||u.hostname.endsWith('.'+d))?u.href:null}catch{return null}}
export function casioReferenceKey(id){return regionalReferenceRoot(String(id||'').trim().toUpperCase()).replace(/[^A-Z0-9]/g,'')}
export function officialCasioForModel(id,registry=officialCasioLinks){
 const key=casioReferenceKey(id),record=registry.entries?.[key],url=record&&officialCasioUrl(record.url);
 if(url&&['product','support'].includes(record.kind)&&record.checked_at&&casioReferenceKey(record.page_model)===key){const path=new URL(url).pathname,slug=path.match(new RegExp('/'+record.kind+'\\.([^/]+)/?$'))?.[1];if(slug&&casioReferenceKey(decodeURIComponent(slug))===key)return {url,kind:record.kind,model:record.page_model,checked_at:record.checked_at,label:record.kind==='product'?'Casio product':'Casio support',description:record.kind==='product'?'Official Casio model page with specifications.':'Official Casio support/service page.'};}
 return {url:'https://www.casio.com/',kind:'homepage',model:null,label:'Casio official',description:'General Casio website.'};
}

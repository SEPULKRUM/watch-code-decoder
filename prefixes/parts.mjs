import {safeUrl,compact} from './core.mjs?v=7c8896384ae6cc00';
export function validateParts(data){
 if(data?.schema_version!==1||data.supplier!=='Boley'||!data.models||Array.isArray(data.models)||typeof data.models!=='object')throw Error('Parts references could not be read.');
 return data;
}
export function partsForModel(data,id){
 const row=data?.models?.[id];if(!row||typeof row.listed_model!=='string'||compact(row.listed_model)!==compact(id))return null;
 const href=safeUrl(row.url);if(!href)return null;const u=new URL(href),m=u.pathname.match(/^\/en\/case-parts\/casio\/\d+\.([a-z0-9]+(?:-[a-z0-9]+)*)$/);
 if(u.hostname!=='boley.de'||u.port||u.search||u.hash||!m||compact(m[1])!==compact(id))return null;
 return {...row,url:href,observed_qw_codes:(Array.isArray(row.observed_qw_codes)?row.observed_qw_codes:[]).filter(code=>/^QW-?\d{3,4}[A-Z]{0,4}-\d{2}[A-Z]{0,4}$/.test(code))};
}

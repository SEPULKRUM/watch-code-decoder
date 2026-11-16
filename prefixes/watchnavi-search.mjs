const compact=value=>String(value).toUpperCase().replace(/[^A-Z0-9]/g,'');
export function searchWatchnavi(reference,query='',offset=0,limit=40){
 const q=String(query).trim().toUpperCase(),key=compact(q);
 const found=reference.placements.filter(row=>!q||row.model_string.toUpperCase().includes(q)||(key&&compact(row.model_string).includes(key))||String(row.year_heading)===q||[...row.caption_lines,...row.feature_phrases].join(' ').toUpperCase().includes(q));
 const start=Math.max(0,Math.floor(offset)),size=Math.max(1,Math.floor(limit));
 return {total:found.length,rows:found.slice(start,start+size),offset:start,limit:size};
}

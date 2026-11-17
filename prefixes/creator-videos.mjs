// Exact mappings provided by SEPULKRUM. Video links do not supply specifications.
export const creatorVideos=[
 {models:[],modules:['3159','3495'],title:'Modules 3159 and 3495 · SEPULKRUM playlist',url:'https://www.youtube.com/playlist?list=PLK00sRoqNZrA',kind:'playlist',attribution:'SEPULKRUM · owner-provided module playlist'},
 {models:['GPW-2000TFB-1A'],title:'GPW-2000TFB-1A · SEPULKRUM playlist',url:'https://www.youtube.com/playlist?list=PLDqbRJ4qDRs0',kind:'playlist',attribution:'SEPULKRUM · owner-provided'},
 {models:['AWG-M520UA','AWG-M520UA-1EJR'],title:'AWG-M520UA | The Modern Revival of the 1996 UNITED ARROWS G-Shock',url:'https://www.youtube.com/watch?v=qJTOpZHMlnw',attribution:'SEPULKRUM · owner-provided'},
 {models:['AWG-500J-1A','AWG-M510-1B','AWG-500J-9A'],title:'AWG-500J-1A, AWG-M510-1B and AWG-500J-9A',url:'https://www.youtube.com/watch?v=jGWa9HTgiIw',attribution:'SEPULKRUM · models identified by the owner'}
];
const key=value=>String(value).trim().toUpperCase().replace(/[^A-Z0-9]/g,'');
export function creatorVideosForModel(model,moduleIds=[]){
 const modules=new Set(moduleIds.map(String));
 return creatorVideos.filter(video=>video.models.some(id=>key(id)===key(model))||(video.modules||[]).some(id=>modules.has(id)));
}

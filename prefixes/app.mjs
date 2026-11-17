import {seriesPdfs} from './series-pdfs-data.mjs?v=series-pdfs-20261117';
import {specialVariants} from './special-variants-data.mjs?v=seven-special-20261117';
import {metalSquares} from './metal-squares-data.mjs?v=metal-squares-20261117';
import {moduleComparison} from './module-comparison-data.mjs?v=module-comparison-20261117';
import {researchPdfs} from './research-pdfs-data.mjs?v=three-pdfs-20261117';
import {applyCatalog1983,catalog1983EvidenceForModel,catalog1983} from './catalog-1983.mjs?v=seven-special-20261117';
import {creatorVideosForModel} from './creator-videos.mjs?v=family-playlists-20261117';
import {validateSearchIndex,searchUnified,indexedModel,exactIndexedModels,modelForDetail,indexedStatus,unifiedFamilyCounts,inSearchMode,fitmentContext} from './unified-search.mjs?v=seven-special-20261117';
import {englishText,nonEnglishScript} from './english.mjs?v=7c8896384ae6cc00';
import {presentationFacts} from './specification-display.mjs?v=7c8896384ae6cc00';
import {validateMaster,expandMasterModel,mergeMasterReferences,searchMaster} from './master-research.mjs?v=7c8896384ae6cc00';
import {catalogBatchReference} from './catalog-batch-reference.mjs?v=7c8896384ae6cc00';
import {watchnaviReference} from './watchnavi-reference.mjs?v=7c8896384ae6cc00';
import {searchWatchnavi} from './watchnavi-search.mjs?v=7c8896384ae6cc00';
import {catalog2011Reference} from './catalog-2011-reference.mjs?v=7c8896384ae6cc00';
import {protrekReference} from './protrek-reference.mjs?v=7c8896384ae6cc00';
import {combinedReference} from './combined-reference.mjs?v=7c8896384ae6cc00';
import {historicalReview} from './historical-review.mjs?v=7c8896384ae6cc00';
import {guideReferenceSections} from './guide-interpretations.mjs?v=lineage-20261117';
import {decoderDisclosure,decoderRules,evidenceName} from './decoder-rules.mjs?v=7c8896384ae6cc00';
import {value,moduleIds,findModels,stats,safeUrl,validateData,label,display,evidenceLabel,recordEvidenceLabel} from './core.mjs?v=ua-archive-20261116';
import {decodeModel,entries} from './decoder.mjs?v=series-pdfs-20261117';
import {validateReferences,findReferences,referenceStatus} from './model-references.mjs?v=7c8896384ae6cc00';
import {modelColor,officialProductLink} from './decoder-presentation.mjs?v=7c8896384ae6cc00';
import {validateParts,partsForModel} from './parts.mjs?v=7c8896384ae6cc00';
const $=s=>document.querySelector(s), el=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=englishText(text);if(cls)n.className=cls;return n};
let watchnaviOffset=0,masterOffset=0,masterResearch=null,baseReferences=null;
let searchIndex=null,reconciliation=null,references=null,productLinks=null,data=null,parts=null,partsUnavailable=false,state={query:'',family:'',verified:false,mode:'models',page:1,pageSize:50},activeModel=null,lastDecode=null;
const repo='https://github.com/SEPULKRUM/casio-watch-specs';
function link(text,url){const a=el('a',text);const valid=safeUrl(url);if(valid){a.href=valid;a.target='_blank';a.rel='noopener noreferrer'}return a}
function status(text){$('#data-status').textContent=text}
function setFamily(family){state.page=1;state.family=family;$('#family-select').value=family;render()}
function readHash(){const p=new URLSearchParams(location.hash.slice(1));return p.get('model')}
function closeDetail(){if($('#detail').open)$('#detail').close();activeModel=null;history.replaceState(null,'',location.pathname+location.search)}
function structured(v,parent){
 if(Array.isArray(v)){v.forEach((x,i)=>{if(typeof x==='object'&&x!==null){const group=el('div',undefined,'structured-group');group.append(el('strong',`Entry ${i+1}`));structured(x,group);parent.append(group)}else parent.append(el('span',`${display(x)}${i<v.length-1?' · ':''}`))});return}
 for(const [k,x] of Object.entries(v)){
  if(typeof x==='object'&&x!==null){const group=el('div',undefined,'structured-group');group.append(el('strong',label(k)));structured(x,group);parent.append(group)}
  else{const row=el('div',undefined,'structured-row');row.append(el('span',label(k)),el('span',display(x,k)));parent.append(row)}
 }
}
function fact(field,f){
 const item=el('div',undefined,'fact'),head=el('div',undefined,'fact-head');head.append(el('span',label(field),'fact-label'));
 if(typeof f.value==='object'&&f.value!==null&&!['dimensions_mm','indexed_dimensions_mm'].includes(field)){head.append(el('span','Details below','fact-value'));item.append(head);const nested=el('div',undefined,'structured');structured(f.value,nested);item.append(nested)}
 else{head.append(el('span',display(f.value,field),'fact-value'));item.append(head)}
 const details=el('details'),stat=evidenceLabel(f);details.append(el('summary',`${stat} · ${(f.sources||[]).length} source${f.sources?.length===1?'':'s'}`));const evidence=el('div',undefined,'evidence');evidence.append(el('p',f.status==='verified'?(f.review?.method==='automated_source_cross_check'?'Verification: automated source cross-check; not a human audit.':'Verification: verified'):'Verification: not independently reviewed'));if(f.review){evidence.append(el('p',`${f.review.reviewed_by} · ${f.review.checked_on||''}`));if(f.review.evidence_reference)evidence.append(link('Source-check record ↗',new URL(f.review.evidence_reference,location.href).href))}if(f.uncertainty)evidence.append(el('p',f.uncertainty));if(nonEnglishScript.test(JSON.stringify(f)))evidence.append(el('p','English translation shown. Original wording is preserved in the downloadable source record.','source-location'));
 for(const s of f.sources||[]){const source=el('div',undefined,'source');let url=s.url|| (s.reference?`${repo}/blob/main/${s.reference}`:null);if(url){let name=s.kind==='user_provided'?'Owner-supplied evidence':new URL(safeUrl(url)||'https://invalid.example').hostname;source.append(link(name+' ↗',url))}source.append(el('p',`${s.accessed||''}${s.archive_timestamp?' · Archive '+s.archive_timestamp.slice(0,4)+'-'+s.archive_timestamp.slice(4,6)+'-'+s.archive_timestamp.slice(6,8):''}`,'source-location'));if(s.locator)source.append(el('p',s.locator,'source-location'));if(s.evidence)source.append(el('p',s.evidence));if(s.scope_note)source.append(el('p',s.scope_note));if(s.original_url)source.append(link('Original official URL ↗',s.original_url));evidence.append(source)}
 details.append(evidence);item.append(details);return item;
}
function addFacts(parent,record,excluded=[]){
 let total=0;for(const [field,f] of presentationFacts(record,{excluded,verified:state.verified})){parent.append(fact(field,f));total++}
 if(!total)parent.append(el('p','No specification fields recorded for this profile.','detail-description'));
}
function partsSection(model){
 const section=el('section',undefined,'detail-section parts-section');section.append(el('h3','Parts & service'));
 const row=partsForModel(parts,model.id);
 if(row){section.append(link(`View Boley parts listing for ${row.listed_model} ↗`,row.url),el('p',`Model listing checked ${row.accessed}. Part numbers and availability are maintained by Boley.`,'detail-description'));
  if(row.observed_qw_codes.length)section.append(el('p','Supplier module code: '+row.observed_qw_codes.join(' / '),'detail-description'));
  if(row.module_comparison==='needs_review')section.append(el('p','Boley’s QW reference differs from the recorded module reference. The assignment needs review.','unknowns'));
  if(row.observed_qw_codes.length)section.append(el('p','Supplier references are recorded separately from official Casio module evidence.','detail-description'));
 }else section.append(el('p',partsUnavailable?'Parts links are temporarily unavailable.':parts?'No exact Boley model listing has been linked yet.':'Loading parts references…','detail-description'),link('Browse Boley’s Casio directory ↗','https://boley.de/en/case-parts/casio'));
 return section;
}
function watchCard(model){
 const card=el('section',undefined,'watch-link-card');
 const url=officialProductLink(productLinks?.models?.[model.id],model.id);
 const icon=el('span','◷','watch-outline');icon.setAttribute('aria-hidden','true');card.append(icon);
 if(url)card.append(link(`SEE THE WATCH · ${model.id} ↗`,url));
 else card.append(el('p','Official Casio product page unavailable'));
 return card;
}
function openModel(id,write=true){
 const resolved=searchIndex?modelForDetail(searchIndex,data,id):null;const model=resolved?.model||data.models[id];if(!model)return;const entry=resolved?.entry;const index2011=String(value(model,'reference_scope')||'').startsWith('2011');activeModel=id;const body=$('#detail-body');body.replaceChildren();body.append(el('div',value(model,'series')||entry?.family||'Casio','detail-family'),el('h2',id));body.querySelector('h2').id='detail-title';body.querySelector('h2').textContent=id;body.append(el('span',entry?indexedStatus(entry):recordEvidenceLabel(model),'pill'));if(entry&&!entry.has_specifications)body.append(el('p',entry.category==='watch'?'Specifications pending verification':indexedStatus(entry),'review-note'));if(entry&&['fitment','uncertain','family','clock','package'].includes(entry.category))body.append(el('p','This record is categorized separately and is not counted as an individual watch variant.','review-note'));
 if(entry?.master_row!==undefined&&masterResearch){const raw=masterResearch.models[entry.master_row];if(raw?.model_id===id){const report=el('details',undefined,'guide-reference');report.append(el('summary','Supplied research for this exact identifier'));const fields=el('div',undefined,'structured');structured(Object.fromEntries(Object.entries(expandMasterModel(masterResearch,raw)).filter(([,v])=>v!=='')),fields);report.append(el('p','Source claims only; no measurements are inherited from another variant or module.'),fields);body.append(report)}}
 const share=el('button','Copy model link','text-button detail-link');share.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(location.href);share.textContent='Link copied'}catch{share.textContent='Copy the address from your browser'}});body.append(share);if(!entry||entry.category==='watch')body.append(watchCard(model),partsSection(model));if(index2011)body.append(el('p',value(model,'reference_scope')==='2011_clock_index'?'2011 clock index reference. Technical fields not established by the source remain blank.':'2011 watch-family/base-label index reference, not a complete colour or regional SKU. Indexed sizes and mass retain their printed label or suffix-group scope.','review-note'));
 appendCreatorVideos(body,id,resolved?.module_ids||moduleIds(model),entry?.family||value(model,'series')||'');appendCatalog1983(body,id);appendPdfResearch(body,id,model);appendModuleComparison(body,id,model);appendSpecialVariants(body,id,model);appendSeriesPdfs(body,id,model);appendMetalSquares(body,id,model);
 const section=el('section',undefined,'detail-section');section.append(el('h3',index2011?'2011 catalog reference':entry&&entry.category!=='watch'?'Source reference':'Watch specifications'),el('p',index2011?'Printed index values and source scope are retained below.':'Case, materials and appearance belong to this model.','detail-description'));addFacts(section,model,['series','module_id','module_candidates','catalog_1983_evidence','research_pdf_evidence','module_comparison_evidence','metal_square_evidence','special_variant_evidence','series_pdf_evidence',...(specialVariants.category_resolutions[id]?['reference_scope']:[])]);
 const missing=['dimensions_mm','weight_g','case_material','band_material','glass','water_resistance_rating'].filter(k=>!model.specs[k]);if(missing.length&&entry?.category!=='package')section.append(el('p',(index2011?'Exact variant / clock fields not established by this index: ':'Not recorded: ')+missing.map(label).join(' · '),'unknowns'));body.append(section);
 const moduleSection=el('section',undefined,'detail-section'),ids=resolved?.module_ids||moduleIds(model),ambiguous=ids.length>1||Boolean(value(model,'module_candidates'));moduleSection.append(el('h3',index2011?'Indexed module information':ambiguous?'Module options':'Module functions'));
 moduleSection.append(el('p',index2011?'The 2011 index associates these numbers with a family label. A linked profile is separate research evidence, not confirmation of a fitted module or every retail variant.':ambiguous?'The cited source describes multiple module associations or historical production versions. The exact fitted module is unresolved; each recorded profile is shown separately.':'Module functions are stored separately from the watch case. The reference describes the available source evidence.','detail-description'));
 if(model.specs.module_id)moduleSection.append(fact('module_id',model.specs.module_id));if(model.specs.module_candidates)moduleSection.append(fact('module_candidates',model.specs.module_candidates));if(model.module)moduleSection.append(el('p',`Module ${model.module} · preserved legacy association; not independently reverified.`,'detail-description'));
 if(!ids.length)moduleSection.append(el('p','No module reference recorded.','unknowns'));
 for(const id of ids){const profile=data.modules[id],option=el('details',undefined,'module-option');if(!ambiguous)option.open=true;const sum=el('summary',`Module ${id}`);const polarity=value(profile,'display_polarity');if(polarity)sum.append(el('small',display(polarity,'display_polarity')));option.append(sum);if(profile){addFacts(option,profile,['catalog_1983_evidence','research_pdf_evidence','module_comparison_evidence','metal_square_evidence','special_variant_evidence','series_pdf_evidence']);for(const field of ['research_pdf_evidence','module_comparison_evidence','metal_square_evidence','special_variant_evidence','series_pdf_evidence']){const note=value(profile,field);if(note){const detail=el('details');detail.append(el('summary',field==='metal_square_evidence'?'3459 / 3539 / 3461 / 3540 research — source-qualified':field==='module_comparison_evidence'?'Updated 3159 / 3495 comparison — source-qualified':'Supplied module research — pending verification'));structured(note,detail);option.append(detail)}}}else option.append(el('p','This candidate module does not yet have a researched specification profile.','detail-description'));moduleSection.append(option)}
 body.append(moduleSection);if(entry){appendFitmentContext(body,entry);body.append(indexedSources(entry))}if(write)history.replaceState(null,'',`#model=${encodeURIComponent(model.id)}`);if(!$('#detail').open)$('#detail').showModal();$('#detail').scrollTop=0;
}

function appendCatalog1983(body,id){
 const evidence=catalog1983EvidenceForModel(id);if(!evidence)return;
 const section=el('section',undefined,'detail-section');section.append(el('h3','Supplied 1983 catalog evidence'),el('p','Visually transcribed supplied catalog; pending independent verification. These claims retain the printed reference scope. Conflicting existing values are preserved separately.','detail-description'),el('p',evidence.date_scope),link('Catalog transcription and page citations ↗',`${repo}/blob/main/${evidence.source_reference}`));
 const own=el('details');own.append(el('summary','Printed watch or clock caption'));structured(evidence.model,own);section.append(own);
 if(evidence.module){const module=el('details');module.append(el('summary','Module '+evidence.module.module_id+' — catalog functions'));structured(evidence.module,module);section.append(module)}body.append(section);
}

function appendPdfResearch(body,id,model){
 const record=researchPdfs.records.find(r=>r.kind==='model'&&r.id===id);
 const evidence=record?.specs.research_pdf_evidence||value(model,'research_pdf_evidence');if(!evidence)return;
 const section=el('section',undefined,'detail-section');section.append(el('h3','Supplied technical research'),el('p','Research conversation claims remain pending independent verification. Production estimates, collector measurements and related-model parts do not establish exact factory specifications or compatibility.','detail-description'));
 const own=el('details');own.append(el('summary','Watch, production and service-part evidence'));structured(evidence,own);section.append(own);

 section.append(link('Technical transcription and PDF page citations ↗',`${repo}/blob/main/${researchPdfs.source_reference}`));body.append(section);
}

function appendModuleComparison(body,id,model){
 const record=moduleComparison.records.find(r=>r.kind==='model'&&r.id===id);
 const evidence=record?.specs.module_comparison_evidence||value(model,'module_comparison_evidence');if(!evidence)return;
 const section=el('section',undefined,'detail-section');section.append(el('h3','3159 / 3495 model comparison'),el('p','C and I describe the supplied document’s manufacturer or independent sources; they do not automatically mark database facts verified. D means base-derived dimensions and estimated weight. Exact variants remain separate.','detail-description'));
 const details=el('details');details.append(el('summary','Measurements, source class and model-specific cautions'));structured(evidence,details);section.append(details);
 if(evidence.reported_evidence_class==='D')section.append(el('p','Weight is an estimate from the base model, not a verified specification for this collaboration.','review-note'));
 for(const note of moduleComparison.cautions)section.append(el('p',note,'detail-description'));
 section.append(link('Technical transcription and source citations ↗',`${repo}/blob/main/${moduleComparison.source_reference}`));body.append(section);
}

function appendMetalSquares(body,id,model){
 const record=metalSquares.records.find(r=>r.kind==='model'&&r.id===id);
 const evidence=record?.specs.metal_square_evidence||value(model,'metal_square_evidence')||metalSquares.unresolved_records.find(r=>r.id===id);if(!evidence)return;
 const section=el('section',undefined,'detail-section');section.append(el('h3','Four-module square reference'),el('p','Exact-model claims, series templates and approximate weights have different evidence scopes. Templates do not establish this variant’s dimensions, weight or glass. Module changeovers require unit-level evidence.','detail-description'));
 const details=el('details');details.append(el('summary','Variant details, source scope and unresolved claims'));structured(evidence,details);section.append(details);
 for(const note of metalSquares.cautions)section.append(el('p',note,'detail-description'));
 section.append(link('Technical transcription and source citations ↗',`${repo}/blob/main/${metalSquares.source_reference}`));body.append(section);
}

function appendSpecialVariants(body,id,model){
 const record=specialVariants.records.find(r=>r.kind==='model'&&r.id===id),related=specialVariants.related_labels.find(r=>r.reading===id);
 const evidence=record?.specs.special_variant_evidence||value(model,'special_variant_evidence')||related;if(!evidence)return;
 const section=el('section',undefined,'detail-section');section.append(el('h3','Special-reference resolution'),el('p','Documented watch variants and retail packages are categorized separately. Package hardware figures describe the included watch, not package weight or a new watch design. Earlier spellings remain preserved.','detail-description'));
 const details=el('details');details.open=true;details.append(el('summary','Documented reference, included watch and evidence limits'));structured(evidence,details);section.append(details);
 const target=evidence.documented_reference||related?.documented_reference;if(target&&target!==id){const b=el('button','View documented reference '+target,'text-button detail-link');b.type='button';b.addEventListener('click',()=>openModel(target));section.append(b)}
 section.append(link('Technical transcription and source citations ↗',`${repo}/blob/main/${specialVariants.source_reference}`));body.append(section);
}

function appendSeriesPdfs(body,id,model){
 const record=seriesPdfs.records.find(r=>r.kind==='model'&&r.id===id),evidence=record?.specs.series_pdf_evidence||value(model,'series_pdf_evidence');if(!evidence)return;
 const section=el('section',undefined,'detail-section');section.append(el('h3','PRW-69 / OCW-G1200 source research'),el('p','Supplied technical research — pending archive verification. Exact variants, approximate measurements and unresolved module attribution retain their scope.','detail-description'));
 const details=el('details');details.open=true;details.append(el('summary','Exact variant, suffix interpretations and evidence limits'));structured(evidence,details);section.append(details);
 for(const note of seriesPdfs.cautions)section.append(el('p',note,'detail-description'));
 const document=seriesPdfs.source_reference;section.append(link('Technical transcription and source citations ↗',`${repo}/blob/main/${document}`));body.append(section);
}

function appendCreatorVideos(body,id,modules=[],family=''){
 const videos=creatorVideosForModel(id,modules,family);if(!videos.length)return;
 const section=el('section',undefined,'detail-section creator-videos');section.append(el('h3','My videos'));
 for(const video of videos){const a=link(video.kind==='playlist'?'▶ View my playlist ↗':'▶ Watch my video ↗',video.url);a.className='creator-video-link';a.setAttribute('aria-label','Watch SEPULKRUM video about '+id);section.append(a,el('p',video.title),el('small',video.attribution));for(const note of video.notes||[])section.append(el('p',note,'detail-description'))}body.append(section);
}

function appendFitmentContext(body,entry){
 for(const context of fitmentContext(searchIndex,entry.id)){
  const section=el('section',undefined,'detail-section');section.append(el('h3','Related individual models and parts references'),el('p',context.scope_note,'detail-description'));
  for(const id of [context.model_id,...context.related_models])if(id!==entry.id){const button=el('button',undefined,'text-button detail-link');button.type='button';button.textContent=id;button.addEventListener('click',()=>openModel(id));section.append(button)}
  const note=claim=>{const detail=el('div',undefined,'evidence');detail.append(el('p',claim.status,'source-location'),el('p',claim.text||claim.note));if(claim.url)detail.append(link('Source ↗',claim.url));section.append(detail)};
  for(const claim of context.evidence||[])note(claim);
  for(const model of context.model_notes||[])if(entry.id===context.model_id||entry.id===model.model_id){const heading=el('h4');heading.textContent=model.model_id;section.append(heading);for(const claim of model.claims)note(claim)}
  if(entry.id===context.model_id&&context.restoration_note)note(context.restoration_note);
  section.append(el('p','Research notes are separate from verified specifications and factory module assignments.','review-note'));body.append(section);
 }
}

function indexedSources(entry){
 const section=el('section',undefined,'detail-section');section.append(el('h3','Identifier sources'),el('p',`${entry.origins.length} source locations. A source mention does not verify missing specifications.`,'detail-description'));
 for(const [sourceNumber,locator,role,hint] of entry.origins){const source=searchIndex.sources[sourceNumber],item=el('details');item.append(el('summary',source.path),link('Open source record ↗',`${repo}/blob/main/${source.path}`),el('p',locator,'source-location'),el('small',role.replace(/_/g,' ')+' · source scope: '+hint));section.append(item)}
 return section;
}

function renderReferenceMatches(query){
 const root=$('#reference-matches');root.replaceChildren();
 if(!references)return;
 if(masterResearch&&query.trim()){const raw=searchMaster(masterResearch,query);if(raw.total){const all=el('button',`View ${raw.total.toLocaleString()} supplied master references (including raw and fitment labels)`,'text-button');all.type='button';all.addEventListener('click',()=>{$('#master-query').value=query;$('#master-category').value='all';masterOffset=0;renderMaster();openResearch(false);$('#master-panel').open=true;$('#master-panel').scrollIntoView({behavior:'smooth',block:'start'})});root.append(all)}}
 const found=findReferences(references,query);if(!query.trim())return;const all=el('button','Search all indexed records in the main table','text-button');all.type='button';all.addEventListener('click',()=>{state.query=query;state.mode='all';state.page=1;$('#search').value=query;$('#search-mode').value='all';installFamilies();render();$('.browser').scrollIntoView({behavior:'smooth'})});root.append(all);
 const header=el('p',`${found.total} matching model / series references${found.total>found.models.length?` · showing ${found.models.length}`:''}`,'reference-count');root.append(header);
 if(!found.total)return;
 root.append(el('p','Research identifiers may be partial or misread. These are separate from specification records. An index check confirms a mention, not the watch’s features.','decoder-disclosure'));
 for(const model of found.models){
  const item=el('details',undefined,'reference-item'),summary=el('summary');summary.append(el('strong',model.id),el('small',referenceStatus(model)));item.append(summary);
  if(model.reading_flags.length)item.append(el('p','Reading needs extra review: '+model.reading_flags.join(' · '),'unknowns'));
  for(const observation of [...model.observations].reverse().slice(0,5)){
   const source=references.sources[observation.source_id];
   const text=source.filename+(observation.catalog_year?` · ${observation.catalog_year} catalog p. ${observation.catalog_page}`:'')+(observation.pdf_page?` · PDF page ${observation.pdf_page}`:'')+(observation.compilation_page?` · compilation page ${observation.compilation_page}`:'')+(observation.line?` · line ${observation.line}`:'')+(observation.csv_row?` · CSV row ${observation.csv_row}`:'');
   item.append(el('p',text,'source-location'));if(observation.reading_scope)item.append(el('small','Source scope: '+observation.reading_scope.replace(/_/g,' ')));if(observation.ocr_review_required)item.append(el('small','This source flags the OCR model reading for review.'));if(observation.source_placement_ids){const captions=el('button','View supplied OCR captions','text-button');captions.type='button';captions.addEventListener('click',()=>{$('#watchnavi-query').value=model.id;watchnaviOffset=0;renderWatchnavi();$('#watchnavi-panel').open=true;$('#watchnavi-panel').scrollIntoView({behavior:'smooth',block:'start'})});item.append(captions)}
   if(source.availability==='publication_web'){item.append(link('Read magazine source ↗',source.url),el('small','Magazine model mention only; primary technical verification remains pending.'))}
   else if(source.availability==='received_research_master')item.append(el('small','Owner-supplied master identifier; not an authenticated model or independently reviewed specification.'));
   else if(source.availability==='received_secondary_guide')item.append(el('small','Supplied reference guide; model features and letter meanings need independent verification.'));
   else if(source.availability.startsWith('received_zip_research_note'))item.append(el('small','Supplied research note only; not primary model verification.'));
   else if(source.availability!=='received_pdf')item.append(el('small','Original source not included in the seven uploads; page claim remains unverified.'));
  }
  if(model.observations.length>5)item.append(el('small',`${model.observations.length-5} further observations in the download.`));
  const use=el('button','Decode this reference','text-button');use.type='button';use.addEventListener('click',()=>submitPrefix(model.id));item.append(use);root.append(item);
 }
}
async function loadReferences(remote=false){
 const fetchJson=async url=>{const response=await fetch(url,{cache:'no-store'});if(!response.ok)throw Error('Research source unavailable');return response.json()};
 const prefix=remote?'https://raw.githubusercontent.com/SEPULKRUM/casio-watch-specs/main/':'';
 const results=await Promise.allSettled([fetchJson(prefix+(remote?'data/':'')+'model-references.json'),fetchJson(remote?prefix+'research/casio-master-research-2026-11-16.json':'master-research.json')]);
 if(results[0].status==='fulfilled'){try{baseReferences=validateReferences(results[0].value)}catch{}}
 if(results[1].status==='fulfilled'){try{masterResearch=validateMaster(results[1].value);renderMaster();renderMasterSources()}catch{}}
 if(baseReferences){references=validateReferences(mergeMasterReferences(baseReferences,masterResearch));$('#reference-coverage').textContent=`${entries.length} prefix patterns · ${references.counts.model_strings.toLocaleString()} research model strings · ${references.counts.index_checked} index identifiers checked`;renderPrefix($('#prefix-input').value)}
 else $('#reference-coverage').textContent='Research model references unavailable; prefix decoding still works.';
 if(searchIndex&&data){render();if(activeModel&&$('#detail').open)openModel(activeModel,false)}
 if(!masterResearch)$('#master-status').textContent='Supplied master research is temporarily unavailable. Other library sources remain usable.';
}

function renderPrefix(query,force=false){
 renderReferenceMatches(query);
 const result=decodeModel(query,data,references),root=$('#prefix-result');lastDecode=result;
 if(!result.recognized){root.replaceChildren();root.hidden=!force||result.empty;if(!root.hidden)root.append(el('p',result.reason,'decode-missing'));return result}
 root.hidden=false;root.replaceChildren();const header=el('div',undefined,'decode-header');header.append(el('h3',result.normalized),el('span',result.family,'decode-family'));root.append(header);
 if(result.references?.length)root.append(el('p',referenceStatus(result.references[0])+' · Model / series mention only; specifications are separate.','decode-coverage'));
 const chips=el('div',undefined,'decode-chips');for(const segment of result.segments)chips.append(el('span',segment.token,'decode-chip '+segment.type));root.append(chips);
 for(const segment of result.segments){
  const row=el('div',undefined,'decode-row'),description=el('div');description.append(el('h4',segment.title));
  if(segment.type==='prefix'&&segment.communityMeaning){
   const meaning=segment.communityMeaning;
   description.append(el('p','The community understands this prefix as:','community-meaning-label'),el('p',meaning.meaning,'community-meaning'),el('small',evidenceName(meaning.status)),el('small',meaning.note),link(meaning.locator+' ↗',meaning.source));
  }else{description.append(el('p',segment.description),el('small',evidenceName(segment.status||'Reference')));if(segment.source)description.append(link('Reference source ↗',segment.source));}
  row.append(el('div',segment.token,'decode-token'),description);root.append(row);
 }
 for(const item of result.guideNotes||[]){const box=el('section',undefined,'guide-context');box.append(el('h4',`Supplied guide · page ${item.page}`),el('p',item.text),el('small','Guide / community interpretation · exact-model confirmation varies'));root.append(box)}
 for(const item of result.editionNotes||[]){const box=el('section',undefined,'guide-context');box.append(el('h4',item.title),el('p',item.description),el('small',evidenceName(item.status)),link(item.linkLabel||'Edition reference ↗',item.source));root.append(box)}
 const color=modelColor(result);
 if(color){const section=el('section',undefined,'model-color');section.append(el('h4','Model color code'));const swatch=el('span',undefined,'color-swatch');swatch.style.backgroundColor=color.swatch;swatch.setAttribute('aria-hidden','true');const line=el('p');line.append(swatch,el('strong',`${color.digit} · ${color.label}`));section.append(line,el('p',color.note),el('small',evidenceName(color.evidence)));if(color.actual)section.append(el('small',`Catalog evidence takes precedence over the heuristic (${color.actualStatus}).`));root.append(section)}
 if(result.officialFeatures){const box=el('section',undefined,'confirmed-features');box.append(el('h4','Features confirmed by Casio'),el('p',result.officialFeatures.description));if(result.officialFeatures.technologyName)box.append(el('p','Official technology name: '+result.officialFeatures.technologyName));box.append(link('Casio feature reference ↗',result.officialFeatures.source),el('small','Confirms the cited model’s features; individual letter expansions remain interpretations.'));root.append(box)}
 if(result.appearanceObservation){const observation=result.appearanceObservation,box=el('section',undefined,'confirmed-features');box.append(el('h4','Appearance observed in Casio’s product image'),el('p',`${observation.polarity==='negative'?'Negative LCD: light digits on a dark background.':'Positive LCD: dark digits on a light background.'} ${observation.accents}.`),link('Casio model reference ↗',observation.source));if(observation.comparison_model)box.append(el('p',`Compared model: ${observation.comparison_model}`));box.append(el('small','Product-image observation; the Blackout / Black Accent letter reading remains a community interpretation.'));root.append(box)}
 const coverage=el('div',undefined,'decode-coverage');
 if(result.exact){coverage.append(el('div',`Model record available: ${result.exact.id}`));const button=el('button','Open watch specifications','primary');button.addEventListener('click',()=>openModel(result.exact.id));coverage.append(button)}
 else if(searchIndex&&exactIndexedModels(searchIndex,query).length===1){const entry=exactIndexedModels(searchIndex,query)[0];coverage.append(el('div',`${entry.id} · ${indexedStatus(entry)}`));const view=el('button','Open indexed model record','primary');view.addEventListener('click',()=>openModel(entry.id));coverage.append(view)}
 else coverage.append(el('div',result.prefixOnly?'Family decoded. Enter a complete model to check for an exact specification record.':`Prefix decoded. This exact model is not yet in the ${data?Object.keys(data.models).length:'current'}-model specification catalog. The model-family interpretation is available independently.`));root.append(coverage);const videoModel=data?.models?.[result.normalized],videoEntry=searchIndex?indexedModel(searchIndex,result.normalized):null;appendCreatorVideos(root,result.normalized,videoModel?moduleIds(videoModel):[],videoEntry?.family||value(videoModel,'series')||result.family);return result;
}
function submitPrefix(model){$('#prefix-input').value=model;state.query=model;state.page=1;$('#search').value=model;if(data)render();renderPrefix(model,true)}

function render(){
 if(!data||!searchIndex)return;renderPrefix(state.query);
 const found=searchUnified(searchIndex,data,state,masterResearch);state.page=found.page;
 $('#result-count').textContent=found.total?`Showing ${found.offset+1}–${Math.min(found.offset+found.pageSize,found.total)} of ${found.total.toLocaleString()} matching records`:'0 matching records';
 $('#list-heading').textContent=state.family||$('#search-mode').selectedOptions[0].textContent;
 for(const button of document.querySelectorAll('.family'))button.setAttribute('aria-pressed',String(button.dataset.family===state.family));
 const list=$('#results');list.replaceChildren();
 for(const entry of found.records){
  const model=entry.catalog_id?data.models[entry.catalog_id]:null,tr=el('tr'),td=el('td'),button=el('button',undefined,'model-button');button.type='button';button.setAttribute('aria-label',`Open ${entry.id}`);
  const mark=el('span','C','watch-mark');mark.setAttribute('aria-hidden','true');const title=el('span');const identifier=el('strong');identifier.textContent=entry.id;title.append(identifier,el('small',indexedStatus(entry)));button.append(mark,title);button.addEventListener('click',()=>openModel(entry.id));td.append(button);const videos=creatorVideosForModel(entry.id,entry.module_ids,entry.family);if(videos.length){const a=link(videos[0].kind==='playlist'?'▶ My playlist ↗':'▶ My video ↗',videos[0].url);a.className='creator-video-row';a.setAttribute('aria-label','Watch SEPULKRUM video about '+entry.id);td.append(a)}tr.append(td,el('td',entry.family));
  const module=el('td');module.append(el('span',entry.module_ids.length?entry.module_ids.join(' / '):'Unknown','module-tag'+(entry.module_ids.length>1?' ambiguous':'')));
  const water=model?presentationFacts(model,{verified:state.verified}).find(([field])=>field==='water_resistance')?.[1].value:null;
  const weight=model&&(!state.verified||model.specs.weight_g?.status==='verified')&&(value(model,'weight_g')!==null?display(value(model,'weight_g'),'weight_g'):value(model,'indexed_weight_g')!==null?display(value(model,'indexed_weight_g'),'indexed_weight_g')+' · index':null);
  tr.append(module,el('td',water||'—'),el('td',weight||'—'));const last=el('td'),view=el('button','↗','row-open');view.setAttribute('aria-label',`View ${entry.id}`);view.addEventListener('click',()=>openModel(entry.id));last.append(view);tr.append(last);list.append(tr);
 }
 $('#empty').hidden=found.total!==0;$('#empty-message').textContent=state.verified?'No matching records have source-checked facts. Turn off the optional filter to include pending models.':'Try another query, family or record category. Retail packages, uncertain readings, fitment labels and clocks have their own categories.';
 $('#page-number').value=found.page;$('#page-number').max=found.pageCount;$('#page-count').textContent=`of ${found.pageCount.toLocaleString()}`;$('#page-prev').disabled=found.page===1;$('#page-next').disabled=found.page===found.pageCount;$('#page-first').disabled=found.page===1;$('#page-last').disabled=found.page===found.pageCount;
}
function installFamilies(){
 if(!searchIndex)return;const families=unifiedFamilyCounts(searchIndex,state.mode),total=Object.values(families).reduce((sum,n)=>sum+n,0),select=$('#family-select'),nav=$('#families');select.replaceChildren();nav.replaceChildren();
 for(const [family,count] of [['',total],...Object.entries(families).sort((a,b)=>a[0].localeCompare(b[0]))]){const button=el('button',undefined,'family');button.dataset.family=family;button.append(el('span',family||'All families'),el('span',count.toLocaleString(),'family-count'));button.addEventListener('click',()=>setFamily(family));nav.append(button);const option=el('option',`${family||'All families'} · ${count.toLocaleString()}`);option.value=family;select.append(option)}
 if(state.family&&!families[state.family])state.family='';select.value=state.family;
}
function installData(next,index,report){
 validateData(next);validateSearchIndex(index,next);
 if(report.index_sha256!==index._sha256||report.missing_model_count!==0||report.distinct_individual_watch_identifiers!==index.counts.watch)throw Error('Search reconciliation does not match this index');
 let composed=applyCatalog1983(next,index,report);composed=applyCatalog1983(composed.catalog,composed.index,composed.report,researchPdfs,'research_pdf_evidence');composed=applyCatalog1983(composed.catalog,composed.index,composed.report,moduleComparison,'module_comparison_evidence');composed=applyCatalog1983(composed.catalog,composed.index,composed.report,metalSquares,'metal_square_evidence');composed=applyCatalog1983(composed.catalog,composed.index,composed.report,specialVariants,'special_variant_evidence');composed=applyCatalog1983(composed.catalog,composed.index,composed.report,seriesPdfs,'series_pdf_evidence');next=composed.catalog;index=composed.index;report=composed.report;
 const checkedData=validateData(next),checkedIndex=validateSearchIndex(index,checkedData);
 data=checkedData;searchIndex=checkedIndex;reconciliation=report;
 const summary=stats(data);$('#model-count').textContent=index.counts.watch.toLocaleString();$('#module-count').textContent=summary.modules;$('#fact-count').textContent=summary.fields.toLocaleString();
 $('#index-summary').textContent=`${index.counts.watch.toLocaleString()} individual watch identifiers · ${index.counts.family.toLocaleString()} family/base references · ${index.counts.clock.toLocaleString()} clocks · ${index.counts.fitment.toLocaleString()} fitment labels · ${index.counts.uncertain.toLocaleString()} uncertain readings · ${(index.counts.package||0).toLocaleString()} retail packages. Counts do not imply authentication.`;
 const root=$('#reconciliation-summary');root.replaceChildren();for(const [label,key] of [['Imported identifier occurrences','total_imported_identifiers'],['Distinct individual watch identifiers','distinct_individual_watch_identifiers'],['Duplicate exact identifier occurrences','duplicate_exact_identifiers'],['Reference-only models','reference_only_models'],['Models with own specifications','models_with_specifications'],['Unresolved identifiers','unresolved_identifiers'],['Eligible models missing from this index','missing_model_count']])root.append(el('p',`${label}: ${report[key].toLocaleString()}`));
 const catalogNotes=el('details');catalogNotes.append(el('summary','Supplied 1983 catalog — source and service notes'),el('p','78 watch references, 29 module profiles and 5 clocks transcribed from the supplied catalog. Source claims remain pending independent verification. Alternate dials without identifiers do not create extra models.'));const sourceNotes=el('div');structured({source_discrepancies:catalog1983.discrepancies,general_service_reference:catalog1983.service_reference},sourceNotes);catalogNotes.append(sourceNotes);root.append(catalogNotes);
 installFamilies();$('#load-error').hidden=true;render();const id=readHash();if(id)openModel(id,false);
}

async function loadParts(remote=false){try{const url=remote?'https://raw.githubusercontent.com/SEPULKRUM/casio-watch-specs/main/data/parts-links.json':'parts-links.json';const r=await fetch(url,{cache:'no-store'});if(!r.ok)throw Error('Parts references unavailable');parts=validateParts(await r.json());partsUnavailable=false}catch{if(!parts)partsUnavailable=true}if(activeModel&&data&&$('#detail').open)openModel(activeModel,false)}
async function loadProductLinks(){try{const r=await fetch('official-product-links.json',{cache:'no-store'});if(!r.ok)throw Error();const next=await r.json();if(next.schema_version===1&&next.models)productLinks=next}catch{productLinks=null}if(activeModel&&data&&$('#detail').open)openModel(activeModel,false)}
async function load(remote=false){
 loadParts(remote);loadProductLinks();loadReferences(remote);$('#refresh').disabled=true;status(remote?'Checking reconciled GitHub data…':'Loading unified model index…');
 try{
  const base=remote?'https://raw.githubusercontent.com/SEPULKRUM/casio-watch-specs/main/data/':'';
  const read=async name=>{const response=await fetch(base+name,{cache:'no-store'});if(!response.ok)throw Error(`Required search dataset ${name} returned ${response.status}.`);const text=await response.text(),digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text));return {data:JSON.parse(text),sha:[...new Uint8Array(digest)].map(b=>b.toString(16).padStart(2,'0')).join('')}};
  const [catalogArtifact,indexArtifact,reportArtifact]=await Promise.all([read('catalog.json'),read('search-index.json'),read('reconciliation-report.json')]);
  if(indexArtifact.data.catalog_sha256!==catalogArtifact.sha)throw Error('Catalog and search index are from different snapshots.');
  indexArtifact.data._sha256=indexArtifact.sha;installData(catalogArtifact.data,indexArtifact.data,reportArtifact.data);
  status(remote?'Latest reconciled GitHub data loaded':'Unified model index loaded');$('#updated').textContent=remote?'Refreshed just now · main branch':'Snapshot · 16 November 2026';
 }catch(error){if(data&&searchIndex)status('Refresh unavailable · keeping the complete saved search index');else{$('#load-error').hidden=false;$('#load-message').textContent=error.message;status('Unified index unavailable')}}finally{$('#refresh').disabled=false}
}

function renderMaster(){
 if(!masterResearch)return;
 const result=searchMaster(masterResearch,$('#master-query').value,$('#master-category').value,masterOffset),root=$('#master-results');root.replaceChildren();
 $('#master-status').textContent=`${masterResearch.counts.raw_references.toLocaleString()} raw references · ${masterResearch.counts.combined_fitment_references.toLocaleString()} combined fitment labels · ${masterResearch.counts.other_unresolved_individual_readings} other unresolved readings`;
 $('#master-count').textContent=result.total?`References ${result.offset+1}–${Math.min(result.offset+result.limit,result.total)} of ${result.total.toLocaleString()}`:'No matching supplied references';
 $('#master-prev').disabled=masterOffset===0;$('#master-next').disabled=masterOffset+result.limit>=result.total;
 for(const hit of result.rows){const row=expandMasterModel(masterResearch,hit.row),item=el('details'),summary=el('summary',row.model_id+' · '+(hit.category==='individual'?'supplied identifier':hit.category==='fitment'?'combined fitment reference':'unresolved raw reading'));item.append(summary,el('p',`Casio_Models_Master_Enriched.csv · row ${hit.csvRow}. Blank fields remain unknown; verification labels below are the compiler’s claims, not independent review.`,'source-location'));const body=el('div',undefined,'structured');structured(Object.fromEntries(Object.entries(row).filter(([,v])=>v!=='')),body);item.append(body);const mappings=masterResearch.relationships.filter(r=>r.model_id===row.model_id);if(mappings.length){item.append(el('strong','Separate model-to-module relationship rows'));const group=el('div',undefined,'structured');structured(mappings,group);item.append(group)}
 if(hit.category==='individual'){const use=el('button','Search this supplied identifier','text-button');use.type='button';use.addEventListener('click',()=>submitPrefix(row.model_id));item.append(use)}else item.append(el('p','Preserved intact; no canonical watch SKU or prefix meaning is inferred.','unknowns'));root.append(item)}
}
function renderMasterSources(){
 const notes=$('#master-cautions');notes.replaceChildren();for(const note of masterResearch.limits)notes.append(el('li',note));
 const corrections=$('#master-notes');corrections.replaceChildren();for(const note of masterResearch.report_notes)corrections.append(el('p',note.text+' · supplied report p.'+note.pdf_page));
 const modules=$('#master-modules');modules.replaceChildren();for(const row of masterResearch.modules){const item=el('details'),summary=el('summary','Module '+row.module_reference_number+' · supplied functions'),body=el('div',undefined,'structured');structured(Object.fromEntries(Object.entries(row).filter(([,v])=>v!=='')),body);item.append(summary,el('p','Unknown values are omitted. The compiler’s verification status does not make these independently reviewed facts.'),body);modules.append(item)}
 const sources=$('#master-sources');sources.replaceChildren();for(const row of masterResearch.source_register){const item=el('li',row.source_key+' — '+row.reference),url=row.reference.match(/https:\/\/[^\s;]+/)?.[0];if(url)item.append(document.createTextNode(' '),link('Open cited reference ↗',url));sources.append(item)}
 const differences=$('#master-comparisons');differences.replaceChildren();differences.append(el('p',masterResearch.comparisons.length+' wording or value differences: previous fields are preserved. Some reflect different wording or scope rather than factual contradictions.'));for(const row of masterResearch.comparisons){const item=el('details'),summary=el('summary',row.id+' · '+label(row.field)),body=el('div',undefined,'structured');structured(row,body);item.append(summary,body);differences.append(item)}
 for(const row of masterResearch.relationship_only_associations)differences.append(el('p',row.model_id+' — '+row.note+': '+row.module_ids.join(' / ')));
}
$('#master-query').addEventListener('input',()=>{masterOffset=0;renderMaster()});$('#master-category').addEventListener('change',()=>{masterOffset=0;renderMaster()});$('#master-prev').addEventListener('click',()=>{masterOffset=Math.max(0,masterOffset-40);renderMaster()});$('#master-next').addEventListener('click',()=>{masterOffset+=40;renderMaster()});
function renderWatchnavi(){const result=searchWatchnavi(watchnaviReference,$('#watchnavi-query').value,watchnaviOffset),root=$('#watchnavi-results');root.replaceChildren();$('#watchnavi-count').textContent=result.total?`Placements ${result.offset+1}–${Math.min(result.offset+result.limit,result.total)} of ${result.total}`:'No matching OCR placements';$('#watchnavi-prev').disabled=watchnaviOffset===0;$('#watchnavi-next').disabled=watchnaviOffset+result.limit>=result.total;
 for(const row of result.rows){const item=el('details'),summary=el('summary',`${row.printed_label} · ${row.year_heading} heading · printed p.${row.printed_page}`);item.append(summary,el('p',row.caption_lines.join(' ')),el('small',`Compilation PDF p.${row.extraction_pdf_page}; original PDF reference p.${row.original_pdf_page_reference}; placement ${row.placement_id}. Year heading and captions are unverified source transcription.`));if(row.feature_phrases.length)item.append(el('p','OCR feature phrases (not verified specifications): '+row.feature_phrases.join(' · ')));if(row.ocr_review_flag)item.append(el('p','Source OCR/review flag retained.','unknowns'));if(row.visual_check_reported_by_compilation)item.append(el('small','The compilation reports a visual model-code check; this does not verify the caption or features.'));if(row.normalized_identifier){const find=el('button','Search candidate identifier','text-button');find.type='button';find.addEventListener('click',()=>submitPrefix(row.normalized_identifier));item.append(find)}else item.append(el('small','No canonical identifier assigned; raw reading preserved without repair.'));root.append(item)}
}
$('#watchnavi-query').addEventListener('input',()=>{watchnaviOffset=0;renderWatchnavi()});$('#watchnavi-prev').addEventListener('click',()=>{watchnaviOffset=Math.max(0,watchnaviOffset-40);renderWatchnavi()});$('#watchnavi-next').addEventListener('click',()=>{watchnaviOffset+=40;renderWatchnavi()});
for(const note of watchnaviReference.limits)$('#watchnavi-cautions').append(el('li',note));for(const row of watchnaviReference.unresolved_labels)$('#watchnavi-unresolved').append(el('li',`${row.raw_label} · printed p.${row.printed_page}, grid ${row.row_column} · compilation p.${row.extraction_pdf_page}. Unresolved, not corrected.`));renderWatchnavi();
for(const note of catalogBatchReference.limits)$('#catalog-batch-cautions').append(el('li',note));for(const [key,catalog] of Object.entries(catalogBatchReference.catalogs)){const source=el('details'),summary=el('summary',catalogBatchReference.sources[key].filename+' · '+catalog.models.length+' listings');source.append(summary);for(let i=0;i<catalog.sections.length;i++){const section=catalog.sections[i],group=el('details'),heading=el('summary',section.collection+' · '+section.title);group.append(heading);for(const text of [...section.description,...section.reference_notes])group.append(el('p',text));group.append(el('small','Shared section context: apply only to subfamilies explicitly described, not every listed model.'));for(const row of catalog.models.filter(r=>r.section===i)){const item=el('details'),title=el('summary',row.printed_label),body=el('div',undefined,'structured');structured({...row.fields,extraction_pdf_page:row.extraction_pdf_page,original_catalog_pdf_page:row.original_pdf_page},body);item.append(title,body);if(row.uncertain_suffix)item.append(el('p','Suffix flagged CHECK in supplied extraction; exact association remains unverified.','unknowns'));const find=el('button','Find listing reference','text-button');find.type='button';find.addEventListener('click',()=>submitPrefix(row.id));item.append(find);group.append(item)}source.append(group)}const notes=el('details');notes.append(el('summary','Additional series-specific technical captions and source limits'));for(const row of catalog.technical_and_source_notes)notes.append(el('p',row.text+' · compilation p.'+row.extraction_pdf_page));source.append(notes);$('#catalog-batch-sources').append(source)}
for(const note of catalog2011Reference.limits)$('#catalog-2011-cautions').append(el('li',note));
for(const group of [...new Set(catalog2011Reference.watch_rows.map(r=>r.printed_group))]){const section=el('details'),rows=catalog2011Reference.watch_rows.filter(r=>r.printed_group===group),summary=el('summary',group+' · '+rows.length+' printed rows');section.append(summary);for(const row of rows){const item=el('details'),title=el('summary',row.printed_label),body=el('div',undefined,'structured');structured(row,body);const use=el('button','Find indexed reference','text-button');use.type='button';use.addEventListener('click',()=>submitPrefix(row.id));item.append(title,body,use);section.append(item)}$('#catalog-2011-watches').append(section)}
for(const row of catalog2011Reference.clock_rows){const item=el('details'),summary=el('summary',row.id),body=el('div',undefined,'structured');structured(row,body);const use=el('button','Find indexed clock','text-button');use.type='button';use.addEventListener('click',()=>submitPrefix(row.id));item.append(summary,body,use);$('#catalog-2011-clocks').append(item)}
for(const note of protrekReference.limits)$('#protrek-cautions').append(el('li',note));
for(const family of protrekReference.detailed_families){const item=el('details'),summary=el('summary',family.title+' · compilation p. '+family.extraction_pdf_page);item.append(summary);for(const text of family.details)item.append(el('p',text));const comparison=protrekReference.family_comparisons.find(r=>r.cells[0]===family.family);if(comparison){const body=el('div',undefined,'structured');structured(Object.fromEntries(comparison.columns.map((name,i)=>[name,comparison.cells[i]])),body);item.append(body)}$('#protrek-families').append(item)}
for(const row of protrekReference.models){const item=el('details'),summary=el('summary',row.cells[0]+' · '+row.cells[4]+' · compilation p. '+row.extraction_pdf_page),body=el('div',undefined,'structured');structured(Object.fromEntries(row.columns.map((name,i)=>[name,row.cells[i]])),body);const button=el('button','Find this exact reference','text-button');button.type='button';button.addEventListener('click',()=>submitPrefix(row.cells[0]));item.append(summary,body,button);$('#protrek-models').append(item)}
for(const row of protrekReference.spf_source_comparison){const item=el('details'),summary=el('summary',row.cells[0]),body=el('div',undefined,'structured');structured(Object.fromEntries(row.columns.map((name,i)=>[name,row.cells[i]])),body);item.append(summary,body);$('#protrek-spf').append(item)}
for(const [key,value] of Object.entries(protrekReference.source_register))$('#protrek-sources').append(el('li',key+' — '+value.filename+' · '+value.description));
for(const note of combinedReference.limits)$('#combined-cautions').append(el('li',note));
for(const table of combinedReference.tables){const group=el('details'),summary=el('summary',`${table.title||table.kind.replace(/_/g,' ')} · supplied compilation p. ${table.page} · ${table.rows.length} entries`),list=el('div',undefined,'structured');for(const row of table.rows){const item=el('details'),title=el('summary',row[0]),body=el('div',undefined,'structured');structured(Object.fromEntries(table.columns.map((name,i)=>[name,row[i]])),body);item.append(title,body);list.append(item)}group.append(summary,list);$('#combined-reference-tables').append(group)}
for(const row of combinedReference.reported_references){const item=el('li',row.label+' — '+row.status+' · compilation p. '+row.extraction_pdf_page);$('#combined-reported-list').append(item)}
for(const [key,value] of Object.entries(combinedReference.source_register))$('#combined-source-register').append(el('li',key+' — '+value));
for(const row of historicalReview){const item=el('li',`${row.reading} — possible module ${row.possible_module||'not established'} · ${row.catalog_year} catalog p. ${row.catalog_page} · extraction PDF p. ${row.extraction_pdf_page}. Visual review required; model identity and module assignment unconfirmed.`);$('#historical-review-list').append(item)}
for(const section of guideReferenceSections()){const group=el('details'),summary=el('summary',section.title),list=el('ul');for(const text of section.items)list.append(el('li',text));group.append(summary,list);$('#guide-reference').append(group)}
$('#decoder-disclosure').textContent=englishText(decoderDisclosure);for(const rule of decoderRules)$('#decoder-rules').append(el('li',rule));
$('#search-mode').addEventListener('change',()=>{state.mode=$('#search-mode').value;state.page=1;state.family='';installFamilies();render()});
$('#page-size').addEventListener('change',()=>{state.pageSize=Number($('#page-size').value);state.page=1;render()});$('#page-number').addEventListener('change',()=>{state.page=Number($('#page-number').value);render()});
$('#page-prev').addEventListener('click',()=>{state.page--;render()});$('#page-next').addEventListener('click',()=>{state.page++;render()});$('#page-first').addEventListener('click',()=>{state.page=1;render()});$('#page-last').addEventListener('click',()=>{state.page=Number($('#page-number').max);render()});
$('#prefix-form').addEventListener('submit',e=>{e.preventDefault();submitPrefix($('#prefix-input').value)});for(const b of document.querySelectorAll('[data-model]'))b.addEventListener('click',()=>submitPrefix(b.dataset.model));$('#prefix-input').addEventListener('input',e=>renderPrefix(e.target.value));$('#search').addEventListener('input',e=>{state.query=e.target.value;state.page=1;const decoded=decodeModel(state.query,data,references);if(decoded.recognized)$('#prefix-input').value=state.query;render()});$('#family-select').addEventListener('change',e=>setFamily(e.target.value));$('#verified').addEventListener('change',e=>{state.verified=e.target.checked;state.page=1;render()});$('#refresh').addEventListener('click',()=>load(true));$('#retry').addEventListener('click',()=>load());$('#reset').addEventListener('click',()=>{state={query:'',family:'',verified:false,mode:'models',page:1,pageSize:50};$('#search-mode').value='models';$('#page-size').value='50';installFamilies();$('#search').value='';$('#prefix-input').value='';$('#verified').checked=false;setFamily('')});$('#close').addEventListener('click',closeDetail);$('#detail').addEventListener('cancel',e=>{e.preventDefault();closeDetail()});$('#detail').addEventListener('click',e=>{if(e.target===$('#detail')){const r=$('#detail').getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right)closeDetail()}});window.addEventListener('hashchange',()=>{const id=readHash();if(id&&data)openModel(id,false);else closeDetail()});document.addEventListener('keydown',e=>{if(e.key==='/'&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName)&&!$('#detail').open){e.preventDefault();$('#search').focus()}});load();

function openResearch(scroll=true){const panel=document.querySelector("#research-sources");if(!panel)return;panel.open=true;if(scroll){panel.scrollIntoView({behavior:"smooth",block:"start"});panel.querySelector("summary")?.focus({preventScroll:true})}}
document.querySelector("#show-research")?.addEventListener("click",()=>openResearch());

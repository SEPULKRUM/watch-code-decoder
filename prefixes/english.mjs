// Display translations only. Original catalog values and evidence stay unchanged.
export const nonEnglishScript=/[\u3040-\u30ff\u3400-\u9fff\uac00-\ud7af]/;
const translations=[
 ['メタルバンド（チタンバンド／但し、中留二つ折れ部ステンレススチール）','Titanium band (stainless-steel folding clasp section)'],
 ['無垢バンド コンポジットバンド（メタル／樹脂） ワンプッシュ三つ折れ式中留','Solid-link composite band (metal / resin); one-touch three-fold clasp'],
 ['メタルバンド（チタンムクバンド）','Solid titanium band'],
 ['メタルバンド（ステンレススチール）','Stainless steel band'],
 ['両面反射防止コーティングサファイアガラス','Sapphire crystal with anti-reflective coating on both surfaces'],
 ['サファイアガラスベゼルリング','Sapphire glass bezel ring'],
 ['ケースサイズ（縦×横×厚さ）','Case size (length × width × thickness)'],
 ['精度・ワールドタイム機能・アラーム機能','Accuracy / world time / alarms'],
 ['日常生活用防水','Water resistant for everyday use (rating not specified)'],
 ['バイオマスプラスチック','bio-based plastic'],
 ['ケース・ベゼル材質','Case and bezel material'],
 ['ステンレススチール','Stainless steel'],
 ['ワールドタイム機能','World time'],
 ['球面・曲面ガラス','Spherical / curved glass'],
 ['サファイアガラス','Sapphire glass'],
 ['モジュール番号','Module number'],
 ['デュアルカーブ','Dual-curved'],
 ['トップページ','Home'],
 ['樹脂ガラス','Resin glass'],
 ['樹脂バンド','Resin band'],
 ['無機ガラス','Mineral glass'],
 ['製品仕様','Product specifications'],
 ['仕様一覧','Specifications'],
 ['ブラック','Black'],['ホワイト','White'],['レッド','Red'],['ブルー','Blue'],
 ['チタン','Titanium'],['樹脂','Resin'],['バンド','Band'],['ガラス','Glass'],
 ['防水性','Water resistance'],['質量','Weight'],['精度','Accuracy'],
].sort((a,b)=>b[0].length-a[0].length);
export function englishText(value){
 let text=String(value).replace(/colours?/gi,word=>word[0]==='C'?'Color'+(word.toLowerCase().endsWith('s')?'s':''):'color'+(word.toLowerCase().endsWith('s')?'s':''));
 if(!nonEnglishScript.test(text))return text;
 text=text.replace(/(\d+(?:\.\d+)?)気圧防水/g,'$1-bar water resistance');
 for(const [original,translated] of translations)text=text.split(original).join(translated);
 text=text.replace(/／/g,' / ').replace(/（/g,' (').replace(/）/g,')');
 return nonEnglishScript.test(text)?'English translation pending; see the linked source record.':text;
}

// Selected visual observations; source photographs are not embedded or republished.
const appearances=[
  {
    "model": "GW-B5600BC-1B",
    "aliases": [
      "GW-B5600BC-1B",
      "GW-B5600BC-1BER"
    ],
    "polarity": "negative",
    "accents": "Dark dial accents",
    "source": "https://www.casio.com/europe/watches/casio/product.GW-B5600BC-1B/",
    "evidence_class": "official_observed",
    "observation_method": "Visual observation of the official product image; not an explicit manufacturer suffix definition",
    "comparison_model": "GW-B5600BC-1"
  },
  {
    "model": "GW-B5600BC-1",
    "aliases": [
      "GW-B5600BC-1",
      "GW-B5600BC-1ER"
    ],
    "polarity": "positive",
    "accents": "Yellow/gold dial and bezel lettering accents",
    "source": "https://www.casio.com/europe/watches/gshock/product.GW-B5600BC-1/",
    "evidence_class": "official_observed",
    "observation_method": "Visual observation of the official product image; not an explicit manufacturer suffix definition",
    "comparison_model": "GW-B5600BC-1B"
  },
  {
    "model": "GW-M5610U-1B",
    "aliases": [
      "GW-M5610U-1B",
      "GW-M5610U-1BJF"
    ],
    "polarity": "negative",
    "accents": "Dark display surround with light markings",
    "source": "https://www.casio.com/jp/watches/gshock/product.GW-M5610U-1B/",
    "evidence_class": "official_observed",
    "observation_method": "Visual observation of the official product image; not an explicit manufacturer suffix definition",
    "comparison_model": "GW-M5610U-1"
  },
  {
    "model": "GW-M5610U-1",
    "aliases": [
      "GW-M5610U-1",
      "GW-M5610U-1JF"
    ],
    "polarity": "positive",
    "accents": "Red outline and coloured dial markings",
    "source": "https://www.casio.com/jp/watches/gshock/product.GW-M5610U-1/",
    "evidence_class": "official_observed",
    "observation_method": "Visual observation of the official product image; not an explicit manufacturer suffix definition",
    "comparison_model": "GW-M5610U-1B"
  },
  {
    "model": "GW-M5610-1B",
    "aliases": [
      "GW-M5610-1B",
      "GW-M5610-1BJF"
    ],
    "polarity": "negative",
    "accents": "Dark display surround with light markings",
    "source": "https://www.casio.com/jp/watches/gshock/product.GW-M5610-1B/",
    "evidence_class": "official_observed",
    "observation_method": "Visual observation of the official product image; not an explicit manufacturer suffix definition",
    "comparison_model": "GW-M5610-1"
  },
  {
    "model": "GW-M5610-1",
    "aliases": [
      "GW-M5610-1",
      "GW-M5610-1JF"
    ],
    "polarity": "positive",
    "accents": "Red outline and coloured dial markings",
    "source": "https://www.casio.com/jp/watches/gshock/product.GW-M5610-1/",
    "evidence_class": "official_observed",
    "observation_method": "Visual observation of the official product image; not an explicit manufacturer suffix definition",
    "comparison_model": "GW-M5610-1B"
  },
  {
    "model": "AE-1200WH-1BV",
    "aliases": [
      "AE-1200WH-1BV"
    ],
    "polarity": "positive",
    "accents": "Gold-tone dial accents and green map; light-background main LCD",
    "source": "https://www.casio.com/intl/watches/casio/product.AE-1200WH-1BV/",
    "evidence_class": "official_observed",
    "observation_method": "Visual observation of the official product image; not an explicit manufacturer suffix definition"
  },
  {
    "model": "F-91WM-1B",
    "aliases": [
      "F-91WM-1B"
    ],
    "polarity": "positive",
    "accents": "Metallic gray case and light-background LCD",
    "source": "https://www.casio.com/intl/watches/casio/product.F-91WM-1B/",
    "evidence_class": "official_observed",
    "observation_method": "Visual observation of the official product image; not an explicit manufacturer suffix definition"
  }
];
const compact=s=>String(s).toUpperCase().replace(/[^A-Z0-9]/g,'');
export function appearanceForModel(model){const key=compact(model);return appearances.find(row=>row.aliases.some(id=>compact(id)===key))||null}
export function variantOrderInterpretation(variant,order,appearance){
 if(variant!=='1'||order!=='B')return null;
 if(appearance?.polarity==='negative')return {status:'community_interpretation',title:'Colour variation · B',description:'Blackout / Black Accent — watch-community reading of -1B in this checked model line. Here it distinguishes the negative (inverted) LCD and darker display treatment from the positive-display -1 variant. This B is not the Bluetooth modifier before the series number.',source:appearance.source};
 if(appearance?.polarity==='positive')return {status:'unverified',title:'Colour / finish variation · B',description:'This checked -1B model has a positive LCD. Its B distinguishes a colour/finish configuration; the blackout / negative-display reading does not apply here. The precise official letter expansion is unverified.',source:appearance.source};
 return {status:'community_interpretation',title:'Colour variation · B',description:'In some digital Casio lines, -1B is read by the watch community as Blackout / Black Accent, often marking a negative LCD or darker dial treatment. This recurring pattern is not universal: this exact model’s appearance remains unverified. This B is not automatically Bluetooth.'};
}

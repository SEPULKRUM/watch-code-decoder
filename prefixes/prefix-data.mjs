import {ownerReadings,ownerReadingSource} from './owner-prefix-readings.mjs?v=7c8896384ae6cc00';
import {researchEntries} from './research-prefix-data.mjs?v=7c8896384ae6cc00';
// Family reference reused from SEPULKRUM/watch-code-decoder/prefixes (read-only).
// Additional catalog-backed EFB, BGD, BA and GD family associations.
const baseEntries=[
  [
    "Casio / G-SHOCK",
    "DW",
    "Digital family used by both G-SHOCK and earlier non-G-SHOCK Casio watches; exact model classification requires evidence",
    "DW-5600"
  ],
  [
    "G-SHOCK",
    "GA",
    "Analog-digital G-SHOCK family",
    "GA-2100"
  ],
  [
    "G-SHOCK",
    "G",
    "G-SHOCK models; features vary",
    "G-5600"
  ],
  [
    "G-SHOCK",
    "GW",
    "G-SHOCK models commonly featuring radio time reception",
    "GW-5000"
  ],
  [
    "G-SHOCK",
    "GMW",
    "Modern full-metal G-SHOCK family; historical GMW identifiers also occur and need exact-model context",
    "GMW-B5000"
  ],
  [
    "G-SHOCK",
    "MRG",
    "MR-G premium G-SHOCK",
    "MRG-B5000"
  ],
  [
    "G-SHOCK",
    "MTG",
    "MT-G premium G-SHOCK",
    "MTG-B3000"
  ],
  [
    "G-SHOCK",
    "GM",
    "Modern metal-covered G-SHOCK family; historical GM identifiers also occur and need exact-model context",
    "GM-2100"
  ],
  [
    "G-SHOCK",
    "GST",
    "G-STEEL family",
    "GST-B400"
  ],
  [
    "G-SHOCK",
    "GBD",
    "G-SQUAD fitness family",
    "GBD-200"
  ],
  [
    "G-SHOCK",
    "GBA",
    "G-SQUAD analog-digital family",
    "GBA-900"
  ],
  [
    "G-SHOCK",
    "GBX",
    "G-LIDE sports family",
    "GBX-100"
  ],
  [
    "G-SHOCK",
    "GWF",
    "FROGMAN family",
    "GWF-1000"
  ],
  [
    "G-SHOCK",
    "GG",
    "Modern MUDMASTER family; historical uses require exact-model evidence",
    "GG-B100"
  ],
  [
    "G-SHOCK",
    "GWG",
    "Modern MUDMASTER family; historical uses require exact-model evidence",
    "GWG-1000"
  ],
  [
    "G-SHOCK",
    "GPR",
    "RANGEMAN family",
    "GPR-B1000"
  ],
  [
    "G-SHOCK",
    "GX",
    "Oversized G-SHOCK family",
    "GX-56"
  ],
  [
    "G-SHOCK",
    "GR",
    "GRAVITYMASTER family",
    "GR-B200"
  ],
  [
    "G-SHOCK",
    "GWX",
    "G-LIDE radio-controlled solar models",
    "GWX-5600"
  ],
  [
    "G-SHOCK",
    "GWN",
    "GULFMASTER family",
    "GWN-1000"
  ],
  [
    "PRO TREK / PATHFINDER",
    "PRG",
    "PRO TREK outdoor watches",
    "PRG-240"
  ],
  [
    "PRO TREK / PATHFINDER",
    "PRW",
    "PRO TREK family commonly featuring radio-controlled, solar-powered timekeeping",
    "PRW-3500"
  ],
  [
    "PRO TREK / PATHFINDER",
    "PRT",
    "PRO TREK outdoor watches",
    "PRT-B50"
  ],
  [
    "PRO TREK / PATHFINDER",
    "PAG",
    "Pathfinder outdoor watches",
    "PAG-240"
  ],
  [
    "PRO TREK / PATHFINDER",
    "PAW",
    "Pathfinder radio-controlled watches",
    "PAW-1500"
  ],
  [
    "OCEANUS / LINEAGE",
    "OCW",
    "OCEANUS premium watches",
    "OCW-S7000"
  ],
  [
    "OCEANUS / LINEAGE",
    "OC",
    "Earlier OCEANUS watches",
    "OC-500"
  ],
  [
    "OCEANUS / LINEAGE",
    "LCW",
    "LINEAGE watches",
    "LCW-M100"
  ],
  [
    "OCEANUS / LINEAGE",
    "LIW",
    "LINEAGE watches",
    "LIW-M610"
  ],
  [
    "EDIFICE",
    "EF",
    "EDIFICE watches",
    "EF-527"
  ],
  [
    "EDIFICE",
    "EFR",
    "EDIFICE watches",
    "EFR-571"
  ],
  [
    "EDIFICE",
    "ECB",
    "EDIFICE connected watches",
    "ECB-900"
  ],
  [
    "EDIFICE",
    "EQB",
    "EDIFICE connected watches",
    "EQB-1000"
  ],
  [
    "EDIFICE",
    "EFS",
    "EDIFICE solar watches",
    "EFS-S570"
  ],
  [
    "BABY-G",
    "BG",
    "BABY-G digital family",
    "BG-169"
  ],
  [
    "BABY-G",
    "BGA",
    "BABY-G analog-digital family",
    "BGA-110"
  ],
  [
    "BABY-G",
    "MSG",
    "G-MS family",
    "MSG-B100"
  ],
  [
    "BABY-G",
    "BLX",
    "BABY-G G-LIDE family",
    "BLX-560"
  ],
  [
    "STANDARD / VINTAGE",
    "A",
    "Classic digital watches",
    "A168"
  ],
  [
    "STANDARD / VINTAGE",
    "AE",
    "Standard digital watches",
    "AE-1200"
  ],
  [
    "STANDARD / VINTAGE",
    "F",
    "Basic digital watches",
    "F-91W"
  ],
  [
    "STANDARD / VINTAGE",
    "W",
    "Standard digital watches",
    "W-800H"
  ],
  [
    "STANDARD / VINTAGE",
    "CA",
    "Calculator watches",
    "CA-53W"
  ],
  [
    "STANDARD / VINTAGE",
    "DBC",
    "Data Bank calculator watches",
    "DBC-32"
  ],
  [
    "STANDARD / VINTAGE",
    "DB",
    "Data Bank watches",
    "DB-36"
  ],
  [
    "STANDARD / VINTAGE",
    "MTP",
    "Standard analog watches",
    "MTP-1302"
  ],
  [
    "STANDARD / VINTAGE",
    "LTP",
    "Standard analog watches",
    "LTP-V007"
  ],
  [
    "STANDARD / VINTAGE",
    "WVA",
    "Wave Ceptor watches",
    "WVA-M640"
  ],
  [
    "STANDARD / VINTAGE",
    "WV",
    "Wave Ceptor digital watches",
    "WV-58"
  ],
  [
    "STANDARD / VINTAGE",
    "SGW",
    "Sports Gear sensor watches",
    "SGW-100"
  ],
  [
    "STANDARD / VINTAGE",
    "AQ",
    "Analog-digital watches",
    "AQ-230"
  ],
  [
    "STANDARD / VINTAGE",
    "LA",
    "Compact digital watches",
    "LA-20WH"
  ],
  [
    "STANDARD / VINTAGE",
    "LF",
    "Classic-style digital watches",
    "LF-20W"
  ],
  [
    "EDIFICE",
    "EFB",
    "EDIFICE model family; exact features depend on the model",
    "EFB-108D-1AV"
  ],
  [
    "BABY-G",
    "BGD",
    "BABY-G digital model family",
    "BGD-565"
  ],
  [
    "BABY-G",
    "BA",
    "Modern BABY-G analog-digital family; historical BA identifiers also occur and need exact-model context",
    "BA-110"
  ],
  [
    "G-SHOCK",
    "GD",
    "Modern G-SHOCK digital family; historical GD identifiers also occur and need exact-model context",
    "GD-010"
  ]
];

const existingEntries=[...baseEntries,...researchEntries];
const suppliedFamilies=ownerReadings.filter(r=>!r.code.includes('-')&&!existingEntries.some(e=>e[1]===r.code)).map(r=>['G-SHOCK / owner-supplied reference',r.code,r.context,r.code,{status:'community_interpretation',source:ownerReadingSource}]);
const masterFamilies=[['G-SHOCK','GAC','GAC-2500 chronograph family reported in the supplied 2026 research; exact source and model features remain pending independent review. Individual letter expansions are not inferred.','GAC-2500-1A',{status:'unverified',source:'https://github.com/SEPULKRUM/casio-watch-specs/blob/main/research/casio-master-research-2026-11-16.json'}]];
export const entries=[...existingEntries,...suppliedFamilies,...masterFamilies.filter(row=>![...existingEntries,...suppliedFamilies].some(e=>e[1]===row[1]))];

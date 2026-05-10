// Canonical figures + chart-ready time series.
// Direct mirror of dossier/numbers.md (snapshot 2026-05-09, ~80 numerical data points).
//
// Source-file abbreviations:
//   HOW   = how-trash-works-pristina.md
//   PDF2  = enrichment-summary-pdf2.md (INDEP/KAS April 2026)
//   PG-CE = enrichment-summary-pg-ce.md (GIZ MPG-CE / CE-PG deck, April 2026)
//   DYVO  = enrichment-summary-dyvo-plastic.md (DYVÓ 2023)
//   MAZ   = enrichment-summary-mazreku-newlaw.md (Mazreku/MMPHI late-2025 deck)

export const CONFIDENCE = {
  high:     'high',     // multiple sources agree
  medium:   'medium',   // single source, recent
  low:      'low',      // older or contested
  inferred: 'inferred', // derived, not directly cited
  tension:  'tension',  // value is in active tension — see tensionId for the disagreement
}

// ── 1. Waste generation + collection ─────────────────────────────────
export const wasteFigures = [
  { year: '2014',    metric: 'Total Kosovo waste generation',         value: '247,000 t',   src: 'DYVO',          confidence: 'medium' },
  { year: '2018',    metric: 'Total Kosovo waste generation',         value: '284,000 t',   src: 'DYVO',          confidence: 'medium' },
  { year: '2023',    metric: 'Total municipal waste generation',      value: '~490,000 t/yr', src: 'HOW',         confidence: 'tension', tensionId: 'tension-generation-vs-collection' },
  { year: '2023',    metric: 'Total municipal waste collected',       value: '471,278 t',   src: 'PDF2',          confidence: 'high', tensionId: 'tension-z' },
  { year: '2024',    metric: 'Total municipal waste collected',       value: '449,708 t',   src: 'PDF2',          confidence: 'high', tensionId: 'tension-z' },
  { year: '2024',    metric: 'Waste deposited at sanitary landfills', value: '468,112 t',   src: 'PDF2',          confidence: 'medium' },
  { year: '2023',    metric: 'Per capita generation (AMMK)',          value: '240 kg/yr',   src: 'PDF2',          confidence: 'high' },
  { year: '2024',    metric: 'Per capita generation (AMMK)',          value: '294 kg/yr',   src: 'PDF2',          confidence: 'high' },
  { year: '2023',    metric: 'Per capita generation (dossier)',       value: '~266 kg/yr (0.73 kg/day)', src: 'HOW', confidence: 'tension', tensionId: 'tension-3' },
  { year: '2014',    metric: 'Total Kosovo waste generation (DYVO methodology)', value: '247,000 t', src: 'DYVO', confidence: 'tension', tensionId: 'tension-z' },
  { year: '2018',    metric: 'Total Kosovo waste generation (DYVO methodology)', value: '284,000 t', src: 'DYVO', confidence: 'tension', tensionId: 'tension-z' },
  { year: '2023',    metric: 'Kosovo global ranking',                 value: '3rd worst — unsorted household waste', src: 'HOW', confidence: 'medium' },
  { year: '2023',    metric: 'Pristina population (city proper)',     value: '~200,000',    src: 'HOW',           confidence: 'medium' },
  { year: '2023',    metric: 'Pristina municipality population',      value: '~220,000',    src: 'HOW',           confidence: 'medium' },
]

// ── 2. Recycling rates + targets ─────────────────────────────────────
export const recyclingFigures = [
  { year: '2025',     metric: 'Kosovo current recycling rate',          value: '~3%',  src: 'HOW,PDF2', confidence: 'high' },
  { year: '2024',     metric: 'Western Balkans recycling rate (avg)',   value: '<3%',  src: 'PDF2',     confidence: 'high' },
  { year: '2024',     metric: 'EU average recycling rate',              value: '~44%', src: 'PDF2',     confidence: 'high' },
  { year: '2030/35',  metric: 'Kosovo recycling target (Strategy)',     value: '~50%', src: 'MAZ',      confidence: 'medium', tensionId: 'tension-x' },
  { year: '2030/35',  metric: 'Kosovo landfill share target',           value: '20%',  src: 'MAZ',      confidence: 'medium' },
  { year: '2023',     metric: 'Bio-waste currently separated/treated',  value: '~5%',  src: 'PDF2',     confidence: 'medium' },
  { year: 'ongoing',  metric: 'EU WEEE collection target',              value: '4 kg/capita/yr', src: 'PDF2', confidence: 'high' },
  { year: '2023→24',  metric: 'Plastic bag imports change',             value: '−68.4%', src: 'PDF2',   confidence: 'tension', tensionId: 'tension-plastic-bag-attribution' },
  { year: '2010-2020', metric: 'Previous strategy collection target',   value: '100% target → ~85% household / 54% business actual', src: 'HOW', confidence: 'medium' },
  // Global plastic baseline (DYVÓ — Geyer et al. 2017 cumulative, 1950-2015)
  { year: '2017 cum.', metric: 'Global virgin plastic produced (cumulative)', value: '8,300 Mt', src: 'DYVO', confidence: 'high' },
  { year: '2017 cum.', metric: 'Global plastic recycled rate',          value: '~9%',  src: 'DYVO', confidence: 'high' },
  { year: '2017 cum.', metric: 'Global plastic incinerated rate',       value: '~12%', src: 'DYVO', confidence: 'high' },
  { year: '2017 cum.', metric: 'Global plastic landfilled / environment', value: '~79%', src: 'DYVO', confidence: 'high' },
  { year: '2018',      metric: 'EU plastic from food packaging',        value: '39.9%', src: 'DYVO', confidence: 'high' },
]

// ── 3. Illegal landfills ─────────────────────────────────────────────
export const illegalLandfillFigures = [
  { year: '2017', metric: 'Illegal landfills (count)',                          value: '2,246',                src: 'PG-CE,HOW',     confidence: 'high' },
  { year: '2021', metric: 'Illegal dumpsites (joint AMMK/GIZ study)',           value: '1,572 across 38 munis', src: 'HOW',          confidence: 'medium' },
  { year: '2022', metric: 'Illegal landfills (count)',                          value: '763',                  src: 'PG-CE',         confidence: 'high' },
  { year: '2023', metric: 'Illegal landfills (AMMK official)',                  value: '403',                  src: 'HOW,PDF2,PG-CE', confidence: 'high' },
  { year: '2024', metric: 'Illegal dumpsites (AMMK official)',                  value: '458',                  src: 'HOW,PDF2,PG-CE', confidence: 'high' },
  { year: '2025', metric: "Illegal landfills (Let's Do It Kosovo current)",     value: '500+',                 src: 'HOW',           confidence: 'low' },
  { year: '2024', metric: 'Illegal landfills (BIRN regional mapping)',          value: '1,500+',               src: 'HOW',           confidence: 'low' },
  { year: '2023', metric: 'Prizren — highest illegal landfill count',           value: '187',                  src: 'HOW',           confidence: 'medium' },
  { year: '2023', metric: 'Gjakovë — lowest illegal landfill count',            value: '37',                   src: 'HOW',           confidence: 'medium' },
]

// ── 4. Money flows ───────────────────────────────────────────────────
export const moneyFigures = [
  { year: '2025',       metric: 'Pastrimi monthly fee per household (with VAT)', value: '€6.20', src: 'HOW', confidence: 'high' },
  { year: '2023',       metric: 'Household billing revenue (national)',          value: '€19.0M', src: 'PDF2', confidence: 'medium' },
  { year: '2024',       metric: 'Household billing revenue (national)',          value: '€20.2M', src: 'PDF2', confidence: 'medium' },
  { year: '2024',       metric: 'Pastrimi alleged 2024 losses from non-registration', value: '€3.5M', src: 'HOW', confidence: 'medium' },
  { year: 'Apr 2025',   metric: 'Pastrimi unpaid debt — early April',            value: '€2.0M',  src: 'HOW', confidence: 'medium' },
  { year: 'Apr 2025',   metric: 'Pastrimi unpaid debt — late April',             value: '€2.2M',  src: 'HOW', confidence: 'medium' },
  { year: '2025',       metric: 'Pastrimi unpaid debt — later',                  value: '€2.5M',  src: 'HOW', confidence: 'medium' },
  { year: 'Feb 2025',   metric: 'Municipality debt to Pastrimi (claimed)',       value: '€2.7M',  src: 'HOW', confidence: 'medium' },
  { year: '2025',       metric: 'Pastrimi debt to KLMC (tipping fees)',          value: '~€1.9M', src: 'HOW', confidence: 'high' },
  { year: '2025',       metric: 'Municipality private operator tender',          value: '€16M',   src: 'HOW', confidence: 'low' },
  { year: '2025',       metric: 'Pastrimi annual revenue at full collection',    value: '€7-8M (est.)', src: 'HOW', confidence: 'low' },
  { year: '2004-06',    metric: 'Mirash construction cost',                      value: '~€3.5M', src: 'HOW', confidence: 'medium' },
  { year: '2025',       metric: 'Citizens who paid Municipality during dispute', value: '~21,000', src: 'HOW', confidence: 'medium' },
  { year: '2023',       metric: 'Pastrimi-submitted new clients (June 2023)',    value: '~25,000 (not registered by Municipality)', src: 'HOW', confidence: 'medium' },
  { year: '2020-22',    metric: 'MPG-CE program total',                          value: '€7M',    src: 'PG-CE', confidence: 'high' },
  { year: '2024-27',    metric: 'CE-PG proposed',                                value: '€20M',   src: 'PG-CE', confidence: 'high' },
  { year: 'total',      metric: 'KIWMS total implementation budget',             value: '€105.15M', src: 'PG-CE', confidence: 'high' },
  { year: '2024-26',    metric: 'Kosovo Action Plan (waste + CE)',               value: '€41M',   src: 'PDF2', confidence: 'high' },
  { year: 'through 2030', metric: 'Total Kosovo CE investments planned',         value: '€77M',   src: 'PDF2', confidence: 'high' },
  { year: '2024-27',    metric: 'EU Reform & Growth Facility (Western Balkans)', value: '€6 billion', src: 'PDF2', confidence: 'high' },
  { year: '2023',       metric: 'CDW removal cost (per construction container)', value: '~€80 / 8-10 m³', src: 'HOW', confidence: 'medium' },
  { year: '2023',       metric: 'Kosovo GDP',                                    value: '€9.7 billion', src: 'PDF2', confidence: 'high' },
  { year: '2023',       metric: 'Kosovo sector mix',                             value: 'services 57.5% / industry 32.8% / agriculture 9.7%', src: 'PDF2', confidence: 'high' },
  { year: '2030',       metric: 'EU CE measures projected GDP increase',         value: '~+0.5% by 2030', src: 'PDF2', confidence: 'high' },
  { year: '2030',       metric: 'EU new jobs projected from CE measures',        value: 'up to 700,000', src: 'PDF2', confidence: 'high' },
  { year: 'design',     metric: 'Product environmental impact determined at design stage', value: '80%', src: 'PDF2', confidence: 'high' },
]

// ── 5. Equipment + infrastructure ────────────────────────────────────
export const equipmentFigures = [
  { year: '2025', metric: 'Pastrimi household waste trucks',     value: '14',  src: 'HOW',  confidence: 'high' },
  { year: '2025', metric: 'Pastrimi business waste trucks',      value: '3',   src: 'HOW',  confidence: 'high' },
  { year: '2025', metric: 'Pastrimi trucks in process of purchase', value: '10', src: 'HOW', confidence: 'high' },
  { year: '2024', metric: 'JICA grant aid total',                value: '543M JPY / €4.83M', src: 'HOW', confidence: 'high' },
  { year: '2024', metric: 'JICA total compactor trucks',         value: '~40 (Pastrimi 10 + Ekoregjioni ~30)', src: 'HOW', confidence: 'high' },
  { year: '2020-22', metric: 'MPG-CE collection trucks delivered', value: '23', src: 'PG-CE', confidence: 'high' },
  { year: '2020-22', metric: 'MPG-CE skipper trucks',            value: '4',     src: 'PG-CE', confidence: 'high' },
  { year: '2020-22', metric: 'MPG-CE sweeping machines',         value: '11',    src: 'PG-CE', confidence: 'high' },
  { year: '2020-22', metric: 'MPG-CE tractors',                  value: '3',     src: 'PG-CE', confidence: 'high' },
  { year: '2020-22', metric: 'MPG-CE 240L containers',           value: '3,000', src: 'PG-CE', confidence: 'high' },
  { year: '2020-22', metric: 'MPG-CE 120L containers',           value: '11,000', src: 'PG-CE', confidence: 'high' },
  { year: '2020-22', metric: 'MPG-CE 1.1m³ containers',          value: '2,400', src: 'PG-CE', confidence: 'high' },
  { year: '2020-22', metric: 'MPG-CE total containers delivered', value: '16,400', src: 'PG-CE', confidence: 'high' },
  { year: '2020-22', metric: 'MPG-CE home composters',           value: '3,500', src: 'PG-CE', confidence: 'high' },
  { year: '2020-22', metric: 'MPG-CE target municipalities',     value: '38 (all)', src: 'PG-CE', confidence: 'high' },
  { year: '2020-22', metric: 'MPG-CE awarded municipalities',    value: '24 of 38 (~63%)', src: 'PG-CE', confidence: 'high' },
  { year: '2017→21', metric: 'New households added to formal collection', value: '70,000+', src: 'PG-CE', confidence: 'medium' },
  { year: '2021', metric: 'Households with separate collection (17 munis)', value: '30,162', src: 'PG-CE', confidence: 'medium' },
  { year: '2024', metric: 'Mirash annual intake',                value: '~160,000 t', src: 'HOW', confidence: 'medium' },
  { year: '2015', metric: 'Mirash share of national waste',      value: '~one-third (~100,000 t in 2015)', src: 'HOW', confidence: 'low' },
  { year: '2024', metric: 'Mirash size',                         value: '7 hectares (~10 football pitches)', src: 'HOW', confidence: 'medium' },
  { year: '2018-25', metric: 'Mirash methane projection (academic IPCC/LandGEM)', value: '50.74-53.74 Gg', src: 'HOW', confidence: 'low' },
  { year: '2024', metric: 'Mirash "landfill lake" rise rate',    value: '>1 m / year', src: 'HOW', confidence: 'medium' },
  { year: '2008', metric: 'Public landfills constructed (EU-funded)', value: '7 (2001-2008)', src: 'HOW', confidence: 'high' },
  { year: '2024', metric: 'Public landfills with leachate treatment', value: '0', src: 'HOW', confidence: 'high' },
  { year: '2024', metric: 'Public landfills with integrated env permits', value: '0', src: 'HOW', confidence: 'high' },
]

// ── 6. Industrial waste streams ──────────────────────────────────────
export const industrialFigures = [
  { year: '2023',    metric: 'CDW annual generation (MMPHI)',       value: '~167,900 t/yr', src: 'HOW',  confidence: 'medium' },
  { year: '2016-20', metric: 'CDW (cumulative 5-year)',             value: '~863,000 t',    src: 'PDF2', confidence: 'high' },
  { year: 'annual',  metric: 'Thermal power plant ash',             value: '>1 million t/yr', src: 'PDF2', confidence: 'medium' },
  { year: 'historical', metric: 'Trepça mining accumulated waste',  value: '~60 million t', src: 'PDF2', confidence: 'medium' },
]

// ── 7. Comparative / EU benchmarks ───────────────────────────────────
export const benchmarkFigures = [
  { year: '2024', metric: 'Resource productivity — Western Balkans', value: '€0.35 / kg consumed', src: 'PDF2', confidence: 'high' },
  { year: '2024', metric: 'Resource productivity — EU average',      value: '€2.07 / kg consumed', src: 'PDF2', confidence: 'high' },
  { year: '2024', metric: 'Resource productivity gap',               value: '~6× (EU vs WB)',      src: 'PDF2', confidence: 'high' },
]

// ── 8. Survey / civil society counts ─────────────────────────────────
export const surveyFigures = [
  { year: '2025', metric: 'Pastrimi employees',                    value: '800-900 (most cite ~900)', src: 'HOW', confidence: 'high' },
  { year: '2025', metric: 'Pastrimi clients (Pastrimi count)',     value: '~95,000',                   src: 'HOW', confidence: 'high' },
  { year: '2025', metric: 'Pastrimi clients (Municipality count)', value: '~72,000',                   src: 'HOW', confidence: 'high' },
  { year: '2025', metric: 'Client register gap',                   value: '~23,000',                   src: 'HOW', confidence: 'high' },
  { year: '2023', metric: 'DYVÓ survey respondents',               value: 'n=150',                     src: 'DYVO', confidence: 'high' },
  { year: '2023', metric: 'DYVÓ largest age cohort in survey',     value: '21-25 (15.3%)',             src: 'DYVO', confidence: 'high' },
  { year: '2023', metric: 'DYVÓ municipalities covered (focus groups)', value: '7 (Pristina, Prizren, Peja, Gjakova, Gjilan, Ferizaj, Mitrovica)', src: 'DYVO', confidence: 'high' },
  { year: '2023', metric: 'Informal waste-picker daily yield',     value: '~100 kg → ~€15',            src: 'HOW', confidence: 'medium' },
]

// ── 9. Performance indicators ────────────────────────────────────────
export const performanceFigures = [
  { year: '2017', metric: 'Fee collection rate',                            value: '80.64%', src: 'PG-CE', confidence: 'high' },
  { year: '2021', metric: 'Fee collection rate',                            value: '81.80%', src: 'PG-CE', confidence: 'high' },
  { year: '2023', metric: 'Collection efficiency',                          value: '89%',    src: 'PDF2',  confidence: 'high' },
  { year: '2024', metric: 'Collection efficiency',                          value: '90.4%',  src: 'PDF2',  confidence: 'high' },
  { year: '2023', metric: 'Compliance with planning requirements',          value: '66%',    src: 'PDF2',  confidence: 'high' },
  { year: '2024', metric: 'Compliance with planning requirements',          value: '65%',    src: 'PDF2',  confidence: 'high' },
  { year: '2017', metric: 'Municipalities reporting annually to AMMK/KEPA', value: '3 of 38', src: 'PG-CE', confidence: 'high' },
  { year: '2021', metric: 'Municipalities reporting annually to AMMK/KEPA', value: '35 of 38', src: 'PG-CE', confidence: 'high' },
  { year: '2024', metric: 'Public landfills (2001-2008) operating beyond planned lifespan', value: 'most', src: 'HOW', confidence: 'high' },
  { year: '2020 vs 2019', metric: 'Pristina region waste collection growth', value: '+2.2%', src: 'DYVO', confidence: 'medium' },
  { year: '2020 vs 2019', metric: 'Other regions waste collection growth',   value: '+0.5%', src: 'DYVO', confidence: 'medium' },
]

// ── 10. Key dates + legislative timeline ─────────────────────────────
export const timelineEvents = [
  { date: '24 May 2012',    event: 'Kosovo Waste Law No. 04/L-060 enacted',                                  src: 'HOW,DYVO', confidence: 'high' },
  { date: 'May 2021',       event: 'MMPHI adopts Kosovo Integrated Waste Management Strategy 2021-2030',     src: 'HOW',  confidence: 'high' },
  { date: '2022',           event: 'Law amending Law on Waste 08/L-071',                                     src: 'DYVO', confidence: 'medium' },
  { date: 'April 2024',     event: 'Strategy revised; current version 2024-2030',                            src: 'PDF2', confidence: 'medium', tensionId: 'tension-x' },
  { date: 'October 2024',   event: 'Concept Document on Integrated Waste Management Reform endorsed',         src: 'MAZ',  confidence: 'medium' },
  { date: '1 December 2023', event: 'Pristina Waste Management Regulation No. 01-030/01-227581/23 (original)', src: 'HOW',  confidence: 'high' },
  { date: '5 December 2024', event: 'Pristina Municipal Assembly amends regulation (PDK + VV bloc)',         src: 'HOW',  confidence: 'high' },
  { date: '6 December 2024', event: 'Amendment recorded as no. 01-030/01-161704/24',                         src: 'HOW',  confidence: 'high' },
  { date: 'December 2024',  event: 'Strategy 2024-2035 approved by Government (per Mazreku)',                src: 'MAZ',  confidence: 'tension', tensionId: 'tension-x' },
  { date: '1 January 2025', event: 'Pastrimi begins billing citizens directly',                              src: 'HOW',  confidence: 'high' },
  { date: '5 February 2025', event: 'Municipality announces citizens not obligated to pay Pastrimi',         src: 'HOW',  confidence: 'high' },
  { date: 'Mid-Feb 2025',   event: 'Pastrimi halts collection; emergency declared',                          src: 'HOW',  confidence: 'high' },
  { date: '19 May 2025',    event: 'Ombudsperson convenes meeting (Reçica attends; Mayor Rama absent)',      src: 'HOW',  confidence: 'high' },
  { date: 'Early June 2025', event: 'Supreme Court of Kosovo upholds the regulation',                        src: 'HOW',  confidence: 'high' },
  { date: '24 June 2025',   event: 'Pastrimi worker protest at company building',                            src: 'HOW',  confidence: 'high' },
  { date: '25 June 2025',   event: 'Mediation: Municipality returns €2.7M to Pastrimi; strike ends',         src: 'HOW',  confidence: 'high' },
  { date: '2024',           event: 'DRS secondary legislation passed',                                       src: 'PDF2', confidence: 'medium' },
  { date: '2024',           event: 'Plastic bag Administrative Order (Order 04/2025 cited; date contested)', src: 'PDF2', confidence: 'tension', tensionId: 'tension-plastic-bag-attribution' },
  { date: 'Jan 2025',       event: 'DRS rollout planned (launch status unverified — see Tension Y)',         src: 'PDF2', confidence: 'tension', tensionId: 'tension-y' },
  { date: 'Late 2025',      event: 'Mayor Përparim Rama (LDK) wins Pristina runoff',                         src: 'HOW',  confidence: 'high' },
  { date: 'Nov-Dec 2025',   event: 'Drafting + finalization of new Law on Integrated Waste Management',      src: 'MAZ',  confidence: 'medium' },
  { date: 'Jan 2026',       event: 'Mayor Rama has not yet presented governing cabinet (per KOHA)',          src: 'HOW',  confidence: 'medium' },
  { date: 'Feb-Mar 2026',   event: 'New Law: Government approval (planned)',                                 src: 'MAZ',  confidence: 'medium' },
  { date: 'Aug-Sep 2026',   event: 'New Law: Assembly approval (planned)',                                   src: 'MAZ',  confidence: 'medium' },
  { date: 'Feb-Mar 2027',   event: 'Secondary legislation incl. EPR (planned)',                              src: 'MAZ',  confidence: 'medium' },
]

// ── 11. Time-series chart-ready data ─────────────────────────────────
//
// Series A — Waste service coverage (national, 2016-2024)
// Series B — Illegal landfills count 2017-2024
// Series C — Per-capita waste generation 2014-2024
// Series D — Recycling rate: current vs target

export const series = [
  {
    id: 'A',
    title: 'Waste service coverage (national)',
    metric: 'coverage',
    unit: 'percent',
    points: [
      { year: '2016', value: 54.0, src: 'PG-CE' },
      { year: '2017', value: 70.9, src: 'PG-CE' },
      { year: '2021', value: 90.2, src: 'PG-CE' },
      { year: '2023', value: 93.6, src: 'PDF2' },
      { year: '2024', value: 90.9, src: 'PDF2' },
    ],
    note: 'Coverage rose steeply between 2016 and 2021 (~+36 pts), driven by MPG-CE expansion. Slight 2023→2024 dip is real but the long arc is dramatically upward.',
  },
  {
    id: 'B',
    title: 'Illegal landfills (count)',
    metric: 'illegal_landfills',
    unit: 'count',
    points: [
      { year: '2017', value: 2246, src: 'PG-CE/HOW (AMMK)' },
      { year: '2021', value: 1572, src: 'HOW (joint AMMK/GIZ)', note: 'Different methodology' },
      { year: '2022', value: 763,  src: 'PG-CE' },
      { year: '2023', value: 403,  src: 'PDF2/PG-CE/HOW (AMMK)' },
      { year: '2024', value: 458,  src: 'PDF2/PG-CE/HOW (AMMK)' },
    ],
    note: '~80% decline 2017-2023 followed by small uptick. Civil-society counts (Let\'s Do It Kosovo: 500+; BIRN regional: 1,500+) suggest official figures may undercount.',
  },
  {
    id: 'C',
    title: 'Per-capita waste generation',
    metric: 'per_capita_generation',
    unit: 'kg/yr',
    points: [
      { year: '2023', value: 240, src: 'PDF2 (AMMK)' },
      { year: '2023', value: 266, src: 'HOW (dossier 0.73 kg/day)', note: 'Different methodology — see tensions Tension 3' },
      { year: '2024', value: 294, src: 'PDF2 (AMMK)' },
    ],
    target: { year: 'see-strategy', value: null, description: 'Strategy aims to reduce growth via prevention; no specific kg/cap cap published' },
    note: 'Trend is rising — generation climbs as incomes rise. Use INDEP/KAS series.',
    tensionId: 'tension-3',
  },
  {
    id: 'D',
    title: 'Recycling rate: current vs target',
    metric: 'recycling_rate',
    unit: 'percent',
    points: [
      { year: 'current (2024-25)', value: 3, src: 'HOW,PDF2' },
      { year: 'WB avg',            value: 2, src: 'PDF2', note: '<3%' },
      { year: 'EU avg',            value: 44, src: 'PDF2' },
    ],
    target: { year: '2030/35', value: 50, description: 'Strategy target: 24.8% sorting/MBT + 9.5% AD/composting + 6.3% RDF/WtE + 6.2% AD + 3.3% other' },
    note: '47-percentage-point gap to close. Depends on DRS launch, EPR systems, MRF infrastructure (currently zero), source separation enforcement.',
    tensionId: 'tension-x',
  },
]

// Aggregate all figures for sim-team consumption
export const allFigures = [
  ...wasteFigures,
  ...recyclingFigures,
  ...illegalLandfillFigures,
  ...moneyFigures,
  ...equipmentFigures,
  ...industrialFigures,
  ...benchmarkFigures,
  ...surveyFigures,
  ...performanceFigures,
]

export function getSeries(id) {
  return series.find(s => s.id === id) ?? null
}

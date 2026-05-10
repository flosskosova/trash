// Tensions and unresolved disagreements between dossier sources.
// Direct mirror of dossier/tensions.md (snapshot 2026-05-09).
//
// Each entry connects a contested fact to the actor nodes / edges it touches,
// so the UI can render a ⚠ badge and link out to the underlying dossier section.

export const TENSION_STATUS = {
  resolved: 'resolved',
  open:     'open',
  reframed: 'reframed',
}

export const tensions = [
  {
    id: 'tension-1',
    title: 'Service coverage figures',
    status: 'resolved',
    shortDescription: 'Dossier (50-85% range) and INDEP/KAS (93.6%) seemed to disagree. GIZ MPG-CE deck reconciled them as a time series — both correct at different time points.',
    affects: {
      nodeIds: ['ammk', 'mmphi'],
      statLabels: ['Waste service coverage'],
    },
    sources: [
      { abbr: 'HOW',   citation: 'Heinrich Böll 2022; Prishtina Insight 2025' },
      { abbr: 'PDF2',  citation: 'INDEP/KAS doc, AMMK 2025 figures' },
      { abbr: 'PG-CE', citation: 'GIZ MPG-CE deck, 2017-2024 series' },
    ],
    reading: 'Coverage 54% (2016) → 70.9% (2017) → 90.2% (2021) → 93.6% (2023) → 90.9% (2024). Use the time series, not any single number.',
    dossierAnchor: 'tensions.md#tension-1-service-coverage-figures-resolved',
  },
  {
    id: 'tension-generation-vs-collection',
    title: 'NOT a tension: generation vs collection (different metrics)',
    status: 'reframed',
    shortDescription: 'Dossier says ~490,000 t/yr generated (2023); INDEP/KAS says 471,278 t collected (2023). These measure different things.',
    affects: {
      nodeIds: ['ammk', 'mirash'],
      statLabels: ['Annual waste generation', 'Total municipal waste collected'],
    },
    sources: [
      { abbr: 'HOW',  citation: 'Heinrich Böll 2022 (generation)' },
      { abbr: 'PDF2', citation: 'AMMK 2025 (collected)' },
    ],
    reading: '~490k generated minus ~471k collected = ~19k tonnes uncollected. Roughly 96% formal capture rate. Use both — they complement each other.',
    dossierAnchor: 'tensions.md#not-a-tension-different-metrics--generation-vs-collection',
  },
  {
    id: 'tension-3',
    title: 'Per-capita generation',
    status: 'open',
    shortDescription: 'Dossier: ~266 kg/yr (2023). INDEP/KAS: 240 kg (2023), 294 kg (2024). Trend is rising — generation climbs as incomes rise, which the dossier did not flag.',
    affects: {
      nodeIds: ['citizens'],
      statLabels: ['Per-capita generation'],
    },
    sources: [
      { abbr: 'HOW',  citation: 'Heinrich Böll 2022 (0.73 kg/day)' },
      { abbr: 'PDF2', citation: 'INDEP/KAS / AMMK 2025' },
    ],
    reading: 'Use the INDEP/KAS series. The trend is rising: 240 → 294 kg per person per year (2023 → 2024).',
    dossierAnchor: 'tensions.md#tension-3-per-capita-generation',
  },
  {
    id: 'tension-x',
    title: 'Strategy date — 2024-2030 vs 2024-2035',
    status: 'open',
    shortDescription: 'INDEP/KAS extraction cites the strategy as 2024-2030 (revised April 2024). Mazreku/MMPHI deck cites it as 2024-2035, approved December 2024.',
    affects: {
      nodeIds: ['mmphi', 'cg'],
      statLabels: ['National waste strategy', 'Current strategy'],
    },
    sources: [
      { abbr: 'PDF2', citation: 'enrichment-summary-pdf2.md §5' },
      { abbr: 'MAZ',  citation: 'enrichment-summary-mazreku-newlaw.md §3, slide 4' },
    ],
    reading: 'Possible reconciliations: (a) 2024-2030 = Action Plan, 2024-2035 = full Strategy; (b) two approval events (April + December 2024); (c) a revision extending end-date. Verify against the official MMPHI document before citing either as canonical.',
    dossierAnchor: 'tensions.md#tension-x-strategy-date--2024-2030-vs-2024-2035',
  },
  {
    id: 'tension-y',
    title: 'DRS readiness gap',
    status: 'open',
    shortDescription: 'INDEP/KAS: secondary legislation passed 2024, planned launch January 2025. Mazreku/MMPHI: DRS legal base in the new Law (Government approval Feb-Mar 2026; secondary legislation Feb-Mar 2027).',
    affects: {
      nodeIds: ['mmphi', 'mint', 'pro'],
      statLabels: ['DRS launch status'],
    },
    sources: [
      { abbr: 'PDF2', citation: 'INDEP/KAS doc' },
      { abbr: 'MAZ',  citation: 'Mazreku deck §6' },
    ],
    reading: 'The 2024 legislation was likely incomplete or insufficient — the new Law replaces or strengthens it. Most likely the planned January 2025 launch slipped or launched in a partial form. Open verification issue #4.',
    dossierAnchor: 'tensions.md#tension-y-drs-readiness-gap',
  },
  {
    id: 'tension-z',
    title: 'Methodology shift in waste-generation figures',
    status: 'open',
    shortDescription: 'DYVÓ: 247,000 t (2014), 284,000 t (2018). INDEP/KAS: 471,278 t collected (2023), 449,708 t (2024). The 2018 → 2023 jump (+66%) is implausibly large as pure generation increase.',
    affects: {
      nodeIds: ['ammk'],
      statLabels: ['Total Kosovo waste generation', 'Total municipal waste collected'],
    },
    sources: [
      { abbr: 'DYVO', citation: 'AMMK Environmental Indicators 2018 (via DYVÓ)' },
      { abbr: 'PDF2', citation: 'AMMK 2025 (via INDEP/KAS)' },
    ],
    reading: 'Most likely a real-but-amplified rise: actual generation did climb, but the headline +66% is partly an artefact of broader collection coverage (MPG-CE expansion 2017-2021) and a possible methodology shift. Don\'t use as a single trend line.',
    dossierAnchor: 'tensions.md#tension-z-methodology-shift-in-waste-generation-figures',
  },
  {
    id: 'tension-plastic-bag-attribution',
    title: 'Plastic bag imports −68.4% — attribution to Order 04/2025',
    status: 'open',
    shortDescription: 'INDEP/KAS attributes a 2023→2024 plastic-bag-imports drop of 68.4% to Administrative Order 04/2025. A 2025-numbered order can\'t have caused a 2023-2024 drop.',
    affects: {
      nodeIds: ['mmphi', 'mint'],
      statLabels: ['Plastic bag imports change'],
    },
    sources: [
      { abbr: 'PDF2', citation: 'INDEP/KAS doc p.21' },
    ],
    reading: 'Possible reconciliations: (a) Order 04/2025 codifies a 2023 or 2024 precursor with a different number; (b) the import drop was driven by import-tariff changes pre-dating the named order. Verify against the underlying admin order text before citing.',
    dossierAnchor: 'enrichment-summary-pdf2.md#6-documents-diagnosis-of-the-system',
  },
]

export function getTension(id) {
  return tensions.find(t => t.id === id) ?? null
}

export function getTensionsForNode(nodeId) {
  return tensions.filter(t => t.affects?.nodeIds?.includes(nodeId))
}

export function getTensionsForStat(statLabel) {
  return tensions.filter(t => t.affects?.statLabels?.some(l =>
    statLabel.toLowerCase().includes(l.toLowerCase()) ||
    l.toLowerCase().includes(statLabel.toLowerCase())
  ))
}

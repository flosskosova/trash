// Acronym glossary — direct mirror of dossier/acronyms.md (snapshot 2026-05-09).
// Pure data export. Not yet wired into UI; available for components/sim team to import.

export const ACRONYM_CATEGORIES = {
  'gov-kosovo':        'Government — Kosovo',
  operators:           'Operators',
  programs:            'Programs / Schemes',
  imc:                 'Inter-municipal architecture',
  infrastructure:      'Infrastructure types',
  streams:             'Streams / EU streams',
  'eu-policy':         'EU / international policy',
  'tech-policy':       'Technical / policy concepts',
  data:                'Data / monitoring',
  donors:              'Donors / institutions',
  parties:             'Political parties (Kosovo)',
  demographics:        'Communities / demographics',
  whiteboard:          'Whiteboard / informal references',
}

export const acronyms = [
  // ── Government — Kosovo ─────────────────────────────────────────────
  { short: 'MMPHI',    full: 'Ministria e Mjedisit, Planifikimit Hapësinor dhe Infrastrukturës', english: 'Ministry of Environment, Spatial Planning and Infrastructure', category: 'gov-kosovo', note: 'Lead waste-policy authority. Albanian form.' },
  { short: 'MESPI',    full: 'Ministry of Environment, Spatial Planning and Infrastructure', english: 'Ministry of Environment, Spatial Planning and Infrastructure', category: 'gov-kosovo', note: 'English form used by GIZ + EU partners. Same institution as MMPHI.' },
  { short: 'MLGA',     full: 'Ministry of Local Government Administration', category: 'gov-kosovo' },
  { short: 'MRD',      full: 'Ministry of Regional Development', category: 'gov-kosovo' },
  { short: 'AMMK',     full: 'Agjencia për Mbrojtjen e Mjedisit të Kosovës', english: 'Kosovo Environmental Protection Agency', category: 'gov-kosovo', note: 'Also written KEPA. Operates under MMPHI.' },
  { short: 'MINT',     full: 'Ministria e Industrisë, Ndërmarrësisë dhe Tregtisë', english: 'Ministry of Industry, Entrepreneurship and Trade', category: 'gov-kosovo' },
  { short: 'KAS-stat', full: 'Agjencia e Statistikave të Kosovës', english: 'Kosovo Agency of Statistics', category: 'gov-kosovo', aliases: ['KAS', 'KAS (1)'], collisionNote: '⚠ Collides with KAS = Konrad-Adenauer-Stiftung (donors). Disambiguated as KAS-stat for safe lookup.' },
  { short: 'NIPHK',    full: 'National Institute of Public Health of Kosovo', english: 'IKSHPK in Albanian', category: 'gov-kosovo' },
  { short: 'KEK',      full: 'Korporata Energjetike e Kosovës', english: 'Kosovo Energy Corporation', category: 'gov-kosovo', note: 'Owns the land Mirash sits on.' },
  { short: 'HReg',     full: 'Hybrid Regulator', category: 'gov-kosovo', note: 'Proposed new institutional actor in the upcoming Law on Integrated Waste Management. Tariff setting, performance monitoring, dispute resolution. Operational from 2027.' },

  // ── Operators ───────────────────────────────────────────────────────
  { short: 'KLMC',     full: 'Kompania për Menaxhimin e Deponive të Kosovës', english: 'Kosovo Landfill Management Company', category: 'operators', note: 'Also written KMDK. Operates the seven public landfills including Mirash.' },
  { short: 'Pastrimi', full: 'KRM Pastrimi JSC', english: 'Regional Waste Collection Company "Pastrimi"', category: 'operators', note: 'Primary collector in Pristina region.' },
  { short: 'Ambienti', full: 'Ambienti', english: 'Regional waste collection company (Pristina region)', category: 'operators', note: 'Surfaced in INDEP/KAS 2026, not in original dossier.' },
  { short: 'Ekoregjioni', full: 'Ekoregjioni', english: 'Regional waste collection company (Prizren region)', category: 'operators', note: 'Receives JICA grant trucks (~30).' },

  // ── Programs / schemes ──────────────────────────────────────────────
  { short: 'MPG-CE',   full: 'Municipal Performance Grant – Clean Environment', category: 'programs', note: '2020-2022 €7M program; succeeded.' },
  { short: 'CE-PG',    full: 'Circular Economy Performance Grant', category: 'programs', note: 'Proposed 2024-2027 €20M successor to MPG-CE.' },
  { short: 'KIWMS',    full: 'Kosovo Integrated Waste Management Strategy', category: 'programs' },
  { short: 'NPISSA',   full: 'National Programme for Implementation of the Stabilisation and Association Agreement', category: 'programs', note: '2022-2026.' },

  // ── Inter-municipal architecture ────────────────────────────────────
  { short: 'IMC',      full: 'Inter-Municipal Cooperation', category: 'imc' },
  { short: 'IIWMP',    full: 'Integrated Inter-Municipal Waste Management Plan', category: 'imc' },
  { short: 'IMCA',     full: 'Inter-Municipal Cooperation Agreement', category: 'imc' },
  { short: 'WMZ',      full: 'Five Waste Management Zones', category: 'imc', note: 'To be defined in the new Law on Integrated Waste Management.' },

  // ── Infrastructure types ────────────────────────────────────────────
  { short: 'CAC',      full: 'Civic Amenity Center', category: 'infrastructure', note: 'Recycling yard for bulky / special waste.' },
  { short: 'TS',       full: 'Transfer Station', category: 'infrastructure' },
  { short: 'MRF',      full: 'Materials Recovery Facility', category: 'infrastructure', note: 'Sorting plant.' },
  { short: 'MBT',      full: 'Mechanical Biological Treatment plant', category: 'infrastructure', note: 'Often "tunnel" type.' },
  { short: 'RDF',      full: 'Refuse-Derived Fuel', category: 'infrastructure', note: 'Paired with WtE.' },
  { short: 'WtE',      full: 'Waste-to-Energy', category: 'infrastructure', note: 'Incineration. Paired with RDF.' },
  { short: 'SWMP',     full: 'Solid Waste Management Plan', category: 'infrastructure', note: 'Per GIZ deck; context unclear.' },

  // ── Streams ─────────────────────────────────────────────────────────
  { short: 'WEEE',     full: 'Waste Electrical and Electronic Equipment', category: 'streams', note: 'EU Directive.' },
  { short: 'WEE',      full: 'Waste Electrical Equipment', category: 'streams', note: 'Sometimes used interchangeably with WEEE.' },
  { short: 'ELV',      full: 'End-of-Life Vehicles', category: 'streams' },
  { short: 'CDW',      full: 'Construction and Demolition Waste', category: 'streams' },

  // ── EU / international policy ───────────────────────────────────────
  { short: 'CEAP',     full: 'EU Circular Economy Action Plan', category: 'eu-policy', note: 'Adopted 2020.' },
  { short: 'ESPR',     full: 'Ecodesign for Sustainable Products Regulation', category: 'eu-policy', note: 'EU, 2024.' },
  { short: 'DPP',      full: 'Digital Product Passport', category: 'eu-policy', note: 'Introduced under ESPR.' },
  { short: 'GAWB',     full: 'Green Agenda for Western Balkans', category: 'eu-policy', note: '2020.' },
  { short: 'RGF',      full: 'EU Reform & Growth Facility', category: 'eu-policy', note: '€6 billion 2024-2027 for Western Balkans.' },
  { short: 'IPA',      full: 'Instrument for Pre-Accession Assistance', category: 'eu-policy', note: 'EU funding mechanism.' },
  { short: 'RCC',      full: 'Regional Cooperation Council', category: 'eu-policy' },
  { short: 'ECHR',     full: 'European Convention on Human Rights', category: 'eu-policy' },

  // ── Technical / policy concepts ─────────────────────────────────────
  { short: 'EPR',      full: 'Extended Producer Responsibility', category: 'tech-policy' },
  { short: 'DRS',      full: 'Deposit Refund System', english: 'Sistemi i Rimbursimit të Depozitave (SRD)', category: 'tech-policy', note: 'Planned launch Jan 2025; current launch status unverified as of May 2026 (see tensions.js).' },
  { short: 'GPP',      full: 'Green Public Procurement', category: 'tech-policy' },
  { short: 'PRO',      full: 'Producer Responsibility Organization', category: 'tech-policy', note: 'Under EPR systems.' },
  { short: 'FNCC',     full: 'Full Net Cost Coverage', category: 'tech-policy', note: 'New principle in upcoming law: collection/transport/recycling/treatment fully covered by user/producer fees.' },
  { short: 'PPP-pol',  full: 'Polluter Pays Principle', category: 'tech-policy', collisionNote: '⚠ Collides with PPP = Public-Private Partnership.' },
  { short: 'PPP-fin',  full: 'Public-Private Partnership', category: 'tech-policy', collisionNote: '⚠ Collides with PPP = Polluter Pays Principle.' },
  { short: 'PAYT',     full: 'Pay As You Throw', category: 'tech-policy' },
  { short: 'SaS',      full: 'Source-as-Separate', category: 'tech-policy', note: 'a.k.a. source separation.' },
  { short: '3Rs',      full: 'Reduce, Reuse, Recycle', category: 'tech-policy' },

  // ── Data / monitoring ───────────────────────────────────────────────
  { short: 'NWIS',     full: 'National Waste Information System', category: 'data', note: 'Proposed under the new law.' },

  // ── Donors / institutions ───────────────────────────────────────────
  { short: 'GIZ',      full: 'Gesellschaft für Internationale Zusammenarbeit', category: 'donors', note: 'German technical cooperation agency.' },
  { short: 'JICA',     full: 'Japan International Cooperation Agency', category: 'donors' },
  { short: 'KAS-fdn',  full: 'Konrad-Adenauer-Stiftung', category: 'donors', aliases: ['KAS', 'KAS (2)', 'KAS-KAS'], collisionNote: '⚠ Collides with KAS = Kosovo Agency of Statistics. Disambiguated as KAS-fdn for safe lookup.', note: 'German Christian Democratic political foundation. Co-publisher of the April 2026 INDEP policy document.' },
  { short: 'INDEP',    full: 'Instituti për Politika Zhvillimore', english: 'Institute for Development Policy', category: 'donors', note: 'Pristina think tank; co-publisher of April 2026 policy doc.' },
  { short: 'DYVÓ',     full: 'DYVÓ', category: 'donors', note: 'NGO that authored the 2023 plastic waste research.' },
  { short: 'BECBA',    full: 'BECBA', category: 'donors', note: 'Project that produced the 2023 bio-waste study cited by INDEP/KAS.' },

  // ── Political parties (Kosovo) ──────────────────────────────────────
  { short: 'PDK',      full: 'Partia Demokratike e Kosovës', english: 'Democratic Party of Kosovo', category: 'parties', note: 'Center-right. Aligned with Pastrimi management.' },
  { short: 'LDK',      full: 'Lidhja Demokratike e Kosovës', english: 'Democratic League of Kosovo', category: 'parties', note: 'Center-right. Mayor Përparim Rama\'s party.' },
  { short: 'VV',       full: 'Lëvizja Vetëvendosje', english: 'Self-Determination Movement', category: 'parties', note: 'Left-nationalist. Sometimes spelled LVV.' },
  { short: 'AAK',      full: 'Aleanca për Ardhmërinë e Kosovës', english: 'Alliance for the Future of Kosovo', category: 'parties' },

  // ── Communities / demographics ──────────────────────────────────────
  { short: 'RAE',      full: 'Roma, Ashkali, Egyptian', category: 'demographics', note: 'Minority communities; predominant in informal scavenger workforce.' },

  // ── Whiteboard / informal references ────────────────────────────────
  { short: 'AMN',        full: 'AMN', category: 'whiteboard', note: 'Almost certainly AMMK — whiteboard shorthand seen in early system-mapping notes.' },
  { short: 'Code Watch', full: 'Code Watch', category: 'whiteboard', note: 'Independent watchdog/monitoring NGO (referenced on whiteboard, scope not yet verified in dossier).' },
]

export function getAcronym(short) {
  // Direct match first, then alias match (handles KAS → KAS-stat / KAS-fdn collision).
  return acronyms.find(a => a.short === short)
      ?? acronyms.find(a => a.aliases?.includes(short))
      ?? null
}

export function acronymsByCategory(category) {
  return acronyms.filter(a => a.category === category)
}

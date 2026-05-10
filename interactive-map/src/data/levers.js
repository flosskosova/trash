// Scenario levers — "what-if" cards. Each lever:
// - highlights affectedNodes and affectedEdges
// - applies a stressLevel to each affected node: 'none' | 'low' | 'medium' | 'high'
// - supplies a short narrative per affected node
// - headlines: 4 breaking-news-style headlines for the ticker
// - revealOrder: arrays of nodeIds showing the shock-wave propagation order
// - historical (optional): true if this already happened; add historicalDate
// - iconName: lucide-react icon name for the lever
//
// Updated 2026-05-09: existing 4 v1 scenarios enriched with dossier citations.
// 2 new scenarios added grounded in the new Law on Integrated Waste Management
// + the 15 INDEP/KAS recommendations:
//   - 'drs-launches-at-scale' — INDEP/KAS Rec 4 / Mazreku §6
//   - 'hybrid-regulator-standup' — Mazreku/MMPHI deck §5 (post-2027)
//
// Optional metadata fields (ignored by v1 UI, available for sim team / v2):
//   - category      : 'operational' | 'policy' | 'enforcement' | 'future-state' | 'historical'
//   - source        : { abbr, citation, url? }
//   - layers        : which RACI layer(s)
//   - horizons      : ['now'] | ['future'] | ['now','future']
//   - recommendationId : 'rec-X' if this implements an INDEP/KAS recommendation

export const levers = [
  // ── 1. KLMC raises landfill fees ─────────────────────────────────────
  {
    id: 'klmc-fee-increase',
    iconName: 'Banknote',
    title: 'KLMC raises landfill fees 30%',
    description: 'Kosovo Landfill Management Company increases the per-ton disposal fee at Mirash.',
    context: 'Mirash has no proper cost recovery for remediation or closure (zero leachate treatment, zero environmental permits). A fee increase is the only financial lever KLMC can pull — but Pastrimi already owes €1.9M, and the mutual-hostage dynamic means KLMC cannot easily refuse Pastrimi trucks (per RACI operational §7).',
    category: 'operational',
    source: {
      abbr: 'HOW',
      citation: 'How Trash Works §5; RACI operational §7',
      url: 'https://prishtinainsight.com/waste-management-a-systemic-crisis-in-kosovo-mag/',
    },
    layers: ['operational'],
    horizons: ['now'],
    headlines: [
      'KLMC raises landfill fees 30% · Pastrimi already owes €1.9M and has no leverage',
      'Three scenarios: absorb the cost, pass it to citizens, or deepen the debt — all roads lead to the same place',
      'No pay-as-you-throw mechanism means every household pays equally, regardless of waste produced',
      'Construction sites expected to increase illegal dumping to avoid higher landfill fees (CDW already drives ~458-1,572 illegal dump sites)',
    ],
    revealOrder: [
      ['klmc'],
      ['pastrimi'],
      ['workers', 'citizens', 'cdw_construction'],
      ['mirash'],
    ],
    affectedNodeIds: ['klmc', 'pastrimi', 'workers', 'citizens', 'mirash', 'cdw_construction'],
    affectedEdgeIds: ['pastrimi-klmc-debt', 'citizens-pastrimi-payment', 'cdw-mirash-illegal'],
    nodeEffects: {
      klmc: {
        stressLevel: 'none',
        narrative: 'Revenue increases in theory. But Pastrimi\'s existing €1.9M debt makes collection of the new fee doubtful without an escalation KLMC can\'t afford — refusing Pastrimi trucks would stop city-wide collection.',
      },
      pastrimi: {
        stressLevel: 'high',
        narrative: 'Operating costs rise. Three historical responses: absorb (cuts margins → pressure on workers), pass to citizens (raise the flat €6.20 fee), or delay KLMC payment (deepens the €1.9M debt). All three have been used during the 2024-2025 crisis.',
      },
      workers: {
        stressLevel: 'medium',
        narrative: 'If margins compress, the first pressure point is worker headcount or wages. Union (Ardian Krasniqi) will push back. The PDK political alignment that protected the Dec 2024 regulation also protects workers from layoffs.',
      },
      citizens: {
        stressLevel: 'medium',
        narrative: 'If Pastrimi passes costs on, the flat €6.20 fee rises. No pay-as-you-throw means all households pay the same increase regardless of how much waste they produce. Per-capita generation is already rising (240 → 294 kg/yr 2023→2024).',
      },
      cdw_construction: {
        stressLevel: 'medium',
        narrative: 'Higher disposal fees push construction sites toward illegal dumping. CDW is already the documented largest driver of Kosovo\'s 458-1,572 illegal dump sites. Pastrimi has reported names + addresses → no enforcement (Springer 2023).',
      },
      mirash: {
        stressLevel: 'low',
        narrative: 'Same waste arrives. The "landfill lake" still rises >1m/year. Methane risk unchanged. Closure still EU-flagged. Higher fees do not change the physical disposal endpoint.',
      },
    },
  },

  // ── 2. Municipality regains billing authority ────────────────────────
  {
    id: 'municipality-wins-billing',
    iconName: 'Scale',
    title: 'Municipality regains billing authority',
    description: 'A court or regulatory reversal gives the Municipality control over waste fee collection again.',
    context: 'This is the hypothetical reversal of the June 2025 Supreme Court ruling — the scenario Pastrimi fears most. It roughly mirrors what existed before December 2024. Mayor Rama (LDK) won the late-2025 runoff but as of January 2026 had not yet presented his governing cabinet, leaving political alignments uncertain.',
    category: 'operational',
    source: {
      abbr: 'HOW',
      citation: 'How Trash Works §3-§4; KOHA Jan 2026 retrospective',
      url: 'https://www.koha.net/en/038-ktv/pa-buxhet-e-me-protesta-viti-2025-per-prishtinen',
    },
    layers: ['operational'],
    horizons: ['now'],
    headlines: [
      'COURT REVERSAL — Municipality regains billing authority · Pastrimi loses revenue stream overnight',
      'Workers\' Union: "This is the prelude to privatization — we will not accept it" (Ardian Krasniqi)',
      'Citizens face confusion again: which bill do I pay? Who sends the other one? (~21K paid Municipality during Jan-Jun 2025)',
      '€16M private operator tender revived · Mayor Rama calls it "EU-required modernisation"',
    ],
    revealOrder: [
      ['municipality'],
      ['assembly', 'pastrimi'],
      ['workers', 'private_operators'],
      ['citizens'],
    ],
    affectedNodeIds: ['municipality', 'assembly', 'pastrimi', 'workers', 'private_operators', 'citizens'],
    affectedEdgeIds: ['citizens-pastrimi-payment', 'municipality-pastrimi-debt', 'assembly-pastrimi-regulation', 'municipality-private-operators'],
    nodeEffects: {
      municipality: {
        stressLevel: 'none',
        narrative: 'Regains revenue control. Can now steer funds and set priorities. Likely to revive the €16M private operator tender — which is its stated preference. Mayor Rama wins political face after losing the June 2025 Supreme Court round.',
      },
      assembly: {
        stressLevel: 'medium',
        narrative: 'PDK+VV political bloc loses the regulation they fought for. PDK has strong incentive to use the Assembly to legislate again — same dynamic that produced the Dec 2024 amendment. Political cycle resumes.',
      },
      pastrimi: {
        stressLevel: 'high',
        narrative: 'Loses direct revenue stream. Becomes fully dependent on Municipality transferring funds — which the Municipality has already proven it can withhold (~€2.7M held back during Jan-Jun 2025). Historical pattern: withholding → cash starvation → workers strike.',
      },
      workers: {
        stressLevel: 'high',
        narrative: 'Union will interpret this as the prelude to privatization. The last time Pastrimi lost billing leverage (Jan-Jun 2025), workers struck for a month. Expect the same response. PDK political alignment provides protection but cannot prevent revenue loss.',
      },
      private_operators: {
        stressLevel: 'none',
        narrative: 'Path clears. The Municipality\'s €16M tender for 5 private operators becomes viable again. The EU, which prefers market-based approaches, would likely approve. Their May 2025 emergency contracts ended with "they also failed to do the job properly" (KOHA).',
      },
      citizens: {
        stressLevel: 'medium',
        narrative: 'Confusion returns — where do they pay? Dual-billing risk re-emerges. If workers strike again, collection stops. Citizens are the system\'s shock absorbers: they absorb every political failure as a service failure. DYVÓ container-shortage complaints already documented.',
      },
    },
  },

  // ── 3. EU formal accession warning ───────────────────────────────────
  {
    id: 'eu-formal-warning',
    iconName: 'Globe',
    title: 'EU issues formal accession warning on waste',
    description: 'The EU formally conditions Kosovo\'s next accession milestone on measurable waste management progress.',
    context: 'Kosovo\'s EU accession path means EU leverage is real but has never been deployed specifically on waste. Acquis Chapter 27 (Environment + Climate) and the Stabilization-Association Agreement provide the framework. The EU\'s €6 billion Reform & Growth Facility (2024-2027) and Green Agenda for Western Balkans 2020 raise the stakes. A formal warning would be one escalation step above the current "noted in annual report" status.',
    category: 'policy',
    source: {
      abbr: 'PDF2',
      citation: 'INDEP/KAS doc §5; Acquis Ch 27; GAWB 2020; RGF 2024-2027',
      url: null,
    },
    layers: ['policy'],
    horizons: ['now', 'future'],
    headlines: [
      'EU formally links Kosovo accession milestone to waste management progress (RGF €6B at stake)',
      'Mirash landfill named on accession scorecard — 20+ years operating, no environmental permit, no leachate treatment',
      'MMPHI must respond with measurable targets — previous strategy promised 100% collection by 2020 (achieved ~85%)',
      'Resource productivity gap (€0.35/kg WB vs €2.07/kg EU = 6×) becomes accession scoring axis',
    ],
    revealOrder: [
      ['eu'],
      ['mmphi', 'mofin', 'klmc'],
      ['municipality', 'pastrimi'],
      ['informal_collectors', 'mirash'],
    ],
    affectedNodeIds: ['eu', 'mmphi', 'mofin', 'klmc', 'municipality', 'pastrimi', 'informal_collectors', 'mirash'],
    affectedEdgeIds: ['eu-mmphi-accession', 'eu-mofin-rgf', 'eu-klmc-landfill-funding', 'mmphi-assembly-approval', 'mmphi-pastrimi-license'],
    nodeEffects: {
      eu: {
        stressLevel: 'none',
        narrative: 'EU deploys its most significant systemic lever. This gives the EU Delegation\'s Pristina office political cover to push harder on specific actors. RGF €6B disbursement becomes conditional.',
      },
      mmphi: {
        stressLevel: 'high',
        narrative: 'Must formally respond. Likely: accelerate the new Law on Integrated Waste Management timeline (Gov approval Feb-Mar 2026 → Assembly Aug-Sep 2026 → secondary legislation Feb-Mar 2027). Pressure to operationalize EPR + DRS, mandatory source separation, and the 50% recycling target.',
      },
      mofin: {
        stressLevel: 'high',
        narrative: 'Action Plan budget (€41M 2024-2026, €77M through 2030) becomes scrutinized. EU RGF disbursement schedule becomes binding. The proposed landfill tax (Rec 10) and performance-based municipal funding (Rec 5) get political oxygen.',
      },
      klmc: {
        stressLevel: 'high',
        narrative: 'Mirash becomes a specific liability on Kosovo\'s accession scorecard. EU closure/replacement funding timeline becomes binding, not advisory. KLMC must apply for environmental permits or risk the accession case.',
      },
      municipality: {
        stressLevel: 'medium',
        narrative: 'Political pressure to demonstrate reform. Private operator introduction — which the EU prefers — gets political oxygen. Mayor Rama can frame the tender as "EU-required modernization." Cross-municipal cooperation under the new law\'s 5 zones becomes mandatory.',
      },
      pastrimi: {
        stressLevel: 'medium',
        narrative: 'EU compliance typically means performance requirements: PAYT, collection coverage metrics, route reporting. Pastrimi currently has none of these. Compliance would require operational restructuring and end the flat-fee monopoly model.',
      },
      informal_collectors: {
        stressLevel: 'high',
        narrative: 'EU compliance often triggers formalization drives. The informal recycling sector — predominantly Roma, Ashkali, Egyptian — is the most economically vulnerable. Formalization would mean losing unemployment benefits and exposing collectors to taxes. Kosovo\'s entire ~3% recycling rate runs through this sector.',
      },
      mirash: {
        stressLevel: 'high',
        narrative: 'Specific EU conditions would likely include a hard timeline for Mirash closure. Funding for a replacement site exists in study form. Political will to actually close and relocate is what\'s missing. KEK (landowner) coordination remains unresolved.',
      },
    },
  },

  // ── 4. Pastrimi workers strike (historical replay) ───────────────────
  {
    id: 'pastrimi-strikes',
    iconName: 'Truck',
    title: 'Pastrimi workers strike',
    description: 'Workers stop collection in protest. This is a historical replay of what actually happened in May-June 2025.',
    context: 'Run this lever to understand the system\'s stress response. Strike began mid-May 2025, lasted ~1 month, ended only after the early-June Supreme Court ruling + the June 25 mediation that returned €2.7M to Pastrimi. KOHA\'s January 2026 retrospective is the most comprehensive timeline.',
    category: 'historical',
    historical: true,
    historicalDate: 'May - June 2025',
    source: {
      abbr: 'HOW',
      citation: 'How Trash Works §4; KOHA Jan 2026 retrospective',
      url: 'https://www.koha.net/en/038-ktv/pa-buxhet-e-me-protesta-viti-2025-per-prishtinen',
    },
    layers: ['operational'],
    horizons: ['now'],
    headlines: [
      'WORKERS WALK OUT — Collection stops city-wide · Trash piles up in summer heat',
      'Mayor Rama declares state of emergency — contracts private operators who also fail to do the job properly (KOHA)',
      'Ombudsperson convenes emergency meeting May 19 · Pastrimi CEO Reçica attends · Mayor Rama does not show up',
      'Residents: "The smell here is unbearable" · Supreme Court rules early June · Strike ends Jun 25 with €2.7M return',
    ],
    revealOrder: [
      ['workers'],
      ['pastrimi', 'municipality'],
      ['private_operators', 'ombudsperson'],
      ['citizens'],
    ],
    affectedNodeIds: ['workers', 'pastrimi', 'municipality', 'private_operators', 'citizens', 'ombudsperson'],
    affectedEdgeIds: ['workers-pastrimi-labor', 'municipality-private-operators', 'ombudsperson-municipality-criticism', 'citizens-pastrimi-payment'],
    nodeEffects: {
      workers: {
        stressLevel: 'none',
        narrative: 'Workers\' chosen action. Union cohesion is high during the strike. Ardian Krasniqi (union president) frames it as defending public employment against "tricks they play among themselves" (Sinani quote, KOHA June 2025).',
      },
      pastrimi: {
        stressLevel: 'medium',
        narrative: 'Management supports the strike as leverage against Municipality, but the company stops generating revenue. Adds to financial pressure. Strike ends only after Supreme Court ruling gives Pastrimi a clear win + €2.7M return on June 25.',
      },
      municipality: {
        stressLevel: 'high',
        narrative: 'Forced to act. Declares state of emergency in waste collection. Contracts private operators. Emergency declaration is politically costly — it admits service failure on the mayor\'s watch. Mayor Rama cites "significant risk of public health crisis" (Balkan Insight).',
      },
      private_operators: {
        stressLevel: 'none',
        narrative: 'Gets temporary emergency contracts. KOHA retrospective: "they also failed to do the job properly." Emergency contracts are not the same as winning the long-term €16M tender — that tender remains blocked by the Dec 2024 regulation.',
      },
      citizens: {
        stressLevel: 'high',
        narrative: 'Trash accumulates. Summer heat amplifies smell. Complaints spike (Bajram Islami, Kalabria: "The waste in every corner is causing us problems even in business"). The dual-billing confusion continues on top of non-collection. ~21,000 paid Municipality instead of Pastrimi by April.',
      },
      ombudsperson: {
        stressLevel: 'medium',
        narrative: 'Convenes emergency mediation on May 19, 2025. Reçica attends. Mayor Rama does not. Jashari publicly criticizes the Municipality for "complete irresponsibility" and notes Pastrimi is "on the verge of bankruptcy." Jashari cannot sanction anyone — can only name and shame.',
      },
    },
  },

  // ── 5. NEW: DRS launches at scale ─────────────────────────────────────
  {
    id: 'drs-launches-at-scale',
    iconName: 'Recycle',
    title: 'DRS launches at scale (post-2027)',
    description: 'Deposit Refund System rolls out for plastic, glass, aluminum bottles 0.15-2L nationwide.',
    context: 'INDEP/KAS Recommendation 4 + Mazreku/MMPHI deck §6. The 2024 secondary legislation existed but launch status is contested (see tensions Tension Y). The new Law on Integrated Waste Management establishes a stronger DRS legal base in 2026-2027. When operational at scale: producers fund collection via Producer Responsibility Organizations (PROs); citizens get deposits back on returned bottles; recyclers receive cleaner streams; the informal sector loses some of its highest-value materials.',
    category: 'policy',
    recommendationId: 'rec-4',
    source: {
      abbr: 'MAZ',
      citation: 'Mazreku/MMPHI deck §6 + §7; INDEP/KAS Rec 4',
      url: null,
    },
    layers: ['policy', 'recommendations'],
    horizons: ['future'],
    headlines: [
      'DRS LIVE — Plastic / glass / aluminum bottles 0.15-2L now have deposit-refund nationwide',
      'Producer Responsibility Organizations (PROs) operationalize · MINT + MMPHI co-lead the rollout',
      'Informal RAE collectors face material-stream loss as bottles bypass bins → return through formal DRS channel',
      'EU compliance scoreboard ticks up · plastic-bag tariff effects compound (-68.4% imports already)',
    ],
    revealOrder: [
      ['mmphi', 'mint'],
      ['pastrimi', 'cdw_construction'],
      ['citizens'],
      ['informal_collectors'],
    ],
    affectedNodeIds: ['mmphi', 'mint', 'pastrimi', 'citizens', 'informal_collectors'],
    affectedEdgeIds: ['mint-mmphi-epr-coordination', 'citizens-pastrimi-payment', 'informal-citizens-scavenging'],
    nodeEffects: {
      mmphi: {
        stressLevel: 'medium',
        narrative: 'Lead policy authority for DRS operation. Must set up enforcement + audit capacity (which the dossier flags as historically weak). Performance becomes EU-visible per Acquis Ch 27.',
      },
      mint: {
        stressLevel: 'medium',
        narrative: 'Co-lead with MMPHI. Industry-side cost recovery falls on MINT. PROs need to be operationally instantiated — they don\'t exist yet as known operators. Industry resistance to producer-pays cost-shift is the political risk.',
      },
      pastrimi: {
        stressLevel: 'low',
        narrative: 'Some recyclables (bottles) bypass the household bin pipeline. Lost volume is small relative to mixed municipal stream. Long-term: cleaner residual stream may improve Mirash conditions.',
      },
      citizens: {
        stressLevel: 'low',
        narrative: 'New behavior required: returning bottles to deposit points. DYVÓ 2023 found citizens generally supportive of plastic taxes. Awareness gap is real (Q11 in DYVÓ survey: most common answer was "neither know what counts as illegal waste nor where to report"). Awareness campaign critical (Rec 15).',
      },
      informal_collectors: {
        stressLevel: 'high',
        narrative: 'High-value materials (plastic, aluminum bottles) shift away from bins to formal DRS channels. Lost income for the predominantly RAE community. ~€15/day from ~100kg recyclables drops if bottle volume disappears. Formalization pressure intensifies.',
      },
    },
  },

  // ── 6. NEW: Hybrid Regulator stands up (post-2027) ────────────────────
  {
    id: 'hybrid-regulator-standup',
    iconName: 'ShieldCheck',
    title: 'Hybrid Regulator stands up (post-2027)',
    description: 'New independent regulator activates. Sets tariffs under FNCC, monitors performance, resolves disputes.',
    context: 'Per the Mazreku/MMPHI deck §5: the new Law on Integrated Waste Management creates a Hybrid Regulator (HReg) — analogous to ARRU (water) and ERO (energy). Three powers: tariff setting under Full Net Cost Coverage (FNCC), performance monitoring, dispute resolution. Replaces ad-hoc ministerial / court paths for in-sector disputes. Operational from ~2027 once secondary legislation passes. Standing-up risk is high — a single not-yet-existing regulator concentrates post-2027 power, and HReg capacity will be the new binding constraint.',
    category: 'future-state',
    source: {
      abbr: 'MAZ',
      citation: 'Mazreku/MMPHI deck §5; raci/policy.md rows 18-21',
      url: null,
    },
    layers: ['policy'],
    horizons: ['future'],
    headlines: [
      'HReg LIVE — Hybrid Regulator now sets all waste tariffs under Full Net Cost Coverage principle',
      'Pastrimi loses unilateral fee-setting · €6.20 flat fee replaced by FNCC-derived tariff (PAYT compatible)',
      'Disputes between municipalities, operators, PROs now route to HReg — not Supreme Court · Five Waste Management Zones come online',
      'Independence from MMPHI is design intent · governance model (board, appointment authority, funding) still unverified',
    ],
    revealOrder: [
      ['hreg'],
      ['mmphi', 'mofin'],
      ['pastrimi', 'klmc', 'municipality'],
      ['citizens'],
    ],
    affectedNodeIds: ['hreg', 'mmphi', 'mofin', 'pastrimi', 'klmc', 'municipality', 'citizens'],
    affectedEdgeIds: ['hreg-pastrimi-tariff', 'hreg-mmphi-independence', 'mmphi-pastrimi-license', 'citizens-pastrimi-payment'],
    nodeEffects: {
      hreg: {
        stressLevel: 'none',
        narrative: 'New institutional actor with concentrated authority. Three powers activate: tariff (FNCC), performance monitoring, dispute resolution. Standing-up risk is high — capacity, board independence, and funding-source design are unverified.',
      },
      mmphi: {
        stressLevel: 'medium',
        narrative: 'Loses tariff-setting authority. Retains policy A on ~8 of 15 INDEP/KAS recommendations. Plus drafting + NWIS operation + zone establishment under the new law. The "load-bearing institution" status persists but the workload grows.',
      },
      mofin: {
        stressLevel: 'low',
        narrative: 'FNCC means waste services recover their full costs from users — eliminating taxpayer subsidy of waste services. MoFin retains landfill tax (Rec 10), GPP (Rec 12), CE innovation finance (Rec 14). Fiscal teeth role intact.',
      },
      pastrimi: {
        stressLevel: 'high',
        narrative: 'Loses unilateral fee-setting authority. €6.20 flat fee replaced by FNCC-derived tariff. PAYT becomes legally non-negotiable. Performance monitoring exposes operational metrics that have been historically opaque (route reporting, response times, tonnage by neighborhood).',
      },
      klmc: {
        stressLevel: 'medium',
        narrative: 'Subject to HReg performance monitoring. Mirash conditions become regulator-visible, not just AMMK-monitored. Future scope expands to operate regional sorting + treatment centers per the new law — bigger portfolio, bigger oversight.',
      },
      municipality: {
        stressLevel: 'medium',
        narrative: 'Tariff disputes with Pastrimi route to HReg, not Supreme Court. Komuna joins one of the Five Waste Management Zones — operational autonomy reduces. Registry-control leverage (the 23K-client gap) becomes harder to weaponize when an independent regulator can audit it.',
      },
      citizens: {
        stressLevel: 'low',
        narrative: 'Tariffs may rise (FNCC means full cost recovery, not subsidized below cost) — but rise is regulator-set and predictable, not politically improvised. PAYT introduces volume incentive: pay less if you produce less. New Civic Amenity Centers come online for bulky/special waste.',
      },
    },
  },
]

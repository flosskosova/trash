# Law Diff: Old Law on Waste (04/L-060, 2012) vs New Law on Integrated Waste Management (drafting)

> **Caveat:** Based on the Mazreku/MMPHI deck describing the new law in late 2025; the actual law text is not yet public. Verify against draft when published. The 2012 law analysis is from DYVÓ 2023 research + dossier.

## Status (as of 2026-05-09)

| Old law | New law |
|---|---|
| **Law on Waste No. 04/L-060** (24 May 2012), with amendments **08/L-071 (2022)** and a 2024 amendment package (permits, harmonization with administrative procedures). 11 administrative instructions issued 2012-2016. | **Law on Integrated Waste Management** — drafted Nov-Dec 2025. Government approval **Feb-Mar 2026**. Assembly approval **Aug-Sep 2026**. Secondary legislation **Feb-Mar 2027**. Currently between Government and Assembly approval. |

The new law is a **replacement**, not an amendment. The old law's 11 administrative instructions will be replaced or updated by 2027 secondary legislation.

---

## Diff matrix

Δ severity legend: **cosmetic** = re-wording or restatement; **substantial** = real new authority/scope, but layered on existing structure; **structural** = new actor, new mechanism, or new fiscal/legal architecture that didn't exist before.

| Dimension | Old (04/L-060 + 2022/2024 amendments) | New (Law on Integrated Waste Management, drafting) | Δ severity |
|---|---|---|---|
| **Authority + scope** | Waste-specific framework: collection, transport, disposal. Municipalities responsible for waste programs in their territory; licensed operators required for commercial collection. EU Commission (2013) flagged it as lacking enforcement capacity; not aligned with EU Waste Framework Directive 2008/98/EC (amended 2018). | Integrated waste management as part of **circular economy**. Frames waste hierarchy (Prevention → Reuse → Recycling → Recovery → Disposal) as binding. Aligns with EU acquis. | **structural** |
| **EPR provisions** | Weak. Packaging covered only via AI 27/2014 (administrative instruction, not law). WEEE via AI 25/2014. Batteries via AI 26/2014. ELV via AI 19/2012. No PROs. No producer-fee architecture. | **Strong legal base for EPR** covering packaging, WEEE, batteries, ELV, tyres, "other waste streams." EPR Assessments for packaging + tyres scheduled 2026. Secondary EPR legislation 2027. | **structural** |
| **DRS provisions** | None in primary law. (INDEP/KAS reports a 2024 secondary legislative move toward DRS, but it has no primary-law anchor and no verified launch.) | **Legal base for Deposit Return System** covering plastic, glass, and aluminum bottles in **0.15-2L** range. Goal: increase collection + recycling, reduce littering nationwide. | **structural** |
| **Inter-municipal cooperation** | Not legally enshrined. Each of Kosovo's ~38 municipalities runs its own collection contract; no required cooperation across boundaries. | **Five Waste Management Zones** legally required. Municipalities cooperate within zonal architecture. | **structural** |
| **Hybrid Regulator** | None. Tariff-setting is a contested municipal-level act (per the 2024-25 Pastrimi-Komuna dispute). No independent dispute-resolution body. No performance benchmarking authority. | **Hybrid Regulator established** for tariff setting, performance monitoring, and dispute resolution. Analogous to ARRU (water) and ERO (energy). | **structural** |
| **Cost-recovery principle** | Polluter Pays Principle in name (Law on Environmental Protection 03/L-025 enumerates it), but no fiscal teeth. Pastrimi's flat ~€6.20/month/household fee is not metered, no PAYT. | **PPP + Full Net Cost Coverage (FNCC)**. Collection, transport, recycling, treatment all covered by user/producer fees — no taxpayer subsidy. Locks in PAYT + EPR cost recovery as non-optional. | **structural** |
| **Data infrastructure** | Fragmented. AMMK collects environmental data; KAS runs the Municipal Waste Survey; MMPHI tracks separately. AMMK's illegal-landfill count (458) disputed by other sources (1,500+). Methodology shifts between reporting periods (e.g., "generated" 2014/2018 vs "collected" 2023/2024). | **National Waste Information System (NWIS)**. Mandatory reporting by municipalities, operators, PROs. AMMK collects + manages national waste data + monitors compliance. | **structural** |
| **Enforcement** | Weak inspection capacity per dossier. Inspectorate "loosely defined." Atlas Institute's Agron Demi: authorities rarely enforce penalties even when they have authority. MMPHI has not used licensing authority to sanction Pastrimi for service failures. | **Strengthened inspection powers** + regular performance and compliance audits. Inspectorate "ensures all operators follow law, enforces penalties" for illegal dumping/non-compliance. | **substantial** (architecture is new; teeth depend on 2027 secondary legislation) |
| **KLMC scope** | Operates landfills (Mirash and most other public landfills). Charges entrance fees that, per EU assessment, only cover basic landfill management — no remediation funds. | Same + **future regional sorting and treatment centers**. Scope expands from disposal-only to disposal + sorting + treatment. | **substantial** |
| **Cross-sector coordination** | No formal body. Coordination happens ad-hoc between MMPHI, KEPA/AMMK, KLMC, municipalities, donors. INDEP/KAS Recommendation 2 explicitly calls for an Inter-Ministerial CE Coordination Unit. | **Cross-Sector Coordination body** integrating central + local institutions, private sector, civil society, donors. INDEP/KAS Recommendation 2 has a name and a slide. | **structural** |
| **Producer Responsibility Organizations (PROs)** | Not formalized. No legal basis, no licensing path. EPR-style obligations on producers exist only via specific AIs and are not operationally enforced. | **Legal basis for PROs + licensing by MMPHI**. PROs become a named institutional actor responsible for collection, sorting, recycling within their stream. | **structural** |
| **Recycling targets** | Aspirational. Strategy 2024-2030/2035 contains targets, but old law gives them no legal force. Current actual recycling rate ~3%. | **50% recycling required** by Strategy with stream-by-stream breakdown: 24.8% via sorting/MBT/recycling market + 9.5% AD/composting + 6.3% RDF/WtE + 6.2% AD + 3.3% other; 20% landfilled. Recycling targets become legally binding via the new law's principles. | **structural** |
| **Administrative Instructions** | 11 AIs covering specific streams: AI 29/2014 (sludge), AI 26/2014 (batteries), AI 27/2014 (packaging), AI 05/2015 (PCB/PCT), AI 19/2012 (ELV), AI 15/2015 (mercury fluorescents), AI 25/2014 (WEEE), AI 15/2012 (landfill management), AI 06/2016 (C&D site selection), AI 21/2014 (mining/extractive waste). 2012-2016 vintage; predate Strategy 2024-2030. | **Secondary legislation Feb-Mar 2027** will replace or update these AIs. Specifics not yet public; will need to be re-catalogued when published. | **substantial** |

---

## What the diff means for the Sim

Every "structural" Δ is a **player-action card** — a lever the player can pull within the new law, with prerequisites (Government approval, Assembly approval, secondary legislation) and consequences. This expands `dossier/raci/recommendations.md` from 15 INDEP/KAS-derived cards to a richer deck:

- **Card: Establish the Hybrid Regulator.** Prerequisite: Assembly passes new law. Effect: independent tariff-setting authority resolves Pastrimi-Komuna-style disputes; performance monitoring becomes routine. Actor moved: new institution (didn't exist).
- **Card: Define the Five Waste Management Zones.** Prerequisite: Government approval + zonal mapping by MMPHI. Effect: forces inter-municipal cooperation; KLMC's expanded scope (regional sorting/treatment centers) becomes deployable per zone.
- **Card: License the first PRO** (e.g., for packaging). Prerequisite: 2027 secondary legislation. Effect: producers begin paying EPR fees; collection costs shift from taxpayers/households to producers.
- **Card: Launch DRS for 0.15-2L bottles.** Prerequisite: secondary legislation + PRO infrastructure. Effect: bottle return rates rise; littering of bottles drops; players accumulate "recycling rate" toward the 50% win condition.
- **Card: Activate FNCC.** Prerequisite: tariff structure approved by Hybrid Regulator. Effect: removes taxpayer subsidy of waste services; forces PAYT or equivalent metered billing; politically hard, fiscally clean.
- **Card: Stand up NWIS.** Prerequisite: AMMK capacity + mandatory reporting rules in 2027 secondary. Effect: data flows; "fragmented data" debuff is removed; subsequent enforcement cards land harder because evidence exists.
- **Card: Convene Cross-Sector Coordination body.** Prerequisite: government decision (likely Office of the Prime Minister). Effect: unblocks multi-actor cards (anything requiring MMPHI + MoFin + KOM + DON simultaneously).
- **Card: Adopt the new EPR scope.** Prerequisite: Assembly approval. Effect: packaging, WEEE, batteries, ELV, tyres become legally producer-funded waste streams. Each stream is a sub-card with its own PRO.
- **Card: Bind the 50% recycling target.** Prerequisite: principles clause of new law in force. Effect: progress against the target becomes legally trackable; failures attract regulatory + EU-accession consequences.

The "substantial" Δ items (enforcement, KLMC scope expansion, AI replacement) are **modifier cards** — they buff or unblock the structural cards rather than standing alone.

## What the diff means for HackTheTrash app

The new law's data + reporting architecture creates direct hooks for the citizen-reporting app:

- **NWIS as the upstream system.** The Reporter app can be built as a citizen-facing front-end to NWIS, making citizen reports a structured input to the state's data infrastructure rather than a parallel system.
- **Mandatory reporting by operators + PROs** means the data layer behind the app will become richer over time. Citizen reports can be cross-referenced against operator-reported collection data; gaps surface as enforcement leads.
- **Strengthened inspection powers** make citizen evidence (photo + GPS + timestamp) procedurally usable — the Inspectorate has explicit authority to act on it under the new law, where the old law left enforcement underspecified.
- **Civic Amenity Centers** (referenced in the Mazreku deck's operational scheme) are coming. Once CACs have addresses, the app gains a "where do I take this?" feature that closes the loop between report and disposal.
- **The Hybrid Regulator's dispute-resolution authority** gives the app a destination for billing-related citizen complaints (the kind that drove the 2024-25 Pastrimi-Komuna crisis).

## What's NOT changing

Continuities between old and new — these are the load-bearing constants the Sim and the app can both rely on:

1. **Komuna remains the operational unit.** Municipalities still run collection. The new law adds zonal cooperation on top; it does not transfer collection authority upward.
2. **AMMK / KEPA remains the data agency.** Role expands from environmental monitoring to NWIS operations, but the institution itself is continuous.
3. **Article 52 of the Kosovo Constitution** — the right to a healthy environment and the state's obligation to protect it — is unchanged. It remains the constitutional anchor for all waste policy + the participatory rights citizens hold.
4. **MMPHI is still the lead waste-policy authority.** The new law expands MMPHI's role (PRO licensing, primary + secondary legislation) but does not move the lead authority elsewhere.

---

*Diff compiled 2026-05-09 from `dossier/how-trash-works-pristina.md` Part 3, `dossier/enrichment-summary-dyvo-plastic.md` §5, `dossier/enrichment-summary-mazreku-newlaw.md` (entire), and `dossier/enrichment-summary-pdf2.md` §5. Re-verify against draft law text once published.*

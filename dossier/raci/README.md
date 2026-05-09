# RACI — Pristina Waste System

> **Confidence: ~80%.** Filled from `dossier/how-trash-works-pristina.md` + `dossier/enrichment-summary-pdf2.md` + the systems whiteboard. Cells marked `⚠` are contested in practice; cells marked `?` are pending verification (see open issues #4, #5, #6). Many "policy" rows describe roles that exist on paper but are weakly implemented — those are real responsibilities, real accountability gaps.

## Sibling artifacts in `dossier/`

The RACI matrices are one slice of a broader dossier. Use these companion files alongside.

**For navigation (narrative + source layer):**
- [`../how-trash-works-pristina.md`](../how-trash-works-pristina.md) — original dossier (operational + political layer)
- [`../enrichment-summary-pdf2.md`](../enrichment-summary-pdf2.md) — INDEP/KAS national policy enrichment
- [`../enrichment-summary-pg-ce.md`](../enrichment-summary-pg-ce.md) — GIZ MPG-CE time series enrichment
- [`../enrichment-summary-dyvo-plastic.md`](../enrichment-summary-dyvo-plastic.md) — DYVÓ citizen voice enrichment
- [`../enrichment-summary-mazreku-newlaw.md`](../enrichment-summary-mazreku-newlaw.md) — Mazreku new-law enrichment
- [`../enrichment-summary-graphs.md`](../enrichment-summary-graphs.md) — DYVÓ survey instrument

**For research / reference:**
- [`../timeline.md`](../timeline.md) — master chronology 2010-2027
- [`../numbers.md`](../numbers.md) — canonical numbers reference (115 data points)
- [`../law-diff.md`](../law-diff.md) — old Law 04/L-060 vs new Law on Integrated WM (13 dimensions)
- [`../tensions.md`](../tensions.md) — cross-source reconciliation
- [`../acronyms.md`](../acronyms.md) — glossary

**For builders (Sim + Reporter app teams):**
- [`../system-map.json`](../system-map.json) — graph data model (60 nodes / 90 edges, post-new-law). Sim reads this directly.
- [`../system-map.md`](../system-map.md) — schema + Mermaid diagrams + Sim-use examples
- [`../law-diff.md`](../law-diff.md) (also useful here) — Sim policy-lever cards

## What's in this folder

Two views, four files:

**View A — Diagnostic (where the system is broken)**
- [`operational.md`](operational.md) — Collection, billing, registry, landfill operations. The Pastrimi-Komuna-KLMC layer. Most contested cells live here.
- [`policy.md`](policy.md) — Strategy, DRS, EPR, EU acquis alignment, capital planning. The MMPHI/MINT/AMMK layer. Most cells are still aspirational.
- [`enforcement.md`](enforcement.md) — Inspection, fines, sanctions, illegal-dumping tracking, audit. The "phantom A" layer — accountable in name, rarely in practice.

**View C — Action (what levers exist)**
- [`recommendations.md`](recommendations.md) — The 15 INDEP/KAS policy recommendations × actors. Each cell = a player-action node. Most useful for the Sim team.

## How to read

| Marker | Meaning |
|---|---|
| **R** | Responsible — does the work |
| **A** | Accountable — one neck per row (max one) |
| **C** | Consulted before decision |
| **I** | Informed after decision |
| **⚠** | Disputed in practice — two actors claim the role, or no one really has it |
| **?** | Unknown / pending verification |
| — | No role |

## Actor codes (consistent across all matrices)

Full names + Albanian originals are in [`dossier/acronyms.md`](../acronyms.md). Quick reference:

| Code | Actor |
|---|---|
| KOM | Komuna (Municipality) of Pristina — executive |
| ASMB | Pristina Municipal Assembly — legislative |
| PAS | Pastrimi |
| PRV | Private operators (parallel collectors) |
| KLM | KLMC (landfill operator) |
| MMPHI | Ministry of Environment, Spatial Planning, Infrastructure |
| AMMK | Kosovo EPA (under MMPHI) |
| MINT | Ministry of Industry, Entrepreneurship, Trade |
| MoEcon | Ministry of Economy |
| MoFin | Ministry of Finance |
| MoAg | Ministry of Agriculture |
| MoEd | Ministry of Education |
| CG | Central Gov / Office of Prime Minister |
| COURT | Constitutional + Supreme Courts |
| OMB | Ombudsperson |
| POL | Kosovo Police |
| INSP | Municipal inspectors / inspectorates |
| EU | EU Office Pristina + IPA + RGF |
| DON | Other donors (GIZ, JICA, World Bank) |
| PRO | Producer Responsibility Organizations |
| REC | Formal private recyclers (Izolimi Plast, Rec-Kos, Trepça lead) |
| SCV | Informal RAE scavengers |
| CIT | Citizens / households |
| COMM | Commercial generators (restaurants, shops) |
| CON | Construction sector |
| IND | Industrial generators (power plants, mining) |
| NGO | Civil society (Atlas, Let's Do It, INDEP, FLOSSK) |

## Why split into multiple matrices

A single 27-actor × 40-activity matrix is unreadable. Splitting by layer makes each matrix small enough to fit on one screen while keeping the whole picture composable. Same actor codes, same markers, same caveats throughout.

## Where the 20% gap is

The gap has narrowed since [`../numbers.md`](../numbers.md) and [`../system-map.json`](../system-map.json) consolidated knowledge across sources — but the verification issues (#4, #5, #6, #14, #15) remain open. Cells we still couldn't fill confidently:

1. **Trepça lead-battery recycling** — operating status unknown (issue #5).
2. **DRS launch** — planned January 2025; current status unverified (issue #4).
3. **Ujë Miros bottle reuse** — scale unverified (issue #6).
4. **Producer Responsibility Organizations** — referenced as "to be created"; no PROs known to be operational yet.
5. **Specific Constitutional Court ruling on Dec 2024 regulation** — Supreme Court ruled June 2025 in Pastrimi's favor; whether the Constitutional Court ever ruled separately is unclear.
6. **Industrial symbiosis platform** — entirely future-tense in INDEP/KAS.
7. **Cross-municipal coordination** for waste between Pristina and surrounding municipalities (Obiliq, Lipjan, Fushë Kosovë sharing Mirash) — described in dossier but role allocation not crisp.

These all deserve a follow-up pass once verification issues close.

## How to use this

- **For Sim team:** start with [`recommendations.md`](recommendations.md) (each row is a card; columns tell you which actor must be moved). Then load [`../system-map.json`](../system-map.json) as the runtime graph, and treat [`../law-diff.md`](../law-diff.md) as the policy-lever deck — each of the 13 dimensions is a candidate card.
- **For research team:** [`operational.md`](operational.md) shows where the dispute is now; [`policy.md`](policy.md) shows where reforms are queued; [`enforcement.md`](enforcement.md) shows why nothing sticks. Cross-reference [`../timeline.md`](../timeline.md) for chronology, [`../numbers.md`](../numbers.md) for canonical figures, and [`../tensions.md`](../tensions.md) for what's contested across sources.
- **For Reporter app team:** [`enforcement.md`](enforcement.md) row 12 PLUS the new "structured citizen reports" row (post-update) tell you the gap your app could fill — inspector understaffing is the dossier's headline. Pair with [`../enrichment-summary-dyvo-plastic.md`](../enrichment-summary-dyvo-plastic.md) §3 for the citizen-perception baseline you'd be moving.

---

*Drafted 2026-05-09 during the Trash, Please hackathon. AI-assisted; verify before publication. Pull requests welcome — the actor codes are the consistency contract, please don't add new codes without updating this README and `acronyms.md`.*

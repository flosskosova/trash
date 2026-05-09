# RACI — Pristina Waste System

> **Confidence: ~80%.** Filled from `dossier/how-trash-works-pristina.md` + `dossier/enrichment-summary-pdf2.md` + the systems whiteboard. Cells marked `⚠` are contested in practice; cells marked `?` are pending verification (see open issues #4, #5, #6). Many "policy" rows describe roles that exist on paper but are weakly implemented — those are real responsibilities, real accountability gaps.

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

Cells we couldn't fill confidently:

1. **Trepça lead-battery recycling** — operating status unknown (issue #5).
2. **DRS launch** — planned January 2025; current status unverified (issue #4).
3. **Ujë Miros bottle reuse** — scale unverified (issue #6).
4. **Producer Responsibility Organizations** — referenced as "to be created"; no PROs known to be operational yet.
5. **Specific Constitutional Court ruling on Dec 2024 regulation** — Supreme Court ruled June 2025 in Pastrimi's favor; whether the Constitutional Court ever ruled separately is unclear.
6. **Industrial symbiosis platform** — entirely future-tense in INDEP/KAS.
7. **Cross-municipal coordination** for waste between Pristina and surrounding municipalities (Obiliq, Lipjan, Fushë Kosovë sharing Mirash) — described in dossier but role allocation not crisp.

These all deserve a follow-up pass once verification issues close.

## How to use this

- **For Sim team:** start with [`recommendations.md`](recommendations.md). Each row is a card; the columns tell you which actor needs to be moved for the card to play.
- **For research team:** [`operational.md`](operational.md) shows where the dispute is now; [`policy.md`](policy.md) shows where reforms are queued; [`enforcement.md`](enforcement.md) shows why nothing sticks.
- **For Reporter app team:** [`enforcement.md`](enforcement.md) row "Receive citizen reports" + the dossier's note on inspector understaffing tells you the gap your app could fill.

---

*Drafted 2026-05-09 during the Trash, Please hackathon. AI-assisted; verify before publication. Pull requests welcome — the actor codes are the consistency contract, please don't add new codes without updating this README and `acronyms.md`.*

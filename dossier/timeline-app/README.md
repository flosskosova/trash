# Pristina Waste Crisis — Interactive Timeline

> A scrollable D3.js timeline visualization of the December 2024 – June 2025 Pastrimi-Komuna regulation crisis. 11 events, click any dot for the full account.

## Live app

**[vibes.diy/vibe/bestboy/pristina-waste-crisis](https://vibes.diy/vibe/bestboy/pristina-waste-crisis/)**

## What it is

An interactive companion to [`../timeline.md`](../timeline.md) that focuses on a single arc — the regulation crisis triggered by the Municipal Assembly's December 2024 vote, through to the June 2025 mediated resolution. Curated to 11 events that tell the story chronologically.

Event categories color-coded:
- **Regulation / Legal** (navy) — the December 2024 amendment, secondary legislation
- **Operational** (red) — billing changes, collection halts, worker strikes
- **Political** (orange) — public statements, party positioning, citizen-payment shifts
- **Court / Oversight** (green) — Ombudsperson mediation, Supreme Court ruling, mediated resolution

Click any dot to expand the full account of that event. Filter by category via the legend.

## Built with Vibes DIY

This timeline was built with **[Vibes DIY](https://vibes.diy/)** — a tool for spinning up small interactive web apps from natural-language descriptions. The full source (React + d3.js) lives in [`App.jsx`](App.jsx) in this folder for archival / forking.

## How it relates to the rest of this repo

| Source | Use |
|---|---|
| [`../timeline.md`](../timeline.md) | The full chronology 2010-2027 — the timeline app is a curated subset focused on the 2024-2025 regulation crisis specifically |
| [`../how-trash-works-pristina.md`](../how-trash-works-pristina.md) Part 4 | The narrative source for each event in the app |
| [`../sim-cards.md`](../sim-cards.md) | Several events in the app (registry dispute, billing flip-flop) are direct triggers for sim-card play scenarios |

## Data source

All 11 events are reproduced verbatim in `App.jsx` as a const array. Source attribution per event is in the dossier. If you want to extend or modify the timeline, edit the `events` array at the top of `App.jsx`.

## Sources cited in the app footer

KOHA, Prishtina Insight, BIRN, RFE/RL, Telegrafi, Kosovo Ombudsperson Institution.

---

*Built during the Trash, Please hackathon at Prishtina Hackerspace, May 9-10 2026.*

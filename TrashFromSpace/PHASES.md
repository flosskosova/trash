# Project Roadmap

Six-phase roadmap for the TrashFromSpace build. Reframed 2026-05-10 from a setup-first technical phasing to a known-sites-first project phasing — start with what we already know exists, validate the pipeline, then expand.

The README's technical phases (download → indices → classify → change-detect → publish) are *substeps within* this project roadmap, not the roadmap itself.

---

## Phase 1 — Known-site time-lapse · *1-2 weekends*

> The killer demo. Start here.

**Goal:** generate animated time-lapses (GIF + MP4) of every known waste site in Kosovo using Sentinel-2 imagery from 2017 to present. Publish as an HTML page anyone can scroll through.

See [`docs/PHASE1-PLAN.md`](docs/PHASE1-PLAN.md) for step-by-step build plan.

**Why first:** skips the classification problem (we already know these are waste sites). Establishes the data pipeline (auth + download + composite). Validates that Sentinel-2 actually shows what we expect. Produces a dramatic visual deliverable for hackathon presentation / press / pitching.

### 🟡 In progress on `feat/timelapse` (Barlli)

Barlli took a **depth-first approach** — exhaust one site (Mirash) across Phases 1, 2, and 3 before scaling to the other 13. Two iterations shipped on the `feat/timelapse` branch:

- **Iter 01** — `landfill-timelapse/iterations/01-midpoint-2km/`: 14 frames over 2017-2026, 2 km AOI covering both Mirash dumps, true-colour + NDVI animations, no quantification
- **Iter 02** — `landfill-timelapse/iterations/02-muni-bsi/`: 35 frames, 800 m muni-only AOI, true-colour + NDVI + BSI animations, full quantification table, 213-line analysis report at `landfill-timelapse/REPORT.md`

**Tooling note:** pure stdlib + numpy + Pillow + matplotlib. No GDAL, no rasterio, no API key. Data via Microsoft Planetary Computer STAC. ~90s per run.

**Done when:**
- [x] Bounding box generated for Mirash *(both 2km and 800m variants on `feat/timelapse`)*
- [x] Time-series imagery for Mirash 2017-2026 (14 + 35 scenes) *(`feat/timelapse`)*
- [x] Animated GIFs generated for Mirash (true-colour + NDVI + BSI) *(`feat/timelapse`)*
- [ ] Coordinates verified for the other 13 sites in `known-sites.geojson`
- [ ] Time-series imagery downloaded for the other 13 sites
- [ ] Animated GIFs generated for the other 13 sites
- [ ] `docs/index.html` lists all sites with embedded animations
- [ ] Mirash work merged from `feat/timelapse` to `main`

**Original killer demo target:** Mirash 2017→2026 with NDWI overlay, lake filling visibly.
**What Barlli actually shipped:** quantitative finding documented in `REPORT.md` — *NDVI inside the 400m ROI fell from +0.258 (2017) to +0.060 (2026), a **77% collapse**, with a step-change visible across 2021.* That's a stronger demo than the original target.

---

## Phase 2 — Spectral fingerprint of known sites · *1 weekend*

**Goal:** for each site at each timestamp, compute NDVI/NDWI/BSI and plot the indices over time. Identify "what does an active landfill look like spectrally" so we can search for unknown sites that match.

**Why second:** uses the data already pulled in Phase 1; converts pretty animations into quantified analysis. Required input for Phase 4.

### 🟡 Done for Mirash on `feat/timelapse`

Iter-02 has NDVI + BSI computed per scene. Time-series in `landfill-timelapse/iterations/02-muni-bsi/waste_area.csv` (35 rows). Headline plot in `waste_area_chart.png`. Analysis in `REPORT.md`.

**Done when:**
- [x] NDVI computed for Mirash, all 35 timestamps *(`feat/timelapse`)*
- [x] BSI computed for Mirash, all 35 timestamps *(`feat/timelapse`)*
- [x] Per-site time-series plot saved as PNG *(`waste_area_chart.png`)*
- [x] Spectral fingerprint findings documented for one site type *(landfill: NDVI <0.10 + BSI ≈ +0.10 saturated)*
- [x] Outlier identified: 2021 step-change documented as needing ground-truth research
- [ ] NDVI/NDWI/BSI computed at the other 13 sites
- [ ] Median spectral signature documented per site type (non-sanitary, recycling, composting)
- [ ] NDWI added (Barlli used NDVI + BSI; NDWI for leachate ponds is still open)

---

## Phase 3 — Change quantification · *1 weekend*

**Goal:** extract numerical change metrics per site over time — area-of-disturbance, leachate-lake volume estimates, growth rates.

**Why third:** quantifies what was qualitative in Phase 1. Outputs feed into the Sim's calibration data and into the validation phase.

### 🟡 Done for Mirash on `feat/timelapse`

Headline metrics from `REPORT.md`:
- Mean NDVI inside 400m ROI: **+0.258 (2017) → +0.060 (2026), −77%**
- Bare-ground area (NDVI<0.25): **87,400 m² (2017) → 150,300 m² (2026), +72%**
- 2021 identified as a **step-change inflection point** — vegetation index falls off a cliff

Caveat: 400m ROI saturates from 2022. Iter 03 with wider ROI is on Barlli's "next steps" list.

**Done when:**
- [x] Per-scene disturbance-area time series for Mirash (35 rows, m² per timestamp) *(`feat/timelapse`)*
- [x] Annual mean NDVI + annual mean BSI for Mirash *(`waste_area.csv`)*
- [x] Step-change detection (the 2021 break point) *(documented in `REPORT.md`)*
- [ ] Same metrics for the other 13 sites
- [ ] Leachate-lake area estimates (would need Iter 03 with NDWI band)
- [ ] Outputs joined back into `known-sites.geojson` as `change_metrics` properties

---

## Phase 4 — Candidate search · *2 weekends*

**Goal:** apply the spectral fingerprint from Phase 2 to the broader Pristina-region AOI. Identify candidates that match the fingerprint but aren't on the known list.

**Why fourth:** can't search effectively until we know what to search for. This is when the original README's Phase 5 (rule-based classifier) becomes useful.

**Done when:**
- [ ] Rule mask applied to Pristina-region AOI
- [ ] Urban areas filtered out (OSM built-up extract or Global Human Settlement Layer)
- [ ] Candidate list extracted as GeoJSON polygons
- [ ] At least 50 candidates labeled via stratified manual review (true positive / construction / quarry / agricultural / other)
- [ ] True-positive rate documented (target: >50%)

---

## Phase 5 — Validation against AMMK · *ongoing*

**Goal:** cross-reference candidates with AMMK's official 458-site illegal-dumpsite register (and Let's Do It Kosovo's competing 500+ count).

**Why fifth:** validation only matters once we have candidates. This is the phase that produces a publishable diff.

**Done when:**
- [ ] AMMK Pristina-region subset obtained (see primary-source audit issue #18)
- [ ] Confusion matrix built: candidates ∩ AMMK / candidates − AMMK / AMMK − candidates
- [ ] At least 5 candidate-only sites field-validated (volunteer with phone)
- [ ] At least 5 AMMK-only sites checked at higher res (Google Earth historical) — likely below Sentinel-2 resolution

---

## Phase 6 — Publish · *1-2 weekends*

**Goal:** public web map combining the known-site animations (Phase 1), the spectral fingerprints (Phase 2), the change metrics (Phase 3), the candidates (Phase 4), and the AMMK validation (Phase 5).

**Why last:** brings everything together. By this point the underlying methodology is solid; this phase is presentation.

**Done when:**
- [ ] Folium map at `docs/index.html` with known sites + candidates layered
- [ ] Per-site detail page with embedded animation + spectral plots
- [ ] GitHub Pages enabled (`flosskosova/trash` repo, `TrashFromSpace/docs/` path) or static hosting at `quarterly.systems/trashfromspace`
- [ ] Map auto-regenerated monthly via GitHub Actions cron

---

## Optional / next-tier work

Listed in README §"What to build next, if v1 works". Not blocking the v1 ship.

- [ ] Sentinel-1 SAR integration (cloud-penetrating, year-round change detection)
- [ ] Landsat thermal (Mirash-specific methane / decomposition heat anomaly)
- [ ] Deep learning classifier (AerialWaste fine-tune)
- [ ] **Cross-reference HackTheTrash citizen reports against satellite candidates** — see `../hackthetrash/`
- [ ] Sentinel-5P TROPOMI methane plume detection (Mirash is a documented major source)
- [ ] One-off VHR imagery (WorldView-3) for top-priority sites (~$10-30/km²)

---

## Status snapshot

**Last updated:** 2026-05-10 (Sunday afternoon, hackathon weekend)
**Current phase:** Phase 1-3 substantially done **for Mirash only** on `feat/timelapse` branch (Barlli, depth-first). Remaining work is breadth — applying same approach to the other 13 sites.
**Active blockers:** none — Barlli's tooling is reproducible (pure stdlib + numpy + Pillow + matplotlib, no API key, ~90s/run, MPC STAC). Other sites can be added by re-running with new `--iter` argument.
**Next milestone:**
- Short-term: merge `feat/timelapse` to main once Barlli's at a stopping point
- Medium-term: extend iter-03 to wider ROI + cover other sites
- Open question: whether to publish Barlli's findings *now* (Mirash NDVI -77% is publishable on its own) or wait for breadth

Update this section when phases complete.

## Strategy note — depth-first vs breadth-first

Barlli's depth-first approach (exhaust Mirash through Phases 1-3 before scaling) turned out to be better than the breadth-first phasing I originally drafted. Reasons:

1. **Validates the methodology against ground truth before applying broadly.** If the pipeline can't show Mirash growing, breadth across 13 sites is worthless.
2. **Surfaces real findings (NDVI -77%, 2021 step-change, water-pit detection) that justify the project regardless of breadth.**
3. **Each iteration is self-contained** — `iterations/01-midpoint-2km/` and `iterations/02-muni-bsi/` snapshot their own builders, so reproducibility is per-iter, not global.

For the remaining 13 sites: a single iteration (e.g., `iter-03-all-sites-800m`) running the Mirash playbook against each site is the natural next step.

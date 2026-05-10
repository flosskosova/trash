# Project Roadmap

Six-phase roadmap for the TrashFromSpace build. Reframed 2026-05-10 from a setup-first technical phasing to a known-sites-first project phasing — start with what we already know exists, validate the pipeline, then expand.

The README's technical phases (download → indices → classify → change-detect → publish) are *substeps within* this project roadmap, not the roadmap itself.

---

## Phase 1 — Known-site time-lapse · *1-2 weekends*

> The killer demo. Start here.

**Goal:** generate animated time-lapses (GIF + MP4) of every known waste site in Kosovo using Sentinel-2 imagery from 2017 to present. Publish as an HTML page anyone can scroll through.

See [`docs/PHASE1-PLAN.md`](docs/PHASE1-PLAN.md) for step-by-step build plan.

**Why first:** skips the classification problem (we already know these are waste sites). Establishes the data pipeline (auth + download + composite). Validates that Sentinel-2 actually shows what we expect. Produces a dramatic visual deliverable for hackathon presentation / press / pitching.

**Done when:**
- [ ] Coordinates verified for all 14 sites in `known-sites.geojson` (`coords_verified: true`)
- [ ] Per-site bounding boxes (~2km × 2km) generated
- [ ] Time-series imagery downloaded for 2017-now per site (~60 monthly composites each)
- [ ] Animated GIF + MP4 generated per site
- [ ] `docs/index.html` lists all sites with embedded animations + descriptions
- [ ] Mirash's "landfill lake" filling visibly tracks on NDWI in animation

**Killer demo target:** Mirash 2017→2026 with NDWI overlay, 8 seconds, lake filling visibly.

---

## Phase 2 — Spectral fingerprint of known sites · *1 weekend*

**Goal:** for each site at each timestamp, compute NDVI/NDWI/BSI and plot the indices over time. Identify "what does an active landfill look like spectrally" so we can search for unknown sites that match.

**Why second:** uses the data already pulled in Phase 1; converts pretty animations into quantified analysis. Required input for Phase 4.

**Done when:**
- [ ] NDVI/NDWI/BSI computed for every Phase 1 timestamp at every site
- [ ] Per-site time-series plots saved as PNGs
- [ ] Median spectral signature documented per site type (sanitary landfill / non-sanitary / recycling facility / composting)
- [ ] Outliers / anomalies flagged (e.g., a site whose NDWI jumped in a single month)

---

## Phase 3 — Change quantification · *1 weekend*

**Goal:** extract numerical change metrics per site over time — area-of-disturbance, leachate-lake volume estimates, growth rates.

**Why third:** quantifies what was qualitative in Phase 1. Outputs feed into the Sim's calibration data and into the validation phase.

**Done when:**
- [ ] Per-site disturbance-area time series (m² per timestamp)
- [ ] Mirash leachate-lake area + volume estimates over time (validates the "1m/year rise" claim from dossier)
- [ ] Annual growth-rate per site
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

**Last updated:** 2026-05-10
**Current phase:** Pre-Phase 1 (scaffolding ready, Phase 1 work hasn't started)
**Active blockers:** none — Copernicus account creation + Phase 1 plan ready to start
**Next milestone:** complete Phase 1 known-site time-lapse — target 1-2 weekends from kickoff

Update this section when phases complete.

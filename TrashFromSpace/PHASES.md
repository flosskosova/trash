# Phase Tracker

Hackathon-style checklist for the TrashFromSpace build. Update this file as phases complete. Each phase has the README.md section it corresponds to + estimated effort + concrete "done when" criteria.

## Phase 1 — Set up access · *1 evening*
README: §"Phase 1: Set up access"

- [ ] Copernicus Data Space Ecosystem account registered + email confirmed
- [ ] Python 3.10+ installed
- [ ] `scripts/setup.sh` run successfully (venv + dependencies installed)
- [ ] `openeo.connect().authenticate_oidc()` succeeds and prints account info

**Done when:** you can run a Python REPL, import `openeo`, and successfully authenticate against Copernicus.

---

## Phase 2 — Define Area of Interest · *1 evening*
README: §"Phase 2: Define the Area of Interest"

- [ ] Decided whether to start with `aoi/pristina_city.geojson` (narrow) or `aoi/pristina_region.geojson` (wider)
- [ ] If neither fits, drew custom polygon at [geojson.io](https://geojson.io) and saved to `aoi/`
- [ ] Polygon visually verified against OpenStreetMap basemap

**Done when:** you have a single GeoJSON polygon you're confident covers the area you want to analyze.

---

## Phase 3 — Download a single scene · *1 evening*
README: §"Phase 3: Download a single Sentinel-2 scene"

- [ ] Code in README §3 runs end-to-end against your AOI
- [ ] `data/pristina_composite.tif` exists, is non-zero size
- [ ] RGB sanity-check displays a recognizable image (Pristina city visible as urban patch; Mirash visible as light patch ~10km west)

**Done when:** you can produce a fresh monthly composite GeoTIFF for your AOI on demand.

**Common gotchas:**
- All scenes are too cloudy → raise `max_cloud_cover` to 40 or extend `temporal_extent`
- AOI too large → openEO timeout or quota issues; trim to one municipality first
- Authentication expired → re-run `authenticate_oidc()`

---

## Phase 4 — Compute spectral indices · *1-2 evenings*
README: §"Phase 4: Compute spectral indices"

- [ ] NDVI computed and saved as a band
- [ ] NDWI computed and saved as a band
- [ ] BSI computed and saved as a band
- [ ] `data/pristina_indices.tif` exists with 3 bands
- [ ] At least one index visualized (e.g., NDVI as heatmap) — Mirash visible as low-NDVI patch

**Done when:** you have a 3-band index raster and can visualize each index for sanity-check.

---

## Phase 5 — First-pass classifier (rule-based) · *1-2 evenings*
README: §"Phase 5: First-pass classifier"

- [ ] Rule-based candidate mask implemented (`(bsi > 0.1) & (ndvi < 0.2) & (ndwi < 0.0)` or similar)
- [ ] Urban areas masked out (OSM built-up extract or Global Human Settlement Layer)
- [ ] Candidate sites extracted as GeoJSON polygons
- [ ] **Stratified manual review** — 50 candidate sites labeled in Google Earth historical imagery
- [ ] True-positive rate computed (target: > 50%)

**Done when:** you have a labeled candidate set with a documented true-positive rate. If TPR < 50%, iterate on the rule before moving on.

---

## Phase 6 — Change detection · *2-3 evenings*
README: §"Phase 6: Change detection"

- [ ] Pipeline runnable for two distinct months
- [ ] Per-site time-series store (one record per site per month)
- [ ] Area-change calculation (% change in mask pixels within site bounding box)
- [ ] Growth alert rule (e.g., > 20% area increase month-over-month)
- [ ] New-site alert (candidate present in month N but not month N-1)

**Done when:** running the pipeline for a new month produces a list of "growing" + "new" sites that's usable for downstream alerts.

---

## Phase 7 — Validate against ground truth · *ongoing*
README: §"Phase 7: Validate against ground truth"

- [ ] AMMK official register obtained (or its Pristina-region subset)
- [ ] Confusion matrix built: candidates ∩ AMMK / candidates - AMMK / AMMK - candidates
- [ ] At least 5 candidate-only sites field-validated by a volunteer with a phone
- [ ] At least 5 AMMK-only sites checked at higher resolution (Google Earth historical) for whether they're below Sentinel-2 resolution

**Done when:** you can publish the diff between your map and AMMK's list with confidence in both directions.

---

## Phase 8 — Publish · *1-2 weekends*
README: §"Phase 8: Publish"

- [ ] Folium map generation script working
- [ ] `docs/index.html` regenerates from a single command
- [ ] GitHub Pages enabled on the `flosskosova/trash` repo (path: `TrashFromSpace/docs/`) or static map hosted elsewhere
- [ ] Map URL public and shareable
- [ ] At least one external person has loaded the map and given feedback

**Done when:** there's a public URL where anyone can view the candidate-sites map, and the URL updates when the pipeline re-runs.

---

## Optional / next-tier work

Listed in README §"What to build next, if v1 works". Not blocking the v1 ship.

- [ ] Sentinel-1 SAR integration (cloud-penetrating)
- [ ] Landsat thermal (Mirash-specific methane/decomposition heat)
- [ ] Deep learning classifier (AerialWaste fine-tune)
- [ ] **Cross-reference HackTheTrash citizen reports against satellite candidates** — see `../hackthetrash/` for the citizen reporting platform
- [ ] Sentinel-5P TROPOMI methane plume detection
- [ ] One-off VHR imagery (WorldView-3) for top-priority sites

---

## Status snapshot

**Last updated:** [date]
**Current phase:** [phase]
**Active blockers:** [list]
**Next milestone:** [target date + scope]

Update this section when phases complete.

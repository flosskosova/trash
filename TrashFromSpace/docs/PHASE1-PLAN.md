# Phase 1 Plan — Known-Site Time-Lapse

> Build a scrollable HTML page with animated time-lapses of every known waste site in Kosovo, 2017→present, generated from free Sentinel-2 imagery. Killer demo target: Mirash's "landfill lake" filling visibly over 9 years.

**Effort:** 1-2 weekends for someone with Python familiarity. Most time is spent waiting on Copernicus downloads, not coding.

**Inputs:** `known-sites.geojson` (14 sites), Copernicus Data Space free account.

**Outputs:** 14 animated GIFs + MP4s, one HTML page that displays them all.

---

## Step-by-step build

### Step 1 — Verify and refine site coordinates · *2-4 hours*

Every feature in `known-sites.geojson` has `coords_verified: false`. The coordinates are city/municipal centers, not actual site footprints. **Refine before downloading anything** — a 2km bounding box around the wrong point gives you imagery of a residential area, not the landfill.

For each site:
1. Open the coords in [Google Maps](https://maps.google.com) or [OpenStreetMap](https://www.openstreetmap.org)
2. Look for the actual landfill / facility footprint — usually visible as a distinct light-grey patch with truck access roads
3. Update the coordinate to the centroid of the visible footprint
4. Set `coords_verified: true` and add `coord_verification_method: "Google Maps satellite, 2026-MM-DD"`

For Mirash specifically: the dossier flags it as ~10km west of Pristina city center, in Obiliq, on KEK-owned land in a former coal pit. Should be visually obvious. The "landfill lake" is southwest of the active deposition area.

For Trepça lead battery recycling: the broader Trepça mining complex is huge; the actual battery-recycling building is a small fraction. May not be visible from satellite if it's an indoor facility — in which case substitute the site of the most-visible mining waste accumulation as a proxy.

**Failure mode:** if you can't confidently identify a site from satellite, mark it `coords_verified: false, skip_phase1: true` and keep moving. Better to ship 10 verified animations than 14 mixed-quality ones.

### Step 2 — Generate per-site bounding boxes · *30 minutes*

For each verified site, generate a 2km × 2km bounding box centered on the coordinate. 2km is large enough to capture context (access roads, neighboring land use, leachate ponds) and small enough to keep download size manageable.

```python
import json
from pathlib import Path

EARTH_R_M = 6371000  # meters
SIDE_M = 2000        # 2km bounding box

def bbox_around(lon, lat, side_m=SIDE_M):
    """Return (west, south, east, north) in degrees, ~side_m on each side."""
    half = side_m / 2
    dlat = (half / EARTH_R_M) * (180 / 3.14159)
    dlon = dlat / max(0.1, abs(__import__('math').cos(lat * 3.14159 / 180)))
    return (lon - dlon, lat - dlat, lon + dlon, lat + dlat)

with open("known-sites.geojson") as f:
    fc = json.load(f)

bboxes = {}
for feat in fc["features"]:
    if not feat["properties"].get("coords_verified"):
        continue  # skip unverified
    lon, lat = feat["geometry"]["coordinates"]
    bboxes[feat["properties"]["id"]] = bbox_around(lon, lat)

Path("data/bboxes.json").write_text(json.dumps(bboxes, indent=2))
print(f"Generated {len(bboxes)} bounding boxes")
```

### Step 3 — Download monthly composites for every site, 2017-now · *1 hour active + ~24 hours wall-clock*

Sentinel-2A launched 2015 but 2B (which gave 5-day revisit) launched March 2017. Earlier data exists but is sparser. Start at 2017-04 to be safe.

For each site, for each month from 2017-04 to current month, request a median composite over that month. Save as `data/<site_id>/<YYYY-MM>.tif`.

```python
import openeo
from datetime import date
from pathlib import Path
import json

connection = openeo.connect("openeo.dataspace.copernicus.eu")
connection.authenticate_oidc()

bboxes = json.loads(Path("data/bboxes.json").read_text())

# Date range
start_year_month = (2017, 4)
end_year_month = (date.today().year, date.today().month)

def months_between(start, end):
    y, m = start
    while (y, m) <= end:
        yield (y, m)
        m += 1
        if m > 12:
            m = 1
            y += 1

for site_id, (w, s, e, n) in bboxes.items():
    site_dir = Path(f"data/{site_id}")
    site_dir.mkdir(parents=True, exist_ok=True)
    for y, m in months_between(start_year_month, end_year_month):
        month_str = f"{y:04d}-{m:02d}"
        out_path = site_dir / f"{month_str}.tif"
        if out_path.exists():
            continue  # resume-friendly
        # ...month bounds
        next_m = m + 1 if m < 12 else 1
        next_y = y if m < 12 else y + 1
        try:
            cube = connection.load_collection(
                "SENTINEL2_L2A",
                spatial_extent={"west": w, "south": s, "east": e, "north": n, "crs": "EPSG:4326"},
                temporal_extent=[f"{y:04d}-{m:02d}-01", f"{next_y:04d}-{next_m:02d}-01"],
                bands=["B02", "B03", "B04", "B08", "B11", "B12"],
                max_cloud_cover=30,
            )
            cube.median_time().download(str(out_path))
            print(f"  ✓ {site_id} {month_str}")
        except Exception as ex:
            # Cloudy or no data — leave a marker so we don't retry forever
            (site_dir / f"{month_str}.SKIP").write_text(str(ex))
            print(f"  ✗ {site_id} {month_str}: {ex}")
```

**Throughput note:** Copernicus has rate limits + queue depth. Expect ~24 hours wall-clock for 14 sites × ~110 months each. Run overnight + over a weekend. The script is resume-friendly — re-run if it crashes.

**Storage:** ~50-200 MB per site after compositing. Total ~1-3 GB. Don't commit to git; keep in `data/` (already gitignored).

### Step 4 — Generate animated GIF + MP4 per site · *2-3 hours*

For each site, stack the monthly composites chronologically and render as animation.

For an RGB-only animation:

```python
import rasterio
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation, PillowWriter
from pathlib import Path

def render_animation(site_id, output_format="gif"):
    site_dir = Path(f"data/{site_id}")
    tifs = sorted(site_dir.glob("*.tif"))
    if not tifs:
        return

    frames = []
    captions = []
    for tif in tifs:
        with rasterio.open(tif) as src:
            r = src.read(3).astype(float)
            g = src.read(2).astype(float)
            b = src.read(1).astype(float)
            rgb = np.stack([r, g, b], axis=-1)
            rgb = np.clip(rgb / 3000, 0, 1)
            frames.append(rgb)
            captions.append(tif.stem)  # YYYY-MM

    fig, ax = plt.subplots(figsize=(8, 8))
    img = ax.imshow(frames[0])
    title = ax.text(0.5, 1.02, captions[0], ha="center", transform=ax.transAxes, fontsize=14)
    ax.axis("off")

    def update(i):
        img.set_array(frames[i])
        title.set_text(captions[i])
        return img, title

    anim = FuncAnimation(fig, update, frames=len(frames), interval=300, blit=False)
    out_path = Path(f"docs/animations/{site_id}.{output_format}")
    out_path.parent.mkdir(parents=True, exist_ok=True)
    if output_format == "gif":
        anim.save(out_path, writer=PillowWriter(fps=4))
    else:
        anim.save(out_path, writer="ffmpeg", fps=4)
    plt.close(fig)
    print(f"✓ {site_id}: {len(frames)} frames → {out_path}")

# Batch
for feat in __import__('json').loads(Path("known-sites.geojson").read_text())["features"]:
    if feat["properties"].get("coords_verified") and not feat["properties"].get("skip_phase1"):
        render_animation(feat["properties"]["id"])
```

For a fancier "RGB + NDWI overlay" (good for Mirash specifically — visualizes the landfill lake filling), compute NDWI per frame and overlay as a blue alpha layer:

```python
ndwi = (g - nir) / (g + nir + 1e-9)
water_mask = ndwi > 0.0
# Composite: RGB underneath, blue tint where water_mask is True
# (left as exercise)
```

### Step 5 — Build the HTML index page · *1-2 hours*

A single `docs/index.html` that lists every site with its animation embedded.

Minimum viable:

```python
from pathlib import Path
import json

fc = json.loads(Path("known-sites.geojson").read_text())

sections = []
for feat in fc["features"]:
    p = feat["properties"]
    if not p.get("coords_verified"):
        continue
    sid = p["id"]
    anim_path = Path(f"docs/animations/{sid}.gif")
    if not anim_path.exists():
        continue
    sections.append(f"""
    <section id="{sid}">
      <h2>{p["name"]}</h2>
      <p><strong>Type:</strong> {p["type"].replace("_", " ")} ·
         <strong>Operator:</strong> {p.get("operator", "?")} ·
         <strong>Region:</strong> {p["region"]}</p>
      <p>{p.get("notes", "")}</p>
      <img src="animations/{sid}.gif" alt="{p['name']} time-lapse 2017-now"
           style="max-width:600px; width:100%; height:auto;" />
    </section>
    """)

html = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>TrashFromSpace — Kosovo waste sites time-lapse 2017-2026</title>
<style>
  body {{ font-family: -apple-system, system-ui, sans-serif; max-width: 720px; margin: 2em auto; padding: 0 1em; line-height: 1.5; }}
  h1 {{ font-size: 2em; }}
  section {{ margin: 3em 0; padding-bottom: 2em; border-bottom: 1px solid #ddd; }}
  img {{ display: block; margin: 1em 0; border: 1px solid #ccc; }}
</style>
</head>
<body>
<h1>Kosovo Waste Sites · Sentinel-2 Time-Lapse</h1>
<p>Free European satellite imagery, 2017→present. Each animation shows monthly median composites of one known waste site. Built as Phase 1 of the <a href="https://github.com/flosskosova/trash/tree/main/TrashFromSpace">TrashFromSpace</a> project. AI-assisted; verify before citing.</p>
{"".join(sections)}
<footer style="margin-top:4em; padding-top:1em; border-top:2px solid #333; font-size:0.9em; color:#666;">
  <p>Data: <a href="https://dataspace.copernicus.eu">Copernicus Data Space Ecosystem</a> · Code: <a href="https://github.com/flosskosova/trash">flosskosova/trash</a> · Last regenerated: <em>fill in</em></p>
</footer>
</body>
</html>"""

Path("docs/index.html").write_text(html)
print(f"Wrote docs/index.html with {len(sections)} site sections")
```

### Step 6 — Publish · *30 minutes*

Two options:

**(a) GitHub Pages** — enable Pages on the `flosskosova/trash` repo with source path `TrashFromSpace/docs/`. Pushing a new `index.html` updates the live site automatically.

**(b) Cloudflare Pages on `quarterly.systems`** — same pattern as the existing `quarterly.systems/trashdemo`. Add a `quarterly-systems-landing/public/trashfromspace/` folder, copy `docs/*` into it, push.

Both are free. (a) keeps everything in one repo; (b) keeps the live URLs under a single domain.

---

## Estimated cumulative effort

| Step | Active time | Wall-clock |
|---|---|---|
| 1. Verify coords | 2-4 hrs | 2-4 hrs |
| 2. Generate bboxes | 30 min | 30 min |
| 3. Download imagery | 1 hr setup | 24-48 hrs (run overnight × 2) |
| 4. Generate animations | 2-3 hrs | 2-3 hrs |
| 5. Build HTML page | 1-2 hrs | 1-2 hrs |
| 6. Publish | 30 min | 30 min |
| **Total** | **~8 hours active** | **2 weekends** |

---

## Killer demo subset (if time-boxed)

If the team has only 1 weekend, do **Mirash + Gërmova + Sferkë + Landovicë + Velekincë** (the 5 regional sanitary landfills). That's enough to:

- Validate the pipeline against multiple sites
- Show comparative spectral signatures (Phase 2 hint)
- Have a presentable page Sunday afternoon

The 4 non-sanitary sites + the 3 recycling facilities can land in week 2.

---

## Failure modes + recoveries

| Failure | Recovery |
|---|---|
| Copernicus auth keeps expiring | Re-run `authenticate_oidc()` mid-script; or use refresh tokens (openEO docs) |
| Some months have no clear imagery (winter cloud) | Skip with `.SKIP` marker; the animation has a slightly uneven cadence but that's fine |
| Site coordinates wrong (wrong patch) | Refine in step 1; re-download for that site only |
| Animation is too jumpy due to seasonal vegetation | Switch from RGB to NDVI-difference rendering — `(NDVI_t − NDVI_baseline)`. Filters out vegetation-cycle noise. |
| Mirash leachate lake invisible in plain RGB | Add NDWI overlay (see step 4 fancier variant). Lake should pop out as blue. |
| Imagery download too slow | Reduce date range to 2020-now; or split work across team members with each owning ~3 sites |

---

## What Phase 1 doesn't do (handled later)

- **No classifier** — Phase 4
- **No change quantification** — Phase 3 (animations are qualitative)
- **No new-site detection** — Phase 4
- **No AMMK validation** — Phase 5
- **No spectral fingerprinting analysis** — Phase 2 (but the data this phase pulls is what Phase 2 reads)

Phase 1 is intentionally narrow: pretty animations of known sites. That's the foundation everything else builds on.

---

## Demo polish ideas (optional)

- Side-by-side comparison: 2017 vs 2026 still frame for each site, hover to flip
- NDWI overlay as a toggle on each animation
- Click-through: each animation links to a `docs/sites/<id>.html` detail page with all 6 spectral bands shown separately + a per-month grid view
- Embed in `quarterly.systems/trashfromspace` with a header banner pointing back to the main hackathon repo

# Watching Trash from Space: A Sentinel-2 Pipeline for Pristina

> **⚠️ DRAFT — VERIFY BEFORE USE**
>
> This document was generated rapidly using Claude (an AI assistant) drawing on web-search results and published research. Code snippets, API parameters, and library versions should be tested before relying on them. Some specifics will have changed since the cited sources were published. Treat this as a starting point for a build, not a finished spec.

---

## What this document is

A practical guide for a small volunteer team (3-5 people, mixed technical skills) who want to use free European satellite imagery to locate, classify, and monitor solid waste accumulations in and around Pristina, Kosovo.

It's written for people who can write Python and follow tutorials but who haven't necessarily worked with satellite data before. No GIS background required.

The realistic deliverable for a team starting from zero is **a public map of candidate waste sites in the Pristina region, regenerated monthly, with a simple change-detection alert when sites grow**. That's achievable in 2-3 months of part-time work. Going beyond that (high-precision detection of small illegal dumps, neighborhood-level container monitoring, real-time alerts) requires either commercial imagery or substantially more engineering.

## What you can and cannot detect

This is the most important thing to be honest about upfront.

**Sentinel-2 imagery is free.** The European Space Agency's Sentinel-2 mission images all of Kosovo every 5 days at 10-meter resolution across 13 spectral bands. Anyone can download it. Anyone can use it.

**At 10-meter resolution, what you can reliably detect is large**. Each pixel is 10m × 10m = 100 square meters. To classify something as waste rather than dirt, vegetation, water, or buildings, you need at least several pixels. In practical terms:

- **Mirash landfill (7 hectares, ~70,000 m²)**: easy to detect, monitor, and characterize.
- **A formal recycling depot or collection yard (hundreds of m²)**: detectable.
- **A 30m x 30m illegal dump**: detectable but low confidence, easy to confuse with construction sites or bare earth.
- **A single overflowing residential container**: invisible. Far below resolution.
- **Plastic bags floating in a river**: invisible directly, but the *aggregation* of waste at river bends or below dams may be detectable as a colour anomaly.
- **A construction-debris dump along a road shoulder**: typically invisible unless it's persistent and growing.

For the small-dump problem, you would need **Very High Resolution (VHR) commercial imagery** (Maxar's WorldView-3 at 30 cm/pixel, Planet's SkySat at 50 cm/pixel) which costs real money and is not freely available at scale. Some VHR imagery is accessible for free via Google Earth historical layers but requires manual review and isn't programmatic.

**The honest framing**: a Sentinel-2 pipeline can produce a credible inventory of large waste sites, change-detection alerts on growing sites, and a methodology that shows where higher-resolution follow-up is warranted. It cannot single-handedly map the 458-to-1,500+ illegal dumpsites that civil society organizations report, because most of those are below resolution.

What it can do that nobody is currently doing in Kosovo: produce an independent, reproducible, monthly-updated count of large waste accumulations using transparent methodology. That is genuinely useful.

## What you'll build

A pipeline that does this end-to-end:

1. Defines an Area of Interest covering Pristina and surrounding municipalities.
2. Downloads Sentinel-2 imagery for that area, periodically (e.g. monthly composites).
3. Computes spectral indices that flag candidate waste areas.
4. Applies a classifier (rule-based to start, machine-learning later) to identify candidate sites.
5. Compares against the previous month to detect growth or new appearances.
6. Outputs a web map showing candidate sites, their history, and confidence.

You can build the v1 in a weekend if you've done geospatial work before. From a cold start with no remote sensing background, plan on 4-8 weekends.

## Stack

Free tools the entire way:

- **Python 3.10+** as the language.
- **Copernicus Data Space Ecosystem** for satellite data ([dataspace.copernicus.eu](https://dataspace.copernicus.eu)). Free account required.
- **`openeo` Python client** for downloading imagery. The current recommended way to access Copernicus data programmatically.
- **`rasterio` and `numpy`** for image processing.
- **`geopandas` and `shapely`** for vector geometry (sites, areas of interest).
- **`scikit-learn`** for classical ML (random forests etc).
- **`PyTorch` or `TensorFlow`** if/when moving to deep learning. Not needed for v1.
- **`Folium` or `Leaflet`** for the web map.
- **GitHub** for code and a static site host (GitHub Pages works fine for the map).

Optional:
- **Sentinel Hub Process API** — easier than openEO for some tasks but requires more setup.
- **QGIS** for manual exploration. Not required programmatically but useful for sanity checks.

## Phase 1: Set up access (1 evening)

Register at [dataspace.copernicus.eu](https://dataspace.copernicus.eu). The account is free. Confirm the email.

Install Python and a virtual environment:

```bash
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install openeo rasterio numpy geopandas shapely matplotlib folium scikit-learn
```

Or run `scripts/setup.sh` from this directory — it does the same.

Test the connection:

```python
import openeo

connection = openeo.connect("openeo.dataspace.copernicus.eu")
connection.authenticate_oidc()
# Follow the URL prompt, log in with your Copernicus account
print("Authenticated:", connection.describe_account())
```

If that works, you're ready to download data.

## Phase 2: Define the Area of Interest (1 evening)

Pristina municipality is roughly bounded by these coordinates (WGS84):

- Western bound: 21.05°E
- Eastern bound: 21.30°E
- Southern bound: 42.55°N
- Northern bound: 42.75°N

For the project, you probably want a wider area. Consider including:

- The full Pristina municipality (city plus surrounding villages).
- Obiliq/Obilic municipality (Mirash landfill, KEK power plants).
- Fushë Kosova / Fushe Kosova (informal recycling, scrap yards).
- Lipjan and Drenas (waste flows to Mirash from these).
- Rivers Sitnica, Llap, and Drenica (riverbank dumping is a known problem).

**Two starter AOIs are provided in this repo** under `aoi/`:
- [`aoi/pristina_city.geojson`](aoi/pristina_city.geojson) — narrow bounding box (Pristina municipality only, the spec's starter coords)
- [`aoi/pristina_region.geojson`](aoi/pristina_region.geojson) — wider bounding box covering Obiliq, Fushë Kosova, Lipjan, Drenas with buffer

Refine either polygon (draw new bounds at [geojson.io](https://geojson.io) and replace the file) when you have a better sense of what you want to include.

## Phase 3: Download a single Sentinel-2 scene (1 evening)

Get a recent cloud-free scene to confirm everything works. Use openEO:

```python
import openeo
from datetime import date, timedelta

connection = openeo.connect("openeo.dataspace.copernicus.eu")
connection.authenticate_oidc()

# Bounding box for Pristina region
spatial_extent = {
    "west": 21.05, "south": 42.55,
    "east": 21.30, "north": 42.75,
    "crs": "EPSG:4326"
}

# Pull a recent month
end = date.today()
start = end - timedelta(days=30)

cube = connection.load_collection(
    "SENTINEL2_L2A",
    spatial_extent=spatial_extent,
    temporal_extent=[start.isoformat(), end.isoformat()],
    bands=["B02", "B03", "B04", "B08", "B11", "B12"],  # Blue, Green, Red, NIR, SWIR1, SWIR2
    max_cloud_cover=20  # Skip cloudy scenes
)

# Make a median composite for the month
composite = cube.median_time()

# Download as GeoTIFF
composite.download("data/pristina_composite.tif")
```

This pulls Level-2A data (atmospherically corrected surface reflectance, the version you almost always want) and produces a single GeoTIFF with the bands stacked.

The choice of bands matters:
- **B02, B03, B04**: Blue, Green, Red. For visual inspection.
- **B08**: Near-infrared. Required for vegetation index (NDVI).
- **B11, B12**: Short-wave infrared. Useful for distinguishing waste from bare soil and for thermal-adjacent properties.

A median composite over a month reduces cloud and shadow artifacts. For a region with frequent winter cloud cover like Kosovo, monthly is the smallest practical time step.

Sanity-check the result by viewing it. Open the file in QGIS (free) or just view RGB in Python:

```python
import rasterio
import matplotlib.pyplot as plt
import numpy as np

with rasterio.open("data/pristina_composite.tif") as src:
    rgb = src.read([3, 2, 1])  # Red, Green, Blue (band order matches your download)
    rgb = np.transpose(rgb, (1, 2, 0))
    rgb = np.clip(rgb / 3000, 0, 1)  # Stretch for display
    plt.imshow(rgb)
    plt.title("Pristina region, Sentinel-2 composite")
    plt.show()
```

You should see Pristina city as a grey/tan urban area, agricultural land in greens and browns, and Mirash landfill as a distinct light patch about 10 km west of the city.

## Phase 4: Compute spectral indices (1-2 evenings)

The literature on satellite-based waste detection consistently uses these indices ([Satellite Data Potentialities review, 2023](https://www.mdpi.com/1424-8220/23/8/3917)):

**NDVI (Normalized Difference Vegetation Index)**

```
NDVI = (NIR - Red) / (NIR + Red) = (B08 - B04) / (B08 + B04)
```

Healthy vegetation: 0.3 to 0.9. Bare soil: 0.0 to 0.2. Water and impervious surfaces: < 0. Active landfills typically show suppressed NDVI relative to their surroundings, sometimes with a "depression" pattern as nearby vegetation is stressed by leachate or methane.

**NDWI (Normalized Difference Water Index)**

```
NDWI = (Green - NIR) / (Green + NIR) = (B03 - B08) / (B03 + B08)
```

Useful for picking up leachate ponds and water accumulation around landfills. Mirash specifically is documented to have a "landfill lake" that rises a meter per year ([Prishtina Insight 2017](https://prishtinainsight.com/mirash-landfill-looming-environmental-disaster-mag/)). NDWI should highlight it.

**DDI (Difference Dump Index)** — proposed in landfill-specific literature; combines visible and SWIR bands. Less standardized; experiment with simple SWIR/NIR ratios first.

**Bare Soil Index (BSI)**

```
BSI = ((SWIR1 + Red) - (NIR + Blue)) / ((SWIR1 + Red) + (NIR + Blue))
```

Distinguishes bare or disturbed earth from vegetation and water. Useful for catching new waste deposits before vegetation recovery.

Compute and save these as separate raster bands:

```python
import rasterio
import numpy as np

with rasterio.open("data/pristina_composite.tif") as src:
    blue = src.read(1).astype(float)
    green = src.read(2).astype(float)
    red = src.read(3).astype(float)
    nir = src.read(4).astype(float)
    swir1 = src.read(5).astype(float)
    swir2 = src.read(6).astype(float)
    profile = src.profile

# Avoid division by zero
def safe_div(a, b):
    return np.where(b != 0, a / b, 0)

ndvi = safe_div(nir - red, nir + red)
ndwi = safe_div(green - nir, green + nir)
bsi = safe_div((swir1 + red) - (nir + blue), (swir1 + red) + (nir + blue))

# Stack and save
indices = np.stack([ndvi, ndwi, bsi])
profile.update(count=3, dtype='float32')

with rasterio.open("data/pristina_indices.tif", 'w', **profile) as dst:
    dst.write(indices.astype('float32'))
```

## Phase 5: First-pass classifier (rule-based, 1-2 evenings)

Don't start with deep learning. Start with rules. They're transparent, debuggable, and surprisingly effective for landfill-scale features.

A rule for "candidate large waste accumulation":
- BSI > 0.1 (bare/disturbed earth)
- NDVI < 0.2 (no healthy vegetation)
- Not water (NDWI < 0.0)
- Not residential urban (need to mask urban areas separately, see below)
- Cluster size > 5 pixels (i.e. > 500 m²)

```python
candidate = (bsi > 0.1) & (ndvi < 0.2) & (ndwi < 0.0)
```

That mask will pick up Mirash. It will also pick up construction sites, quarries, parking lots, and recently-plowed fields. That's why this is a *candidate* mask, not a final answer.

To filter out cities, download Pristina's built-up area from [OpenStreetMap](https://www.openstreetmap.org/#map=11/42.65/21.18) or the [Global Human Settlement Layer](https://human-settlement.emergency.copernicus.eu/) and exclude those pixels. You'll be left with off-urban candidates: legitimate landfills, illegal dumps, quarries, construction sites, agricultural disturbance.

The next step is **stratified manual review**. Take 50 candidate sites, look at each one in Google Earth historical imagery, and label them:

- True positive (waste site)
- Construction/development
- Quarry/mining
- Agricultural/bare field
- Other

If your rule has > 50% true-positive rate, you have a usable starting point. If lower, refine the rule or add features.

## Phase 6: Change detection (2-3 evenings)

This is where the work gets genuinely useful. A single snapshot can be done by anyone with a satellite browser. Time-series comparison is what justifies a real pipeline.

For each candidate site, store its bounding box and characteristics. Re-run the pipeline monthly. For each existing site, compute:

- **Change in area** (pixel count of mask within bounding box)
- **Change in NDVI** (declining vegetation = expanding disturbance)
- **Change in BSI** (increasing bare/disturbed area)

Flag any site where area grew by > 20% in one month. Flag any *new* candidate that wasn't there last month.

The change detection is what gives you both:
- An independent measure of whether known sites (e.g. Mirash) are growing.
- A way to surface new illegal dumps as they appear, rather than relying on residents to report them.

## Phase 7: Validate against ground truth (ongoing)

The Pastrimi-Municipality dispute means there are several existing lists you can validate against:

- **AMMK official register**: 458 illegal landfills nationally, with municipal breakdowns. Get the Pristina-region subset.
- **Let's Do It Kosovo**: maintains their own count, asserting > 500 nationally.
- **BIRN's regional landfill mapping** ([2024](https://balkaninsight.com/2024/03/29/its-devastating-birn-maps-illegal-landfills-blighting-the-balkans/)): coordinates may be available on request.
- **Field validation**: the most credible. A volunteer with a phone driving to flagged candidate locations can confirm or refute in 30 seconds per site.

Confusion matrix:
- Sites in your map AND in AMMK's list: validation
- Sites in your map but NOT in AMMK's list: candidates for new illegal dump alerts
- Sites in AMMK's list but NOT in your map: probably below resolution; flag for higher-resolution review

The diff between your map and AMMK's is publishable on its own, regardless of the rest of the project.

## Phase 8: Publish (1-2 weekends)

The output is a public web map. The minimum is a Folium map exported as static HTML, hosted on GitHub Pages.

```python
import folium
import geopandas as gpd

sites = gpd.read_file("data/candidate_sites.geojson")

m = folium.Map(location=[42.65, 21.18], zoom_start=11)

for _, site in sites.iterrows():
    folium.CircleMarker(
        location=[site.geometry.y, site.geometry.x],
        radius=site.area_ha * 2,  # Scale by site size
        popup=f"Site #{site.id}<br>Area: {site.area_ha:.1f} ha<br>Last seen: {site.last_seen}",
        color="red" if site.growing else "orange",
        fill=True
    ).add_to(m)

m.save("docs/index.html")
```

That's it. Every month, the script regenerates `docs/index.html`, GitHub Pages serves it, and the map is updated.

For more polish, look at [Leafmap](https://leafmap.org/), which adds time-series controls and basemap options.

## Practical limits and honest caveats

**Cloud cover.** Kosovo gets significant winter cloud cover. Some months you may not have a single clean Sentinel-2 image of Pristina. Sentinel-1 SAR (also free, also via Copernicus) is cloud-penetrating but harder to interpret and not as good for waste classification specifically.

**Mixed pixels at boundaries.** A 10m pixel that contains 30% waste, 40% bare earth, and 30% gravel will not classify cleanly. This is fundamental to the resolution and not solvable without VHR imagery.

**False positives from construction.** Kosovo has an active construction sector and many sites that look exactly like illegal dumps in spectral terms. Validation is essential.

**Legal status confusion.** A pixel cannot tell you whether a site is a legal landfill, an illegal dump, a recycling yard, or a temporary construction debris pile. That requires cross-referencing with permit data, which is generally not public in Kosovo.

**Change ≠ harm.** A site that grew by 20% may have been actively remediated and resorted, not just expanded. Site-level interpretation requires either field validation or temporal pattern analysis.

**Not a substitute for ground truth.** This pipeline supplements field surveys, doesn't replace them. The right framing is "narrow the candidate list before visiting" rather than "make field visits unnecessary."

## What to build next, if v1 works

Listed roughly in order of difficulty:

1. **Sentinel-1 SAR integration**: cloud-penetrating, useful for change detection year-round.
2. **Landsat thermal data**: thermal anomalies indicate active landfills with biological decomposition (heat) or methane combustion. Useful specifically for Mirash.
3. **Deep learning classifier**: fine-tune a model on the [AerialWaste dataset](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9889343/) (10,434 labeled images from Lombardy) and apply to Sentinel-2 patches. Published F1 scores of 90%+ are achievable.
4. **Citizen reporting integration**: web form where Pristina residents can submit photos and coordinates of dumps they encounter; cross-reference against satellite candidates. **Note: HackTheTrash (the sibling app under `hackthetrash/` in this repo) already does the citizen-reporting side. Cross-referencing satellite candidates against HackTheTrash submissions is the natural integration point.**
5. **Methane emission detection**: Sentinel-5P TROPOMI measures atmospheric methane at coarse resolution but can identify large emission plumes. Mirash is a major methane source.
6. **VHR imagery for validated hotspots**: pay for one-off WorldView-3 acquisitions (~$10-30/km² typically) over the highest-priority candidates to confirm and characterize.

## Cost estimate for a v1 build

- Sentinel-2 imagery: free
- Compute: a laptop is sufficient for v1. Cloud compute (~$20/month) makes monthly runs faster.
- Hosting: GitHub Pages, free
- Domain (optional): ~$15/year

Total: under $100 for the year if you stay on free tiers.

A 4-person volunteer team working ~5 hours/week each can produce a public v1 in 2-3 months. Going from "map exists" to "respected, regularly-cited reference" is a multi-year community-building effort, not a technical effort.

## References

### Foundational papers

- [AerialWaste dataset for landfill discovery in aerial and satellite images](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9889343/) (Torres & Fraternali, 2023). 10,434 labeled images; the standard benchmark for waste detection in aerial imagery.
- [Revealing influencing factors on global waste distribution via deep-learning based dumpsite detection from satellite imagery](https://www.nature.com/articles/s41467-023-37136-1) (Nature Communications, 2023). 2,500-site global dataset.
- [Satellite Data Potentialities in Solid Waste Landfill Monitoring: Review and Case Studies](https://www.mdpi.com/1424-8220/23/8/3917) (Sensors, 2023). Methodology review covering NDVI, NDWI, LST, and SAR for landfills.
- [Satellite monitoring of terrestrial plastic waste](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9847976/) (Maus et al., 2022). Operational pipeline for plastic waste detection in Southeast Asia using Sentinel-1 and Sentinel-2.
- [A Deep Learning Pipeline for Solid Waste Detection in Remote Sensing Images](https://arxiv.org/pdf/2502.06607) (2025). VHR-imagery-based pipeline with Italian environmental agency.
- [Waste Detection and Change Analysis based on Multispectral Satellite Imagery](https://arxiv.org/pdf/2303.14521) (Cseh et al., 2023). Random forest classification on Sentinel-2 for the Tisza river (Hungary). Closest regional analog to Kosovo.

### Tools and tutorials

- [Copernicus Data Space Ecosystem](https://dataspace.copernicus.eu/) — primary data source.
- [openEO documentation](https://openeo.org/documentation/1.0/) — recommended Python client.
- [Sentinel Hub Process API](https://documentation.dataspace.copernicus.eu/APIs/SentinelHub.html) — alternative for cloud-side processing.
- [Downloading Sentinel-2 with Python from Copernicus (Medium tutorial, 2025)](https://medium.com/@steve.lacroix32/downloading-sentinel-2-satellite-images-with-python-8048971904cd) — practical walkthrough.
- [European Space Imaging on landfill detection with deep learning](https://www.euspaceimaging.com/combining-vhr-satellite-imagery-and-deep-learning-to-detect-landfills/) — commercial perspective on what's operationally possible.

### Datasets

- [AerialWaste Dataset (Lombardy, Italy)](https://aerialwaste.org/) — 10,434 labeled images, free for research.
- [European Environment Agency Kosovo Country Fact Sheet](https://www.eea.europa.eu/themes/waste/waste-management/municipal-waste-management-country/kosovo-municipal-waste-factsheet-2021) — baseline waste statistics for validation.

### Kosovo context (in this repo)

- [`../dossier/how-trash-works-pristina.md`](../dossier/how-trash-works-pristina.md) — institutional, legal, and political context for Kosovo waste management. Read first if you have not.
- [`../dossier/timeline.md`](../dossier/timeline.md) — 2010-2027 chronology of Kosovo's waste system.
- [`../dossier/numbers.md`](../dossier/numbers.md) — canonical numbers reference (waste tonnage, coverage, illegal landfills time series).
- [`../dossier/system-map.json`](../dossier/system-map.json) — graph data model of actors and relationships.
- [`../hackthetrash/`](../hackthetrash/) — sibling project: citizen reporting platform (web + mobile + admin). The natural integration point for ground-truth submissions cross-referencing satellite candidates.

---

*This document is a starting point for technical work. Adapt freely, verify all code before relying on it, and contribute improvements upstream where possible.*

*Last source check: April 28, 2026.*

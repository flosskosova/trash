#!/usr/bin/env bash
# TrashFromSpace — Phase 1 setup automation
# Creates a Python venv and installs the Sentinel-2 pipeline dependencies.
# Run from inside TrashFromSpace/: bash scripts/setup.sh
set -euo pipefail

echo "→ Creating Python venv at .venv/"
python3 -m venv .venv

echo "→ Activating venv"
# shellcheck disable=SC1091
source .venv/bin/activate

echo "→ Upgrading pip"
pip install --upgrade pip

echo "→ Installing core dependencies"
pip install \
  openeo \
  rasterio \
  numpy \
  geopandas \
  shapely \
  matplotlib \
  folium \
  scikit-learn

echo "→ Creating data/ directory (gitignored)"
mkdir -p data

echo ""
echo "✓ Setup complete."
echo ""
echo "Next steps:"
echo "  1. Register at https://dataspace.copernicus.eu (free)"
echo "  2. Activate the venv:    source .venv/bin/activate"
echo "  3. Test connection:      python -c 'import openeo; c = openeo.connect(\"openeo.dataspace.copernicus.eu\"); c.authenticate_oidc(); print(c.describe_account())'"
echo "  4. Read README.md Phase 3 to download your first scene."

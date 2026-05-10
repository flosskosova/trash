"use client";

import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useI18n } from "@/lib/i18n";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const colorIcon = (color: string) =>
  L.divIcon({
    className: "",
    html: `<div style="background:${color};width:18px;height:18px;border-radius:50%;border:3px solid white;box-shadow:0 0 4px rgba(0,0,0,.3)"></div>`,
    iconSize: [18, 18]
  });

const STATUS_COLORS: Record<string, string> = {
  reported: "#DC2626",
  verified: "#F59E0B",
  cleaning: "#3B82F6",
  cleaned: "#10B981",
  rejected: "#6B7280"
};

type Report = {
  id: string;
  latitude: number;
  longitude: number;
  status: keyof typeof STATUS_COLORS | string;
  description?: string;
  tags?: string[];
  severity?: string;
  // Backend may return either of these depending on storage backend
  photoUrls?: string[];
  photo_urls?: string[];
  createdAt?: string;
  created_at?: string;
  takenAt?: string;
  taken_at?: string;
};

// Helper: prepend API base to relative photo URLs
const fullPhotoUrl = (u: string) => (u.startsWith("http") ? u : `${API_URL}${u}`);

// Helper: pick photo URLs from either field name
const getPhotos = (r: Report): string[] => r.photoUrls ?? r.photo_urls ?? [];

// Helper: pick createdAt from either field name
const getCreated = (r: Report): string | undefined => r.createdAt ?? r.created_at;

// Helper: pick takenAt (when the photo was taken, from EXIF) from either field name
const getTaken = (r: Report): string | undefined => r.takenAt ?? r.taken_at;

// Pristina city centre (used as the default starting view of the map)
const PRISTINA_CENTER: [number, number] = [42.6629, 21.1655];
const PRISTINA_ZOOM = 13;

// Loose bounds covering greater Prishtina. Keeps the user from getting lost on
// the OpenStreetMap tile layer while still allowing some panning.
const PRISTINA_BOUNDS: L.LatLngBoundsExpression = [
  [42.55, 21.05],
  [42.78, 21.30]
];

// Component to programmatically center the map (e.g. on a freshly submitted report)
function FlyTo({ coords }: { coords: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (coords) map.flyTo(coords, 16, { duration: 1.5 });
  }, [coords, map]);
  return null;
}

// Exposes the leaflet map instance to the parent so we can offer a "home" button.
function MapRef({ onReady }: { onReady: (m: L.Map) => void }) {
  const map = useMap();
  useEffect(() => { onReady(map); }, [map, onReady]);
  return null;
}

export default function PublicMap() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const params = useSearchParams();
  const { t } = useI18n();

  // /map?lat=...&lng=...&id=... will fly to that point (used after submission)
  const flyLat = params.get("lat");
  const flyLng = params.get("lng");
  const flyTarget: [number, number] | null =
    flyLat && flyLng ? [Number(flyLat), Number(flyLng)] : null;
  const highlightId = params.get("id");
  const justSubmitted = params.get("just") === "1";

  // Toast banner shown right after a successful submission. Auto-fades after
  // ~6s; the URL is left intact so a refresh re-shows it (cheap + obvious).
  const [showToast, setShowToast] = useState(justSubmitted);
  useEffect(() => {
    if (!justSubmitted) return;
    const t = setTimeout(() => setShowToast(false), 6000);
    return () => clearTimeout(t);
  }, [justSubmitted]);

  const load = () => {
    fetch(`${API_URL}/api/reports`)
      .then((r) => r.json())
      .then((data) => setReports(data.reports ?? []))
      .catch(() => {
        // Fallback demo data if backend unavailable
        setReports([
          { id: "demo1", latitude: 42.6629, longitude: 21.1655, status: "reported",
            description: "Demo: plastic bottles near Skanderbeg Square", severity: "medium", tags: ["Plastic"] },
          { id: "demo2", latitude: 42.6699, longitude: 21.1782, status: "cleaned",
            description: "Demo: cleaned construction debris in Sunny Hill", severity: "large", tags: ["Construction"] }
        ]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // Poll every 30s so newly submitted reports appear on the OSM layer automatically
    const timer = setInterval(load, 30000);
    return () => clearInterval(timer);
  }, []);

  // Default starting view is always Prishtina city centre. If the user arrives
  // via /map?lat=&lng= (after submitting), we still mount on Prishtina but
  // immediately fly to the freshly submitted point.
  const center = PRISTINA_CENTER;
  const initialZoom = PRISTINA_ZOOM;
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);

  const goHome = () => {
    if (mapInstance) mapInstance.flyTo(PRISTINA_CENTER, PRISTINA_ZOOM, { duration: 1 });
  };

  return (
    <div className="relative h-full w-full">
      {showToast && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-emerald-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 max-w-[90%]">
          <span className="text-2xl">✅</span>
          <div>
            <div className="font-semibold text-sm">Report logged</div>
            <div className="text-xs opacity-90">Authorities can now see this on the public map.</div>
          </div>
          <button
            type="button"
            onClick={() => setShowToast(false)}
            className="ml-2 text-white/70 hover:text-white text-lg leading-none"
            aria-label="Dismiss"
          >×</button>
        </div>
      )}
      <MapContainer
        center={center}
        zoom={initialZoom}
        minZoom={11}
        maxZoom={19}
        maxBounds={PRISTINA_BOUNDS}
        maxBoundsViscosity={0.7}
        className="h-full w-full"
      >
        {/* OpenStreetMap raster tile layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapRef onReady={setMapInstance} />
        <FlyTo coords={flyTarget} />

        {reports.map((r) => {
          const photos = getPhotos(r);
          const created = getCreated(r);
          const taken = getTaken(r);
          const isHighlight = r.id === highlightId;

          return (
            <Marker
              key={r.id}
              position={[r.latitude, r.longitude]}
              icon={colorIcon(STATUS_COLORS[r.status] ?? "#999")}
              ref={(m) => {
                // Auto-open the popup on the freshly submitted report so the
                // user immediately sees confirmation + details.
                if (isHighlight && m) {
                  setTimeout(() => m.openPopup(), 600);
                }
              }}
            >
              {/* Hover preview tooltip - shows the first photo when the
                  user mouses over the marker. Click still opens the
                  full-size popup below. */}
              <Tooltip
                direction="top"
                offset={[0, -10]}
                opacity={1}
                className="htt-tooltip"
              >
                <div style={{ maxWidth: 200 }}>
                  {photos.length > 0 ? (
                    <>
                      <img
                        src={fullPhotoUrl(photos[0])}
                        alt="trash"
                        style={{
                          width: 200,
                          height: 130,
                          objectFit: "cover",
                          borderRadius: 6,
                          display: "block"
                        }}
                      />
                      {photos.length > 1 && (
                        <div style={{
                          fontSize: 11, color: "#fff", marginTop: 4,
                          textAlign: "center", fontWeight: 600
                        }}>
                          📷 +{photos.length - 1} more
                        </div>
                      )}
                    </>
                  ) : (
                    <div style={{ fontSize: 12, padding: 6 }}>
                      {t("admin.noPhotos")}
                    </div>
                  )}
                  <div style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: STATUS_COLORS[r.status] ?? "#999",
                    marginTop: 4,
                    textTransform: "capitalize"
                  }}>
                    ● {t(`status.${r.status}`)}
                  </div>
                  {r.description && (
                    <div style={{ fontSize: 11, color: "#374151", marginTop: 2 }}>
                      {r.description.length > 60
                        ? r.description.slice(0, 60) + "..."
                        : r.description}
                    </div>
                  )}
                  <div style={{ fontSize: 10, color: "#6B7280", marginTop: 4, fontStyle: "italic" }}>
                    Click for details
                  </div>
                </div>
              </Tooltip>

              <Popup>
                <div style={{ minWidth: 220, maxWidth: 280 }}>
                  {/* Photo gallery */}
                  {photos.length > 0 && (
                    <div style={{ display: "flex", gap: 4, overflowX: "auto", marginBottom: 6 }}>
                      {photos.map((url, i) => (
                        <a key={i} href={fullPhotoUrl(url)} target="_blank" rel="noreferrer">
                          <img
                            src={fullPhotoUrl(url)}
                            alt="trash"
                            style={{ height: 90, borderRadius: 6, objectFit: "cover" }}
                          />
                        </a>
                      ))}
                    </div>
                  )}

                  <div style={{ fontWeight: 700, color: STATUS_COLORS[r.status] ?? "#999" }}>
                    ● {t(`status.${r.status}`)}{" "}
                    {isHighlight && <span style={{ fontSize: 11, color: "#16A34A" }}>{t("map.yourReport")}</span>}
                  </div>

                  {r.description && <div style={{ marginTop: 4 }}>{r.description}</div>}

                  {r.tags && r.tags.length > 0 && (
                    <div style={{ fontSize: 12, color: "#6B7280", marginTop: 4 }}>
                      🏷️ {r.tags.join(", ")}
                    </div>
                  )}

                  {r.severity && (
                    <div style={{ fontSize: 12, color: "#6B7280" }}>📏 {t(`report.${r.severity}`)}</div>
                  )}

                  <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 6 }}>
                    📍 {r.latitude.toFixed(5)}, {r.longitude.toFixed(5)}
                  </div>
                  {taken && (
                    <div style={{ fontSize: 11, color: "#6B7280", marginTop: 2 }}>
                      📷 Taken {new Date(taken).toLocaleString()}
                    </div>
                  )}
                  {created && (
                    <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>
                      📨 Reported {new Date(created).toLocaleString()}
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Floating action buttons (top-right) */}
      <div className="absolute top-3 right-3 z-[1000] flex flex-col gap-2">
        <button
          onClick={goHome}
          className="bg-white shadow rounded-full px-3 py-2 text-sm font-medium border hover:bg-gray-50"
          title="Pristina"
        >
          🏠 Pristina
        </button>
        <button
          onClick={load}
          className="bg-white shadow rounded-full px-3 py-2 text-sm font-medium border hover:bg-gray-50"
          title={t("map.refresh")}
        >
          {loading ? t("common.loading") : `🔄 ${t("map.refresh")}`}
        </button>
      </div>

      {/* Floating legend */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-white/95 backdrop-blur shadow rounded-lg p-3 text-xs space-y-1 border">
        <div className="font-semibold mb-1">{t("map.legend")}</div>
        <div className="flex items-center gap-2"><span className="inline-block w-3 h-3 rounded-full" style={{ background: "#DC2626" }} /> {t("status.reported")}</div>
        <div className="flex items-center gap-2"><span className="inline-block w-3 h-3 rounded-full" style={{ background: "#F59E0B" }} /> {t("status.verified")}</div>
        <div className="flex items-center gap-2"><span className="inline-block w-3 h-3 rounded-full" style={{ background: "#3B82F6" }} /> {t("status.cleaning")}</div>
        <div className="flex items-center gap-2"><span className="inline-block w-3 h-3 rounded-full" style={{ background: "#10B981" }} /> {t("status.cleaned")}</div>
      </div>
    </div>
  );
}

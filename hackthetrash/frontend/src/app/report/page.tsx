"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import exifr from "exifr";
import { useI18n } from "@/lib/i18n";

const LocationPicker = dynamic(
  () => import("@/components/map/LocationPicker"),
  { ssr: false, loading: () => <div className="h-64 bg-gray-100 rounded" /> }
);

const TRASH_TYPES = ["Plastic", "E-waste", "Hazardous", "Construction", "Organic", "Other"];

type ExifFinding = { gps: boolean; takenAt: boolean };
type CoordsSource = "exif" | "geo" | "manual" | null;

export default function ReportPage() {
  const { t } = useI18n();

  const [photos, setPhotos] = useState<File[]>([]);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [coordsSource, setCoordsSource] = useState<CoordsSource>(null);
  const [takenAt, setTakenAt] = useState<Date | null>(null);
  const [exifFinding, setExifFinding] = useState<ExifFinding | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [severity, setSeverity] = useState<"small" | "medium" | "large">("medium");
  const [description, setDescription] = useState("");
  const [anonymous, setAnonymous] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [askingGeo, setAskingGeo] = useState(false);

  // Generate object URLs for thumbnails. Revoke when photos change or unmount
  // to avoid leaking blob URLs.
  const previews = useMemo(() => photos.map((p) => URL.createObjectURL(p)), [photos]);
  useEffect(() => {
    return () => previews.forEach((u) => URL.revokeObjectURL(u));
  }, [previews]);

  const toggleTag = (tg: string) =>
    setTags((prev) => (prev.includes(tg) ? prev.filter((x) => x !== tg) : [...prev, tg]));

  const ingestFiles = async (incoming: File[]) => {
    const files = incoming.filter((f) => f.type.startsWith("image/")).slice(0, 5);
    if (files.length === 0) return;
    setPhotos(files);

    let gpsHit = false;
    let dateHit = false;
    for (const file of files) {
      try {
        const data = await exifr
          .parse(file, { tiff: true, exif: true, gps: true })
          .catch(() => null);
        if (process.env.NODE_ENV !== "production") {
          // eslint-disable-next-line no-console
          console.log("[EXIF]", file.name, data);
        }
        if (!gpsHit && data && data.latitude != null && data.longitude != null) {
          setCoords({ lat: data.latitude, lng: data.longitude });
          setCoordsSource("exif");
          gpsHit = true;
        }
        const when: Date | string | undefined = data?.DateTimeOriginal || data?.CreateDate;
        if (!dateHit && when) {
          const d = when instanceof Date ? when : new Date(when);
          if (!isNaN(d.getTime())) {
            setTakenAt(d);
            dateHit = true;
          }
        }
        if (gpsHit && dateHit) break;
      } catch {
        // Non-fatal: not all images have EXIF (screenshots, stripped uploads, etc.)
      }
    }
    setExifFinding({ gps: gpsHit, takenAt: dateHit });
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) ingestFiles(Array.from(e.target.files));
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) ingestFiles(Array.from(e.dataTransfer.files));
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported by this browser. Tap the map below to set the location manually.");
      return;
    }
    setAskingGeo(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setCoordsSource("geo");
        setAskingGeo(false);
      },
      () => {
        setAskingGeo(false);
        alert("Could not get your location. Tap the map below to set it manually.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const handlePickerChange = (c: { lat: number; lng: number } | null) => {
    setCoords(c);
    setCoordsSource(c ? "manual" : null);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (photos.length === 0) return;
    if (!coords) return;

    setSubmitting(true);
    try {
      const fd = new FormData();
      photos.forEach((p) => fd.append("photos", p));
      fd.append("latitude", String(coords.lat));
      fd.append("longitude", String(coords.lng));
      fd.append("tags", JSON.stringify(tags));
      fd.append("severity", severity);
      fd.append("description", description);
      fd.append("anonymous", String(anonymous));
      if (takenAt) fd.append("takenAt", takenAt.toISOString());

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/reports`,
        { method: "POST", body: fd }
      );
      if (!res.ok) throw new Error("Submission failed");
      const created = await res.json();
      const id = created?.id ?? null;
      setSubmittedId(id);
      // Redirect straight to the map. The map page detects ?just=1 and shows
      // the "Logged" toast; ?lat/lng/id pre-existed and handle fly-to + popup.
      if (typeof window !== "undefined") {
        const qs = new URLSearchParams({
          lat: String(coords.lat),
          lng: String(coords.lng),
          just: "1"
        });
        if (id) qs.set("id", id);
        window.location.href = `/map?${qs.toString()}`;
        return;
      }
      setSuccess(true);
    } catch (err) {
      alert(t("report.errorSubmit"));
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    const mapHref = coords
      ? `/map?lat=${coords.lat}&lng=${coords.lng}${submittedId ? `&id=${submittedId}` : ""}&just=1`
      : "/map";
    return (
      <div className="max-w-md mx-auto p-8 text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold mb-2">{t("success.title")}</h2>
        <p className="text-gray-600">{t("success.body")}</p>
        <a href={mapHref} className="mt-6 inline-block bg-primary text-white px-4 py-2 rounded">
          🗺️ {t("success.seeOnMap")}
        </a>
      </div>
    );
  }

  const canSubmit = photos.length > 0 && coords != null && !submitting;
  const needsLocation = photos.length > 0 && !coords;

  return (
    <form onSubmit={submit} className="max-w-md mx-auto p-4 pb-32 space-y-5">
      <div>
        <h1 className="text-2xl font-bold">📸 Report Trash</h1>
        <p className="text-sm text-gray-600 mt-1">
          Just a photo. Everything else is optional.
        </p>
      </div>

      {/* Hero dropzone — full-width, big touch target, drag-drop on desktop */}
      <label
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`block rounded-xl border-2 border-dashed cursor-pointer transition
          ${isDragging ? "border-primary bg-primary/5" : "border-gray-300 bg-gray-50"}
          ${photos.length === 0 ? "py-12 px-4" : "p-3"}`}
      >
        <input
          type="file"
          accept="image/*"
          multiple
          capture="environment"
          onChange={handleFileInput}
          className="sr-only"
        />
        {photos.length === 0 ? (
          <div className="text-center">
            <div className="text-5xl mb-2">📷</div>
            <div className="font-semibold text-gray-800">Take a photo or drop one here</div>
            <div className="text-xs text-gray-500 mt-1">
              On mobile, this opens your camera. Up to 5 photos.
            </div>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-3 gap-2">
              {previews.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`photo ${i + 1}`}
                  className="w-full h-24 object-cover rounded"
                />
              ))}
            </div>
            <div className="text-xs text-center text-gray-500 mt-2">
              Tap to change · {photos.length} photo{photos.length === 1 ? "" : "s"}
            </div>
          </div>
        )}
      </label>

      {/* EXIF banner: green on hits, silent on misses (location panel handles
          the "missing location" state) */}
      {exifFinding && (exifFinding.gps || exifFinding.takenAt) && (
        <div className="text-xs bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-emerald-900">
          <div className="font-semibold mb-1">📷 Read from photo</div>
          {exifFinding.gps && coords && (
            <div>📍 {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}</div>
          )}
          {exifFinding.takenAt && takenAt && (
            <div>🕒 {takenAt.toLocaleString()}</div>
          )}
        </div>
      )}

      {/* Location: only surfaces when we actually need user action. If EXIF
          gave us coords, we stay quiet and trust them. */}
      {needsLocation && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 space-y-2">
          <div className="text-sm text-amber-900 font-semibold">
            📍 We need a location for this report
          </div>
          <div className="text-xs text-amber-900/80">
            Your photo doesn&apos;t include GPS info. Use your current location, or tap the map below.
          </div>
          <button
            type="button"
            onClick={useMyLocation}
            disabled={askingGeo}
            className="w-full bg-amber-600 text-white px-3 py-2 rounded text-sm font-semibold disabled:opacity-50"
          >
            {askingGeo ? "Getting location…" : "📍 Use my current location"}
          </button>
          <LocationPicker coords={coords} onChange={handlePickerChange} />
        </div>
      )}

      {/* If user manually overrides or chose geo, give them a small map preview
          + a clear "change" affordance so they know location is set. */}
      {coords && coordsSource !== "exif" && (
        <div className="text-xs text-gray-700 bg-gray-50 border border-gray-200 rounded-lg p-2 flex items-center justify-between">
          <span>
            📍 {coordsSource === "geo" ? "Using your current location" : "Pin set on map"} ·{" "}
            {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
          </span>
          <button
            type="button"
            onClick={() => { setCoords(null); setCoordsSource(null); }}
            className="text-gray-600 underline"
          >
            change
          </button>
        </div>
      )}

      {/* Submit — always visible, disabled until photo + location exist */}
      <button
        type="submit"
        disabled={!canSubmit}
        className="w-full bg-primary text-white py-4 rounded-lg font-bold text-lg disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {submitting ? "Submitting…" : photos.length === 0 ? "Add a photo to start" : !coords ? "Set location to submit" : "📤 Submit report"}
      </button>

      {/* Optional details — collapsed by default */}
      <details className="bg-white border border-gray-200 rounded-lg">
        <summary className="cursor-pointer select-none px-4 py-3 text-sm font-semibold text-gray-700">
          Add details (optional)
        </summary>
        <div className="px-4 pb-4 pt-1 space-y-4">
          <div>
            <label className="block font-medium text-sm mb-2">🏷️ What kind of trash?</label>
            <div className="flex flex-wrap gap-2">
              {TRASH_TYPES.map((tg) => (
                <button
                  type="button"
                  key={tg}
                  onClick={() => toggleTag(tg)}
                  className={`px-3 py-1 rounded-full text-sm border ${
                    tags.includes(tg) ? "bg-primary text-white border-primary" : "bg-white"
                  }`}
                >
                  {t(`tags.${tg}`)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-medium text-sm mb-2">📏 Size</label>
            <div className="flex gap-2">
              {(["small", "medium", "large"] as const).map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setSeverity(s)}
                  className={`flex-1 px-3 py-2 rounded border capitalize ${
                    severity === s ? "bg-primary text-white border-primary" : "bg-white"
                  }`}
                >
                  {t(`report.${s}`)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-medium text-sm mb-2">📝 Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full border rounded p-2 text-sm"
              placeholder={t("report.descriptionPlaceholder")}
            />
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={anonymous}
              onChange={(e) => setAnonymous(e.target.checked)}
            />
            Submit anonymously
          </label>
          <p className="text-xs text-gray-500 -mt-2">
            Want credit for your reports? <a href="/admin/login" className="text-primary underline">Sign in</a> to start collecting badges.
          </p>
        </div>
      </details>
    </form>
  );
}

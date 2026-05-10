"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import exifr from "exifr";
import { useI18n } from "@/lib/i18n";

const LocationPicker = dynamic(
  () => import("@/components/map/LocationPicker"),
  { ssr: false, loading: () => <div className="h-64 bg-gray-100 rounded" /> }
);

const TRASH_TYPES = ["Plastic", "E-waste", "Hazardous", "Construction", "Organic", "Other"];

type ExifFinding = {
  gps: boolean;
  takenAt: boolean;
};

export default function ReportPage() {
  const { t } = useI18n();

  const [photos, setPhotos] = useState<File[]>([]);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [coordsFromExif, setCoordsFromExif] = useState(false);
  const [takenAt, setTakenAt] = useState<Date | null>(null);
  const [exifFinding, setExifFinding] = useState<ExifFinding | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [severity, setSeverity] = useState<"small" | "medium" | "large">("medium");
  const [description, setDescription] = useState("");
  const [anonymous, setAnonymous] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const useMyLocation = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported");
    navigator.geolocation.getCurrentPosition(
      (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => alert("Could not get location")
    );
  };

  const toggleTag = (tg: string) =>
    setTags((prev) => (prev.includes(tg) ? prev.filter((x) => x !== tg) : [...prev, tg]));

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files).slice(0, 5);
    setPhotos(files);

    // Parse EXIF from the first file that has any. GPS + DateTimeOriginal
    // auto-populate the location pin and the "taken at" timestamp so the
    // user doesn't have to manually drop a pin or remember when they took
    // the photo. They can still override either one.
    let gpsHit = false;
    let dateHit = false;
    for (const file of files) {
      try {
        // One parse with explicit segments. The `pick` filter is intentionally
        // omitted because picking restricts the returned object even when GPS
        // and EXIF segments are enabled, which silently drops fields.
        const data = await exifr.parse(file, {
          tiff: true,
          exif: true,
          gps: true
        }).catch(() => null);
        if (!gpsHit && data && data.latitude != null && data.longitude != null) {
          setCoords({ lat: data.latitude, lng: data.longitude });
          setCoordsFromExif(true);
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
        // Non-fatal: not all images have EXIF (e.g. screenshots, stripped uploads).
      }
    }
    setExifFinding({ gps: gpsHit, takenAt: dateHit });
  };

  const clearExifLocation = () => {
    setCoords(null);
    setCoordsFromExif(false);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coords) return alert(t("report.errorMissingLocation"));
    if (photos.length === 0) return alert(t("report.errorMissingPhoto"));

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
      setSubmittedId(created?.id ?? null);
      setSuccess(true);
    } catch (err) {
      alert(t("report.errorSubmit"));
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    const mapHref = coords
      ? `/map?lat=${coords.lat}&lng=${coords.lng}${submittedId ? `&id=${submittedId}` : ""}`
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

  return (
    <form onSubmit={submit} className="max-w-md mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">📸 {t("report.title")}</h1>

      <div>
        <label className="block font-semibold mb-2">{t("report.photos")}</label>
        <input type="file" accept="image/*" multiple capture="environment" onChange={handleFiles}
          className="block w-full text-sm" />
        <div className="flex gap-2 mt-2 flex-wrap">
          {photos.map((p, i) => (
            <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded">{p.name}</span>
          ))}
        </div>

        {exifFinding && (exifFinding.gps || exifFinding.takenAt) && (
          <div className="mt-3 text-xs bg-emerald-50 border border-emerald-200 rounded p-2 text-emerald-900">
            <div className="font-semibold mb-1">📷 Read from photo</div>
            {exifFinding.gps && coords && (
              <div className="flex items-center justify-between gap-2">
                <span>📍 Location: {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}</span>
                <button type="button" onClick={clearExifLocation}
                  className="text-emerald-700 underline">Override</button>
              </div>
            )}
            {exifFinding.takenAt && takenAt && (
              <div>🕒 Taken: {takenAt.toLocaleString()}</div>
            )}
          </div>
        )}
        {exifFinding && !exifFinding.gps && !exifFinding.takenAt && photos.length > 0 && (
          <div className="mt-3 text-xs bg-amber-50 border border-amber-200 rounded p-2 text-amber-900">
            No EXIF data found in this photo — please drop a pin or tap &quot;Use my location&quot; below.
          </div>
        )}
      </div>

      <div>
        <label className="block font-semibold mb-2">📍 {t("report.location")}</label>
        <button type="button" onClick={useMyLocation}
          className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm mb-2">
          {coords ? t("report.updateLocation") : t("report.useMyLocation")}
        </button>
        <LocationPicker coords={coords} onChange={setCoords} />
        {coords && (
          <p className="text-xs text-gray-500 mt-1">
            Lat: {coords.lat.toFixed(5)}, Lng: {coords.lng.toFixed(5)}
          </p>
        )}
      </div>

      <div>
        <label className="block font-semibold mb-2">🏷️ {t("report.trashType")}</label>
        <div className="flex flex-wrap gap-2">
          {TRASH_TYPES.map((tg) => (
            <button type="button" key={tg} onClick={() => toggleTag(tg)}
              className={`px-3 py-1 rounded-full text-sm border ${
                tags.includes(tg) ? "bg-primary text-white border-primary" : "bg-white"
              }`}>
              {t(`tags.${tg}`)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block font-semibold mb-2">📏 {t("report.size")}</label>
        <div className="flex gap-2">
          {(["small", "medium", "large"] as const).map((s) => (
            <button type="button" key={s} onClick={() => setSeverity(s)}
              className={`flex-1 px-3 py-2 rounded border capitalize ${
                severity === s ? "bg-primary text-white border-primary" : "bg-white"
              }`}>
              {t(`report.${s}`)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block font-semibold mb-2">📝 {t("report.description")}</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)}
          rows={3} className="w-full border rounded p-2 text-sm"
          placeholder={t("report.descriptionPlaceholder")} />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={anonymous} onChange={(e) => setAnonymous(e.target.checked)} />
        {t("report.anonymous")}
      </label>

      <button type="submit" disabled={submitting}
        className="w-full bg-primary text-white py-3 rounded-lg font-bold disabled:opacity-50">
        {submitting ? t("report.submitting") : t("report.submit")}
      </button>
    </form>
  );
}

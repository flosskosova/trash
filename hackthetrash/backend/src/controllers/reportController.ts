import { Request, Response } from "express";
import path from "path";
import { ReportRepo } from "../models/ReportRepo";
import { autoModerate } from "../ai/moderation";
import { notifyStatusChange } from "../services/push";

const USE_DB = !!process.env.DATABASE_URL;

// In-memory fallback (used when DATABASE_URL not set, e.g. quick local demo).
import { reportsDB, Report } from "../models/Report";
import { v4 as uuid } from "uuid";

export const listReports = async (_req: Request, res: Response) => {
  try {
    if (USE_DB) {
      const rows = await ReportRepo.list();
      return res.json({ reports: rows });
    }
    res.json({ reports: reportsDB });
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
};

export const getReport = async (req: Request, res: Response) => {
  try {
    if (USE_DB) {
      const r = await ReportRepo.findById(req.params.id);
      if (!r) return res.status(404).json({ error: "Not found" });
      return res.json(r);
    }
    const r = reportsDB.find((x) => x.id === req.params.id);
    if (!r) return res.status(404).json({ error: "Not found" });
    res.json(r);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
};

export const createReport = async (req: Request, res: Response) => {
  try {
    const files = (req.files as Express.Multer.File[]) || [];
    const { latitude, longitude, severity, description, anonymous, takenAt } = req.body;
    let tags: string[] = [];
    try { tags = JSON.parse(req.body.tags || "[]"); } catch {}

    if (!latitude || !longitude) {
      return res.status(400).json({ error: "latitude & longitude required" });
    }

    // Run AI moderation on uploaded images
    const imagePaths = files.map((f) => path.join(__dirname, "../../uploads", f.filename));
    const ai = await autoModerate(imagePaths);
    console.log(`[AI] best=${ai.best.label} score=${ai.best.score} -> ${ai.recommendation}`);

    if (USE_DB) {
      const created = await ReportRepo.create({
        latitude: Number(latitude),
        longitude: Number(longitude),
        description,
        severity,
        tags,
        anonymous: anonymous === "true",
        aiScore: ai.best.score,
        aiLabel: ai.best.label
      });
      const photoUrls = files.map((f) => `/uploads/${f.filename}`);
      await ReportRepo.addPhotos(created.id, photoUrls);

      // Auto-status from AI
      if (ai.recommendation === "auto_verify") {
        await ReportRepo.updateStatus(created.id, "verified", "AI auto-verified");
      } else if (ai.recommendation === "auto_reject") {
        await ReportRepo.updateStatus(created.id, "rejected", "AI auto-rejected");
      }
      // Return the new report with photo_urls so the client can immediately
      // place a marker on the OpenStreetMap layer with the picture in the popup.
      return res.status(201).json({ ...created, photo_urls: photoUrls, ai });
    }

    // Fallback: in-memory
    const report: Report = {
      id: uuid(),
      latitude: Number(latitude),
      longitude: Number(longitude),
      severity: severity || "medium",
      description: description || "",
      tags,
      status: ai.recommendation === "auto_verify" ? "verified"
            : ai.recommendation === "auto_reject" ? "rejected"
            : "reported",
      anonymous: anonymous === "true",
      photoUrls: files.map((f) => `/uploads/${f.filename}`),
      createdAt: new Date().toISOString(),
      takenAt: typeof takenAt === "string" && !isNaN(Date.parse(takenAt)) ? takenAt : undefined
    };
    reportsDB.unshift(report);
    res.status(201).json({ ...report, ai });
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
};

export const updateStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    if (!["reported", "verified", "cleaning", "cleaned", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }
    if (USE_DB) {
      await ReportRepo.updateStatus(req.params.id, status);
      const r = await ReportRepo.findById(req.params.id);
      if (r) {
        // Fire-and-forget push to subscribed devices
        notifyStatusChange({ id: r.id, status: r.status, latitude: r.latitude, longitude: r.longitude }).catch(() => {});
      }
      return res.json(r);
    }
    const r = reportsDB.find((x) => x.id === req.params.id);
    if (!r) return res.status(404).json({ error: "Not found" });
    r.status = status;
    notifyStatusChange({ id: r.id, status: r.status, latitude: r.latitude, longitude: r.longitude }).catch(() => {});
    res.json(r);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
};

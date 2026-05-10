// In-memory store for MVP. Replace with PostgreSQL/PostGIS in production.

export type ReportStatus = "reported" | "verified" | "cleaning" | "cleaned" | "rejected";

export interface Report {
  id: string;
  latitude: number;
  longitude: number;
  severity: "small" | "medium" | "large" | string;
  description: string;
  tags: string[];
  status: ReportStatus;
  anonymous: boolean;
  photoUrls: string[];
  createdAt: string;
  takenAt?: string;
  userId?: string;
}

export const reportsDB: Report[] = [
  {
    id: "demo-1",
    latitude: 42.6629,
    longitude: 21.1655,
    severity: "medium",
    description: "Plastic bottles near Skanderbeg Square",
    tags: ["Plastic"],
    status: "reported",
    anonymous: true,
    photoUrls: [],
    createdAt: new Date().toISOString()
  },
  {
    id: "demo-2",
    latitude: 42.6699,
    longitude: 21.1782,
    severity: "large",
    description: "Construction debris in Sunny Hill",
    tags: ["Construction"],
    status: "cleaned",
    anonymous: true,
    photoUrls: [],
    createdAt: new Date().toISOString()
  }
];

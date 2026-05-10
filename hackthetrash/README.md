# 🗑️ HackTheTrash

> A crowdsourced web platform where citizens report illegal landfills with **photos + GPS coordinates**, helping authorities and communities clean up the environment.

![Status](https://img.shields.io/badge/status-MVP--in--progress-yellow)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## 🌍 What is HackTheTrash?

Illegal trash dumps pollute our forests, rivers, and neighborhoods. **HackTheTrash** lets anyone snap a photo, share their GPS location, and create a public, verifiable map of trash hotspots — so cities, NGOs, and volunteers can clean them up.

## ✨ Features

- 📸 **Submit reports** — photo upload + GPS auto-detection
- 🗺️ **Interactive map** — public, color-coded by status
- 🏷️ **Tags & severity** — categorize trash (plastic, e-waste, hazardous…)
- ✅ **Moderation system** — verify reports, merge duplicates
- 🏛️ **Authority dashboard** — track and resolve cleanups
- 🏆 **Gamification** — badges for active reporters
- 🔒 **Privacy first** — anonymous reporting, EXIF stripping

## 🛠️ Tech Stack

| Layer | Tech |
|-------|------|
| Frontend (web) | Next.js 14 + TypeScript + TailwindCSS + Leaflet |
| Mobile app | React Native + Expo + Leaflet (WebView) |
| Backend | Node.js + Express + TypeScript |
| Database | PostgreSQL + PostGIS |
| Storage | AWS S3 / Cloudinary |
| Auth | JWT |
| Hosting | Vercel + Railway + EAS Build |

## 📂 Project Structure

```
hackthetrash/
├── frontend/          # Next.js app
│   ├── src/
│   │   ├── app/       # Routes (report, map, dashboard, auth)
│   │   ├── components/
│   │   ├── lib/
│   │   └── styles/
│   └── public/
├── backend/           # Express API
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── ai/        # Pluggable image classifier
│   │   ├── db/        # Migrations + seeds (PostGIS)
│   │   ├── middleware/
│   │   └── services/
│   └── uploads/
├── mobile/            # React Native (Expo) app
│   ├── App.tsx
│   ├── src/screens/   # Home, Report (camera+GPS), Map (OSM), Success
│   └── src/lib/
├── docs/              # Wireframes, mockups, architecture, API docs
└── scripts/           # Dev / deployment scripts
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+ (with PostGIS extension)
- npm or pnpm

### Installation

```bash
# Clone
git clone https://github.com/yourusername/hackthetrash.git
cd hackthetrash

# Frontend
cd frontend
npm install
npm run dev

# Backend (in another terminal)
cd backend
npm install
npm run dev
```

### Environment Variables

Copy `.env.example` to `.env` in both `frontend/` and `backend/`:

```env
# backend/.env
DATABASE_URL=postgresql://user:pass@localhost:5432/hackthetrash
JWT_SECRET=your_secret_here
PORT=4000
S3_BUCKET=...
```

```env
# frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_MAPBOX_TOKEN=...
```

## 🗺️ Roadmap

- [x] Project scaffold
- [x] MVP submission form + map
- [x] Moderation panel
- [x] Authority dashboard
- [x] PostgreSQL + PostGIS schema & migrations
- [x] AI image verification (pluggable, HuggingFace ready)
- [x] HTML mockups
- [x] Mobile app (Expo)
- [x] Push notifications + offline queue
- [x] i18n English + Albanian (Pristina-focused)

See [docs/ROADMAP.md](docs/ROADMAP.md) for full details.

## 📚 Docs

- [Architecture](docs/architecture/ARCHITECTURE.md)
- [API Reference](docs/api/API.md)
- [Database Setup](docs/DATABASE.md)
- [AI Classification](docs/AI.md)
- [Mobile App](docs/MOBILE.md)
- [Admin Panel](docs/ADMIN.md)
- [Wireframes](docs/wireframes/WIREFRAMES.md)
- [HTML Mockups](docs/mockups/index.html)

## 🤝 Contributing

Contributions welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md).

## 📜 License

MIT © 2026 HackTheTrash Contributors

## 💚 Acknowledgements

Built for a cleaner planet 🌱

---

Powered by [**FLOSSK**](https://flossk.org)

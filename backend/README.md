# Flux Backend (minimal)

This is a tiny Express + Mongoose backend for storing `rollNo` -> `points`.

Endpoints:
- GET /api/health
- GET /api/points/:rollNo
- POST /api/points/add  { rollNo, points }
- POST /api/seed/from-applications  (reads ../test.applications.json and creates score docs)

Quick start:

1. Copy `.env.example` to `.env` and set `MONGODB_URI`.
2. Install dependencies and run:

```bash
cd backend
npm install
npm run dev
```

The server will listen on PORT (default 4000).

Note: this is intentionally minimal. If you want authentication, validation, or to accept the full review object shape from the frontend (and compute sums server-side), I can extend this.

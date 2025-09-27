# JudgeJuryExecutioner (Flux applications judge)
Small React + Vite frontend and Node/Express + MongoDB backend used to review and score applications.

This README explains the environment variables, how to run locally, seed the database, and recommended deployment steps (Backend: Render / Frontend: Vercel).
## What this repo contains
- frontend (root) — Vite + React + TypeScript app. Build output served separately (Vercel recommended).
- backend/ — Express server using Mongoose. Provides scoring APIs and a small seeder that reads `backend/src/test.applications.json`.

## Required environment variables

Backend (backend/.env or Render environment variables)
- `MONGODB_URI` — MongoDB connection string. Defaults to `mongodb://localhost:27017/flux` if not provided.
- `PORT` — (optional) port the backend listens on (default 4000).

Frontend (Vite / Vercel environment)
- `VITE_API_BASE` — Base URL for the backend API (e.g. `https://your-backend.onrender.com`). This is baked at build time.

Note: Vite environment variables used in the frontend must be prefixed with `VITE_` and are embedded at build time.

## Local development

Prerequisites
- Node.js (18+ recommended)
- npm
- MongoDB (local or Atlas). If using local MongoDB, ensure it's running.

Start backend locally
1. Open a terminal in `backend/` and install dependencies:

```bash
cd backend
npm install
```

2. Create a `.env` file in `backend/` (optional) with example values:

```bash
MONGODB_URI=mongodb://localhost:27017/flux
PORT=4000
```

3. Start the backend (development with nodemon):

```bash
npm run dev
```

Or run the production start command:

```bash
npm start
```

Backend verification endpoints
- Health: GET /api/health → { status: 'ok' }
- Get merged applications with scores (optionally hide those already rated by a rater):
  - GET /api/scores/all-with-details?rater=<username>
- Add score (records rater in the Score document's `raters` array):
  - POST /api/scores/add { rollNo, points, rater }
- Seed scores from the bundled backend JSON:
  - POST /api/scores/seed/from-applications

Start frontend locally

1. Install dependencies in the repo root:

```bash
npm install
```

2. Start the dev server (this will use the default `VITE_API_BASE` fallback http://localhost:4000 unless you set env):

```bash
npm run dev
```

3. To point the frontend to a running backend during development without rebuilding, set the Vite env when starting dev (in PowerShell or bash):

```bash
# bash (Linux / WSL / Git Bash / Windows with bash.exe)
export VITE_API_BASE='http://localhost:4000'
npm run dev

# windows cmd
set VITE_API_BASE=http://localhost:4000 && npm run dev
```

Important: When deploying the frontend (Vercel/Netlify), set `VITE_API_BASE` in the deployment environment so the built site points to your backend.

## Seeding data

The backend contains a small seeder that creates Score documents for every `rollNo` in `backend/src/test.applications.json` with 0 points.

Run it locally (backend must be running and connected to MongoDB):

```bash
curl -X POST http://localhost:4000/api/scores/seed/from-applications
```

Or from the backend folder:

```bash
cd backend
node -e "require('./src/index.js')"
# then curl the seed route (or use Postman)
```

## Deployment recommendations

Backend (Render recommended)

1. Create a Render Web Service (or another host) pointing to this repo and the `backend/` folder.
2. Set the start command to: `npm start`
3. Set environment variables on Render:
  - `MONGODB_URI` (required)
  - `PORT` (optional, Render sets one for you)
4. Ensure `backend/package.json` dependencies are installed by Render (it will run `npm install`).

After deployment, set the backend URL in the frontend's Vercel project as `VITE_API_BASE` (see Frontend notes below).

Frontend (Vercel recommended)

1. Create a Vercel project from this repository (root).
2. In the Vercel Project Settings > Environment Variables add:
  - `VITE_API_BASE` = `https://<your-backend-url>` (the Render URL or whichever host you used)
3. Build & Deploy. Because Vite inlines env vars at build time, you must set this before deploying.

Optional: You can host frontend and backend together on the same host and set relative paths, but the current setup expects separate hosting.

## Troubleshooting & notes

- If you see `Error: Cannot find module 'dotenv'` when starting the backend, run `npm install` inside the `backend` directory.
- Vite env vars are evaluated at build time. Changing `VITE_API_BASE` after a deployment requires a rebuild.
- The app uses `localStorage` key `flux_current_user` for a simple client-side sign-in. This is not secure and is intended only for demo/testing.

## Quick checklist

- [ ] Install dependencies: `npm install` (root) and `cd backend && npm install`
- [ ] Start backend: `cd backend && npm run dev` (or `npm start`)
- [ ] Start frontend: `npm run dev` (root)
- [ ] Seed DB: `curl -X POST http://localhost:4000/api/scores/seed/from-applications`
- [ ] Sign in with a user (user1..user18) and start reviewing

---

If you'd like, I can also:
- Add a small `Makefile` or npm scripts to run both frontend and backend concurrently for local development.
- Add a small health-check / readiness endpoint for Docker/Render.

Happy to update or expand the README with deployment screenshots or environment variables for a specific provider (Render, Heroku, Vercel, Netlify, Docker, etc.).
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

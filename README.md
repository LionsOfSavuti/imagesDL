# Spare Parts Inventory Management System (Local PostgreSQL + Apache)

This project runs fully on your local machine:
- **Frontend:** React 18 + TypeScript + Vite + Tailwind
- **Backend API:** Apache + PHP (`/api/*.php`)
- **Database:** PostgreSQL 16
- **Orchestration:** Docker Compose

---

## 1) Prerequisites (install once)

## Required
- **Git**
- **Node.js 20+** (includes npm)
- **Docker Desktop** (Windows/macOS) or Docker Engine + Compose plugin (Linux)

## Verify tools
Run these in a terminal:

```bash
git --version
node -v
npm -v
docker --version
docker compose version
```

If any command fails, install that tool before continuing.

---

## 2) Get the project on your computer

If cloning fresh:

```bash
git clone <YOUR_REPO_URL>
cd imagesDL
```

If you already have the folder, just open terminal in the project root.

---

## 3) Configure environment variables

Create `.env` from the example:

```bash
cp .env.example .env
```

Default value:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

Use a different URL only if you changed Apache port/path.

---

## 4) Install frontend dependencies

```bash
npm install
```

This installs React, Vite, Tailwind, TypeScript, and UI dependencies.

---

## 5) Build frontend assets

Apache serves static frontend files from `dist/`, so build once:

```bash
npm run build
```

---

## 6) Start local PostgreSQL + Apache API

```bash
docker compose up -d --build
```

What starts:
- `postgres` container on `localhost:5432`
- `apache` container on `localhost:8080`

On first start, PostgreSQL auto-runs `supabase/schema.sql` via Docker init mount to create:
- all tables,
- indexes,
- RLS + policies,
- sample plants and spare parts.

---

## 7) Open the app

Open in browser:

- **http://localhost:8080**

API endpoint base:

- **http://localhost:8080/api**

---

## 8) Useful commands

## Stop services
```bash
docker compose down
```

## Stop + remove DB volume (full reset)
```bash
docker compose down -v
```

## Rebuild frontend after code changes
```bash
npm run build
docker compose restart apache
```

## View container logs
```bash
docker compose logs -f postgres
docker compose logs -f apache
```

---

## 9) Development mode (optional)

If you want hot reload while coding frontend:

```bash
npm run dev
```

Then open Vite URL shown in terminal (usually `http://localhost:5173`).
Keep Docker services running so API is available at `http://localhost:8080/api`.

---

## 10) API endpoints implemented

- `GET /api/plants.php`
- `GET|POST|PUT|DELETE /api/parts.php`
- `GET|POST /api/transactions.php`
- `GET|POST /api/analytics.php`
- `GET /api/kraljic.php`
- `GET /api/eoq.php`
- `GET /api/recommendations.php`

---

## 11) Common issues and fixes

## `docker: command not found`
Install Docker Desktop (Windows/macOS) or Docker Engine + Compose plugin (Linux).

## Port 8080 or 5432 already in use
Change host ports in `docker-compose.yml`, for example:
- `8081:80` for Apache
- `5433:5432` for PostgreSQL

Then update `.env` accordingly (example: `VITE_API_BASE_URL=http://localhost:8081/api`).

## Database changes not applying
If schema already initialized, reset DB volume:

```bash
docker compose down -v
docker compose up -d --build
```

## Frontend shows API/network errors
- Ensure Apache container is running: `docker compose ps`
- Ensure `.env` contains correct `VITE_API_BASE_URL`
- Rebuild frontend after `.env` changes: `npm run build`

---

## 12) Quick start (copy/paste)

```bash
git clone <YOUR_REPO_URL>
cd imagesDL
cp .env.example .env
npm install
npm run build
docker compose up -d --build
# open http://localhost:8080
```

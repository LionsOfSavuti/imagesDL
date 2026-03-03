# Spare Parts Inventory Management (Local: Node.js API + Apache + PostgreSQL)

Local stack:
- Frontend: React + TypeScript + Vite + Tailwind
- Backend API: Node.js (Express + pg)
- Web server: Apache (serves frontend + proxies `/api` to Node)
- Database: PostgreSQL 16
- Runtime: Docker Compose

## 1) Prerequisites
- Git
- Node.js 20+
- Docker + Docker Compose

Verify:
```bash
git --version
node -v
npm -v
docker --version
docker compose version
```

## 2) Clone and open project
```bash
git clone <YOUR_REPO_URL>
cd imagesDL
```

## 3) Frontend environment
```bash
cp .env.example .env
```
Default:
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

## 4) Install and build frontend
```bash
npm install
npm run build
```

## 5) Start full local stack
```bash
docker compose up -d --build
```
Services:
- `postgres` (localhost:5432)
- `node_api` (internal, proxied by Apache)
- `apache` (localhost:8080)

Database schema + seed data are auto-applied from `supabase/schema.sql` on first boot.

## 6) Open application
- App: http://localhost:8080
- API base (via Apache proxy): http://localhost:8080/api

## 7) API routes
- `GET /api/plants`
- `GET|POST /api/parts`
- `PUT|DELETE /api/parts/:id`
- `GET|POST /api/transactions`
- `GET|POST /api/analytics`
- `GET /api/recommendations`
- `GET /api/kraljic`
- `GET /api/eoq`

## 8) Common operations
Stop:
```bash
docker compose down
```

Full reset:
```bash
docker compose down -v
docker compose up -d --build
```

After frontend changes:
```bash
npm run build
docker compose restart apache
```

Logs:
```bash
docker compose logs -f postgres
docker compose logs -f node_api
docker compose logs -f apache
```

## 9) Optional frontend dev mode
```bash
npm run dev
```
Keep Docker stack running, and retain `VITE_API_BASE_URL=http://localhost:8080/api`.

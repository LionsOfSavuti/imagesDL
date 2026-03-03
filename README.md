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
Services expected:
- `postgres` (localhost:5432)
- `node_api` (internal, proxied by Apache)
- `apache` (localhost:8080)

Database schema + seed data are auto-applied from `supabase/schema.sql` on first boot.

## 6) What to do immediately after `docker compose up`
Run these checks in order:

1. Check running containers:
```bash
docker compose ps
```
You should see **three** services up: `postgres`, `node_api`, `apache`.

2. If `apache` is missing, include exited containers:
```bash
docker compose ps -a
```

3. Inspect Apache logs:
```bash
docker compose logs --no-log-prefix apache
```

4. Start/rebuild Apache explicitly:
```bash
docker compose up -d --build apache
```

5. Verify API through Apache proxy:
```bash
curl http://localhost:8080/api/plants
```

6. Open app:
- http://localhost:8080

## 7) If you get `curl: (7) Failed to connect to localhost port 8080`
This means Apache is not listening on host port 8080. Do:

```bash
docker compose ps -a
docker compose logs apache
```

Then hard-recreate containers:
```bash
docker compose down
docker compose up -d --build --force-recreate
```

If still failing, reset everything including DB volume:
```bash
docker compose down -v
docker compose up -d --build
```

## 8) API routes
- `GET /api/plants`
- `GET|POST /api/parts`
- `PUT|DELETE /api/parts/:id`
- `GET|POST /api/transactions`
- `GET|POST /api/analytics`
- `GET /api/recommendations`
- `GET /api/kraljic`
- `GET /api/eoq`

## 9) Common operations
Stop:
```bash
docker compose down
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

## 10) Optional frontend dev mode
```bash
npm run dev
```
Keep Docker stack running and keep `VITE_API_BASE_URL=http://localhost:8080/api`.

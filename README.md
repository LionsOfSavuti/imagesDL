# Spare Parts Inventory Management System (Local PostgreSQL + Apache)

This project runs fully local without Bolt/Supabase:
- Frontend: React + TypeScript + Vite + Tailwind
- API server: Apache + PHP
- Database: PostgreSQL

## Prerequisites
- Node.js 20+
- Docker + Docker Compose

## Local setup
1. Install frontend dependencies:
   ```bash
   npm install
   ```
2. Create env file:
   ```bash
   cp .env.example .env
   ```
3. Build frontend:
   ```bash
   npm run build
   ```
4. Start PostgreSQL + Apache API:
   ```bash
   docker compose up -d --build
   ```
5. Open app at `http://localhost:8080`.

The database schema and sample data are auto-loaded from `supabase/schema.sql` into local PostgreSQL on first container boot.

## Development mode
Run frontend dev server if desired:
```bash
npm run dev
```
Set `VITE_API_BASE_URL=http://localhost:8080/api`.

## API endpoints
- `/api/plants.php`
- `/api/parts.php`
- `/api/transactions.php`
- `/api/analytics.php`
- `/api/kraljic.php`
- `/api/eoq.php`
- `/api/recommendations.php`

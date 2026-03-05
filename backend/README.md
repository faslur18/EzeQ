# EzeQ Backend

Express + TypeScript backend organized as domain modules with shared platform middleware.

## Architecture

- `src/config`: environment loading and runtime config
- `src/routes`: versioned API routers (`/api/v1`)
- `src/modules`: module registry for domain routes
- `src/{auth,salons,services,hours,appointments,users,admin-salons}`: domain features
- `src/database`: Drizzle + SQLite setup
- `src/shared`: cross-cutting concerns (errors, middleware, http helpers)

This layout is microservice-ready: each module has a clear boundary and can be extracted into an independent service with minimal route-contract changes.

## API Base Paths

- Preferred: `/api/v1/...`
- Backward compatibility: existing unversioned routes (`/auth`, `/salons`, etc.) remain mounted.

## Run

```bash
npm install
npm run dev
```

## Environment

Required:

- `JWT_SECRET`

Optional:

- `PORT` (default `4000`)
- `FRONTEND_URL` (default `http://localhost:3000`)
- `SQLITE_DB_PATH` (default `backend/sqlite.db`)


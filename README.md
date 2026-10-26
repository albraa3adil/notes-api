# Notes API

REST API for notes with pagination, search and tag filtering.
Node.js · Express 5 · TypeScript · PostgreSQL · Zod

## Setup

**Requirements:** Node.js 22 (Express 5 needs 18+), PostgreSQL 13+.

```bash
# 1. Install
npm install

# 2. Configure
cp .env.example .env        # then set DATABASE_URL (step 3)
```

**3. Create a database** (either option), then set `DATABASE_URL` in `.env`:

```bash
# Docker
docker run --name notes-db -e POSTGRES_USER=notes -e POSTGRES_PASSWORD=notes \
  -e POSTGRES_DB=notes -p 5432:5432 -d postgres:16

# or local PostgreSQL, from psql as a superuser
CREATE USER notes WITH PASSWORD 'notes';
CREATE DATABASE notes OWNER notes;
```

```
DATABASE_URL=postgres://notes:notes@localhost:5432/notes
```

```bash
# 4. Create the tables (safe to re-run)
npm run migrate

# 5. Start with auto-reload, then check it
npm run dev
curl http://localhost:3000/api/health
```

## Configuration (`.env`)

| Variable | Default | Description |
| --- | --- | --- |
| `DATABASE_URL` | required | PostgreSQL connection string |
| `PORT` | `3000` | Server port |
| `NODE_ENV` | `development` | `production` disables pretty logs and requires `CORS_ORIGINS` |
| `LOG_LEVEL` | `info` | Pino level (`debug`, `info`, `warn`, `error`, `silent`) |
| `CORS_ORIGINS` | `http://localhost:3300` | Comma-separated allowed browser origins. **Required in production.** |

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start with auto-reload |
| `npm start` | Start (production) |
| `npm run migrate` | Apply pending SQL migrations from `migrations/` |

## API

Base URL `http://localhost:3000/api`

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/health` | Health check |
| `POST` | `/notes` | Create a note |
| `GET` | `/notes` | List notes |
| `GET` | `/notes/:id` | Get a note |
| `PUT` | `/notes/:id` | Replace a note |
| `DELETE` | `/notes/:id` | Delete a note |

`:id` must be a UUID.

**Body** for `POST` and `PUT`:

| Field | Rules |
| --- | --- |
| `title` | Required, trimmed, 1–200 characters |
| `content` | Optional string, defaults to `""` |
| `tags` | Optional array of strings (trimmed, blanks dropped), defaults to `[]` |

**Query parameters** for `GET /notes` (all optional, combinable):

| Parameter | Default | Description |
| --- | --- | --- |
| `page` | `1` | Page number (≥ 1) |
| `limit` | `10` | Page size (1–100) |
| `search` | – | Case-insensitive match in title or content (max 200 chars) |
| `tag` | – | Notes with **any** of the tags, case-insensitive. Repeat for several: `?tag=work&tag=home` (max 100 chars each) |

Results are newest first.

**Responses**

```jsonc
// POST, GET /:id, PUT /:id  ->  201 / 200
{ "success": true, "data": { "id": "…", "title": "…", "content": "…", "tags": [], "created_at": "…", "updated_at": "…" } }

// GET /notes  ->  200
{ "success": true, "data": [ /* notes */ ], "total": 25, "page": 1, "limit": 10, "totalPages": 3 }

// DELETE /:id  ->  200
{ "success": true, "message": "Note deleted successfully." }

// Errors
{ "success": false, "message": "Validation failed.", "errors": [{ "field": "title", "message": "Title must not be empty." }] }
```

| Status | Meaning |
| --- | --- |
| `400` | Validation failed or malformed JSON |
| `404` | Note or route not found |
| `413` | Body larger than 100 KB |
| `500` | Unexpected server error |

## Notes

- **Layout:** `routes` → `services` → `repositories` (SQL). Zod schemas live in `schemas/`; the `validate` middleware applies them and `errorHandler` formats all errors.
- **Migrations:** add `migrations/003_name.sql` and run `npm run migrate`. Never edit one that has already been applied.
- **Production:** set `NODE_ENV=production`, `DATABASE_URL` and `CORS_ORIGINS`, run `npm run migrate`, then `npm start`.
- **Security:** Helmet headers, CORS allowlist, 100 KB body limit, parameterized SQL.

## Troubleshooting

| Error | Fix |
| --- | --- |
| `Missing required environment variable` | Create `.env` from `.env.example` and fill in the named variable |
| `ECONNREFUSED` / `password authentication failed` | Database isn't running, or `DATABASE_URL` doesn't match your database user |
| `permission denied to create extension "pgcrypto"` | Use PostgreSQL 13+ with the database owner, or run `CREATE EXTENSION pgcrypto;` once as a superuser |
| `EADDRINUSE` | Port is taken; change `PORT` |
| Browser CORS error | Add the frontend's exact origin (scheme, host, port) to `CORS_ORIGINS` and restart |

# Fadila Journal

A bilingual (Azerbaijani/English) editorial-style personal blog starter built with Next.js App Router, TypeScript, Tailwind CSS, Prisma, and PostgreSQL.

## Included in this starter

- Editorial/minimal responsive homepage
- Light/dark/system theme toggle
- AZ/EN route structure
- Journal, article design samples, and About page
- Newsletter form UI (demo only)
- Prisma schema for posts, translations, categories, tags, comments, reactions, newsletter, views, and site settings
- Category seed data
- Initial folder structure for the admin dashboard and AI assistant

## Important: starter, not a complete production app

The public pages currently use sample content. The admin dashboard, authentication, real database queries, working search/filters, comment submission/moderation, reaction endpoints, newsletter provider, and AI provider integration are **not implemented yet**. Do not deploy this as a finished production blog or expose admin functionality until authentication and server-side authorization are implemented.

## Requirements

- Node.js 20+
- PostgreSQL 15+ (local or managed)
- npm

## Run locally

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and set `DATABASE_URL`.

3. Generate Prisma Client:

   ```bash
   npm run db:generate
   ```

4. Create the database schema:

   ```bash
   npm run db:migrate
   ```

5. Seed starter categories:

   ```bash
   npm run db:seed
   ```

6. Start the development server:

   ```bash
   npm run dev
   ```

7. Open http://localhost:3000

The homepage redirects to `/en`; the Azerbaijani version is at `/az`.

## Next implementation steps

1. Add Auth.js with a secure admin-only sign-in flow and required adapter/session models.
2. Add server-side permission checks and protected `/admin` routes.
3. Implement post/category/tag queries and CRUD with Zod validation.
4. Build the TipTap editor and safe content rendering.
5. Connect public pages to published PostgreSQL records.
6. Implement real search and category filtering.
7. Add moderated comments, reactions with abuse protection, and double-opt-in newsletter.
8. Add AI assistant with server-side provider key, rate limits, and usage/cost controls.
9. Add unit, integration, and E2E tests; configure backups and deployment.

## Environment variables

See `.env.example`. Never commit real secrets.

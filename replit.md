# Project: Veritas Crypto

## Overview
This is a full-stack JavaScript application built with Express on the backend and React on the frontend. It is a licensed custodial crypto investment platform named "Veritas Crypto".

## Recent Changes
- Fixed immediate logouts by adjusting session cookie domain and proxy trust.
- Updated branding across the application to "Veritas Crypto".
- Migrated project structure to Replit environment (January 2026).
- Verified local development server functionality on port 5000.
- Documented external deployment architecture.
- Fixed 'MemoryStore is not designed for a production environment' by switching to `connect-pg-simple` for session persistence.
- Configured secure production-ready session cookies.
- Added `session` table to schema to support `connect-pg-simple` on Supabase.

## Deployment Details
- **Backend**: Render (https://veritas-9pwj.onrender.com)
- **Frontend**: Vercel (https://veritas-one-sandy.vercel.app)
- **Database**: Supabase (PostgreSQL)

## Architecture
- **Backend**: Express with TypeScript, Drizzle ORM.
- **Frontend**: React (Vite), Tailwind CSS, Radix UI.
- **Authentication**: Passport.js with session-based auth.
- **Storage**: Currently configured for PostgreSQL (Supabase).

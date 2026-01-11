# Project: REST Express Application

## Overview
This is a full-stack JavaScript application built with Express on the backend and React on the frontend. It uses Drizzle ORM for database management and Passport.js for authentication.

## Recent Changes
- Migrated project structure to Replit environment (January 2026).
- Verified local development server functionality on port 5000.
- Documented external deployment architecture.
- Fixed 'MemoryStore is not designed for a production environment' by switching to `connect-pg-simple` for session persistence.
- Configured secure production-ready session cookies.

## Deployment Details
- **Backend**: Render
- **Frontend**: Vercel
- **Database**: Supabase (PostgreSQL)

## Architecture
- **Backend**: Express with TypeScript, Drizzle ORM.
- **Frontend**: React (Vite), Tailwind CSS, Radix UI.
- **Authentication**: Passport.js with session-based auth.
- **Storage**: Currently configured for PostgreSQL (Supabase).

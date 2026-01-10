# Deployment Instructions

## Render (Backend)
1. Create a new **Web Service** on Render.
2. Connect your repository.
3. Set the following environment variables:
   - `DATABASE_URL`: Your PostgreSQL connection string.
   - `SESSION_SECRET`: A secure random string for sessions.
   - `NODE_ENV`: `production`
   - `DEPOSIT_WALLET_PRIVATE_KEY`: Your backend wallet private key.
   - `RPC_URL`: Your blockchain RPC provider URL.
4. Build Command: `npm install && npm run build`
5. Start Command: `npm start`

## Vercel (Frontend)
1. Create a new project on Vercel.
2. Connect your repository.
3. Set the following environment variables:
   - `VITE_API_URL`: The URL of your Render backend.
4. Vercel will automatically detect the Vite project and deploy it.

## Supabase (Database)
1. Create a new project on Supabase.
2. Go to **Project Settings > Database** to find your connection string.
3. Use this string as the `DATABASE_URL` in your Render settings.
4. Run the database migrations (if not using Replit's managed DB).

## Security Assumptions
- Private keys are only stored in environment variables, never in the database.
- All withdrawals require manual admin approval and signing.
- Row Level Security is enforced at the API level via the storage layer.

# Deployment Guide: Crypto Investment Platform

This project is structured for easy deployment across **Render**, **Vercel**, and **Supabase**.

## 1. Supabase (Database & Auth)
Supabase provides the PostgreSQL database and managed authentication.

1.  **Create Project**: Sign up at [supabase.com](https://supabase.com) and create a new project.
2.  **Database Connection**: 
    *   Go to **Project Settings > Database**.
    *   Copy the **URI** (Connection String) under the "Connection string" section (Transaction mode recommended).
    *   Use this as your `DATABASE_URL`.
3.  **Authentication**:
    *   Go to **Authentication > Providers**.
    *   Ensure **Email** is enabled.
    *   (Optional) Configure Redirect URLs to match your Vercel deployment URL.

## 2. Render (Backend API)
Render will host the Node.js Express server.

1.  **Create Web Service**: Connect your GitHub repository to Render.
2.  **Runtime**: Select `Node`.
3.  **Build Command**: `npm install && npm run build`
4.  **Start Command**: `npm start`
5.  **Environment Variables**:
    *   `DATABASE_URL`: Your Supabase connection string.
    *   `SESSION_SECRET`: A secure random string.
    *   `RPC_URL`: Your blockchain RPC URL (e.g., Infura/Alchemy).
    *   `DEPOSIT_WALLET_PRIVATE_KEY`: Private key for the platform's EOA wallet.
    *   `CHAIN_ID`: The ID of the blockchain you are using.
    *   `NODE_ENV`: `production`

## 3. Vercel (Frontend)
Vercel will host the Next.js/React frontend.

1.  **Import Project**: Connect your repository to Vercel.
2.  **Framework Preset**: Select `Vite` or `Other` (if using the Replit structure).
3.  **Build Command**: `npm run build`
4.  **Output Directory**: `dist` (or `client/dist`)
5.  **Environment Variables**:
    *   `VITE_API_URL`: The URL of your Render backend (e.g., `https://your-api.onrender.com`).
    *   `VITE_CHAIN_ID`: The blockchain network ID.

## 4. Final Wiring
*   Ensure the frontend calls the backend using the `VITE_API_URL`.
*   The backend must have CORS configured to allow requests from your Vercel domain.
*   Once both are live, users can connect wallets and start investing.

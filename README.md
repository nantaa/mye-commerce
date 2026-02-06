# E-Commerce Project Setup Guide

This guide describes how to set up, configure, and run the E-Commerce platform (Frontend + Backend).

## Prerequisites
- **Node.js**: v18+ recommended
- **PostgreSQL**: Database for the backend
- **Redis**: For caching and queues (Required for Analytics)

## Redis Setup (Windows/WSL)
You need a running Redis instance for analytics features to work.

### Option 1: Using Docker (Recommended)
If you have Docker Desktop installed:
```bash
docker run --name redis -p 6379:6379 -d redis
```

### Option 2: Using WSL (Ubuntu)
If you prefer installing directly in WSL:
```bash
sudo apt-get update
sudo apt-get install redis-server
sudo service redis-server start
```

## Project Structure
- `frontend/`: Next.js application
- `backend/`: Node.js/Express application

## 1. Backend Setup
Navigate to the backend directory:
```bash
cd backend
```

### Install Dependencies
```bash
npm install
```

### Environment Configuration
Create or update `.env` in `backend/`:
```env
PORT=4000
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/YOUR_DB_NAME?schema=public"
REDIS_URL="redis://localhost:6379"

# Auth
CLERK_SECRET_KEY=sk_test_...

# Midtrans Payment
MIDTRANS_SERVER_KEY="Your-SB-Mid-Server-Key"
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY="Your-SB-Mid-Client-Key"
```

### Database Setup
```bash
# Push schema to database
npx prisma db push

# Generate Prisma Client (Fixes 'PrismaClient' export errors)
npx prisma generate
```

### Run Development Server
```bash
npm run dev
```
Backend runs on `http://localhost:4000`.

## 2. Frontend Setup
Navigate to the frontend directory:
```bash
cd ../frontend
```

### Install Dependencies
```bash
npm install
```

### Environment Configuration
Create `.env.local` in `frontend/`:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY="Your-SB-Mid-Client-Key"
```

### Run Development Server
```bash
npm run dev
```
Frontend runs on `http://localhost:3000`.

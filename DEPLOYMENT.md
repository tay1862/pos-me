# Production Deployment Guide

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or cloud)
- npm or yarn package manager

## Step 1: Database Setup

### Option A: Local PostgreSQL

1. Install PostgreSQL on your server
2. Create a new database:
   ```sql
   CREATE DATABASE pos_db;
   ```

### Option B: Cloud Database (Recommended)

Use a managed PostgreSQL service:
- **Neon** (https://neon.tech) - Free tier available
- **Supabase** (https://supabase.com) - Free tier available
- **Railway** (https://railway.app) - Free tier available
- **Render** (https://render.com) - Free tier available

## Step 2: Environment Configuration

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update `.env` with your database URL:
   ```
   DATABASE_URL="postgresql://user:password@host:port/pos_db"
   ```

## Step 3: Install Dependencies

```bash
npm install
```

## Step 4: Database Migration

```bash
# Push schema to database
npx prisma db push

# Generate Prisma Client
npx prisma generate

# Seed initial data (optional)
npx ts-node prisma/seed.ts
```

## Step 5: Build for Production

```bash
npm run build
```

## Step 6: Start Production Server

```bash
npm start
```

The application will be available at http://localhost:3000

## Step 7: Deployment Options

### Option A: Vercel (Recommended for Next.js)

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Add environment variables in Vercel dashboard

### Option B: Docker

1. Create `Dockerfile`:
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   COPY . .
   RUN npx prisma generate
   RUN npm run build
   EXPOSE 3000
   CMD ["npm", "start"]
   ```

2. Build and run:
   ```bash
   docker build -t pos-system .
   docker run -p 3000:3000 --env-file .env pos-system
   ```

### Option C: Traditional Server (VPS)

1. Use PM2 for process management:
   ```bash
   npm install -g pm2
   pm2 start npm --name "pos-system" -- start
   pm2 save
   pm2 startup
   ```

2. Set up Nginx as reverse proxy:
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## Troubleshooting

### Database Connection Issues

1. Check DATABASE_URL format:
   ```
   postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public
   ```

2. Verify database is accessible:
   ```bash
   npx prisma db pull
   ```

### Build Errors

1. Clear Next.js cache:
   ```bash
   rm -rf .next
   npm run build
   ```

2. Regenerate Prisma Client:
   ```bash
   npx prisma generate
   ```

### Port Already in Use

Change port in `package.json`:
```json
"start": "next start -p 3001"
```

## Security Checklist

- [ ] Change default PINs in production
- [ ] Use strong database password
- [ ] Enable HTTPS (use Let's Encrypt)
- [ ] Set up database backups
- [ ] Configure firewall rules
- [ ] Keep dependencies updated

## Monitoring

Consider adding:
- Error tracking (Sentry)
- Analytics (Google Analytics, Plausible)
- Uptime monitoring (UptimeRobot)
- Performance monitoring (Vercel Analytics)

## Support

For issues, check:
1. Application logs: `pm2 logs` (if using PM2)
2. Database logs
3. Browser console for client-side errors

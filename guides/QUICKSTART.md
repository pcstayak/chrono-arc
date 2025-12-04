# Chrono Arc - Quick Start Checklist

Use this checklist to get from zero to deployed in ~30 minutes.

---

## ✅ Step 1: Local Development Setup (5 min)

### Install Dependencies
```bash
cd f:/dev/chrono-arc
npm install
```

**✓ Done when**: No errors in terminal

---

## ✅ Step 2: Supabase Database Setup (15 min)

### 2a. Create Supabase Project
1. Go to https://app.supabase.com
2. Sign up / Log in
3. Click **"New Project"**
4. Name: `chrono-arc`
5. Save the database password securely
6. Wait 2-3 minutes for provisioning

**✓ Done when**: Project dashboard loads

### 2b. Get API Credentials
1. Settings → API
2. Copy **Project URL** (starts with `https://`)
3. Copy **anon public** key (starts with `eyJ...`)

**✓ Done when**: You have both values copied

### 2c. Configure Local Environment
1. Copy `.env.example` → `.env.local`
2. Paste your credentials into `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
   ```

**✓ Done when**: `.env.local` exists with real values

### 2d. Run Database Migrations
1. In Supabase: SQL Editor → New query
2. Open `supabase/migrations/000_initial_schema.sql`
3. Copy entire file → Paste → Run
4. Open `supabase/migrations/001_sample_data.sql`
5. Copy entire file → Paste → Run
6. Table Editor → Verify 4 tables exist

**✓ Done when**: `events` table has 5 sample rows

---

## ✅ Step 3: Test Locally (2 min)

### Start Dev Server
```bash
npm run dev
```

### Test the App
1. Open http://localhost:3000
2. Click **"Create Session"**
3. Enter your name
4. Click **"Create Session"**
5. You should see a 6-character room code

### Verify in Supabase
1. Supabase Dashboard → Table Editor → `sessions`
2. Your session should appear

**✓ Done when**: You can create sessions and see them in Supabase

---

## ✅ Step 4: Deploy to Vercel (10 min) - OPTIONAL

### 4a. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit - Chrono Arc"
git remote add origin https://github.com/YOUR_USERNAME/chrono-arc.git
git branch -M main
git push -u origin main
```

**✓ Done when**: Code is on GitHub (verify at github.com)

### 4b. Deploy to Vercel
1. Go to https://vercel.com
2. Sign up with GitHub
3. Click **"Add New..."** → **"Project"**
4. Import `chrono-arc` repository
5. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Click **"Deploy"**
7. Wait 2-3 minutes

**✓ Done when**: You get a live URL like `https://chrono-arc-xxx.vercel.app`

### 4c. Test Production
1. Visit your Vercel URL
2. Create a session
3. Verify it works

**✓ Done when**: Production app works like local

---

## 🎉 You're Done!

Your app is now:
- ✅ Running locally at http://localhost:3000
- ✅ Connected to Supabase database
- ✅ Deployed to Vercel (if you did Step 4)
- ✅ Ready for feature development

---

## 📚 Next Steps

### Option A: Add a Custom Domain
See [`VERCEL_DEPLOYMENT.md`](./VERCEL_DEPLOYMENT.md) Part 3 for:
- How to buy a domain (~$10/year)
- How to connect it to Vercel
- Recommended registrars

### Option B: Start Building Features
Check out the user stories in `specs/stories/`:
- **Epic 1**: MVP Core Layout (basic structure)
- **Epic 2**: Timeline Arc Navigation (the fun part!)
- **Epic 3**: Card Trigger System (interactivity)
- **Epic 4**: Sample Data & State Management

### Option C: Customize the App
- Add more sample events to `events` table
- Customize colors in `tailwind.config.ts`
- Update landing page copy in `app/page.tsx`

---

## 🐛 Troubleshooting

### "Can't connect to Supabase"
- Check `.env.local` has correct values
- No spaces or quotes around values
- Restart dev server

### "Tables don't exist"
- Go to Supabase SQL Editor
- Run `000_initial_schema.sql`
- Check Table Editor to verify

### "Vercel deployment failed"
- Check build logs in Vercel
- Make sure env vars are set
- Try: `npm run build` locally first

### "Domain not working"
- Wait 15 minutes for DNS propagation
- Check DNS records point to `76.76.21.21`
- Try incognito/private browsing

---

## 📖 Detailed Guides

For step-by-step walkthroughs with screenshots and explanations:

- **[SETUP.md](./SETUP.md)** - Local development setup
- **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** - Complete database setup guide
- **[VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)** - Deployment + domain setup

---

## 💰 Cost Breakdown

**MVP (Free Forever)**:
- Hosting: $0 (Vercel free tier)
- Database: $0 (Supabase free tier)
- Domain: $0 (use `your-app.vercel.app`)
- SSL: $0 (automatic)

**Production (Paid)**:
- Hosting: $0 (still free unless you get lots of traffic)
- Database: $0 (up to 500MB free)
- Domain: $10-20/year
- SSL: $0 (automatic)

---

## 🆘 Getting Help

If you're stuck:
1. Check the detailed guides above
2. Read error messages carefully
3. Check Supabase and Vercel dashboards
4. Google the specific error

---

**Happy coding!** 🚀

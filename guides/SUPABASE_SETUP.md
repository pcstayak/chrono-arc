# Supabase Setup Guide

Complete step-by-step instructions for setting up Supabase for Chrono Arc.

## Part 1: Create Supabase Project (5 minutes)

### Step 1: Sign Up / Log In
1. Go to https://app.supabase.com
2. Sign up with GitHub (recommended) or email
3. Verify your email if required

### Step 2: Create New Project
1. Click **"New Project"** button
2. Fill in project details:
   - **Name**: `chrono-arc` (or any name you prefer)
   - **Database Password**: Generate a strong password and **SAVE IT SECURELY**
     - You'll need this if you ever want to connect directly to the database
     - Store it in a password manager
   - **Region**: Choose closest to your location (e.g., `us-east-1`, `eu-central-1`)
   - **Pricing Plan**: Select **Free** tier (perfect for development)
3. Click **"Create new project"**
4. Wait 2-3 minutes while Supabase provisions your database

### Step 3: Get Your Project Credentials
Once your project is ready, you need two values:

1. **Project URL**:
   - Go to **Settings** (gear icon in left sidebar)
   - Click **API**
   - Find **Project URL** (looks like: `https://xxxxxxxxxxxxx.supabase.co`)
   - Copy this value

2. **Anon Public Key**:
   - Same page (**Settings** → **API**)
   - Find **Project API keys** section
   - Copy the **`anon` `public`** key (long string starting with `eyJ...`)
   - **DO NOT** copy the `service_role` key (that's for backend only)

---

## Part 2: Run Database Migrations (3 minutes)

### Step 1: Open SQL Editor
1. In Supabase Dashboard, click **SQL Editor** in left sidebar
2. Click **"New query"** button

### Step 2: Run Initial Schema Migration
1. Open the file `supabase/migrations/000_initial_schema.sql` from your project
2. Copy the **entire contents** of the file
3. Paste into the SQL Editor in Supabase
4. Click **"Run"** button (or press `Ctrl+Enter` / `Cmd+Enter`)
5. You should see: **"Success. No rows returned"**

### Step 3: Run Sample Data Migration
1. Open the file `supabase/migrations/001_sample_data.sql` from your project
2. Copy the **entire contents** of the file
3. Paste into the SQL Editor in Supabase (create new query or replace previous)
4. Click **"Run"** button
5. You should see: **"Success. 5 rows returned"** or similar

### Step 4: Verify Tables Were Created
1. Click **Table Editor** in left sidebar
2. You should see 4 tables:
   - `sessions`
   - `players`
   - `events` (should have 5 sample rows)
   - `session_events`
3. Click on **`events`** table to see the 5 sample historical events

---

## Part 3: Configure Local Project (2 minutes)

### Step 1: Create Environment File
1. In your project root (`f:/dev/chrono-arc/`), find the file `.env.example`
2. Create a **copy** of this file and name it `.env.local`
3. Open `.env.local` in your editor

### Step 2: Add Your Supabase Credentials
Replace the placeholder values with your actual credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4eHh4eHh4eHh4eHgiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Important**:
- Copy your **Project URL** from Step 3 above
- Copy your **`anon` `public`** key (NOT the `service_role` key!)
- Make sure there are **no quotes** around the values
- Make sure there are **no spaces** before or after the `=` sign

### Step 3: Verify `.env.local` is Gitignored
The `.env.local` file should **never** be committed to git (it contains secrets).

1. Check that `.gitignore` includes this line:
   ```
   .env*.local
   ```
2. If missing, add it to `.gitignore`

---

## Part 4: Test Your Setup (2 minutes)

### Step 1: Start Development Server
```bash
npm run dev
```

### Step 2: Open the Application
1. Open http://localhost:3000 in your browser
2. You should see the Chrono Arc landing page with:
   - "Create Session" button
   - "Join Session" button

### Step 3: Test Creating a Session
1. Click **"Create Session"**
2. Enter your name (e.g., "Test Player")
3. Click **"Create Session"**
4. If successful, you'll be redirected to a game page with a **room code** (6 characters)

### Step 4: Verify in Supabase Dashboard
1. Go back to Supabase Dashboard
2. Click **Table Editor** → **sessions**
3. You should see your newly created session with the room code
4. Click **Table Editor** → **players**
5. You should see your player entry

### Step 5: Test Sample Events
1. In Supabase Dashboard, go to **Table Editor** → **events**
2. Verify you see 5 events:
   - Invention of the Wheel (-3500)
   - Printing Press (1440)
   - First Flight (1903)
   - Moon Landing (1969)
   - Internet Invention (1983)

---

## Part 5: Optional Configuration

### Enable Real-time (For Future Multiplayer Features)
1. In Supabase Dashboard, go to **Database** → **Replication**
2. Enable replication for tables:
   - `sessions`
   - `players`
   - `session_events`
3. This allows real-time updates when other players join or place events

### Set Up Row Level Security (Production)
For MVP, RLS is set to allow all operations. For production:
1. Go to **Authentication** → **Policies**
2. Update policies for each table to restrict access based on user authentication
3. See Supabase docs: https://supabase.com/docs/guides/auth/row-level-security

---

## Troubleshooting

### Error: "Invalid API key"
- Double-check you copied the **`anon` `public`** key (not `service_role`)
- Make sure there are no extra spaces or quotes in `.env.local`
- Restart your dev server: `Ctrl+C` then `npm run dev`

### Error: "relation 'sessions' does not exist"
- You didn't run the migrations yet
- Go to **SQL Editor** and run `000_initial_schema.sql`

### Error: "Network request failed"
- Check your **Project URL** is correct in `.env.local`
- Make sure your Supabase project is running (check dashboard)
- Check your internet connection

### Dev Server Won't Start
- Make sure `.env.local` exists and has valid values
- Try deleting `.next` folder: `rm -rf .next` then `npm run dev`
- Make sure npm packages are installed: `npm install`

### Can't See Data in Tables
- Run `001_sample_data.sql` migration
- Check **Table Editor** → **events** to verify

---

## Next Steps

Once your setup is complete and tested:

1. **Start implementing user stories** from `specs/stories/`
2. **Add more sample events** to the `events` table for richer gameplay
3. **Deploy to Vercel** (see SETUP.md for deployment instructions)

---

## Quick Reference

### Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

### Migration Files (run in order)
1. `supabase/migrations/000_initial_schema.sql`
2. `supabase/migrations/001_sample_data.sql`

### Useful Supabase Dashboard Links
- **SQL Editor**: Run queries and migrations
- **Table Editor**: View and edit data
- **API Docs**: Auto-generated API documentation for your tables
- **Logs**: Debug issues with queries

### Local Development
```bash
npm run dev              # Start dev server (http://localhost:3000)
npm run build           # Test production build
npm run start           # Run production build locally
```

---

## Security Checklist

Before deploying to production:

- [ ] Never commit `.env.local` to git
- [ ] Use environment variables on your hosting platform (Vercel, Netlify, etc.)
- [ ] Tighten Row Level Security policies
- [ ] Rotate API keys if accidentally exposed
- [ ] Enable 2FA on your Supabase account
- [ ] Set up database backups (automatic on Supabase)

---

**Need help?** Check the main `SETUP.md` file or Supabase documentation at https://supabase.com/docs

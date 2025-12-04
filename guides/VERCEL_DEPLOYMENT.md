# Vercel Deployment Guide

Complete step-by-step instructions for deploying Chrono Arc to Vercel with domain setup.

---

## Prerequisites

Before deploying, make sure you have:
- ✅ Completed Supabase setup (see `SUPABASE_SETUP.md`)
- ✅ Your code in a GitHub repository
- ✅ Tested the app locally (`npm run dev` works)

---

## Part 1: Push Code to GitHub (5 minutes)

### Step 1: Create GitHub Repository

If you haven't already:

1. Go to https://github.com
2. Sign in (or create an account)
3. Click **"New"** or **"+"** → **"New repository"**
4. Fill in details:
   - **Repository name**: `chrono-arc`
   - **Description**: "Web-based family timeline game"
   - **Visibility**: Choose **Private** or **Public**
   - **DO NOT** initialize with README (you already have one)
5. Click **"Create repository"**

### Step 2: Push Your Code to GitHub

Open a terminal in your project directory and run:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit - Chrono Arc boilerplate"

# Add GitHub as remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/chrono-arc.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Important**: Make sure `.env.local` is NOT pushed to GitHub (it should be in `.gitignore`).

### Step 3: Verify on GitHub

1. Go to your repository URL: `https://github.com/YOUR_USERNAME/chrono-arc`
2. Refresh the page
3. You should see all your files (but NOT `.env.local`)
4. Check that `.env.example` is there (it should be)

---

## Part 2: Deploy to Vercel (10 minutes)

### Step 1: Create Vercel Account

1. Go to https://vercel.com
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"** (recommended)
4. Authorize Vercel to access your GitHub account
5. This links your GitHub repos to Vercel

### Step 2: Import Your Repository

1. You'll land on the Vercel dashboard
2. Click **"Add New..."** → **"Project"**
3. You'll see a list of your GitHub repositories
4. Find **`chrono-arc`** in the list
5. Click **"Import"** next to it

**If you don't see your repository:**
- Click **"Adjust GitHub App Permissions"**
- Grant access to the repository
- Refresh the page

### Step 3: Configure Project Settings

Vercel will auto-detect Next.js. You'll see a configuration screen:

#### Framework Preset
- Should auto-select **"Next.js"** ✅
- If not, select it manually

#### Root Directory
- Leave as **"./"** (root of repository)

#### Build and Output Settings
- Leave defaults:
  - **Build Command**: `next build`
  - **Output Directory**: `.next`
  - **Install Command**: `npm install`

#### Environment Variables (IMPORTANT!)

This is where you add your Supabase secrets. Click **"Environment Variables"** section and add:

**Variable 1:**
- **Name**: `NEXT_PUBLIC_SUPABASE_URL`
- **Value**: Your Supabase Project URL (from `.env.local`)
- Click **"Add"**

**Variable 2:**
- **Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value**: Your Supabase Anon Key (from `.env.local`)
- Click **"Add"**

**Optional Variable 3 (for future backend features):**
- **Name**: `SUPABASE_SERVICE_ROLE_KEY`
- **Value**: Your Supabase Service Role Key
- Click **"Add"**

**Important**:
- Make sure variable names are EXACTLY as shown (including `NEXT_PUBLIC_` prefix)
- No extra spaces before or after
- These will be available for all environments (Production, Preview, Development)

### Step 4: Deploy!

1. Click **"Deploy"** button
2. Vercel will:
   - Clone your repository
   - Install dependencies (`npm install`)
   - Build your app (`npm run build`)
   - Deploy to a URL
3. Wait 2-3 minutes while it builds
4. You'll see a progress log - watch for any errors

### Step 5: Celebrate! 🎉

Once deployment succeeds:
- You'll see a success screen with confetti
- You'll get a **deployment URL** like: `https://chrono-arc-xxxxx.vercel.app`
- Click **"Visit"** to see your live app

---

## Part 3: Get a Domain Name (15-30 minutes)

You have two options for your domain:

### Option A: Use Free Vercel Subdomain (Recommended for MVP)

Vercel gives you a free subdomain automatically:

**Format**: `https://chrono-arc.vercel.app` or `https://your-project-name.vercel.app`

**Pros**:
- ✅ Free forever
- ✅ Instant setup (already done!)
- ✅ SSL/HTTPS automatic
- ✅ Perfect for testing and MVP

**Cons**:
- ❌ Not a custom domain
- ❌ Has "vercel.app" in the name

**To customize your Vercel subdomain**:
1. Go to your project in Vercel dashboard
2. Click **"Settings"** → **"Domains"**
3. You'll see your default domain (e.g., `chrono-arc-xxxxx.vercel.app`)
4. Click **"Edit"** to change the prefix
5. Try: `chrono-arc.vercel.app` (if available)

**This is perfect for your MVP - skip to Part 4 if using this option.**

---

### Option B: Buy a Custom Domain (For Production)

For a professional domain like `chrono-arc.com`, you need to purchase one.

#### Step 1: Choose a Domain Registrar

Popular options:
- **Namecheap** (https://www.namecheap.com) - $8-12/year, beginner-friendly
- **Google Domains** (https://domains.google) - ~$12/year, simple interface
- **Cloudflare** (https://www.cloudflare.com/products/registrar/) - At-cost pricing (~$8-10/year)
- **GoDaddy** (https://www.godaddy.com) - Popular but more expensive

**Recommended**: Namecheap or Cloudflare for best price/features.

#### Step 2: Search for Available Domain

1. Go to your chosen registrar
2. Search for domain name ideas:
   - `chrono-arc.com`
   - `chronoarc.com`
   - `chronoarc.app`
   - `chronoarc.games`
   - `playchronoarc.com`

**Tips**:
- `.com` is most popular but more expensive ($10-15/year)
- `.app` is great for web apps ($12-15/year)
- `.games` is perfect for game projects ($15-20/year)
- `.dev` is good for projects ($12-15/year)
- Avoid `.xyz`, `.info` (look spammy)

#### Step 3: Purchase Domain

1. Add domain to cart
2. **Select registration period**: 1 year minimum
3. **Add WHOIS privacy protection** (FREE on most registrars, protects your personal info)
4. **Decline upsells**: You don't need email, website builder, etc.
5. Checkout and pay

**Total cost**: ~$10-20 for first year

#### Step 4: Wait for Confirmation

- You'll get an email confirming purchase
- Domain is usually active within 5-15 minutes
- Some registrars require email verification - check your inbox

---

## Part 4: Connect Domain to Vercel (5 minutes)

### Option A: If Using Vercel Subdomain

You're already done! Your app is at `https://your-project.vercel.app`

Skip to Part 5.

---

### Option B: If Using Custom Domain

#### Method 1: Add Domain in Vercel (Easiest)

1. Go to Vercel dashboard → your project
2. Click **"Settings"** → **"Domains"**
3. Click **"Add"** or enter domain in the input field
4. Type your domain (e.g., `chrono-arc.com`)
5. Click **"Add"**

Vercel will show you DNS records to configure.

#### Method 2: Configure DNS Records

You need to point your domain to Vercel's servers. Vercel gives you two options:

**Option 2a: Using A Record (Recommended)**

Go to your domain registrar's DNS settings and add:

**A Record**:
- **Name/Host**: `@` (or leave blank)
- **Value/Points to**: `76.76.21.21`
- **TTL**: `3600` (or Auto)

**CNAME Record (for www subdomain)**:
- **Name/Host**: `www`
- **Value/Points to**: `cname.vercel-dns.com`
- **TTL**: `3600`

**Option 2b: Using CNAME (Alternative)**

If your registrar doesn't support A records for root domain:

- **Name/Host**: `@` or `your-domain.com`
- **Value/Points to**: `cname.vercel-dns.com`
- **TTL**: `3600`

#### Step-by-Step for Popular Registrars

**Namecheap**:
1. Log in to Namecheap
2. Go to **"Domain List"** → click **"Manage"** next to your domain
3. Click **"Advanced DNS"** tab
4. Click **"Add New Record"**
5. Add the A and CNAME records shown in Vercel
6. Click **"Save All Changes"**

**Google Domains**:
1. Go to https://domains.google.com
2. Click on your domain
3. Click **"DNS"** in left sidebar
4. Scroll to **"Custom resource records"**
5. Add the records from Vercel
6. Click **"Add"**

**Cloudflare**:
1. Go to Cloudflare dashboard
2. Select your domain
3. Click **"DNS"** tab
4. Click **"Add record"**
5. Add the A and CNAME records from Vercel
6. **Important**: Set Proxy status to **"DNS only"** (gray cloud, not orange)
7. Save

#### Step 3: Wait for DNS Propagation

1. In Vercel, wait for the domain status to change from "Pending" to "Active"
2. This can take:
   - **5-15 minutes** (common)
   - **Up to 48 hours** (rare)
3. Vercel will automatically provision an SSL certificate (HTTPS)

#### Step 4: Set as Primary Domain (Optional)

In Vercel → Settings → Domains:
1. Find your custom domain in the list
2. Click **"..."** menu → **"Set as Primary"**
3. Now all traffic will redirect to your custom domain

---

## Part 5: Test Your Deployment (5 minutes)

### Step 1: Visit Your Live App

Go to your deployment URL:
- Vercel subdomain: `https://chrono-arc.vercel.app`
- Custom domain: `https://your-domain.com`

### Step 2: Test Core Features

1. **Landing page loads**: You should see "Create Session" and "Join Session" buttons
2. **Create a session**:
   - Click "Create Session"
   - Enter a player name
   - You should get a 6-character room code
3. **Verify database connection**:
   - Check Supabase dashboard → Table Editor → `sessions`
   - Your new session should appear
4. **Test in another browser/incognito**:
   - Open the join page
   - Enter the room code
   - Verify you can join

### Step 3: Check for Errors

Open browser DevTools (F12):
- **Console tab**: Should have no red errors
- **Network tab**: All requests should return 200/201 (green)

If you see errors:
- Check environment variables in Vercel
- Verify Supabase project is active
- Check the deployment logs

---

## Part 6: Configure Vercel Project Settings (Optional)

### Auto-Deploy on Git Push

Vercel automatically redeploys when you push to GitHub:

```bash
# Make a change
git add .
git commit -m "Update landing page"
git push

# Vercel will automatically build and deploy in ~2 minutes
```

You'll get notifications in:
- Vercel dashboard
- Email (if enabled)
- GitHub PR comments (for preview deployments)

### Preview Deployments

Every GitHub Pull Request gets a unique preview URL:
- Format: `https://chrono-arc-git-feature-branch-username.vercel.app`
- Perfect for testing features before merging to main
- Automatically deleted when PR is merged/closed

### Environment Variables for Different Environments

Vercel supports 3 environments:
- **Production**: Your main domain
- **Preview**: PR and branch deployments
- **Development**: Local development (not used with Vercel)

To set different values per environment:
1. Go to Settings → Environment Variables
2. Click on a variable
3. Uncheck environments where you don't want it
4. Add different values for Production vs Preview

For Chrono Arc, you can use the same Supabase project for all environments (MVP).

---

## Part 7: Monitoring & Analytics (Optional)

### Vercel Analytics (Free for hobby projects)

1. Go to your project in Vercel
2. Click **"Analytics"** tab
3. Click **"Enable Analytics"**
4. Free tier includes:
   - Page view counts
   - Top pages
   - Unique visitors
   - Device/browser breakdown

### Vercel Logs

To debug production issues:
1. Click **"Logs"** tab in your project
2. See real-time logs from your app
3. Filter by:
   - Deployment
   - Source (Build, Function, Edge)
   - Status (Error, Warning, Info)

---

## Troubleshooting

### "Environment variables not found"

**Problem**: App can't connect to Supabase in production

**Solution**:
1. Go to Vercel → Settings → Environment Variables
2. Verify these exist with correct values:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Make sure they're enabled for "Production" environment
4. Redeploy: Deployments → ... menu → "Redeploy"

### "Build failed" Error

**Problem**: Deployment fails during build

**Solution**:
1. Check the build logs in Vercel
2. Common issues:
   - TypeScript errors: Fix types locally, test with `npm run build`
   - Missing dependencies: Run `npm install` locally
   - Syntax errors: Check the error message for file/line number
3. Fix locally, commit, push → auto-redeploys

### Domain Not Working

**Problem**: Custom domain shows "DNS error" or doesn't load

**Solutions**:
1. **Wait longer**: DNS can take up to 24-48 hours (usually 15 min)
2. **Check DNS records**:
   - Go to https://dnschecker.org
   - Enter your domain
   - Verify A record points to `76.76.21.21`
3. **Verify in registrar**: Make sure you saved DNS changes
4. **Check Vercel status**: Settings → Domains → should show "Active"
5. **Flush DNS cache**:
   - Windows: `ipconfig /flushdns`
   - Mac: `sudo dscacheutil -flushcache`

### SSL Certificate Issues

**Problem**: "Not Secure" warning or SSL errors

**Solutions**:
1. Wait 5-10 minutes after domain is added (Vercel auto-provisions SSL)
2. Check Vercel → Settings → Domains → SSL status should be "Active"
3. Try accessing `https://` (not `http://`)
4. If stuck after 1 hour, remove domain from Vercel and re-add it

### "Invalid API Key" in Production

**Problem**: Works locally but not in Vercel

**Solutions**:
1. Copy the exact same values from your local `.env.local`
2. Make sure there are no extra spaces or quotes in Vercel env vars
3. Verify you're using `NEXT_PUBLIC_` prefix (required for client-side access)
4. Redeploy after changing env vars

---

## Domain Name Tips & Recommendations

### Best Domain Extensions for Chrono Arc

1. **`.com`** - Classic, trusted, ~$12/year
2. **`.app`** - Perfect for web apps, ~$12/year, HTTPS required (good security)
3. **`.games`** - Great for games, ~$20/year
4. **`.io`** - Popular for tech products, ~$35/year (expensive)
5. **`.gg`** - Gaming focused, ~$25/year

### Recommended Registrars (Price/Features)

| Registrar | Price | Pros | Cons |
|-----------|-------|------|------|
| **Namecheap** | $8-12/yr | Free WHOIS, easy DNS | Support can be slow |
| **Cloudflare** | $8-10/yr | At-cost pricing, great DNS | Fewer TLDs available |
| **Porkbun** | $8-15/yr | Cheap, free WHOIS, simple | Lesser known |
| **Google Domains** | $12/yr | Simple, trusted | Being migrated to Squarespace |
| **GoDaddy** | $15-20/yr | Well-known | Expensive, lots of upsells |

**My recommendation**: **Namecheap** or **Cloudflare** for best value.

### Domain Name Ideas

If `chrono-arc.com` is taken, try:
- `chronoarc.com` (no hyphen)
- `playchronoarc.com`
- `chronoarc.app`
- `chronoarc.games`
- `getchronoarc.com`
- `chronoarc.io`
- `thechronoarc.com`

**Free tool to check availability**: https://domainr.com

---

## Cost Summary

### Free Option (MVP)
- **Hosting**: $0 (Vercel free tier)
- **Domain**: $0 (use `chrono-arc.vercel.app`)
- **Database**: $0 (Supabase free tier)
- **SSL**: $0 (automatic)
- **Total**: **$0/month**

**Limits**:
- 100 GB bandwidth/month
- 6,000 build minutes/month
- Unlimited projects
- Perfect for MVP and small games

### Paid Option (Production)
- **Hosting**: $0 (Vercel free tier is generous)
- **Domain**: $10-20/year (~$1-2/month)
- **Database**: $0 (Supabase free tier up to 500MB)
- **SSL**: $0 (automatic)
- **Total**: **~$1-2/month**

When you outgrow free tiers:
- **Vercel Pro**: $20/month (if you need more bandwidth)
- **Supabase Pro**: $25/month (if you need more database storage)

---

## Next Steps After Deployment

1. **Share your game**: Send the URL to friends/family for testing
2. **Set up monitoring**: Enable Vercel Analytics
3. **Create a custom domain** (when ready for production)
4. **Add features**: Start implementing user stories from `specs/stories/`
5. **Iterate**: Use Git workflow → push → auto-deploy

---

## Quick Reference

### Important URLs
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Your Project**: https://vercel.com/your-username/chrono-arc
- **Deployment URL**: https://chrono-arc.vercel.app (or your custom domain)

### Key Commands
```bash
# Deploy manually (usually not needed)
npx vercel

# Deploy to production
npx vercel --prod

# Check deployment status
npx vercel ls

# View logs
npx vercel logs
```

### Environment Variables Checklist
- [ ] `NEXT_PUBLIC_SUPABASE_URL` (required)
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` (required)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` (optional, for future backend features)

---

**Congratulations!** Your game is now live on the internet! 🚀

Share the URL and start building features. Every time you push to GitHub, Vercel will automatically redeploy with your latest changes.

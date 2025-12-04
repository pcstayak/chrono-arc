# Chrono Arc - Setup Instructions

This document provides step-by-step instructions for setting up and running the Chrono Arc project.

## Prerequisites

Ensure you have the following installed:
- Node.js 18.0.0 or higher
- npm 8.0.0 or higher
- A Supabase account (free tier works fine)

## Initial Setup

### 1. Install Dependencies

Dependencies are already installed. If you need to reinstall them:

```bash
npm install
```

### 2. Configure Supabase

**→ See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for detailed step-by-step instructions**

Quick summary:
1. Create a Supabase project at https://app.supabase.com
2. Get your Project URL and Anon Key from Settings → API
3. Copy `.env.example` to `.env.local` and add your credentials
4. Run migrations from `supabase/migrations/` in SQL Editor:
   - `000_initial_schema.sql` (creates tables)
   - `001_sample_data.sql` (adds sample events)

### 3. Run the Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Project Structure

```
chrono-arc/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Landing page
│   ├── layout.tsx         # Root layout
│   ├── globals.css        # Global styles
│   ├── game/[sessionId]/  # Main game interface
│   └── session/           # Session flows
│       ├── create/        # Create session
│       └── join/          # Join session
├── components/            # React components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── CardPanel.tsx
│   └── InteractivePanel.tsx
├── lib/
│   ├── dal/              # Data Access Layer
│   │   ├── index.ts      # Main exports
│   │   ├── base.ts       # Utilities
│   │   ├── sessions.ts   # Session operations
│   │   ├── players.ts    # Player operations
│   │   ├── events.ts     # Event operations
│   │   └── session-events.ts
│   └── supabase/         # Supabase client config
│       ├── client.ts     # Browser client
│       └── server.ts     # Server client
├── types/                # TypeScript types
│   ├── database.ts       # Supabase schema
│   ├── domain.ts         # Domain models
│   └── index.ts
├── specs/                # Product specifications
│   ├── friends_pitch.md
│   ├── ui_concept.md
│   └── stories/          # User stories
└── supabase/
    └── migrations/       # Database schema
```

## Available Scripts

```bash
npm run dev         # Start development server (http://localhost:3000)
npm run build       # Build for production
npm run start       # Start production server
npm run lint        # Run ESLint
npm run type-check  # Run TypeScript type checking
```

## Development Workflow

### Creating a New Session

1. Navigate to http://localhost:3000
2. Click "Create New Game"
3. You'll get a 6-character room code
4. Share this code with others to join

### Joining a Session

1. Navigate to http://localhost:3000
2. Click "Join Existing Game"
3. Enter the room code
4. Choose a display name and color
5. Click "Join Game"

## Troubleshooting

### "Missing Supabase environment variables"

Make sure your `.env.local` file exists and has the correct values. The file should not be committed to git.

### Database Connection Errors

1. Verify your Supabase project is active
2. Check that the API keys are correct
3. Ensure the database schema has been created (run the SQL script)

### Next.js Build Errors

Try clearing the cache:
```bash
rm -rf .next
npm run dev
```

### Type Errors

Run type checking to see detailed errors:
```bash
npm run type-check
```

## Next Steps

1. Review user stories in `specs/stories/` to understand planned features
2. Set up your Supabase project and run the database migration
3. Add sample event data for testing
4. Start implementing the first user stories (Epic 1: MVP Core Layout)

## Support

For questions or issues:
- Check the main README.md for architecture documentation
- Review the spec files in `specs/`
- Check Supabase documentation: https://supabase.com/docs

## Deployment

**→ See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for complete deployment guide including domain setup**

Quick summary:
1. Push your code to GitHub
2. Sign up at https://vercel.com with GitHub
3. Import your `chrono-arc` repository
4. Add environment variables (Supabase URL and keys)
5. Deploy - you'll get a free `.vercel.app` domain
6. Optional: Buy and connect a custom domain

**Free hosting**: Vercel's free tier is perfect for MVPs and small projects.

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- **Netlify** - Similar to Vercel, generous free tier
- **Railway** - Easy deployment with databases
- **Fly.io** - Global edge deployment
- **AWS Amplify** - AWS integration
- **Self-hosted** - Any Node.js server

Make sure to set the environment variables on your deployment platform.

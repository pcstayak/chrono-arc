# Chrono Arc

A family-friendly, web-based timeline game where players collaboratively place historical events and inventions in chronological order. Think "Jackbox-style" multiplayer education meets interactive history.

## Overview

Chrono Arc is designed for families and small groups to learn about history together. Players share a session (via room code), work on a shared timeline, and defend their placements from "time bandits" trying to scramble history.

## Technology Stack

### Frontend
- **Framework**: Next.js 15 (App Router, React Server Components)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Architecture**: Fat client (all business logic in frontend)

### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Not yet implemented (future)
- **Storage**: Supabase Storage (for event images)

### Data Access Layer (DAL)
The project uses a custom DAL in `lib/dal/` that abstracts Supabase operations. This makes future API migration straightforward—business logic stays the same, only DAL implementation changes.

## Project Structure

```
chrono-arc/
├── app/                      # Next.js App Router
│   ├── game/[sessionId]/    # Main game interface
│   ├── session/             # Session create/join flows
│   │   ├── create/
│   │   └── join/
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Landing page
│   └── globals.css          # Global styles
├── components/              # React components
│   ├── Header.tsx           # Top bar with session info
│   ├── Footer.tsx           # Timeline arc container
│   ├── CardPanel.tsx        # Left column - event card
│   └── InteractivePanel.tsx # Right column - dynamic content
├── lib/
│   ├── dal/                 # Data Access Layer
│   │   ├── base.ts          # Common utilities
│   │   ├── sessions.ts      # Session operations
│   │   ├── players.ts       # Player operations
│   │   ├── events.ts        # Event catalog operations
│   │   ├── session-events.ts # Session-specific events
│   │   └── index.ts         # Main exports
│   └── supabase/            # Supabase client config
│       ├── client.ts        # Browser client
│       └── server.ts        # Server client (SSR)
├── types/                   # TypeScript type definitions
│   ├── database.ts          # Supabase schema types
│   ├── domain.ts            # Domain/business types
│   └── index.ts             # Centralized exports
├── specs/                   # Product specs and user stories
│   ├── friends_pitch.md
│   ├── ui_concept.md
│   └── stories/             # User stories by epic
└── supabase/                # Supabase migrations and config
    └── migrations/          # (To be created)
```

## Getting Started

### Quick Start Guide

**Complete setup takes ~20 minutes**. Follow these guides in order:

1. **📥 Local Setup** - [`SETUP.md`](./SETUP.md)
   - Install dependencies
   - Configure development environment

2. **🗄️ Database Setup** - [`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md)
   - Create Supabase project
   - Run database migrations
   - Configure environment variables
   - Test the connection

3. **🚀 Deployment** - [`VERCEL_DEPLOYMENT.md`](./VERCEL_DEPLOYMENT.md) *(optional)*
   - Deploy to Vercel
   - Get a free `.vercel.app` domain
   - Buy and connect a custom domain

### Prerequisites

- **Node.js** 18.0.0 or higher
- **npm** 8.0.0 or higher
- **Supabase account** (free tier works fine)
- **GitHub account** (for deployment)

### Installation (Quick Version)

```bash
# 1. Clone and install
git clone <repo-url>
cd chrono-arc
npm install

# 2. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# 3. Run database migrations (see SUPABASE_SETUP.md)
# Copy/paste files from supabase/migrations/ into Supabase SQL Editor:
# - 000_initial_schema.sql
# - 001_sample_data.sql

# 4. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler check
```

## Key Features (Roadmap)

### MVP (Stories 1-4)
- [x] Core layout (header, two-column content, footer timeline)
- [ ] Timeline arc navigation with event dots
- [ ] Card trigger system (story, mini-games, related items)
- [ ] Sample data and in-memory state

### Future
- Defense mode (time bandits attacking cards)
- Progressive difficulty (unlock more detailed events)
- Mini-games for placement and recall
- Real-time multiplayer sync
- Session persistence and resumption

## Architecture Decisions

### Fat Client vs. Backend API

**Current**: All business logic lives in the frontend. Supabase is used purely for data persistence.

**Why**:
- Faster initial development
- Simpler deployment (single Next.js app)
- Suitable for the MVP scope

**Future Migration**: The DAL (`lib/dal/`) abstracts database calls. When scaling requires a backend API:
1. Replace DAL implementations with API fetch calls
2. Move business logic to backend services
3. Frontend code remains mostly unchanged

### Supabase Direct Access

We use Supabase's client libraries directly in the DAL. This is safe because:
- Row-level security (RLS) policies protect data
- All queries go through the DAL, making them auditable
- Easy to swap for REST API calls later

## Contributing

See user stories in `specs/stories/` for planned features. Each story defines acceptance criteria and implementation scope.

## License

TBD

## Contact

TBD

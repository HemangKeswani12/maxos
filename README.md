# bemaxxed

> **objectively better, open source.**

bemaxxed is an engineering stack for human aesthetics. Not a course. Not a coach. Not a Discord server charging $97/month.

## What It Is

- **3D Holographic Engine** — Parametrically scaled body model (current vs. potential) using React Three Fiber
- **MediaPipe Visual Analyzer** — Client-side facial landmark extraction for biometric ratios. Zero uploads. Zero server processing.
- **Groq AI Assistant** — Ultra-low latency LLM (Llama 3.3 70B) with your full biometric context injected
- **30+ Evidence-Based Protocols** — Skin, face structure, posture, body composition, hair, grooming. MDX filtered to your concerns.
- **Routine Tracker** — Daily protocol adherence tracking

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + Verdana |
| State | Zustand |
| Auth | NextAuth.js (Google OAuth) |
| Database | Supabase (PostgreSQL) |
| 3D | React Three Fiber + Three.js |
| Vision | MediaPipe Tasks Vision |
| AI | Groq SDK (Llama 3.3 70B) |
| Content | MDX + gray-matter |

## Setup

### 1. Clone & Install

```bash
git clone https://github.com/HemangKeswani12/maxos.git
cd maxos
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```bash
cp .env.example .env.local
```

Required:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `GROQ_API_KEY`

### 3. Supabase Schema

Run `supabase-schema.sql` in your Supabase SQL editor.

### 4. Run

```bash
npm run dev
```

## Architecture

```
src/
├── app/
│   ├── api/auth/[...nextauth]/   NextAuth handler
│   ├── api/chat/                 Groq AI endpoint
│   ├── dashboard/                Main dashboard
│   ├── onboarding/               Onboarding flow
│   └── page.tsx                  Landing page
├── components/
│   ├── dashboard/                Dashboard components
│   ├── landing/                  Landing page components
│   ├── mediapipe/                Visual analyzer
│   ├── three/                    3D hologram
│   └── ui/                       Shared components
├── lib/                          Auth, Supabase, MDX utils
├── store/                        Zustand global state
└── types/                        TypeScript types + file tree
content/                          MDX protocols (30+ files)
```

## Privacy

- MediaPipe runs 100% client-side. Webcam data is never transmitted.
- User profile stored in Supabase with Row Level Security.
- No tracking beyond Google AdSense.

---

*Not medical advice. Protocols are based on published literature.*

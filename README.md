# maxOS

> **objectively better, open source.**

maxOS is an engineering stack for human aesthetics. Not a course. Not a coach. Not a Discord server charging $97/month.

## What It Is

- **3D Holographic Engine** — Parametrically scaled body model (current vs. potential) using React Three Fiber
- **MediaPipe Visual Analyzer** — Client-side facial landmark extraction for biometric ratios. Zero uploads. Zero server processing.
- **Groq AI Assistant** — Ultra-low latency LLM (Llama 3.3 70B) with your full biometric context injected
- **Personalized Action Plan** — MDX protocol database filtered to your specific insecurities
- **Routine Tracker** — Evidence-based daily protocol adherence tracking

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 14+ (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + Verdana |
| State | Zustand |
| Auth | NextAuth.js (Google OAuth) |
| Database | Supabase (PostgreSQL) |
| 3D | React Three Fiber + Three.js |
| Vision | MediaPipe Tasks Vision |
| AI | Groq SDK (Llama 3.3 70B) |
| Content | MDX + gray-matter |
| Deployment | Netlify |

## Setup

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/maxos.git
cd maxos
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Required variables:
- `NEXT_PUBLIC_SUPABASE_URL` — Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Your Supabase anon key
- `GOOGLE_CLIENT_ID` — Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` — Google OAuth client secret
- `NEXTAUTH_SECRET` — Random 32+ char secret (`openssl rand -base64 32`)
- `NEXTAUTH_URL` — Your deployment URL (`http://localhost:3000` for local)
- `GROQ_API_KEY` — Your Groq API key (free tier available at console.groq.com)

### 3. Supabase Schema

Run `supabase-schema.sql` in your Supabase SQL editor to create the required tables.

### 4. Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 credentials
3. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`

### 5. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Architecture

```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/  # NextAuth handler
│   │   └── chat/               # Groq AI endpoint
│   ├── dashboard/              # Main dashboard
│   ├── onboarding/             # User onboarding flow
│   └── page.tsx                # Landing page
├── components/
│   ├── dashboard/              # Dashboard components
│   ├── landing/                # Landing page components
│   ├── mediapipe/              # MediaPipe visual analyzer
│   ├── three/                  # React Three Fiber hologram
│   └── ui/                     # Shared UI components
├── lib/
│   ├── auth.ts                 # NextAuth config
│   ├── mdx.ts                  # MDX content parser
│   └── supabase.ts             # Supabase client
├── store/
│   └── useAppStore.ts          # Zustand global state
└── types/
    └── index.ts                # TypeScript types + file tree
content/
├── face/skin/                  # Skincare protocols (MDX)
├── face/jawline/               # Facial structure protocols
├── physique/posture/           # Posture correction protocols
├── physique/body/              # Body composition protocols
└── hair/                       # Hair protocols
```

## Privacy

- MediaPipe runs **100% in the browser**. Webcam data is never transmitted.
- User profile data is stored in Supabase with Row Level Security.
- No tracking beyond Google AdSense (standard).

## License

MIT — Fork it. Read it. Audit it. Build on it.

---

*Not medical advice. Protocols are based on published literature. Consult a qualified professional for medical decisions.*

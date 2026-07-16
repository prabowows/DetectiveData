# Detective Data 🔎

**Investigate. Think. Solve.**

An educational detective game that teaches computational thinking, data literacy, pattern recognition, logical reasoning, and decision making — built to feel like Duolingo, Notion, Linear, and Google Material had a baby.

This is **not** a horror game. It's a cheerful, colorful, approachable investigation experience for the general public.

---

## ✨ What's inside

- **Game User experience**: Dashboard → Case Library → Case Detail → Investigation (the "detective desk") → Submission → Result
- **Admin experience**: Dashboard → Upload CSV → Case Management → Analytics
- **CSV Engine**: unlimited cases, all driven by a two-section CSV (`META` + `EVENT`). Nothing is hardcoded.
- Confetti, skeleton loading, empty states, autosave notes, search/filter/sort/group timelines, dark mode tokens, keyboard-accessible components.

## 🧱 Tech stack

Next.js 15 (App Router) · TypeScript · Tailwind CSS · shadcn/ui (Radix primitives) · Framer Motion · Lucide Icons · PapaParse · React Hook Form · Zod · Zustand · Supabase (optional) · Vercel-ready

## 🚀 Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app seeds itself with **3 sample cases** on first load — no setup required. Everything (cases, player progress, submissions) is stored in your browser via Zustand + localStorage, so you can try the whole product immediately.

### Try it as an admin

Go to `/admin/upload`, drop in one of the CSVs from `/data`, review the validation + preview, and hit **Publish**. It'll instantly show up in `/cases`.

## 🔌 Optional: connecting Supabase

The game runs fully in "local mode" without any configuration. If you want a real shared Postgres database (multi-admin case management, cross-device play history, auth-gated `/admin`), do this:

1. Create a project at [supabase.com](https://supabase.com).
2. Run `supabase/schema.sql` in the SQL Editor — it creates `cases`, `case_events`, `submissions`, and an `admins` allow-list table with row-level security policies already wired up.
3. Copy `.env.example` to `.env.local` and fill in:
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...
   ```
4. Insert your own user id into `admins` (via the SQL editor) to unlock `/admin`.

`lib/supabase/client.ts` and `lib/supabase/server.ts` return `null` when the env vars aren't set, so the rest of the app degrades gracefully to local mode — nothing crashes if you skip Supabase entirely.

## 📄 The Case Definition Language (CSV schema)

Every case is one CSV with **two row types**, distinguished by the `Type` column. The schema is fixed — this is intentional, it's what lets the CSV Engine generate unlimited cases without any code changes.

```
Type,Key,Value,ID,Time,Source,Actor,Action,Object,Target,Location,Description,Importance
META,CASE_ID,CASE001,,,,,,,,,,
META,TITLE,Laptop Hilang di Kantor,,,,,,,,,,
META,DIFFICULTY,Easy,,,,,,,,,,
META,CATEGORY,Theft,,,,,,,,,,
META,TIME_LIMIT,15,,,,,,,,,,
META,MAX_SCORE,100,,,,,,,,,,
META,STORY,"...",,,,,,,,,,
META,QUESTION,"...",,,,,,,,,,
META,CULPRIT,Andi,,,,,,,,,,
META,SOLUTION,"...",,,,,,,,,,
META,REFERENCE_EVENTS,3|5|7,,,,,,,,,,
META,HINT,"...",,,,,,,,,,
EVENT,,,1,08:00,Attendance,Andi,Check In,,,Office,Andi arrives,1
EVENT,,,2,09:00,CCTV,Andi,Enter,,,Meeting Room,...,3
```

### META fields (one row per field, `Key`/`Value` columns)

| Key | Meaning |
|---|---|
| `CASE_ID` | Unique case identifier |
| `TITLE` | Case title shown everywhere |
| `DIFFICULTY` | `Easy` \| `Medium` \| `Hard` |
| `CATEGORY` | e.g. Theft, Fraud, Missing Person |
| `TIME_LIMIT` | Suggested minutes to solve |
| `MAX_SCORE` | Points available |
| `STORY` | The case briefing shown before investigation |
| `QUESTION` | What the player must answer |
| `CULPRIT` | The correct suspect — must match an `Actor` in the EVENT section |
| `SOLUTION` | Official explanation shown on the Result page |
| `REFERENCE_EVENTS` | `\|`-separated list of EVENT `ID`s that support the solution — these get highlighted and auto-scrolled-to on the Result page |
| `HINT` | Optional nudge, revealed on demand during investigation |

### EVENT fields (one row per timeline event)

| Column | Meaning |
|---|---|
| `ID` | Unique within the case |
| `Time` | Displayed as-is (e.g. `08:30`, `23:10`) |
| `Source` | CCTV, GPS, Chat, Email, Attendance, Transaction, Forensic, Witness, IoT Sensor, Incident, or any custom string |
| `Actor` | Who the event is about — the set of unique Actors (excluding `System`) becomes the suspect list |
| `Action` | What happened |
| `Object` / `Target` | Optional extra context |
| `Location` | Where it happened |
| `Description` | Full sentence description shown on the card |
| `Importance` | `1`–`5`, drives the card's visual weight |

Uploading a CSV runs it through `lib/csv-parser.ts`, which validates every required field with Zod (`lib/csv-schema.ts`) and surfaces friendly, field-by-field error messages — including cross-checks like "CULPRIT doesn't appear as an Actor" or "REFERENCE_EVENTS points to an ID that doesn't exist."

## 📁 Project structure

```
app/
  page.tsx                          Game user dashboard
  cases/page.tsx                    Case Library
  cases/[caseId]/page.tsx           Case Detail (briefing)
  cases/[caseId]/investigate/       Investigation ("detective desk")
  cases/[caseId]/submit/            Submission (pick culprit + reasoning)
  cases/[caseId]/result/            Result (correct/incorrect + solution)
  admin/                            Admin dashboard, upload, case management, analytics
components/
  ui/                               shadcn-style primitives (Button, Card, Dialog, ...)
  layout/                           Navbar, seed provider
  game/                             EventCard, Timeline, FilterBar, SuspectCard, NotesPanel, StorySidebar, Confetti
  admin/                            CsvUploader, ValidationReport, CasePreview
lib/
  types.ts                          Case/Event/Submission domain types
  csv-parser.ts                     The CSV Engine
  csv-schema.ts                     Zod validation schemas
  store.ts                          Zustand store (cases, progress, submissions) + localStorage persistence
  seed-data.ts                      Bundled sample case CSVs (generated from /data)
  supabase/                         Optional Supabase browser/server clients
data/                               Sample Case Definition CSVs (source of seed-data.ts)
supabase/schema.sql                 Optional Postgres schema + RLS policies
```

## 🚢 Deploying to Vercel

```bash
vercel deploy
```

No environment variables are required for local mode. Add the three Supabase variables from `.env.example` in your Vercel project settings if you've enabled the Supabase backend.

## 🎨 Design system

- **Primary** Blue `#3B82F6` · **Secondary** Emerald `#10B981` · **Accent** Orange `#F97316`
- Rounded-xl/2xl corners, soft shadows, glassmorphism (`glass` / `glass-card` utility classes in `app/globals.css`), gradient hero sections
- Type scale uses Poppins for display/headings and Inter for body text
- Full dark mode token set is defined in `globals.css` (`.dark` class) — wire up a theme toggle with `next-themes` if you want a switch in the UI

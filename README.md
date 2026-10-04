# THE UNBIAS — AI Decision-Audit Workspace

> **"See the decision you are actually making."**  
> *The AI does not give you a better answer. It helps you notice the answer you were already smuggling in.*

**The Unbias** is an AI decision-audit workspace built on a strict non-negotiable principle: **it never chooses for the user**. Rather than acting as an oracle that ranks choices or spits out shallow pros/cons, The Unbias turns complex, high-stakes decisions (career crossroads, educational paths, venture funding, personal dilemmas) into structured reasoning maps. It stress-tests hidden assumptions, flags evidence gaps, simulates pre-mortem failure modes, and generates empirical verification actions.

---

## 🌟 Executive Summary & Pitch

- **The Problem:** People make life-altering decisions using unexamined assumptions and confirmation bias. Conventional AI chatbots make this worse: they produce generic verdicts, stripping human critical agency and fostering false confidence.
- **The Solution:** An interactive reasoning audit system that inspects *how* you think rather than *what* you should choose.
- **Key Guarantee:** No option scoring, no "AI picks", no recommendations. Success is not higher confidence—it is **confidence that matches your evidence**.
- **Interactive Presentation Deck:** View the full interactive pitch presentation at [`/ppt`](http://localhost:3000/ppt).

---

## 🎨 Visual Identity & Brutalist Design

- **Canvas & Background:** High-contrast yellow (`#FFE600`) with a persistent 32px architectural grey grid.
- **Buttons:** Bold crimson red (`#E10600`) with crisp white uppercase text, 3px solid black borders, and hard `4px 4px 0 #000` offset shadows.
- **Cards & Surfaces:** Pure white (`#FFFFFF`) cards with 3px black borders, `6px 6px 0 #000` hard drop shadows, and zero/minimal rounded corners.
- **Typography:** Display headlines in **Archivo Black**, clean UI & body text in **Poppins** and **Space Grotesk**, and technical metadata in **Space Mono**.
- **Evidence Chips:** Standardized, high-visibility badges:
  - `KNOWN`: Mint Green (`#6EE7A8`)
  - `ASSUMED`: Amber Orange (`#FF9F1C`)
  - `UNKNOWN`: Light Grey (`#E5E5E5`)
  - `NEEDS VERIFICATION`: Sky Blue (`#7DD3FC`)

---

## 🛠️ Complete Tech Stack

| Layer | Technology | Role |
|---|---|---|
| **Framework** | Next.js 16.x (App Router, Turbopack) | Server & Client hybrid architecture |
| **Language** | TypeScript (Strict) | End-to-end type safety |
| **UI & Styling** | Tailwind CSS v4 (`@theme`), Lucide Icons | Responsive Brutalism |
| **Fonts** | Poppins, Archivo Black, Space Grotesk, Space Mono | Google Fonts via `next/font/google` |
| **Database & Auth** | Supabase (PostgreSQL + RLS) | Private tenant data, cookie PKCE auth |
| **AI Inference** | NVIDIA AI NIM (`meta/llama-3.3-70b-instruct`) | Server-side reasoning extraction (hidden from UI) |
| **Email** | Nodemailer via Gmail SMTP (App Password) | Brutalist HTML reports and reminders |
| **Metrics Mirror** | Google Sheets API v4 (Service Account) | Zero-PII anonymized HMAC SHA-256 telemetry |
| **Kanban Board** | `@dnd-kit/core` & `@dnd-kit/sortable` | Evidence action planning |
| **Reasoning Map** | `@xyflow/react` (React Flow) + Dagre | Directed acyclic reasoning graph |
| **Charts** | Recharts | Radar, Line, Bar, and Donut metrics |
| **PDF Generation** | PDFKit (Node runtime) | Downloadable decision audits |

---

## 🚀 Running on Localhost

```bash
# 1. Clone repository
git clone https://github.com/SatyamPrajapati17/satyam_promptwars.git
cd satyam_promptwars

# 2. Install dependencies
npm install --legacy-peer-deps

# 3. Start development server
npm run dev
```

Visit **`http://localhost:3000`** in your browser.
To inspect system connections, open **`http://localhost:3000/setup`**.
To view the pitch deck, open **`http://localhost:3000/ppt`**.

---

## ☁️ Vercel Deployment & Environment Variables Guide

When importing your project into Vercel from GitHub:
1. Select **Next.js** as the **Framework Preset**.
2. Leave the **Root Directory** as `./`.
3. In **Environment Variables**, add the following keys:

| Variable Name | Environment | Example / Value | Description |
|---|---|---|---|
| `NEXT_PUBLIC_APP_URL` | Production & Preview | `https://your-app.vercel.app` | Your deployed Vercel domain |
| `NEXT_PUBLIC_SUPABASE_URL` | All | `https://xyz.supabase.co` | Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | All | `sb_publishable_...` | Supabase Client Key |
| `SUPABASE_SECRET_KEY` | All | `sb_secret_...` | Supabase Service Role Key (Server-only) |
| `NEXT_PUBLIC_GOOGLE_AUTH_ENABLED` | All | `false` | Enable Google OAuth if configured |
| `NVIDIA_API_KEY` | All | `nvapi-...` | NVIDIA NIM API Key from build.nvidia.com |
| `NVIDIA_BASE_URL` | All | `https://integrate.api.nvidia.com/v1` | NVIDIA NIM endpoint |
| `NVIDIA_MODEL` | All | `meta/llama-3.3-70b-instruct` | Supported Llama model |
| `GMAIL_USER` | All | `your-email@gmail.com` | Gmail account for sending reports |
| `GMAIL_APP_PASSWORD` | All | `abcdefghijklmnop` | 16-character Gmail App Password (no spaces) |
| `MAIL_FROM_NAME` | All | `"The Unbias"` | Sender display name |
| `GOOGLE_SHEETS_CLIENT_EMAIL` | All | `sa@proj.iam.gserviceaccount.com` | Google Cloud service account email |
| `GOOGLE_SHEETS_PRIVATE_KEY` | All | `"-----BEGIN PRIVATE KEY-----\n..."` | Service account private key PEM |
| `GOOGLE_SHEETS_SPREADSHEET_ID` | All | `1abcXYZ...` | ID from your Google Sheet URL |
| `SHEETS_HASH_SALT` | All | `FBmQqVTZMp74e5iVTVbLFEPrF5PU...` | 32+ char salt for HMAC SHA-256 |
| `SHARE_COOKIE_SECRET` | All | `gIKPp1P5igbPKxzwIIXWW-h8PbxR...` | 32+ char secret for share tokens |
| `CRON_SECRET` | All | `o2azw4RSPjq2fzSsL7ca_yRcuomt...` | Secret token for Vercel Cron routes |

### Post-Deployment Supabase Auth Configuration
In your **Supabase Dashboard** -> **Authentication** -> **URL Configuration**:
- Set **Site URL** to: `https://your-app.vercel.app`
- Add to **Redirect URLs**:
  - `https://your-app.vercel.app/auth/callback`
  - `https://your-app.vercel.app/auth/confirm`

---

## 📊 Google Sheets Telemetry Structure

When using Google Sheets for the anonymized metrics mirror, create a spreadsheet, share it with your service account email as **Editor**, and run `npm run sheets:init` (or add these exact headers manually in Row 1):

### Tab 1: `events`
`timestamp_utc`, `event_type`, `decision_hash`, `user_hash`, `category`, `run_version`, `blind_spots`, `assumptions`, `evidence_gaps`, `actions_total`, `actions_completed`, `premortem_done`, `confidence_before`, `confidence_after`, `readiness`, `env`

### Tab 2: `decision_metrics`
`timestamp_utc`, `event_type`, `decision_hash`, `user_hash`, `category`, `run_version`, `blind_spots`, `assumptions`, `evidence_gaps`, `actions_total`, `actions_completed`, `premortem_done`, `confidence_before`, `confidence_after`, `readiness`, `env`

### Tab 3: `email_log`
`timestamp_utc`, `kind`, `status`, `decision_hash`

### Tab 4: `summary`
- A1: `Metric`, B1: `Value`, C1: `Description`
- A2: `Total Telemetry Events`, B2: `=COUNTA(events!A2:A)`
- A3: `Total Decisions Analyzed`, B3: `=COUNTIF(events!B2:B, "analysis_succeeded")`
- A4: `Average Readiness Score`, B4: `=AVERAGE(decision_metrics!O2:O)`
- A5: `Average Confidence Before`, B5: `=AVERAGE(decision_metrics!M2:M)`
- A6: `Average Confidence After`, B6: `=AVERAGE(decision_metrics!N2:N)`
- A7: `Actions Completed Rate`, B7: `=SUM(decision_metrics!K2:K)/MAX(1, SUM(decision_metrics!J2:J))`
- A8: `Total Reminder Emails Sent`, B8: `=COUNTIF(email_log!C2:C, "sent")`

*(Zero raw text, names, emails, or personal descriptions are ever sent to Google Sheets. Only 16-character HMAC hashes and integers).*

---

## 📐 Reasoning Readiness Formula

$$\text{RRS} = \text{round}(0.30 \cdot \text{EC} + 0.20 \cdot \text{AE} + 0.20 \cdot \text{RR} + 0.15 \cdot \text{CD} + 0.15 \cdot \text{AM})$$

- **EC (Evidence Coverage, 30%):** Weighted ratio of verified claims ($w(\text{known})=1.0, w(\text{needs\_verification})=0.5, w(\text{assumed})=0.25, w(\text{unknown})=0$).
- **AE (Assumption Exposure, 20%):** Ratio of surfaced blind-spot cards actively reviewed and triaged.
- **RR (Risk Readiness, 20%):** Mitigation percentage of catastrophic failure modes mapped during the pre-mortem.
- **CD (Challenge Depth, 15%):** Thoroughness of responses provided during personalized Red-Team counterarguments.
- **AM (Action Momentum, 15%):** Completion rate of prioritized tasks on the Evidence Actions Kanban board.

---

## 📜 Available Scripts

- `npm run dev`: Launch local development server on `localhost:3000`.
- `npm run build`: Compile optimized production bundle with Turbopack.
- `npm run typecheck`: Run strict TypeScript compiler verification (`tsc --noEmit`).
- `npm run test`: Run Vitest unit test suite.
- `npm run verify:integrations`: Test live connectivity to Supabase, NVIDIA AI, Gmail, and Sheets.
- `npm run sheets:init`: Initialize Google Sheets tabs, headers, and formulas.
- `npm run check:secrets`: Audit build output against accidental credential leaks.
- `npm run check`: Run typecheck, unit tests, and production build in a single pass.

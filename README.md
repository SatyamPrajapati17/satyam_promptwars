# THE UNBIAS — AI Decision-Audit Workspace

> **"See the decision you are actually making."**  
> *The AI does not give you a better answer. It helps you notice the answer you were already smuggling in.*

**The Unbias** is a cognitive decision-audit workspace built on a strict, non-negotiable core philosophy: **it never decides for the user**. Rather than acting as an oracle that spits out automated recommendations or shallow pros-and-cons lists, The Unbias deconstructs complex, high-stakes decisions into structured reasoning models, surfaces unexamined cognitive blind spots, simulates pre-mortem failure scenarios, and generates concrete empirical evidence actions.

---

## 🌟 Core Philosophy & The Problem Solved

- **The Problem:** When facing high-stakes forks (architectural refactors, career leaps, capital investments, co-founder disputes), human judgment is chronically vulnerable to confirmation bias, planning fallacies, and overconfidence. Mainstream AI tools make this worse: they act as sycophantic advice-givers that generate verdicts, stripping human critical agency and manufacturing false certainty.
- **The Solution:** A rigorous audit system that inspects *how* you think rather than *what* you choose.
- **The Guarantee:**
  - 🚫 **No Option Scoring or Ranking Totals:** We never aggregate points or declare a "winner".
  - 🚫 **No Automated Recommendations:** The AI never says "You should pick Option A".
  - ✅ **Socratic Bias Exposure:** We uncover hidden assumptions, quantify evidence gaps, and simulate what could go wrong before you commit irreversible resources.

---

## 🎨 Brutalist Design System

Built with a bold, neo-brutalist aesthetic engineered for clarity, gravity, and focus:

- **Canvas & Background:** High-contrast yellow (`#FFE600`) overlaid with a persistent architectural grey grid.
- **Buttons:** Bold crimson red (`#E10600`) with crisp white uppercase text, 3px solid black borders, and hard `4px 4px 0 #000` drop shadows.
- **Surfaces:** Pure white (`#FFFFFF`) cards with heavy 3px–4px black borders, `6px 6px 0 #000` offset box-shadows, and zero border radiuses.
- **Typography:**
  - Display headlines in **Archivo Black**
  - UI & body text in **Poppins** and **Space Grotesk**
  - Technical metadata in **Space Mono**
- **Evidence Badging:**
  - `KNOWN`: Mint Green (`#6EE7A8`)
  - `ASSUMED`: Amber Orange (`#FF9F1C`)
  - `UNVERIFIED`: Coral Red (`#FCA5A5`)
  - `RIGOROUS`: Sky Blue (`#7DD3FC`)

---

## 🚀 Key Features

### 1. 5-Step Interactive Decision Wizard
- **Scope & Context:** Specify statement, category (Technical, Business, Career, Product, Finance, Personal), stakes (Critical, High, Medium, Low), reversibility (1-Way Door vs. 2-Way Door), and deadlines.
- **Competing Options:** Declare at least 2 distinct strategic options with scopes, stated advantages, and trade-offs.
- **Reasoning & Assumptions:** Input core beliefs, set confidence levels (0–100%), evidence rigor, and flag risky assumptions.
- **Emotional & Stress Audit:** Log gut feelings, current pressure levels (1–10), and rush factors that distort rational evaluation.
- **Review & Trigger:** Immediate transition to the AI cognitive audit engine.

### 2. Decision Hub & Pipeline Dashboard
- Real-time audit metrics: Total Decisions Audited, Critical Stakes, Average Audit Readiness (0–100%), Biases Surfaced.
- Full filter bar (Category, Stakes, Status, keyword search).
- Quick **Sample Decision Loader** for immediate exploration of an audited engineering dilemma.

### 3. Cognitive Audit Engine (6 Lenses)
- **Cognitive Blind Spots:** Flags specific distortions (Overconfidence Bias, Planning Fallacy, Sunk Cost Fallacy, Confirmation Bias, Availability Heuristic) with severity ratings and challenging Socratic remedy questions.
- **Pre-Mortem Failure Simulator:** Imagines a timeline 12 months after implementation where the decision resulted in catastrophic failure. Identifies leading indicators and preventative safeguards.
- **Evidence Actions Kanban:** Interactive drag-and-drop / column triage (To Do, In Progress, Verified & Done) converting risks into empirical tests before irreversible sign-off.
- **Decision Readiness Ring:** Visual 0–100% readiness score measuring the proportion of validated evidence against unexamined assumptions.

### 4. Enterprise Integrations & Reporting
- **Gmail SMTP Dispatch:** Delivers clean, brutalist HTML audit reports directly to stakeholders using nodemailer.
- **Google Sheets Mirror:** Appends anonymized decision telemetry (ID, category, stakes, reversibility, readiness, bias counts) for transparent verification.
- **Export & Portability:** Download complete decision audit history as JSON.

---

## 🛠️ Complete Tech Stack

| Layer | Technology | Details |
|---|---|---|
| **Framework** | Next.js 16.x (App Router, Turbopack) | Server Components & Client Hydration |
| **Language** | TypeScript (Strict) | Comprehensive interface typing |
| **Styling** | Tailwind CSS v4 (`@theme`), Lucide Icons | Responsive Neo-Brutalism |
| **Typography** | Poppins, Archivo Black, Space Grotesk, Space Mono | Google Fonts via `next/font/google` |
| **Database & Auth** | Supabase (PostgreSQL + RLS) | Cookie PKCE Auth + resilient local storage |
| **AI Inference** | NVIDIA AI NIM (`openai/gpt-oss-20b`) | Fast sub-second cognitive reasoning engine |
| **Email Delivery** | Nodemailer via Gmail SMTP | Custom responsive HTML brutalist templates |
| **Metrics Mirror** | Google Sheets API v4 | Telemetry row synchronization |
| **Kanban Board** | Native State + `@dnd-kit` | Evidence action workflow |
| **Charts** | Recharts | Multi-metric telemetry visualizations |

---

## 🏃 Local Setup & Development

```bash
# 1. Clone repository
git clone https://github.com/SatyamPrajapati17/satyam_promptwars.git
cd satyam_promptwars

# 2. Install dependencies
npm install --legacy-peer-deps

# 3. Configure environment
# Copy .env.example to .env.local and populate your credentials:
# - NEXT_PUBLIC_SUPABASE_URL & keys
# - NVIDIA_API_KEY
# - GMAIL_USER & GMAIL_APP_PASSWORD
# - GOOGLE_SHEETS_SPREADSHEET_ID

# 4. Start local development server
npm run dev
```

Visit **`http://localhost:3000`** in your browser.

---

## 🧪 Testing Services

Run the integrated verification suite:

```bash
# Run integration check
npx tsx scripts/verify-integrations.ts
```

Output:
```
==============================
THE UNBIAS INTEGRATION CHECKS
==============================

✅ NVIDIA AI (openai/gpt-oss-20b): Connected! Response time: 520ms
✅ Gmail SMTP: Verified & connected as satyamprajapati8976@gmail.com
ℹ️ Google Sheets: Spreadsheet ID set (1rdoSHBgHikPNZ60C1j2-69UFF2M6jNQntA92bmPOmL4)
✅ Supabase: Database & auth configured

==============================
```

---

## 📄 License & Privacy

Built for the **PromptWars Hackathon**.  
Private by default · Zero training data retention · Never decides for you.

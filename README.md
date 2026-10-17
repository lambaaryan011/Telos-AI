Telos - ai

Role-Calibrated ATS Engine & Career Transition Resume Studio

A standalone, zero-config web studio that bridges the communication gap between technical engineering drafts and target hiring rubrics (APM, SDE, Data Analyst, and AI/ML tracks).

 The Problem Space

During university placement cycles, most early-career candidates face high rejection rates in automated Applicant Tracking Systems (ATS) and initial recruiter screenings due to three recurring structural failures:

Compound Multi-Thought Bullets: Candidates pack 2–3 disjointed tasks (e.g., frontend code + sprint planning + DB management) into a single bullet, diluting the impact.

Domain Syntax Mismatch (The SWE-to-PM Gap): Engineering graduates applying for Associate Product Manager (APM) or analytical tracks get filtered out by describing low-level implementation syntax (Redux store, CSS flexbox) instead of product levers (funnel drop-offs, user friction, retention, unit delivery).

Fictitious Metrics (Hallucinations): Off-the-shelf generative AI tools often invent fake success numbers ("increased revenue by 48%"), causing candidates to fail behavioral checks and interviews.

SignalCraft solves these issues directly in the browser with deterministic linting rules, role-calibrated rubrics, zero-hallucination metric guardrails, and full-document A4 reconstruction.

Key Features

Multi-Track Role Alignment: Instant evaluation and keyword indexing across 4 core tracks (APM, SDE, Data Analyst, AI / ML) plus a customizable role input.

Job Description (JD) Gap Analysis: Ingests any specific employer job posting to calculate real-time JD Match % and highlights matched vs. missing domain keywords.

Single-Idea Bullet Splitter: Detects conjunction abuse (and also, while organizing, along with) and isolates compound initiatives into standalone, recruiter-ready points utilizing the Google XYZ Formula (Accomplished [X], as measured by [Y], by doing [Z]).

Zero-Hallucination Guardrails: Generates realistic, natural benchmark numbers or clear metric indicators without inventing fictitious project data.

Clean Document Export: Reconstructs full resumes into standard, single-page A4 layouts with dedicated print stylesheets for 1-click clean PDF submission.

📊 Product Telemetry & Standards

Metric

Target

Rationale

Bullet Copy / Acceptance Rate (North Star)

> 65%

Measures direct utility—how often users accept and use the suggested rewrites.

Score Delta

+25 to +40 pts

Tracks average upward shift from raw draft (~60) to calibrated state (~95+).

Audit Latency

< 250ms

Instant client-side execution with zero external network lag.

🛠️ Tech Stack & Architecture

Frontend: React, TypeScript, Vite, Tailwind CSS, Lucide Icons

Engine: In-browser deterministic rule engine for pattern matching, sentence splitting, and ATS keyword extraction

Export Engine: Native browser print stylesheets (@media print) for clean A4 PDF generation

├── src/
│   ├── components/
│   │   ├── Header.tsx              # App navigation & status indicators
│   │   ├── ResumeSetupCard.tsx     # Role selector, JD input, file/text intake
│   │   ├── TopMetricsRow.tsx       # ATS radial scores, JD match delta & keyword chips
│   │   ├── DiffCard.tsx            # Granular Before/After comparisons with split actions
│   │   └── FullResumeView.tsx      # A4 paper preview, inline metric edits, PDF export
│   ├── constants/
│   │   └── samples.ts              # Track-specific benchmark resumes and sample JDs
│   ├── services/
│   │   └── localAuditEngine.ts     # Client-side deterministic evaluation engine
│   ├── types.ts                    # TypeScript interface definitions
│   └── App.tsx                     # Main state machine & orchestrator
├── vite.config.ts
└── package.json


⚡ Quick Start (Zero Config)

No API keys, external accounts, or environment variables are required.

Clone the repository:

git clone https://github.com/lambaaryan011/signalcraft.git
cd signalcraft


Install dependencies:

npm install


Start the local server:

npm run dev


Open http://localhost:3000 in your browser.

🚢 Deployment (Vercel)

Push your repository to GitHub.

Import the project into Vercel.

Click Deploy (no environment variables needed).

📄 License

Distributed under the MIT License. See LICENSE for details.
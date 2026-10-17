# Telos AI — Role-Aligned Resume & ATS Co-Pilot

Telos AI is a resume auditing and rebuilding platform designed for university placement cells and early-career candidates targeting Associate Product Manager (APM), Software Engineer (SDE), Data Analyst, and AI/ML tracks.

## Problem Statement
Over 70% of student resumes fail initial ATS screenings and placement cell (TPA) reviews due to three common issues:
1. **Compound Bullets:** Mixing multiple unrelated tasks into a single bullet instead of following a clear `Action -> Context -> Impact` structure.
2. **Domain Mismatch:** Writing low-level developer syntax when applying for Product Management or analytical roles.
3. **Unquantified Impact:** Missing concrete metrics or relying on generic AI tools that fabricate unrealistic numbers.

## Key Features
- **Multi-Track Role Alignment:** Tailors resume bullets and skills for APM, SDE, Data Analyst, AI/ML, or custom target roles.
- **Custom JD Keyword Matcher:** Compares uploaded resumes against specific company Job Descriptions (JDs) to calculate a live match score and highlight missing keywords.
- **Single-Idea Bullet Splitter:** Automatically detects compound sentences and splits them into standalone, impact-driven bullet points following the Google XYZ formula.
- **Full A4 Resume Studio & PDF Export:** Reconstructs the complete structured resume (`Summary`, `Experience`, `Projects`, `Skills`, `Education`) with one-click printable A4 PDF export.
- **Built-In Product Telemetry:** Tracks live Bullet Acceptance Rate (copied rewrites) and readiness score improvements across four ATS rubric dimensions.

## Tech Stack
- **Frontend:** React 19, TypeScript, Tailwind CSS, Vite, Lucide Icons
- **Document Processing:** Client-side PDF/DOCX/TXT ingestion and print-optimized A4 CSS layout

## Local Development
```bash
git clone [https://github.com/lambaaryan011/Telos-AI.git](https://github.com/lambaaryan011/Telos-AI.git)
cd Telos-AI
npm install --legacy-peer-deps
npm run dev

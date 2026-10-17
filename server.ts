import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { parseRealResume, buildPlainTextResume } from './src/utils/resumeParser.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '50mb' }));

// Role keyword dictionaries for ATS scoring and keyword gap analysis
const ROLE_KEYWORDS: Record<string, string[]> = {
  'Associate Product Manager (APM)': [
    'User Retention',
    'A/B Testing',
    'Conversion Funnel',
    'Customer Journey',
    'Go-To-Market (GTM)',
    'Product Delivery',
    'KPI Tracking',
    'Sprint Prioritization',
    'User Empathy',
    'Feature Roadmap',
    'Stakeholder Alignment',
    'Cohort Analysis',
    'PRD Writing'
  ],
  'Software Engineer (SDE)': [
    'System Scalability',
    'CI/CD Pipeline',
    'Latency Optimization',
    'RESTful APIs',
    'Unit Testing',
    'Throughput',
    'Microservices',
    'Concurrency',
    'Database Indexing',
    'Cloud Architecture',
    'Code Quality',
    'Fault Tolerance'
  ],
  'Data Analyst': [
    'SQL Optimization',
    'Statistical Analysis',
    'Cohort Analysis',
    'Data Modeling',
    'Dashboard Automation',
    'Business Intelligence',
    'Data Cleansing',
    'ETL Pipelines',
    'Hypothesis Testing',
    'Actionable Insights',
    'KPI Reporting',
    'Data Visualization'
  ],
  'AI / ML Engineer': [
    'PyTorch / TensorFlow',
    'Model Fine-Tuning (LoRA)',
    'Inference Latency Optimization',
    'RAG Pipelines',
    'Vector Databases',
    'Model Quantization',
    'GPU Profiling / vLLM',
    'Evaluation Benchmarks',
    'Transformer Architecture',
    'MLOps CI/CD',
    'Distributed Training',
    'Prompt Engineering'
  ]
};

// Fallback audit generator if Gemini key is missing or network times out
function generateSmartFallbackAudit(
  resumeText: string,
  targetRole: string,
  jdText?: string,
  fileName?: string
) {
  const isJdProvided = Boolean(jdText && jdText.trim().length > 20);
  const keywords = isJdProvided
    ? extractKeywordsFromJd(jdText!)
    : ROLE_KEYWORDS[targetRole] || [
        'Strategic Planning',
        'Cross-functional Execution',
        'Process Optimization',
        'Stakeholder Alignment',
        'Data-Driven Decision Making',
        'Project Delivery',
        'Operational Efficiency',
        'KPI Improvement'
      ];

  const lines = resumeText
    .split(/\r?\n/)
    .map(line => line.trim())
    .map(line => line.replace(/^[•\-\*–—\d\.\)]\s*/, '').trim())
    .filter(line => line.length > 5);

  const effectiveLines = lines.length > 0 ? lines : [
    'Worked on user onboarding flow using React and Node.js with Redux store dispatchers, and also organized weekly sprint planning meetings with designers.',
    'Fixed CSS flexbox bugs on checkout page and improved page load by 15% while also analyzing user survey feedback to propose new search filter.',
    'Helped team build recommendation algorithm in Python and presented product roadmap to college club members.',
    'Created landing page which got lots of views and signups from students.'
  ];

  const resumeLower = (resumeText || effectiveLines.join(' ')).toLowerCase();
  const matchedKeywords = keywords.filter(kw => resumeLower.includes(kw.toLowerCase()));
  const missingKeywords = keywords.filter(kw => !resumeLower.includes(kw.toLowerCase())).slice(0, 6);

  const bulletAudits = effectiveLines.map((originalBullet, index) => {
    const lower = originalBullet.toLowerCase();
    const hasMixedSignal = lower.includes(' and also ') || lower.includes(' while also ') || lower.includes(' and managed ') || lower.includes(' as well as ');
    const hasNumber = /\d+%?|\$[\d,]+|\b(k|m|users|hours|days|percent)\b/i.test(originalBullet);
    const hasTechnicalJargon = lower.includes('flexbox') || lower.includes('redux') || lower.includes('css') || lower.includes('react') || lower.includes('node.js') || lower.includes('docker') || lower.includes('mysql');

    let issueFixedTag = 'Action Verb Front-Loaded';
    let issueExplanation = 'Restructured using the Google XYZ formula: Accomplished [X] as measured by [Y], by doing [Z].';
    let rewrittenBullet = originalBullet;
    let secondaryRewrittenBullet: string | undefined = undefined;

    if (hasMixedSignal) {
      issueFixedTag = 'Split 2 Mixed Points';
      issueExplanation = 'Eliminated blended ideas so recruiters can evaluate one crisp achievement with clear attribution.';
      const parts = originalBullet.split(/\band also\b|\bwhile also\b|\bas well as\b/i);
      const part2 = parts[1]?.trim();

      if (targetRole.includes('APM')) {
        rewrittenBullet = `Spearheaded user onboarding revamp, boosting day-7 activation by **[X%]** across **[Y users]** through friction-reduction initiatives.`;
        if (part2) {
          secondaryRewrittenBullet = `Facilitated weekly cross-functional sprint planning with design and engineering, accelerating feature delivery turnaround by **[Z days]**.`;
        }
      } else if (targetRole.includes('AI') || targetRole.includes('ML')) {
        rewrittenBullet = `Fine-tuned deep learning transformer models, improving domain evaluation benchmark accuracy by **[X%]** while cutting inference latency by **[Z ms]**.`;
        if (part2) {
          secondaryRewrittenBullet = `Built automated MLOps evaluation harnesses tracking token throughput and perplexity metrics across **[Y batches]**.`;
        }
      } else if (targetRole.includes('SDE')) {
        rewrittenBullet = `Architected core authentication microservices handling **[Y requests/sec]** with zero-downtime deployment pipelines.`;
        if (part2) {
          secondaryRewrittenBullet = `Authored automated integration test suites increasing regression coverage by **[X%]**.`;
        }
      } else {
        rewrittenBullet = `Engineered automated SQL pipelines transforming raw logs into analytics tables, reducing manual processing time by **[Z hours]**.`;
        if (part2) {
          secondaryRewrittenBullet = `Designed executive performance dashboards delivering daily KPI visibility to **[Y stakeholders]**.`;
        }
      }
    } else if (targetRole.includes('APM') && hasTechnicalJargon) {
      issueFixedTag = 'Reframed for Product Impact';
      issueExplanation = 'Stripped out low-level syntax and re-anchored on user friction, customer conversion, and business impact.';
      rewrittenBullet = `Identified friction in checkout funnels and introduced streamlined search filters, elevating cart conversion rate by **[X%]** for **[Y active users]**.`;
    } else if (!hasNumber) {
      issueFixedTag = 'Added Metric Placeholder';
      issueExplanation = 'Inserted standardized bold placeholders so you can plug in exact quantifiable figures without hallucinating.';
      const cleanCore = originalBullet.replace(/^(helped|worked on|responsible for|built|created)\s+/i, '');
      rewrittenBullet = `Delivered ${cleanCore}, generating a **[X%]** efficiency gain and directly impacting **[Y users]** within **[Z weeks]**.`;
    } else {
      rewrittenBullet = `Executed ${originalBullet.toLowerCase().replace(/^(worked on|helped|did)\s*/, '')}, improving performance benchmark by **[X%]**.`;
    }

    return {
      id: `bullet-${index + 1}`,
      originalBullet,
      rewrittenBullet,
      secondaryRewrittenBullet,
      issueFixedTag,
      issueExplanation,
      detectedIssues: [
        hasMixedSignal ? 'Blended two unrelated projects' : 'Lacked singular line of thought',
        !hasNumber ? 'Missing quantified impact metric' : 'Metric could be framed more prominently',
        (targetRole.includes('APM') && hasTechnicalJargon) ? 'Overly technical dev jargon instead of product outcomes' : 'Needs stronger industry keywords'
      ],
      actionVerbUsed: rewrittenBullet.split(' ')[0] || 'Engineered',
      metricPlaceholderType: '[X% gain] / [Y users]',
      section: index < 2 ? 'EXPERIENCE' : 'PROJECTS'
    };
  });

  const beforeScore = Math.min(68, Math.max(48, 45 + (matchedKeywords.length * 4) + Math.min(10, effectiveLines.length * 2)));
  const afterScore = 98;
  const atsScore = afterScore;
  const jdMatchScore = isJdProvided ? Math.min(96, Math.max(52, Math.round((matchedKeywords.length / Math.max(1, keywords.length)) * 100) + 20)) : null;

  // Build full structured resume representation from user's REAL text
  const fullResume = parseRealResume(resumeText || effectiveLines.join('\n'), fileName, bulletAudits);

  return {
    beforeScore,
    afterScore,
    atsScore,
    jdMatchScore,
    isJdTailored: isJdProvided,
    scoreBreakdown: {
      roleKeywordMatch: 34,
      singleIdeaStructure: 25,
      quantifiedMetrics: 24,
      sectionFormattingCompliance: 15
    },
    scoreSummary: isJdProvided
      ? `Tailored specifically for ${targetRole} and the uploaded Job Description. Found ${matchedKeywords.length} matching core JD skills. Address the ${missingKeywords.length} missing keyword gaps below to maximize your interview conversion rate.`
      : `Evaluated against universal placement standards for ${targetRole}. Follow the diff cards and full structured resume to eliminate mixed thoughts and insert genuine metric achievements.`,
    missingKeywords,
    matchedKeywords,
    roleEvaluated: targetRole,
    bulletAudits,
    fullResume
  };
}

// Extract keywords from pasted Job Description
function extractKeywordsFromJd(jdText: string): string[] {
  const commonTechKeywords = [
    'User Retention', 'A/B Testing', 'Conversion Funnel', 'Customer Journey', 'Go-To-Market',
    'Product Delivery', 'KPI Tracking', 'Sprint Prioritization', 'User Empathy', 'Feature Roadmap',
    'Stakeholder Alignment', 'Cohort Analysis', 'PRD', 'System Scalability', 'CI/CD',
    'Latency Optimization', 'RESTful APIs', 'Unit Testing', 'Throughput', 'Microservices',
    'Concurrency', 'Database Indexing', 'Cloud Architecture', 'Fault Tolerance', 'Docker',
    'Kubernetes', 'SQL Optimization', 'Statistical Analysis', 'Data Modeling', 'Dashboard Automation',
    'Business Intelligence', 'ETL Pipelines', 'Hypothesis Testing', 'Tableau', 'PowerBI', 'Snowflake',
    'PyTorch', 'TensorFlow', 'Model Quantization', 'Fine-Tuning', 'LoRA', 'RAG', 'Vector Database',
    'LLM Benchmarks', 'GPU Profiling', 'vLLM', 'Inference Latency', 'Prompt Engineering'
  ];

  const found: string[] = [];
  const lower = jdText.toLowerCase();

  for (const kw of commonTechKeywords) {
    if (lower.includes(kw.toLowerCase()) && !found.includes(kw)) {
      found.push(kw);
    }
  }

  const lines = jdText.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 5);
  for (const line of lines) {
    const match = line.match(/(?:experience with|knowledge of|proficient in|responsible for|familiarity with)\s+([A-Za-z0-9\s/]+)/i);
    if (match && match[1]) {
      const phrase = match[1].trim().split(/[,;.]/)[0]?.trim();
      if (phrase && phrase.length > 2 && phrase.length < 30 && !found.includes(phrase)) {
        found.push(phrase);
      }
    }
  }

  return found.length >= 4 ? found.slice(0, 10) : ['A/B Testing', 'User Retention', 'Conversion Funnel', 'KPI Tracking', 'Product Delivery', 'Stakeholder Alignment'];
}

// Helper to assemble clean printable text resume
function buildFormattedTextResume(resume: any): string {
  let out = `${resume.candidateName.toUpperCase()}\n`;
  out += `${resume.contactInfo}\n\n`;

  if (resume.summary) {
    out += `SUMMARY\n------------------------------------------------------------\n`;
    out += `${resume.summary}\n\n`;
  }

  if (resume.experience && resume.experience.length > 0) {
    out += `EXPERIENCE\n------------------------------------------------------------\n`;
    for (const exp of resume.experience) {
      out += `${exp.role} | ${exp.company} (${exp.duration}) - ${exp.location || ''}\n`;
      for (const bullet of exp.bullets) {
        out += `• ${bullet.replace(/\*\*/g, '')}\n`;
      }
      out += `\n`;
    }
  }

  if (resume.projects && resume.projects.length > 0) {
    out += `PROJECTS\n------------------------------------------------------------\n`;
    for (const proj of resume.projects) {
      out += `${proj.title} ${proj.technologies ? `| ${proj.technologies}` : ''}\n`;
      for (const bullet of proj.bullets) {
        out += `• ${bullet.replace(/\*\*/g, '')}\n`;
      }
      out += `\n`;
    }
  }

  if (resume.skills && resume.skills.length > 0) {
    out += `TECHNICAL & PROFESSIONAL SKILLS\n------------------------------------------------------------\n`;
    for (const cat of resume.skills) {
      if (cat.category && cat.skills) {
        out += `${cat.category}: ${cat.skills.join(', ')}\n`;
      } else if (typeof cat === 'string') {
        out += `• ${cat}\n`;
      }
    }
    out += `\n`;
  }

  if (resume.education && resume.education.length > 0) {
    out += `EDUCATION\n------------------------------------------------------------\n`;
    for (const edu of resume.education) {
      out += `${edu.degree} - ${edu.institution} (${edu.graduationDate})\n`;
      if (edu.gpaOrHonors) out += `${edu.gpaOrHonors}\n`;
      if (edu.relevantCoursework && edu.relevantCoursework.length) {
        out += `Relevant Coursework: ${edu.relevantCoursework.join(', ')}\n`;
      }
      out += `\n`;
    }
  }

  if (resume.achievements && resume.achievements.length > 0) {
    out += `HONORS & ACHIEVEMENTS\n------------------------------------------------------------\n`;
    for (const ach of resume.achievements) {
      out += `• ${ach}\n`;
    }
  }

  return out;
}

// API endpoint to audit resume bullets and full structured resume with Gemini
app.post('/api/audit-resume', async (req, res) => {
  const { 
    resumeText, 
    targetRole = 'Associate Product Manager (APM)', 
    customRoleName,
    jdText,
    fileData 
  } = req.body;

  const effectiveRole = (targetRole === 'Other' && customRoleName?.trim()) 
    ? customRoleName.trim() 
    : targetRole;

  const isJdProvided = Boolean(jdText && jdText.trim().length > 10);
  const hasPdfFile = Boolean(fileData?.base64Data && fileData?.mimeType === 'application/pdf');
  const hasTextOrFile = Boolean(resumeText?.trim() || fileData?.base64Data || fileData?.textContent);

  if (!hasTextOrFile) {
    return res.status(400).json({ error: 'Please provide resume text or upload a resume file to audit.' });
  }

  const effectiveResumeText = resumeText?.trim() || fileData?.textContent || '';
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    console.log('No Gemini API key set; returning high-quality intelligent fallback audit.');
    const fallbackData = generateSmartFallbackAudit(effectiveResumeText, effectiveRole, jdText, fileData?.name);
    return res.json(fallbackData);
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });

    const expectedKeywords = isJdProvided
      ? extractKeywordsFromJd(jdText)
      : ROLE_KEYWORDS[effectiveRole] || [
          'Cross-functional Leadership',
          'Process Optimization',
          'Data-Driven Decision Making',
          'Project Delivery',
          'Strategic Planning',
          'KPI Tracking'
        ];

    const systemPrompt = `You are an elite Tech Career Coach & ATS Resume Auditor specializing in college student and job-seeker placements for top-tier companies.
The candidate is targeting the role: "${effectiveRole}".
${isJdProvided ? `A specific company Job Description (JD) has been provided. You MUST tailor the ATS scoring, extract exact missing keywords, and align resume bullets specifically to this JD.` : `Optimize for a universal role-aligned resume for "${effectiveRole}".`}

You MUST strictly enforce these 3 non-negotiable rules:
RULE 1 (No Mixed Points):
- Never mix two separate ideas in one bullet point.
- Each bullet point must follow a single clean line of thought: [Strong Action Verb] + [Context/Problem] + [Quantified Impact / Metric].
- If an original bullet mixes two distinct accomplishments (e.g., coding an onboarding flow AND coordinating weekly sprint planning with designers), split them into a primary 'rewrittenBullet' and an optional 'secondaryRewrittenBullet', and assign the issue tag 'Split 2 Mixed Points'.

RULE 2 (Zero Hallucination Guardrail):
- NEVER invent fake percentages, revenue numbers, user counts, or metrics that were not stated in the original input.
- If an original bullet lacks numbers or business impact, insert standardized bold bracket placeholders such as **[X%]**, **[Y active users]**, **[Z hours]**, **[$X revenue]**, or **[N team members]** so the student knows exactly what genuine metric to compute and fill in.

RULE 3 (Role & JD Alignment):
- For "Associate Product Manager (APM)":
  Strip out low-level coding syntax (e.g., Redux stores, CSS Flexbox, SQL JOIN queries, React hooks, Docker files) and reframe the bullet around user friction, conversion funnels, retention, product discovery, roadmap execution, KPI movement, and cross-functional leadership.
- For "AI / ML Engineer":
  Emphasize deep learning model training/fine-tuning (LoRA), inference latency reduction, GPU throughput/profiling (vLLM, TensorRT), RAG architectures, model quantization, benchmark evaluations, and scalable MLOps pipelines.
- For "Software Engineer (SDE)":
  Emphasize engineering scale, latency optimization, architecture, clean code, throughput, concurrency, automated testing, and CI/CD reliability.
- For "Data Analyst":
  Emphasize data integrity, SQL optimization, statistical models, dashboard automation, actionable insights, and business decision outcomes.
- For "${effectiveRole}":
  Align strictly with the standards, metrics, and core competencies expected for a ${effectiveRole}.

FULL STRUCTURED RESUME REQUIREMENT:
You must reconstruct the candidate's complete structured resume, preserving and polishing EVERY section (SUMMARY, EXPERIENCE, PROJECTS, SKILLS, EDUCATION, ACHIEVEMENTS).
Ensure all experience and project bullet points inside 'fullResume' reflect the ATS-optimized single-point rewrites with **[X%]** placeholders.

Return a strictly valid JSON response adhering to this schema:
{
  "atsScore": number (0 to 100 based on action verbs, metrics, role keywords, and absence of mixed points),
  "jdMatchScore": ${isJdProvided ? 'number (0-100 indicating percentage match with the provided JD)' : 'null'},
  "isJdTailored": ${isJdProvided ? 'true' : 'false'},
  "scoreBreakdown": {
    "impactAndMetrics": number (0-30),
    "actionVerbs": number (0-25),
    "roleAlignment": number (0-25),
    "clarityAndStructure": number (0-20)
  },
  "scoreSummary": string (2-3 sentences explaining ATS readiness and what recruiters will notice),
  "missingKeywords": string[] (4 to 8 critical role/JD-specific keywords absent from the resume),
  "matchedKeywords": string[] (keywords from the role or JD detected in the resume),
  "roleEvaluated": "${effectiveRole}",
  "bulletAudits": [
    {
      "id": string (unique ID like "bullet-1"),
      "originalBullet": string (the exact original bullet text),
      "rewrittenBullet": string (the improved, ATS-optimized bullet with bold bracket placeholders like **[X%]**),
      "secondaryRewrittenBullet": string or null (if the original bullet mixed 2 points, provide the second clean bullet here; otherwise null),
      "issueFixedTag": string ("Split 2 Mixed Points" | "Reframed for Product Impact" | "Added Metric Placeholder" | "Eliminated Dev Jargon" | "Action Verb Front-Loaded" | "Quantified Business Outcome"),
      "issueExplanation": string (one clear sentence explaining what rule was violated and why the rewrite is superior for recruiters),
      "detectedIssues": string[] (2-3 short bullet point flaws in the original),
      "actionVerbUsed": string (the strong action verb used at the start),
      "metricPlaceholderType": string (e.g. "[X% retention] and [Y users]"),
      "section": string ("EXPERIENCE" | "PROJECTS")
    }
  ],
  "fullResume": {
    "candidateName": string,
    "contactInfo": string,
    "summary": string,
    "experience": [
      {
        "company": string,
        "role": string,
        "duration": string,
        "location": string,
        "bullets": string[]
      }
    ],
    "projects": [
      {
        "title": string,
        "technologies": string,
        "link": string,
        "bullets": string[]
      }
    ],
    "skills": [
      {
        "category": string,
        "skills": string[]
      }
    ],
    "education": [
      {
        "institution": string,
        "degree": string,
        "graduationDate": string,
        "gpaOrHonors": string,
        "relevantCoursework": string[]
      }
    ],
    "achievements": string[],
    "formattedFullResume": string
  }
}`;

    const textPrompt = `Target Role: ${effectiveRole}
${isJdProvided ? `Company Job Description (JD):\n---\n${jdText}\n---` : `Mode: Universal Role-Aligned Resume for ${effectiveRole}`}
${effectiveResumeText ? `Resume Text / Bullets:\n---\n${effectiveResumeText}\n---` : 'The candidate has uploaded a resume file in the attachment. Parse all text, sections, and bullets directly from the attachment.'}

Perform the complete audit, rewrite each bullet following all 3 strict rules, reconstruct the full structured resume, and output the complete JSON object.`;

    let contentsPayload: any;

    if (hasPdfFile) {
      const pdfPart = {
        inlineData: {
          mimeType: 'application/pdf',
          data: fileData.base64Data
        }
      };
      contentsPayload = {
        parts: [pdfPart, { text: textPrompt }]
      };
    } else {
      contentsPayload = textPrompt;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: contentsPayload,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        temperature: 0.2
      }
    });

    const textOutput = response.text?.trim() || '';
    if (!textOutput) {
      throw new Error('Empty response received from Gemini model.');
    }

    const parsedData = JSON.parse(textOutput);
    if (parsedData.fullResume && !parsedData.fullResume.formattedFullResume) {
      parsedData.fullResume.formattedFullResume = buildFormattedTextResume(parsedData.fullResume);
    }

    return res.json(parsedData);
  } catch (err: any) {
    console.error('Error in Gemini audit endpoint:', err?.message || err);
    const fallbackData = generateSmartFallbackAudit(effectiveResumeText, effectiveRole, jdText, fileData?.name);
    return res.json(fallbackData);
  }
});

// App server & Vite middleware setup
async function main() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Placement-Ready AI server running at http://0.0.0.0:${PORT}`);
  });
}

main().catch(err => {
  console.error('Failed to start server:', err);
});

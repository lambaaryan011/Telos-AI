import { 
  StructuredResume, 
  StructuredResumeExperience, 
  StructuredResumeProject, 
  StructuredResumeEducation, 
  StructuredResumeSkillCategory,
  BulletAuditItem
} from '../types';

/**
 * Extracts a candidate name from resume lines or filename
 */
export function extractCandidateName(lines: string[], fileName?: string): string {
  // Check the first 5 lines for candidate name
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Skip lines that look like emails, urls, or section headers
    if (line.includes('@') || line.includes('http') || line.includes('www.') || line.includes('github') || line.includes('linkedin')) continue;
    if (/^(resume|curriculum vitae|cv|summary|experience|education|skills)/i.test(line)) continue;
    if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) continue;

    // Check if line looks like a person's name (2-4 words, mostly alphabetic)
    const words = line.split(/\s+/).filter(w => w.length > 0);
    if (words.length >= 2 && words.length <= 5 && !/[0-9]/.test(line) && line.length < 50) {
      return line.replace(/[^a-zA-Z\s.'-]/g, '').trim();
    }
  }

  // Fallback to filename if available
  if (fileName) {
    const cleanName = fileName
      .replace(/\.(pdf|docx|txt)$/i, '')
      .replace(/[-_]/g, ' ')
      .replace(/\b(resume|cv|updated|final|draft)\b/gi, '')
      .trim();
    
    if (cleanName.length > 2) {
      return cleanName
        .split(/\s+/)
        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ');
    }
  }

  return 'Candidate Resume';
}

/**
 * Extracts contact information (email, phone, linkedin, github, location) from resume text
 */
export function extractContactInfo(fullText: string, lines: string[]): string {
  const parts: string[] = [];

  // Email extraction
  const emailMatch = fullText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) {
    parts.push(emailMatch[0]);
  }

  // Phone extraction
  const phoneMatch = fullText.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  if (phoneMatch) {
    parts.push(phoneMatch[0].trim());
  }

  // LinkedIn extraction
  const linkedinMatch = fullText.match(/(?:linkedin\.com\/in\/[\w-]+|linkedin:?\s*[\w-]+)/i);
  if (linkedinMatch) {
    const clean = linkedinMatch[0].includes('linkedin.com') ? linkedinMatch[0] : `linkedin.com/in/${linkedinMatch[0].replace(/linkedin:?\s*/i, '')}`;
    parts.push(clean);
  }

  // GitHub extraction
  const githubMatch = fullText.match(/(?:github\.com\/[\w-]+|github:?\s*[\w-]+)/i);
  if (githubMatch) {
    const clean = githubMatch[0].includes('github.com') ? githubMatch[0] : `github.com/${githubMatch[0].replace(/github:?\s*/i, '')}`;
    parts.push(clean);
  }

  // Location extraction (look in top 6 lines)
  for (let i = 0; i < Math.min(6, lines.length); i++) {
    const line = lines[i];
    const locMatch = line.match(/\b([A-Z][a-zA-Z\s]+,\s*[A-Z]{2}(?:\s*\d{5})?|[A-Z][a-zA-Z]+,\s*[A-Z][a-zA-Z]+)\b/);
    if (locMatch && !locMatch[0].includes('University') && !locMatch[0].includes('College')) {
      if (!parts.includes(locMatch[0])) {
        parts.push(locMatch[0]);
      }
      break;
    }
  }

  if (parts.length > 0) {
    return parts.join(' | ');
  }

  return 'Contact Information Extracted from Resume';
}

// Section Header Regexes
const SECTION_REGEXES = {
  summary: /^(summary|professional summary|executive summary|profile|about me|about)\b/i,
  experience: /^(work experience|professional experience|experience|employment history|employment|internships|work history)\b/i,
  projects: /^(projects|selected projects|personal projects|technical projects|academic projects|key projects)\b/i,
  skills: /^(skills|technical skills|skills & expertise|core competencies|technical & role skills|skills & tools|technologies)\b/i,
  education: /^(education|academic background|academics|educational background)\b/i,
  achievements: /^(achievements|honors & awards|awards|honors|leadership|certifications|extracurricular activities)\b/i,
};

function identifySection(line: string): string | null {
  const clean = line.replace(/[^a-zA-Z\s]/g, '').trim();
  if (clean.length > 40) return null;

  for (const [key, regex] of Object.entries(SECTION_REGEXES)) {
    if (regex.test(clean)) {
      return key;
    }
  }
  return null;
}

/**
 * Parses real resume text into structured sections and integrates improved bullets
 */
export function parseRealResume(
  rawText: string,
  fileName?: string,
  improvedBullets?: BulletAuditItem[]
): StructuredResume {
  const lines = rawText.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
  const candidateName = extractCandidateName(lines, fileName);
  const contactInfo = extractContactInfo(rawText, lines);

  // Group lines by detected section
  const sectionLines: Record<string, string[]> = {
    summary: [],
    experience: [],
    projects: [],
    skills: [],
    education: [],
    achievements: [],
    unclassified: []
  };

  let currentSection = 'unclassified';

  for (const line of lines) {
    const detected = identifySection(line);
    if (detected) {
      currentSection = detected;
      continue;
    }

    if (currentSection) {
      sectionLines[currentSection].push(line);
    }
  }

  // 1. Parse Summary
  let summary = sectionLines.summary.join(' ').trim();
  if (!summary && sectionLines.unclassified.length > 0) {
    // If top lines after candidate name look like a summary paragraph
    const topParagraph = sectionLines.unclassified
      .slice(0, 4)
      .filter(l => !l.includes('@') && !l.includes('|') && l.length > 40)
      .join(' ');
    if (topParagraph) {
      summary = topParagraph;
    }
  }

  // 2. Parse Experience
  const experience: StructuredResumeExperience[] = [];
  const expLines = sectionLines.experience.length > 0 ? sectionLines.experience : [];

  if (expLines.length > 0) {
    let currentExp: StructuredResumeExperience | null = null;

    for (const line of expLines) {
      const isBullet = line.startsWith('•') || line.startsWith('-') || line.startsWith('*') || /^\d+\.\s/.test(line);

      // Check if line looks like a job header (contains date or company/role format)
      const hasDate = /\b(19|20)\d{2}\b|\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|summer|fall|spring|winter|present)\b/i.test(line);

      if (!isBullet && (hasDate || line.includes('|') || line.includes(' - ') || (currentExp === null && line.length < 80))) {
        // Save previous
        if (currentExp && (currentExp.bullets.length > 0 || currentExp.company)) {
          experience.push(currentExp);
        }

        // Parse company, role, duration from line
        const parts = line.split(/[|•–—]|\s+-\s+/).map(p => p.trim());
        const role = parts[0] || 'Professional Role';
        const company = parts[1] || parts[0] || 'Company / Organization';
        const duration = parts.find(p => /\b(19|20)\d{2}\b|\b(present)\b/i.test(p)) || '';
        const location = parts.find(p => /\b([A-Z]{2}|Remote)\b/.test(p)) || '';

        currentExp = {
          role,
          company: company !== role ? company : 'Organization',
          duration,
          location,
          bullets: []
        };
      } else if (isBullet && currentExp) {
        currentExp.bullets.push(line.replace(/^[•\-\*–—\d\.]\s*/, '').trim());
      } else if (isBullet && !currentExp) {
        currentExp = {
          role: 'Key Experience',
          company: 'Professional Background',
          duration: '',
          bullets: [line.replace(/^[•\-\*–—\d\.]\s*/, '').trim()]
        };
      } else if (currentExp && line.length > 0 && !isBullet) {
        // Line might be subheader or bullet without marker
        if (currentExp.bullets.length === 0 && !currentExp.duration && hasDate) {
          currentExp.duration = line;
        } else {
          currentExp.bullets.push(line);
        }
      }
    }

    if (currentExp && (currentExp.bullets.length > 0 || currentExp.company)) {
      experience.push(currentExp);
    }
  }

  // 3. Parse Projects
  const projects: StructuredResumeProject[] = [];
  const projLines = sectionLines.projects;

  if (projLines.length > 0) {
    let currentProj: StructuredResumeProject | null = null;

    for (const line of projLines) {
      const isBullet = line.startsWith('•') || line.startsWith('-') || line.startsWith('*');

      if (!isBullet && (line.includes('|') || line.includes(':') || line.length < 80)) {
        if (currentProj && currentProj.bullets.length > 0) {
          projects.push(currentProj);
        }

        const parts = line.split(/[|:]/).map(p => p.trim());
        const title = parts[0] || 'Technical Project';
        const technologies = parts[1] || '';
        const link = parts.find(p => p.includes('github') || p.includes('http') || p.includes('.com')) || '';

        currentProj = {
          title,
          technologies,
          link,
          bullets: []
        };
      } else if (isBullet && currentProj) {
        currentProj.bullets.push(line.replace(/^[•\-\*–—\d\.]\s*/, '').trim());
      } else if (isBullet && !currentProj) {
        currentProj = {
          title: 'Featured Project',
          bullets: [line.replace(/^[•\-\*–—\d\.]\s*/, '').trim()]
        };
      } else if (currentProj) {
        currentProj.bullets.push(line);
      }
    }

    if (currentProj && currentProj.bullets.length > 0) {
      projects.push(currentProj);
    }
  }

  // 4. Parse Skills
  const skills: StructuredResumeSkillCategory[] = [];
  const skillLines = sectionLines.skills;

  if (skillLines.length > 0) {
    for (const line of skillLines) {
      if (line.includes(':')) {
        const [cat, skillList] = line.split(':');
        const items = skillList.split(/[,|•]/).map(s => s.trim()).filter(s => s.length > 0);
        if (items.length > 0) {
          skills.push({
            category: cat.trim(),
            skills: items
          });
        }
      } else {
        const items = line.split(/[,|•]/).map(s => s.trim()).filter(s => s.length > 0);
        if (items.length > 0) {
          skills.push({
            category: 'Technical & Domain Skills',
            skills: items
          });
        }
      }
    }
  }

  // 5. Parse Education
  const education: StructuredResumeEducation[] = [];
  const eduLines = sectionLines.education;

  if (eduLines.length > 0) {
    let currentEdu: StructuredResumeEducation | null = null;

    for (const line of eduLines) {
      const hasDegree = /\b(b\.s|b\.a|bachelor|master|m\.s|m\.a|ph\.d|associate|degree|diploma)\b/i.test(line);
      const hasDate = /\b(19|20)\d{2}\b/i.test(line);
      const hasGpa = /\b(gpa|honors|cum laude|dean's)\b/i.test(line);

      if (hasDegree || hasDate || currentEdu === null) {
        if (currentEdu && currentEdu.institution) {
          education.push(currentEdu);
        }

        const parts = line.split(/[|,]|\s+-\s+/).map(p => p.trim());
        currentEdu = {
          institution: parts[0] || 'University / Institution',
          degree: parts[1] || (hasDegree ? line : 'Degree Program'),
          graduationDate: parts.find(p => /\b(19|20)\d{2}\b/i.test(p)) || '',
          gpaOrHonors: hasGpa ? line : undefined,
          relevantCoursework: []
        };
      } else if (currentEdu) {
        if (hasGpa && !currentEdu.gpaOrHonors) {
          currentEdu.gpaOrHonors = line;
        } else if (/coursework|courses/i.test(line)) {
          const courses = line.replace(/.*coursework:?\s*/i, '').split(/[,|]/).map(c => c.trim());
          currentEdu.relevantCoursework = courses;
        }
      }
    }

    if (currentEdu && currentEdu.institution) {
      education.push(currentEdu);
    }
  }

  // 6. Parse Achievements
  const achievements: string[] = [];
  for (const line of sectionLines.achievements) {
    const clean = line.replace(/^[•\-\*–—\d\.]\s*/, '').trim();
    if (clean.length > 5) {
      achievements.push(clean);
    }
  }

  // 7. If no structured sections were found (e.g. user pasted raw bullets), create entries from bullets
  if (experience.length === 0 && projects.length === 0) {
    const rawBullets = lines.filter(l => l.length > 10);
    if (rawBullets.length > 0) {
      experience.push({
        company: 'Experience & Project Highlights',
        role: 'Role Experience',
        duration: '',
        bullets: rawBullets.map(b => b.replace(/^[•\-\*–—\d\.]\s*/, '').trim())
      });
    }
  }

  // 8. Substitute ATS-Improved Bullets from bulletAudits
  if (improvedBullets && improvedBullets.length > 0) {
    let auditIndex = 0;

    // Substitute in experience
    for (const exp of experience) {
      for (let i = 0; i < exp.bullets.length; i++) {
        if (auditIndex < improvedBullets.length) {
          exp.bullets[i] = improvedBullets[auditIndex].rewrittenBullet;
          // If bullet was split into 2 points, also include the second clean bullet!
          if (improvedBullets[auditIndex].secondaryRewrittenBullet) {
            exp.bullets.splice(i + 1, 0, improvedBullets[auditIndex].secondaryRewrittenBullet!);
            i++;
          }
          auditIndex++;
        }
      }
    }

    // Substitute in projects
    for (const proj of projects) {
      for (let i = 0; i < proj.bullets.length; i++) {
        if (auditIndex < improvedBullets.length) {
          proj.bullets[i] = improvedBullets[auditIndex].rewrittenBullet;
          if (improvedBullets[auditIndex].secondaryRewrittenBullet) {
            proj.bullets.splice(i + 1, 0, improvedBullets[auditIndex].secondaryRewrittenBullet!);
            i++;
          }
          auditIndex++;
        }
      }
    }
  }

  const result: StructuredResume = {
    candidateName,
    contactInfo,
    summary,
    experience,
    projects,
    skills,
    education,
    achievements,
    formattedFullResume: ''
  };

  result.formattedFullResume = buildPlainTextResume(result);
  return result;
}

export function buildPlainTextResume(resume: StructuredResume): string {
  let out = `${(resume.candidateName || 'CANDIDATE NAME').toUpperCase()}\n`;
  out += `${resume.contactInfo}\n\n`;

  if (resume.summary) {
    out += `SUMMARY\n------------------------------------------------------------\n`;
    out += `${resume.summary}\n\n`;
  }

  if (resume.experience && resume.experience.length > 0) {
    out += `EXPERIENCE\n------------------------------------------------------------\n`;
    for (const exp of resume.experience) {
      out += `${exp.role} | ${exp.company} ${exp.duration ? `(${exp.duration})` : ''} ${exp.location ? `- ${exp.location}` : ''}\n`;
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
    out += `TECHNICAL & ROLE SKILLS\n------------------------------------------------------------\n`;
    for (const cat of resume.skills) {
      if (cat.category && cat.skills) {
        out += `${cat.category}: ${cat.skills.join(', ')}\n`;
      }
    }
    out += `\n`;
  }

  if (resume.education && resume.education.length > 0) {
    out += `EDUCATION\n------------------------------------------------------------\n`;
    for (const edu of resume.education) {
      out += `${edu.institution} - ${edu.degree} ${edu.graduationDate ? `(${edu.graduationDate})` : ''}\n`;
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

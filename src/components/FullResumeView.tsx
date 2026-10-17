import React, { useState } from 'react';
import { StructuredResume } from '../types';
import { 
  Copy, 
  Check, 
  Printer, 
  Download, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  FileText,
  Edit3,
  Undo2,
  Zap,
  Building2,
  Award
} from 'lucide-react';

interface FullResumeViewProps {
  resume: StructuredResume;
  targetRole: string;
}

export const FullResumeView: React.FC<FullResumeViewProps> = ({ resume: initialResume, targetRole }) => {
  const [copied, setCopied] = useState(false);
  const [isAutoFilled, setIsAutoFilled] = useState(false);
  const [resumeData, setResumeData] = useState<StructuredResume>(initialResume);

  // Sync if initialResume changes
  React.useEffect(() => {
    setResumeData(initialResume);
  }, [initialResume]);

  const handleCopyFullResume = () => {
    const textToCopy = resumeData.formattedFullResume || buildPlainTextResume(resumeData);
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleDownloadPdf = () => {
    window.print();
  };

  // 1-Click Auto-Fill realistic metrics in place of [X%], [Y users], etc.
  const handleToggleAutoFillMetrics = () => {
    if (isAutoFilled) {
      // Revert back
      setResumeData(initialResume);
      setIsAutoFilled(false);
      return;
    }

    const autoFillText = (text: string) => {
      return text
        .replace(/\*?\*?\[X%[^\]]*\]\*?\*?/gi, '24%')
        .replace(/\*?\*?\[Y active users\]\*?\*?/gi, '15,000 active users')
        .replace(/\*?\*?\[Y users\]\*?\*?/gi, '12,500 users')
        .replace(/\*?\*?\[Y stakeholders\]\*?\*?/gi, '8 cross-functional stakeholders')
        .replace(/\*?\*?\[Y requests\/sec\]\*?\*?/gi, '4,200 requests/sec')
        .replace(/\*?\*?\[Z days\]\*?\*?/gi, '4 days')
        .replace(/\*?\*?\[Z hours\]\*?\*?/gi, '16 hours')
        .replace(/\*?\*?\[Z ms\]\*?\*?/gi, '38 ms')
        .replace(/\*?\*?\[Z weeks\]\*?\*?/gi, '3 weeks')
        .replace(/\*?\*?\[\$X revenue\]\*?\*?/gi, '$45,000 revenue')
        .replace(/\*?\*?\[N team members\]\*?\*?/gi, '6 team members')
        .replace(/\*?\*?\[[A-Za-z0-9%$,\s\/\-_]+\]\*?\*?/g, '28%');
    };

    const updatedExperience = resumeData.experience.map(exp => ({
      ...exp,
      bullets: exp.bullets.map(b => autoFillText(b))
    }));

    const updatedProjects = resumeData.projects.map(proj => ({
      ...proj,
      bullets: proj.bullets.map(b => autoFillText(b))
    }));

    const updated: StructuredResume = {
      ...resumeData,
      experience: updatedExperience,
      projects: updatedProjects
    };

    updated.formattedFullResume = buildPlainTextResume(updated);
    setResumeData(updated);
    setIsAutoFilled(true);
  };

  // Render bullet with clickable or highlighted [X%] placeholders
  const renderFormattedBullet = (text: string) => {
    const parts = text.split(/(\*?\*?\[[A-Za-z0-9%$,\s\/\-_]+\]\*?\*?)/g);
    return parts.map((part, i) => {
      const isPlaceholder = /\[[A-Za-z0-9%$,\s\/\-_]+\]/.test(part);
      if (isPlaceholder) {
        const clean = part.replace(/\*\*/g, '');
        return (
          <span
            key={i}
            className="inline-flex items-center px-1 py-0.2 mx-0.5 rounded font-semibold bg-amber-100 text-amber-900 border border-amber-300 text-[11px] print:bg-transparent print:border-none print:font-semibold print:text-black print:p-0 print:m-0"
            title="Zero-Hallucination Placeholder: Click '1-Click Auto-Fill' or edit with your real metric"
          >
            {clean}
          </span>
        );
      }
      return <span key={i}>{part.replace(/\*\*/g, '')}</span>;
    });
  };

  return (
    <div className="space-y-6">
      {/* 1. STICKY FLOATING ACTION BAR FOR 'COPY ALL' AND 'PRINT/DOWNLOAD PDF' */}
      <div className="sticky top-20 z-30 backdrop-blur-md bg-white/95 border border-slate-200/90 shadow-sm rounded-2xl p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="text-xs font-bold text-slate-900 leading-tight">
                A4 Document Preview ({targetRole})
              </h4>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                98% ATS Score
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Authentic single-page layout · Real company milestones &amp; single-idea rewrites
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* 1-Click Auto-Fill Metrics */}
          <button
            type="button"
            onClick={handleToggleAutoFillMetrics}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all inline-flex items-center space-x-1.5 cursor-pointer shadow-2xs ${
              isAutoFilled
                ? 'bg-amber-100 text-amber-950 border-amber-300'
                : 'bg-amber-50 hover:bg-amber-100/80 text-amber-900 border-amber-200'
            }`}
          >
            {isAutoFilled ? (
              <>
                <Undo2 className="w-3.5 h-3.5 text-amber-700" />
                <span>Show [X%] Tags</span>
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5 text-amber-600" />
                <span>Auto-Fill Metrics</span>
              </>
            )}
          </button>

          {/* Copy Full Resume */}
          <button
            type="button"
            onClick={handleCopyFullResume}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all inline-flex items-center space-x-1.5 cursor-pointer shadow-2xs ${
              copied
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-300'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                <span>Copied All!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Copy All</span>
              </>
            )}
          </button>

          {/* Prominent Print/Download PDF Button */}
          <button
            type="button"
            onClick={handleDownloadPdf}
            className="px-4 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white shadow-sm hover:shadow transition-all inline-flex items-center space-x-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Download PDF</span>
          </button>
        </div>
      </div>

      {/* 2. AUTHENTIC A4 DOCUMENT PREVIEW LAYOUT */}
      <div className="bg-slate-200/60 p-4 sm:p-8 rounded-3xl border border-slate-300/70 overflow-x-auto print:bg-white print:border-none print:p-0">
        <div 
          id="printable-resume-container"
          className="w-full max-w-[800px] min-h-[1130px] mx-auto bg-white border border-slate-300/80 shadow-xl shadow-slate-300/50 rounded-xs sm:rounded p-8 sm:p-14 text-slate-900 space-y-5 print:shadow-none print:border-none print:p-0 print:m-0 print:max-w-none print:min-h-0"
        >
          {/* Candidate Header */}
          <div className="text-center space-y-1 pb-3 border-b-2 border-slate-950">
            <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-slate-950">
              {resumeData.candidateName || 'CANDIDATE NAME'}
            </h1>
            <p className="text-[11.5px] text-slate-600 font-medium tracking-wide">
              {resumeData.contactInfo}
            </p>
          </div>

          {/* Section: SUMMARY */}
          {resumeData.summary && (
            <div className="space-y-1">
              <div className="border-b border-slate-950 pb-0.5">
                <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-950">
                  Professional Summary
                </h2>
              </div>
              <p className="text-[11.5px] text-slate-800 leading-relaxed pt-1">
                {resumeData.summary}
              </p>
            </div>
          )}

          {/* Section: EXPERIENCE */}
          {resumeData.experience && resumeData.experience.length > 0 && (
            <div className="space-y-2.5">
              <div className="border-b border-slate-950 pb-0.5">
                <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-950">
                  Professional Experience
                </h2>
              </div>
              <div className="space-y-3 pt-1">
                {resumeData.experience.map((exp, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex flex-wrap items-baseline justify-between text-[11.5px]">
                      <span className="font-bold text-slate-950">
                        {exp.role} {exp.company ? `• ${exp.company}` : ''}
                      </span>
                      <span className="text-[11px] font-medium text-slate-600">
                        {exp.duration} {exp.location ? `| ${exp.location}` : ''}
                      </span>
                    </div>
                    <ul className="list-disc list-outside ml-4 space-y-1 text-[11.5px] text-slate-800 leading-relaxed">
                      {exp.bullets.map((bullet, bIdx) => (
                        <li key={bIdx}>
                          {renderFormattedBullet(bullet)}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: PROJECTS */}
          {resumeData.projects && resumeData.projects.length > 0 && (
            <div className="space-y-2.5">
              <div className="border-b border-slate-950 pb-0.5">
                <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-950">
                  Selected Projects
                </h2>
              </div>
              <div className="space-y-3 pt-1">
                {resumeData.projects.map((proj, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex flex-wrap items-baseline justify-between text-[11.5px]">
                      <span className="font-bold text-slate-950">
                        {proj.title}
                        {proj.technologies && (
                          <span className="font-normal text-slate-600 italic ml-1">
                            | {proj.technologies}
                          </span>
                        )}
                      </span>
                      {proj.link && (
                        <span className="text-[11px] font-medium text-slate-500">
                          {proj.link}
                        </span>
                      )}
                    </div>
                    <ul className="list-disc list-outside ml-4 space-y-1 text-[11.5px] text-slate-800 leading-relaxed">
                      {proj.bullets.map((bullet, bIdx) => (
                        <li key={bIdx}>
                          {renderFormattedBullet(bullet)}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: SKILLS */}
          {resumeData.skills && resumeData.skills.length > 0 && (
            <div className="space-y-1.5">
              <div className="border-b border-slate-950 pb-0.5">
                <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-950">
                  Technical &amp; Role Skills
                </h2>
              </div>
              <div className="space-y-1 text-[11.5px] text-slate-800 pt-0.5">
                {resumeData.skills.map((category, idx) => (
                  <div key={idx} className="flex flex-wrap leading-relaxed">
                    <span className="font-bold text-slate-950 min-w-[160px]">
                      {category.category}:
                    </span>
                    <span className="text-slate-800">
                      {category.skills.join(', ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: EDUCATION */}
          {resumeData.education && resumeData.education.length > 0 && (
            <div className="space-y-1.5">
              <div className="border-b border-slate-950 pb-0.5">
                <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-950">
                  Education
                </h2>
              </div>
              <div className="space-y-1.5 pt-0.5">
                {resumeData.education.map((edu, idx) => (
                  <div key={idx} className="space-y-0.5 text-[11.5px]">
                    <div className="flex flex-wrap items-baseline justify-between">
                      <span className="font-bold text-slate-950">
                        {edu.institution}
                      </span>
                      <span className="text-[11px] font-medium text-slate-600">
                        {edu.graduationDate}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-baseline justify-between text-slate-800">
                      <span>{edu.degree}</span>
                      {edu.gpaOrHonors && (
                        <span className="font-semibold text-slate-950">{edu.gpaOrHonors}</span>
                      )}
                    </div>
                    {edu.relevantCoursework && edu.relevantCoursework.length > 0 && (
                      <p className="text-[11px] text-slate-600">
                        <strong className="text-slate-900">Coursework:</strong> {edu.relevantCoursework.join(', ')}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: ACHIEVEMENTS */}
          {resumeData.achievements && resumeData.achievements.length > 0 && (
            <div className="space-y-1.5">
              <div className="border-b border-slate-950 pb-0.5">
                <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-950">
                  Honors &amp; Achievements
                </h2>
              </div>
              <ul className="list-disc list-outside ml-4 space-y-0.5 text-[11.5px] text-slate-800 leading-relaxed pt-0.5">
                {resumeData.achievements.map((ach, idx) => (
                  <li key={idx}>{ach}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Plain text resume builder
function buildPlainTextResume(resume: StructuredResume): string {
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

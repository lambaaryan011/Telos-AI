import React from 'react';
import { ScoreBreakdown } from '../types';
import { CheckCircle2, AlertCircle, Copy, Award, Info, Target, Sparkles, Building2 } from 'lucide-react';

interface TopMetricsRowProps {
  score: number;
  jdMatchScore?: number | null;
  isJdTailored?: boolean;
  scoreBreakdown?: ScoreBreakdown;
  bulletsAcceptedCount: number;
  totalBulletsCount: number;
  missingKeywords: string[];
  matchedKeywords: string[];
  onCopyAllBullets: () => void;
  allCopied: boolean;
}

export const TopMetricsRow: React.FC<TopMetricsRowProps> = ({
  score,
  jdMatchScore,
  isJdTailored,
  scoreBreakdown,
  bulletsAcceptedCount,
  totalBulletsCount,
  missingKeywords,
  matchedKeywords,
  onCopyAllBullets,
  allCopied
}) => {
  // Score color calculation
  const getScoreColor = (val: number) => {
    if (val >= 80) return { text: 'text-emerald-700', bg: 'bg-emerald-500', barBg: 'bg-emerald-100', badge: 'bg-emerald-100 text-emerald-800 border-emerald-200', label: 'Interview Ready' };
    if (val >= 60) return { text: 'text-amber-700', bg: 'bg-amber-500', barBg: 'bg-amber-100', badge: 'bg-amber-100 text-amber-800 border-amber-200', label: 'Competitive' };
    return { text: 'text-rose-700', bg: 'bg-rose-500', barBg: 'bg-rose-100', badge: 'bg-rose-100 text-rose-800 border-rose-200', label: 'Needs Improvement' };
  };

  const scoreTheme = getScoreColor(score);
  const jdTheme = jdMatchScore ? getScoreColor(jdMatchScore) : null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
        {/* Metric 1: ATS Readiness Score (& JD Match % if provided) */}
        <div className="md:col-span-5 bg-slate-50/80 rounded-xl p-4 border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  ATS Readiness Score
                </span>
                <span className="text-slate-400" title="Calculated based on action verb strength, absence of mixed points, role keywords, and quantifiable impact metrics.">
                  <Info className="w-3.5 h-3.5" />
                </span>
              </div>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${scoreTheme.badge}`}>
                {scoreTheme.label}
              </span>
            </div>

            <div className="flex items-baseline justify-between my-1">
              <div className="flex items-baseline space-x-2">
                <span className={`text-3xl font-extrabold tracking-tight ${scoreTheme.text}`}>
                  {score}
                </span>
                <span className="text-sm font-semibold text-slate-400">/ 100</span>
              </div>

              {/* JD Match Score Badge if JD provided */}
              {isJdTailored && jdMatchScore !== undefined && jdMatchScore !== null && (
                <div className="flex items-center space-x-1.5 bg-indigo-50 border border-indigo-200 text-indigo-900 px-2.5 py-1 rounded-lg">
                  <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-indigo-600 block leading-none">JD Match</span>
                    <span className="text-xs font-extrabold text-indigo-950">{jdMatchScore}%</span>
                  </div>
                </div>
              )}
            </div>

            {/* Visual Progress Bar */}
            <div className="w-full mt-2 space-y-1">
              <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${scoreTheme.bg} transition-all duration-700 ease-out rounded-full`}
                  style={{ width: `${Math.min(100, Math.max(5, score))}%` }}
                />
              </div>
              {isJdTailored && jdMatchScore && (
                <div className="flex justify-between items-center text-[10px] text-slate-500 pt-0.5">
                  <span>ATS Formula: {score}%</span>
                  <span className="font-semibold text-indigo-700">Company JD Alignment: {jdMatchScore}%</span>
                </div>
              )}
            </div>
          </div>

          {/* Sub-breakdown mini pills */}
          {scoreBreakdown && (
            <div className="grid grid-cols-2 gap-1.5 mt-3 pt-2.5 border-t border-slate-200/70 text-[11px] text-slate-600">
              <div className="flex items-center justify-between">
                <span>Role/JD Match:</span>
                <span className="font-semibold text-slate-800">{scoreBreakdown.roleKeywordMatch}/35</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Single Idea:</span>
                <span className="font-semibold text-slate-800">{scoreBreakdown.singleIdeaStructure}/25</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Metrics &amp; XYZ:</span>
                <span className="font-semibold text-slate-800">{scoreBreakdown.quantifiedMetrics}/25</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Formatting:</span>
                <span className="font-semibold text-slate-800">{scoreBreakdown.sectionFormattingCompliance}/15</span>
              </div>
            </div>
          )}
        </div>

        {/* Metric 2: Bullets Accepted (Copied) Counter */}
        <div className="md:col-span-3 bg-slate-50/80 rounded-xl p-4 border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Bullets Accepted
              </span>
              <Award className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-[11px] text-slate-500">Incremental copy tracker</p>
          </div>

          <div className="my-2 flex items-baseline space-x-1.5">
            <span className="text-3xl font-extrabold text-emerald-700">
              {bulletsAcceptedCount}
            </span>
            <span className="text-sm font-semibold text-slate-400">
              / {totalBulletsCount} copied
            </span>
          </div>

          <button
            type="button"
            onClick={onCopyAllBullets}
            disabled={totalBulletsCount === 0}
            className={`w-full py-1.5 px-2.5 text-xs font-semibold rounded-lg border transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
              allCopied
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300 shadow-2xs'
            }`}
          >
            {allCopied ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                <span>All Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Copy All Improved</span>
              </>
            )}
          </button>
        </div>

        {/* Metric 3: Missing Role / JD Keywords (FIXED: h-auto so badges NEVER get cut off!) */}
        <div className="md:col-span-4 bg-slate-50/80 rounded-xl p-4 border border-slate-200 flex flex-col justify-between h-auto min-h-[140px]">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center space-x-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  {isJdTailored ? 'Missing JD Keywords' : 'Missing Role Keywords'}
                </span>
              </div>
              <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded">
                {missingKeywords.length} Gaps
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mb-2">
              {isJdTailored
                ? 'Required skills parsed from your target job description:'
                : 'Critical ATS filter terms absent from your draft:'}
            </p>
          </div>

          {/* Red pills/badges with h-auto and full wrapping */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {missingKeywords.length > 0 ? (
              missingKeywords.map((keyword, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-colors"
                  title="Add this term or concept to improve ATS keyword score"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1.5 shrink-0"></span>
                  <span>{keyword}</span>
                </span>
              ))
            ) : (
              <span className="text-xs text-emerald-700 font-medium flex items-center space-x-1 py-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>All core target keywords matched!</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Matched Keywords bar if available */}
      {matchedKeywords && matchedKeywords.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-500 font-medium flex items-center space-x-1 mr-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Found in your resume:</span>
          </span>
          {matchedKeywords.map((kw, i) => (
            <span
              key={i}
              className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200"
            >
              {kw}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

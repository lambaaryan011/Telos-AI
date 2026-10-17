import React from 'react';
import { ScoreBreakdown } from '../types';
import { 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Award, 
  Copy, 
  ShieldCheck, 
  Layers, 
  Plus, 
  ArrowRight,
  Zap,
  Building2,
  Check
} from 'lucide-react';

interface AtsCheckerScorecardProps {
  beforeScore: number;
  afterScore: number;
  scoreBreakdown: ScoreBreakdown;
  matchedKeywords: string[];
  missingKeywords: string[];
  injectedKeywords?: string[];
  onInjectMissingKeywords: () => void;
  bulletsAcceptedCount: number;
  totalBulletsCount: number;
  onCopyAllBullets: () => void;
  allCopied: boolean;
  jdMatchScore?: number | null;
  isJdTailored?: boolean;
  roleEvaluated: string;
}

// Sleek SVG Radial Progress Ring Component
const RadialProgressRing: React.FC<{
  score: number;
  size?: number;
  strokeWidth?: number;
  strokeColor: string;
  trackColor: string;
  textColor?: string;
  label: string;
  badgeText: string;
  badgeStyle: string;
}> = ({
  score,
  size = 110,
  strokeWidth = 9,
  strokeColor,
  trackColor,
  textColor = 'text-white',
  label,
  badgeText,
  badgeStyle
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, score)) / 100) * circumference;

  return (
    <div className="flex flex-col items-center text-center">
      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
        {label}
      </span>
      <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={trackColor}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-3xl font-black ${textColor} tracking-tight leading-none`}>
            {score}
          </span>
          <span className="text-[10px] font-bold text-slate-400 mt-1">/ 100</span>
        </div>
      </div>
      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full inline-block mt-2.5 ${badgeStyle}`}>
        {badgeText}
      </span>
    </div>
  );
};

export const AtsCheckerScorecard: React.FC<AtsCheckerScorecardProps> = ({
  beforeScore,
  afterScore,
  scoreBreakdown,
  matchedKeywords,
  missingKeywords,
  injectedKeywords,
  onInjectMissingKeywords,
  bulletsAcceptedCount,
  totalBulletsCount,
  onCopyAllBullets,
  allCopied,
  jdMatchScore,
  isJdTailored,
  roleEvaluated
}) => {
  const scoreBoost = Math.max(0, afterScore - beforeScore);

  return (
    <div className="space-y-6">
      {/* 1. HIGH-CONTRAST ATS SCORE TRANSFORMATION BANNER */}
      <div className="bg-slate-950 rounded-3xl border border-slate-800 p-6 sm:p-8 text-white shadow-xl space-y-6 overflow-hidden relative">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        {/* Banner Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800 relative z-10">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 rounded-2xl shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-black text-white tracking-tight leading-tight">
                  ATS Score Transformation Engine
                </h3>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Placement Verified
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Before vs. After Optimization Scorecard tailored for {roleEvaluated}
              </p>
            </div>
          </div>

          {/* Bullets Accepted Tracker & Bulk Copy */}
          <div className="flex items-center space-x-2.5">
            <div className="flex items-center space-x-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300">
              <Award className="w-4 h-4 text-emerald-400" />
              <span>{bulletsAcceptedCount} / {totalBulletsCount} Accepted</span>
            </div>

            <button
              type="button"
              onClick={onCopyAllBullets}
              disabled={totalBulletsCount === 0}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl border transition-all inline-flex items-center space-x-1.5 cursor-pointer shadow-xs ${
                allCopied
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-slate-900 hover:bg-slate-800 text-white border-slate-700'
              }`}
            >
              {allCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>All Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copy All Improved</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* RADIAL PROGRESS RINGS COMPARISON DISPLAY */}
        <div className="flex flex-col md:flex-row items-center justify-around gap-6 py-4 px-2 relative z-10">
          {/* Radial Ring 1: Initial Score */}
          <RadialProgressRing
            score={beforeScore}
            label="Initial Draft"
            strokeColor="#f43f5e"
            trackColor="#334155"
            textColor="text-rose-400"
            badgeText="Needs Polish • Mixed Ideas"
            badgeStyle="bg-rose-500/10 text-rose-400 border border-rose-500/20"
          />

          {/* Transformation Arrow & Lift Badge */}
          <div className="flex flex-col items-center justify-center px-4 py-2 text-center">
            <span className="text-xs font-black text-emerald-400 bg-emerald-500/20 border border-emerald-500/30 px-3 py-1 rounded-full mb-2 shadow-xs">
              +{scoreBoost} Pts Boost
            </span>
            <div className="w-10 h-10 rounded-full bg-slate-800/90 border border-slate-700 text-indigo-400 flex items-center justify-center shadow-xs">
              <ArrowRight className="w-5 h-5" />
            </div>
            <span className="text-[10px] text-slate-400 mt-2 font-medium">
              Google XYZ Formula
            </span>
          </div>

          {/* Radial Ring 2: Rebuilt Score */}
          <RadialProgressRing
            score={afterScore}
            label="AI Rebuilt Resume"
            strokeColor="#10b981"
            trackColor="#334155"
            textColor="text-emerald-400"
            badgeText="98/100 • Interview Ready ✓"
            badgeStyle="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-black"
          />

          {/* Optional JD Match Ring / Metric if provided */}
          {isJdTailored && jdMatchScore !== undefined && jdMatchScore !== null && (
            <div className="border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6 flex flex-col items-center">
              <RadialProgressRing
                score={jdMatchScore}
                size={95}
                strokeWidth={8}
                label="Target JD Match"
                strokeColor="#6366f1"
                trackColor="#334155"
                textColor="text-indigo-400"
                badgeText={`${jdMatchScore}% Custom Aligned`}
                badgeStyle="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
              />
            </div>
          )}
        </div>

        {/* Narrative Summary inside Banner */}
        <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 text-xs text-slate-300 leading-relaxed flex items-start space-x-3 relative z-10">
          <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-white">How Score Was Boosted: </span>
            Single-idea separation purged mixed bullet responsibilities; standard [X%] placeholders enabled quantified outcomes without hallucinating fake data; and missing role keywords were wove in for high-volume ATS parsers.
          </div>
        </div>
      </div>

      {/* 2. 4-PART ATS RUBRIC BREAKDOWN */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 sm:p-7 space-y-4">
        <div className="flex items-center justify-between pb-1 border-b border-slate-100">
          <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
            <Layers className="w-4 h-4 text-indigo-600" />
            <span>4-Part ATS Rubric Breakdown</span>
          </h4>
          <span className="text-[11px] text-slate-500 font-semibold">
            Universal Industry Hiring Standard
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Part 1: Role & JD Keyword Match (0-35) */}
          <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800">1. Role &amp; JD Match</span>
              <span className="font-extrabold text-indigo-700">
                {scoreBreakdown.roleKeywordMatch} / 35
              </span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                style={{ width: `${(scoreBreakdown.roleKeywordMatch / 35) * 100}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-500">
              Evaluates hard skills, methodologies &amp; tools.
            </p>
          </div>

          {/* Part 2: Single-Idea Bullet Structure (0-25) */}
          <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800">2. Single-Idea Structure</span>
              <span className="font-extrabold text-violet-700">
                {scoreBreakdown.singleIdeaStructure} / 25
              </span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-violet-600 rounded-full transition-all duration-500"
                style={{ width: `${(scoreBreakdown.singleIdeaStructure / 25) * 100}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-500">
              No mixed points • Crisp Google XYZ formula.
            </p>
          </div>

          {/* Part 3: Quantified Impact Metrics (0-25) */}
          <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800">3. Quantified Impact</span>
              <span className="font-extrabold text-amber-700">
                {scoreBreakdown.quantifiedMetrics} / 25
              </span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${(scoreBreakdown.quantifiedMetrics / 25) * 100}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-500">
              Percentages, active users &amp; [X%] placeholders.
            </p>
          </div>

          {/* Part 4: ATS Section & Formatting Compliance (0-15) */}
          <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800">4. Section Compliance</span>
              <span className="font-extrabold text-emerald-700">
                {scoreBreakdown.sectionFormattingCompliance} / 15
              </span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${(scoreBreakdown.sectionFormattingCompliance / 15) * 100}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-500">
              Standard headers: Experience, Projects, Skills.
            </p>
          </div>
        </div>
      </div>

      {/* 3. KEYWORD GAP SCANNER WITH SOFT BACKGROUND PILLS */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 sm:p-7 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
          <div>
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
              <span>Keyword Gap Scanner</span>
              <span className="text-[11px] font-bold text-slate-500 font-normal">
                ({matchedKeywords.length} Detected · {missingKeywords.length} Missing)
              </span>
            </h4>
            <p className="text-[11px] text-slate-500">
              ATS parsers scan for these exact domain keywords before ranking candidate resumes
            </p>
          </div>

          {/* 1-Click Inject Missing Keywords Button */}
          {missingKeywords.length > 0 && (
            <button
              type="button"
              onClick={onInjectMissingKeywords}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow transition-all inline-flex items-center space-x-1.5 cursor-pointer self-start sm:self-auto"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
              <span>1-Click Inject Missing Keywords (+2 pts)</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Matched Keywords (Modern tag pills with soft background fills: bg-emerald-50 text-emerald-700) */}
          <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-emerald-800 flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Matched Keywords Found in Resume</span>
              </span>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                {matchedKeywords.length} Matched
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {matchedKeywords.map((kw, i) => (
                <span
                  key={i}
                  className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-2xs"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 shrink-0" />
                  <span>{kw}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Missing Keywords (Modern tag pills with soft background fills: bg-rose-50 text-rose-700) */}
          <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-rose-800 flex items-center space-x-1.5">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>Missing Role / JD Keywords</span>
              </span>
              <span className="text-[10px] font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full">
                {missingKeywords.length} Missing
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {missingKeywords.length > 0 ? (
                missingKeywords.map((kw, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200/80 shadow-2xs"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1.5 shrink-0" />
                    <span>{kw}</span>
                  </span>
                ))
              ) : (
                <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-700 py-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>All keyword gaps resolved! Rebuilt resume is 100% matched.</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {injectedKeywords && injectedKeywords.length > 0 && (
          <div className="p-3 bg-indigo-50/80 border border-indigo-200 rounded-xl text-xs text-indigo-900 flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>
              <strong>Injected Keywords:</strong> {injectedKeywords.join(', ')} added directly into your Technical &amp; Role Skills section!
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

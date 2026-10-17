import React from 'react';
import { TrendingUp, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface ScoreTransformationBannerProps {
  initialScore: number;
  rebuiltScore: number;
  injectedKeywords: string[];
  roleEvaluated: string;
  isJdTailored?: boolean;
}

export const ScoreTransformationBanner: React.FC<ScoreTransformationBannerProps> = ({
  initialScore,
  rebuiltScore,
  injectedKeywords,
  roleEvaluated,
  isJdTailored
}) => {
  const lift = Math.max(0, rebuiltScore - initialScore);

  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-7 text-white shadow-lg border border-indigo-800/60 space-y-5">
      {/* Top Banner Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="space-y-1.5 max-w-xl">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>ATS Score Transformation Engine</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Resume Rebuilt to <span className="text-emerald-400">{rebuiltScore}% ATS Readiness</span>
          </h3>
          <p className="text-xs text-indigo-200/80 leading-relaxed">
            {isJdTailored 
              ? `We extracted high-signal keywords directly from your target JD and structured single-point accomplishments for ${roleEvaluated}.`
              : `We converted passive mixed thoughts into singular Google XYZ bullets and wove in core industry keywords for ${roleEvaluated}.`}
          </p>
        </div>

        {/* Score Comparison Display */}
        <div className="flex items-center space-x-3 sm:space-x-4 bg-white/10 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border border-white/15 shrink-0 self-start lg:self-center">
          {/* Initial Score */}
          <div className="text-center px-2">
            <span className="text-[10px] uppercase font-bold text-slate-300 block">Initial Draft</span>
            <div className="flex items-baseline justify-center space-x-0.5 mt-0.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-rose-300">{initialScore}</span>
              <span className="text-xs text-slate-400">/100</span>
            </div>
            <span className="text-[9px] font-semibold text-rose-300 bg-rose-500/20 px-1.5 py-0.2 rounded block mt-1">
              Low Keyword Match
            </span>
          </div>

          {/* Transformation Arrow */}
          <div className="flex flex-col items-center px-1">
            <span className="text-xs font-black text-emerald-400 bg-emerald-500/20 border border-emerald-400/30 px-2 py-0.5 rounded-full mb-1">
              +{lift} pts
            </span>
            <ArrowRight className="w-5 h-5 text-indigo-300" />
          </div>

          {/* Rebuilt Score */}
          <div className="text-center px-2">
            <span className="text-[10px] uppercase font-bold text-emerald-300 block">AI Rebuilt Resume</span>
            <div className="flex items-baseline justify-center space-x-0.5 mt-0.5">
              <span className="text-2xl sm:text-3xl font-black text-emerald-400">{rebuiltScore}</span>
              <span className="text-xs text-slate-400">/100</span>
            </div>
            <span className="text-[9px] font-bold text-emerald-200 bg-emerald-500/30 border border-emerald-400/40 px-1.5 py-0.2 rounded block mt-1">
              Interview-Ready ✓
            </span>
          </div>
        </div>
      </div>

      {/* Injected Keywords & Fixes Bar */}
      <div className="pt-4 border-t border-indigo-900/80 space-y-2">
        <div className="flex items-center space-x-2 text-xs font-bold text-indigo-200">
          <Zap className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Injected JD Keywords &amp; Architectural Fixes (woven into live resume):</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {injectedKeywords && injectedKeywords.length > 0 ? (
            injectedKeywords.map((keyword, i) => (
              <span
                key={i}
                className="inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mr-1.5 shrink-0" />
                <span>Injected: {keyword}</span>
              </span>
            ))
          ) : (
            <span className="text-xs text-indigo-300">
              ✓ Core role keywords and metrics integrated into experience bullets
            </span>
          )}

          <span className="inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 mr-1.5 shrink-0" />
            <span>Fixed: Zero Hallucination Guardrail</span>
          </span>
          <span className="inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 mr-1.5 shrink-0" />
            <span>Fixed: Split 2 Mixed Points</span>
          </span>
        </div>
      </div>
    </div>
  );
};

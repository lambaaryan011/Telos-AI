import React from 'react';
import { Target, ShieldCheck, Sparkles, BookOpen, Layers } from 'lucide-react';

interface HeaderProps {
  onOpenRulesModal: () => void;
  bulletsAcceptedCount: number;
  totalBulletsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenRulesModal,
  bulletsAcceptedCount,
  totalBulletsCount
}) => {
  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand identity */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-sm ring-1 ring-black/5">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-tight">
                Placement-Ready AI
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                ATS Co-Pilot
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Resume Bullet &amp; ATS Optimizer for APM, SDE &amp; Data Analyst Roles
            </p>
          </div>
        </div>

        {/* System Rules Pill & Action */}
        <div className="flex items-center space-x-3">
          <div className="hidden lg:flex items-center space-x-2 text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Strict Guardrails:</span>
            <span className="font-semibold text-slate-800">No Mixed Points</span>
            <span className="text-slate-300">•</span>
            <span className="font-semibold text-slate-800">Zero Hallucination</span>
            <span className="text-slate-300">•</span>
            <span className="font-semibold text-slate-800">Role Aligned</span>
          </div>

          {totalBulletsCount > 0 && (
            <div className="flex items-center space-x-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold px-3 py-1.5 rounded-lg">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>{bulletsAcceptedCount}/{totalBulletsCount} Accepted</span>
            </div>
          )}

          <button
            onClick={onOpenRulesModal}
            className="inline-flex items-center space-x-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            title="View Strict AI System Prompt Rules"
          >
            <BookOpen className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden sm:inline">Audit Rules Guide</span>
          </button>
        </div>
      </div>
    </header>
  );
};

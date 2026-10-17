import React from 'react';
import { TargetRole } from '../types';
import { Compass, FileText, CheckCircle2, ArrowRight, ShieldCheck, Sparkles, Building2 } from 'lucide-react';

interface WorkflowStepsBarProps {
  targetRole: TargetRole;
  customRoleName?: string;
  hasJd: boolean;
  hasResume: boolean;
  resumeFileName?: string;
  isAudited: boolean;
  score?: number;
}

export const WorkflowStepsBar: React.FC<WorkflowStepsBarProps> = ({
  targetRole,
  customRoleName,
  hasJd,
  hasResume,
  resumeFileName,
  isAudited,
  score
}) => {
  const roleDisplay = targetRole === 'Other' && customRoleName ? customRoleName : targetRole.replace(/\s*\(.*?\)/, '');

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/90 shadow-xs p-3.5 sm:p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
        {/* Step 1: Role & JD */}
        <div className="flex items-center space-x-3 p-2 rounded-xl bg-slate-50/80 border border-slate-200/60">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
            1
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-bold text-slate-900 tracking-tight">Select Role &amp; JD</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
            </div>
            <p className="text-[11px] text-slate-500 truncate">
              {roleDisplay} {hasJd ? '• Custom JD' : '• Universal Mode'}
            </p>
          </div>
        </div>

        {/* Step 2: Add Resume */}
        <div className={`flex items-center space-x-3 p-2 rounded-xl border transition-all ${
          hasResume 
            ? 'bg-emerald-50/50 border-emerald-200/80' 
            : 'bg-slate-50/80 border-slate-200/60'
        }`}>
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 shadow-xs transition-colors ${
            hasResume 
              ? 'bg-emerald-600 text-white' 
              : 'bg-slate-200 text-slate-700'
          }`}>
            {hasResume ? <CheckCircle2 className="w-4 h-4" /> : '2'}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-bold text-slate-900 tracking-tight">Add Resume</span>
              {hasResume && (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-1.5 py-0.2 rounded">
                  Ready
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 truncate">
              {resumeFileName || (hasResume ? 'Bullets Loaded' : 'PDF / DOCX or Paste Text')}
            </p>
          </div>
        </div>

        {/* Step 3: Audit & Export */}
        <div className={`flex items-center space-x-3 p-2 rounded-xl border transition-all ${
          isAudited 
            ? 'bg-indigo-50/60 border-indigo-200' 
            : 'bg-slate-50/80 border-slate-200/60'
        }`}>
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 shadow-xs transition-colors ${
            isAudited 
              ? 'bg-indigo-600 text-white' 
              : 'bg-slate-200 text-slate-700'
          }`}>
            {isAudited ? <Sparkles className="w-4 h-4" /> : '3'}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-bold text-slate-900 tracking-tight">Audit &amp; Export</span>
              {isAudited && (
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100/80 px-1.5 py-0.2 rounded">
                  {score || 98}/100
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 truncate">
              {isAudited ? 'Scorecard & Rebuilt A4 PDF' : 'Click Run Audit Below'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

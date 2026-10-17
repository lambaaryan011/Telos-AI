import React from 'react';
import { X, ShieldCheck, CheckCircle2, AlertOctagon, Sparkles, BookOpen, Layers } from 'lucide-react';

interface MethodologyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MethodologyModal: React.FC<MethodologyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 bg-blue-500/20 text-blue-400 rounded-lg">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Strict AI Audit Rules</h3>
              <p className="text-xs text-slate-400">Our 3 Non-Negotiable System Guardrails for Top Placements</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Rule 1 */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-2.5">
            <div className="flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-violet-100 text-violet-800 text-xs font-bold flex items-center justify-center">
                1
              </span>
              <h4 className="text-sm font-bold text-slate-900">Rule 1: No Mixed Points (Single Line of Thought)</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Student resumes frequently try to pack multiple achievements into one sentence using connectors like &quot;and also&quot; or &quot;while also&quot;. This confuses ATS scrapers and dilutes recruiter impact. Every bullet must follow exactly one line of thought:
              <strong className="text-slate-800 block mt-1">Strong Action Verb + Context / Problem Solved + Quantified Impact.</strong>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-900">
                <span className="font-bold text-rose-700 block mb-0.5">❌ Mixed Point:</span>
                &quot;Built user onboarding flow and also coordinated weekly sprint planning with designers.&quot;
              </div>
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900">
                <span className="font-bold text-emerald-700 block mb-0.5">✓ Split &amp; Crisp:</span>
                &quot;Redesigned user onboarding flow, reducing day-1 drop-offs by [X%] across [Y users].&quot;
              </div>
            </div>
          </div>

          {/* Rule 2 */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-2.5">
            <div className="flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 text-xs font-bold flex items-center justify-center">
                2
              </span>
              <h4 className="text-sm font-bold text-slate-900">Rule 2: Zero Hallucination Guardrail</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Generic LLMs often fabricate fake numbers like &quot;increased revenue by 47.3%&quot;. If an interviewer probes a fake metric, the student gets disqualified immediately. Our engine NEVER invents data; instead, it injects bold bracket placeholders like <span className="font-bold text-amber-900 bg-amber-100 px-1 py-0.5 rounded">[X%]</span>, <span className="font-bold text-amber-900 bg-amber-100 px-1 py-0.5 rounded">[Y users]</span>, or <span className="font-bold text-amber-900 bg-amber-100 px-1 py-0.5 rounded">[Z hours]</span> so you know what real metric to compute.
            </p>
          </div>

          {/* Rule 3 */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-2.5">
            <div className="flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-xs font-bold flex items-center justify-center">
                3
              </span>
              <h4 className="text-sm font-bold text-slate-900">Rule 3: Strict Role Alignment</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Resume bullets must align with the hiring rubric of the specific target track:
            </p>
            <ul className="space-y-1.5 text-xs text-slate-700">
              <li className="flex items-start space-x-2">
                <span className="font-semibold text-purple-700 shrink-0">• APM:</span>
                <span>Purges low-level code syntax (Redux, Flexbox, SQL scripts) and reframes around user friction, conversion funnels, retention, and customer impact.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="font-semibold text-blue-700 shrink-0">• SDE:</span>
                <span>Elevates engineering scale, latency optimization, microservices, reliability, throughput, and clean modular code.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="font-semibold text-emerald-700 shrink-0">• Data Analyst:</span>
                <span>Highlights data integrity, SQL optimization, automated BI reporting, hypothesis testing, and business decision drivers.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Got It, Back to Audit
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { BulletAuditItem, BulletFeedback } from '../types';
import { 
  Copy, 
  Check, 
  ThumbsUp, 
  ThumbsDown, 
  Split, 
  Sparkles, 
  AlertTriangle, 
  Edit3, 
  ChevronDown, 
  ChevronUp, 
  Layers,
  ArrowRight
} from 'lucide-react';

interface DiffCardProps {
  bullet: BulletAuditItem;
  index: number;
  feedback?: BulletFeedback;
  onCopyBullet: (bulletId: string, textToCopy: string) => void;
  onRateBullet: (bulletId: string, rating: 'up' | 'down') => void;
}

export const DiffCard: React.FC<DiffCardProps> = ({
  bullet,
  index,
  feedback,
  onCopyBullet,
  onRateBullet
}) => {
  const [copiedPrimary, setCopiedPrimary] = useState(false);
  const [copiedSecondary, setCopiedSecondary] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [customText, setCustomText] = useState(bullet.rewrittenBullet);
  const [showDetails, setShowDetails] = useState(false);

  // Issue tag badge styling helper
  const getTagStyle = (tag: string) => {
    switch (tag) {
      case 'Split 2 Mixed Points':
        return 'bg-violet-100 text-violet-800 border-violet-200';
      case 'Reframed for Product Impact':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Added Metric Placeholder':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Eliminated Dev Jargon':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    }
  };

  const handleCopyPrimary = () => {
    const text = isEditing ? customText : bullet.rewrittenBullet;
    // Strip bold asterisks for clean clipboard paste
    const cleanText = text.replace(/\*\*/g, '');
    onCopyBullet(bullet.id, cleanText);
    setCopiedPrimary(true);
    setTimeout(() => setCopiedPrimary(false), 2200);
  };

  const handleCopySecondary = () => {
    if (!bullet.secondaryRewrittenBullet) return;
    const cleanText = bullet.secondaryRewrittenBullet.replace(/\*\*/g, '');
    onCopyBullet(`${bullet.id}-sec`, cleanText);
    setCopiedSecondary(true);
    setTimeout(() => setCopiedSecondary(false), 2200);
  };

  // Helper to render text with highlighted placeholders like [X%], [Y users]
  const renderFormattedText = (text: string) => {
    // Regex matches [X%], [Y users], [Z hours], etc., optionally wrapped in **
    const parts = text.split(/(\*?\*?\[[A-Za-z0-9%$,\s\/\-_]+\]\*?\*?)/g);
    return parts.map((part, i) => {
      const isPlaceholder = /\[[A-Za-z0-9%$,\s\/\-_]+\]/.test(part);
      if (isPlaceholder) {
        const cleanContent = part.replace(/\*\*/g, '');
        return (
          <span
            key={i}
            className="inline-flex items-center px-1.5 py-0.2 mx-0.5 rounded font-bold bg-amber-200/90 text-amber-950 border border-amber-400 text-xs shadow-2xs"
            title="Zero Hallucination Guardrail: Replace this placeholder with your genuine metric!"
          >
            {cleanContent}
          </span>
        );
      }
      return <span key={i}>{part.replace(/\*\*/g, '')}</span>;
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-sm transition-all overflow-hidden">
      {/* Card Header Bar */}
      <div className="px-5 py-3.5 bg-slate-50/80 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2.5">
          <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center">
            {index + 1}
          </span>
          <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
            Bullet Audit
          </span>
          {/* Issue Fixed Tag Badge */}
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${getTagStyle(
              bullet.issueFixedTag
            )}`}
          >
            {bullet.issueFixedTag === 'Split 2 Mixed Points' && (
              <Split className="w-3 h-3 mr-1" />
            )}
            {bullet.issueFixedTag}
          </span>
        </div>

        {/* Accepted indicator */}
        <div className="flex items-center space-x-2">
          {feedback?.copied && (
            <span className="inline-flex items-center text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
              <Check className="w-3 h-3 mr-1" />
              Accepted
            </span>
          )}

          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs text-slate-500 hover:text-slate-800 inline-flex items-center space-x-1 cursor-pointer"
          >
            <span>{showDetails ? 'Hide Rationale' : 'Why Flagged'}</span>
            {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Flagged issues dropdown rationale */}
      {showDetails && (
        <div className="px-5 py-3 bg-amber-50/50 border-b border-amber-100 text-xs text-amber-900 space-y-1.5">
          <div className="font-semibold flex items-center space-x-1 text-amber-800">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>ATS &amp; Hiring Manager Issues Detected:</span>
          </div>
          <ul className="list-disc list-inside space-y-0.5 text-slate-700 pl-1">
            {bullet.detectedIssues.map((issue, idx) => (
              <li key={idx}>{issue}</li>
            ))}
          </ul>
          <p className="text-slate-600 text-[11px] italic pt-1">
            <strong className="text-slate-800 not-italic">Fix: </strong>
            {bullet.issueExplanation}
          </p>
        </div>
      )}

      {/* Diff Content Area */}
      <div className="p-5 space-y-3.5">
        {/* Original Bullet (Light Red Highlight) */}
        <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-3.5 transition-colors">
          <div className="flex items-center justify-between mb-1.5">
            <span className="inline-flex items-center text-[11px] font-bold text-rose-800 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-rose-500 mr-1.5 animate-pulse" />
              Original Draft
            </span>
            <span className="text-[11px] font-medium text-rose-700/80">
              Needs Polish
            </span>
          </div>
          <p className="text-sm text-rose-950 font-sans leading-relaxed line-through decoration-rose-300 decoration-1">
            {bullet.originalBullet}
          </p>
        </div>

        {/* AI Rewritten Bullet (Light Green Highlight) */}
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-3.5 transition-colors relative">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-emerald-600 mr-1" />
                AI Rewritten Bullet (ATS-Optimized)
              </span>
              {bullet.actionVerbUsed && (
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-1.5 py-0.2 rounded border border-emerald-300">
                  Verb: {bullet.actionVerbUsed}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className="text-[11px] text-emerald-700 hover:text-emerald-900 inline-flex items-center space-x-1 cursor-pointer font-medium"
              title="Edit metrics inline before copying"
            >
              <Edit3 className="w-3 h-3" />
              <span>{isEditing ? 'Done Editing' : 'Fill In Metrics'}</span>
            </button>
          </div>

          {isEditing ? (
            <div className="mt-2 space-y-2">
              <textarea
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                rows={3}
                className="w-full text-sm font-mono text-emerald-950 bg-white border border-emerald-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-200 outline-hidden"
              />
              <span className="text-[11px] text-emerald-700 block">
                Replace [X%], [Y users], or [Z hours] with your real accomplishments.
              </span>
            </div>
          ) : (
            <p className="text-sm text-emerald-950 font-medium leading-relaxed">
              • {renderFormattedText(bullet.rewrittenBullet)}
            </p>
          )}

          {/* Quick guidance pill regarding zero-hallucination */}
          <div className="mt-2.5 pt-2 border-t border-emerald-200/60 flex items-center justify-between text-[11px] text-emerald-800">
            <span className="flex items-center space-x-1">
              <span className="font-semibold">Guardrail Active:</span>
              <span>Zero Hallucination (Metric Placeholders in Amber)</span>
            </span>
            <span className="font-medium text-emerald-900">Single Line of Thought</span>
          </div>
        </div>

        {/* Secondary Clean Bullet (When Split 2 Mixed Points occurred) */}
        {bullet.secondaryRewrittenBullet && (
          <div className="rounded-xl border border-teal-200 bg-teal-50/70 p-3.5 transition-colors">
            <div className="flex items-center justify-between mb-1.5">
              <span className="inline-flex items-center text-[11px] font-bold text-teal-800 uppercase tracking-wider">
                <Split className="w-3 h-3 text-teal-600 mr-1" />
                Split Point #2 (Standalone Second Achievement)
              </span>
              <button
                type="button"
                onClick={handleCopySecondary}
                className={`text-xs font-semibold px-2.5 py-1 rounded-md border transition-all inline-flex items-center space-x-1 cursor-pointer ${
                  copiedSecondary
                    ? 'bg-teal-700 text-white border-teal-700'
                    : 'bg-white hover:bg-teal-100/60 text-teal-800 border-teal-300'
                }`}
              >
                {copiedSecondary ? (
                  <>
                    <Check className="w-3 h-3" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy Point #2</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-sm text-teal-950 font-medium leading-relaxed">
              • {renderFormattedText(bullet.secondaryRewrittenBullet)}
            </p>
            <p className="text-[11px] text-teal-700 mt-1.5">
              The original draft contained two separate ideas. We isolated this second accomplishment so you can add it as its own high-impact bullet!
            </p>
          </div>
        )}
      </div>

      {/* Interactive Feedback Buttons Bar */}
      <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Rating feedback (thumbs up / down) */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-500 font-medium mr-1">Was this rewrite helpful?</span>
          <button
            type="button"
            onClick={() => onRateBullet(bullet.id, 'up')}
            className={`p-1.5 rounded-lg border text-xs flex items-center space-x-1 transition-all cursor-pointer ${
              feedback?.rating === 'up'
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold shadow-2xs'
                : 'bg-white hover:bg-slate-100 text-slate-600 border-slate-200'
            }`}
            title="Helpful rewrite"
          >
            <ThumbsUp className="w-3.5 h-3.5" />
            <span className="text-[11px]">Good</span>
          </button>
          <button
            type="button"
            onClick={() => onRateBullet(bullet.id, 'down')}
            className={`p-1.5 rounded-lg border text-xs flex items-center space-x-1 transition-all cursor-pointer ${
              feedback?.rating === 'down'
                ? 'bg-rose-100 text-rose-800 border-rose-300 font-bold shadow-2xs'
                : 'bg-white hover:bg-slate-100 text-slate-600 border-slate-200'
            }`}
            title="Needs improvement"
          >
            <ThumbsDown className="w-3.5 h-3.5" />
            <span className="text-[11px]">Needs Work</span>
          </button>

          {feedback?.rating && (
            <span className="text-[11px] text-slate-400 italic">
              {feedback.rating === 'up' ? 'Feedback noted ✓' : 'Feedback noted'}
            </span>
          )}
        </div>

        {/* Right: Primary Copy Improved Bullet Button */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleCopyPrimary}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-xs ${
              copiedPrimary || feedback?.copied
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20'
                : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-emerald-500/20 hover:scale-[1.02]'
            }`}
          >
            {copiedPrimary ? (
              <>
                <Check className="w-4 h-4" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Improved Bullet</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

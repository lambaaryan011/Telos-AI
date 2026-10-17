import React, { useState, useRef } from 'react';
import { TargetRole, UploadedFileInfo } from '../types';
import { ROLE_CONFIGS } from '../constants/samples';
import { 
  Briefcase, 
  FileText, 
  UploadCloud, 
  CheckCircle2, 
  Sparkles, 
  RefreshCw, 
  Trash2, 
  ArrowRight, 
  ChevronDown, 
  ChevronUp, 
  Building2, 
  FileCheck, 
  X,
  FileCode,
  Layers
} from 'lucide-react';

interface LeftPanelProps {
  targetRole: TargetRole;
  setTargetRole: (role: TargetRole) => void;
  jdText: string;
  setJdText: (text: string) => void;
  resumeText: string;
  setResumeText: (text: string) => void;
  uploadedFile: UploadedFileInfo | null;
  setUploadedFile: (file: UploadedFileInfo | null) => void;
  onLoadSampleResume: () => void;
  onLoadSampleJd: () => void;
  onRunAudit: () => void;
  isLoading: boolean;
  sampleLoaded: boolean;
}

export const LeftPanel: React.FC<LeftPanelProps> = ({
  targetRole,
  setTargetRole,
  jdText,
  setJdText,
  resumeText,
  setResumeText,
  uploadedFile,
  setUploadedFile,
  onLoadSampleResume,
  onLoadSampleJd,
  onRunAudit,
  isLoading,
  sampleLoaded
}) => {
  const [isJdOpen, setIsJdOpen] = useState<boolean>(Boolean(jdText.trim()));
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentConfig = ROLE_CONFIGS[targetRole];

  // File drop / select handler
  const handleFileProcess = (file: File) => {
    const isPdf = file.type === 'application/pdf' || file.name.endsWith('.pdf');
    const isText = file.type.startsWith('text/') || file.name.endsWith('.txt');

    const reader = new FileReader();

    if (isPdf) {
      reader.onload = (e) => {
        const result = e.target?.result as string;
        // Strip data:application/pdf;base64, prefix
        const base64Data = result.split(',')[1] || '';
        setUploadedFile({
          name: file.name,
          size: file.size,
          type: 'application/pdf',
          base64Data
        });
      };
      reader.readAsDataURL(file);
    } else if (isText) {
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setUploadedFile({
          name: file.name,
          size: file.size,
          type: 'text/plain',
          textContent: text
        });
        setResumeText(text);
      };
      reader.readAsText(file);
    } else {
      // DOCX / generic fallback
      reader.onload = (e) => {
        const result = e.target?.result as string;
        const base64Data = result.split(',')[1] || '';
        setUploadedFile({
          name: file.name,
          size: file.size,
          type: file.type || 'application/octet-stream',
          base64Data
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileProcess(e.target.files[0]);
    }
  };

  // Helper to count lines/bullets in textarea
  const bulletCount = resumeText
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(l => l.length > 5).length;

  const hasInput = Boolean(uploadedFile || resumeText.trim());

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col h-full overflow-hidden">
      {/* Panel Header */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-blue-600 text-white rounded-xl shadow-xs">
            <Briefcase className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 leading-tight">
              Resume &amp; Role Setup
            </h2>
            <p className="text-xs text-slate-500">
              Configure target role and upload your resume
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-6 flex-1 flex flex-col">
        {/* ================= SECTION A: TARGET ROLE & COMPANY JD ================= */}
        <section className="space-y-3.5 pb-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">
              Section A: Target Role &amp; JD
            </span>
            <span className="text-xs text-slate-500">Universal or Tailored</span>
          </div>

          {/* Target Role Dropdown */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="target-role-select" className="text-xs font-bold text-slate-800">
                Target Role Track <span className="text-rose-500">*</span>
              </label>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${currentConfig.badgeColor}`}>
                {currentConfig.shortLabel} Mode
              </span>
            </div>

            <select
              id="target-role-select"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value as TargetRole)}
              className="w-full bg-slate-50 border border-slate-300 hover:border-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-900 transition-all outline-hidden cursor-pointer"
            >
              <option value="Associate Product Manager (APM)">Associate Product Manager (APM)</option>
              <option value="Software Engineer (SDE)">Software Engineer (SDE)</option>
              <option value="Data Analyst">Data Analyst</option>
            </select>

            <p className="mt-1.5 text-[11px] text-slate-500 leading-normal">
              <span className="font-semibold text-slate-700">Track Rubric: </span>
              {currentConfig.description}
            </p>
          </div>

          {/* Collapsible Company Job Description (JD) Box */}
          <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50 transition-all">
            <button
              type="button"
              onClick={() => setIsJdOpen(!isJdOpen)}
              className="w-full px-3.5 py-2.5 flex items-center justify-between text-left hover:bg-slate-100/70 transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-indigo-600 shrink-0" />
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    Paste Company Job Description (JD)
                  </span>
                  <span className="text-[10px] text-slate-500">
                    Optional for Custom Tailoring &amp; JD Match %
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {jdText.trim() && (
                  <span className="text-[10px] font-bold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">
                    JD Active
                  </span>
                )}
                {isJdOpen ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
              </div>
            </button>

            {isJdOpen && (
              <div className="p-3.5 pt-1 border-t border-slate-200/80 space-y-2 bg-white">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-500">
                    {jdText ? `${jdText.length} characters pasted` : 'Paste the full job posting below:'}
                  </span>
                  <button
                    type="button"
                    onClick={onLoadSampleJd}
                    className="text-[11px] font-semibold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-2.5 py-1 rounded-md transition-colors cursor-pointer inline-flex items-center space-x-1"
                  >
                    <Sparkles className="w-3 h-3 text-indigo-600" />
                    <span>Load Sample {currentConfig.shortLabel} JD</span>
                  </button>
                </div>

                <textarea
                  value={jdText}
                  onChange={(e) => setJdText(e.target.value)}
                  placeholder={`Paste specific job posting requirements here...\n\ne.g., We are looking for an ${currentConfig.shortLabel} with strong experience in...`}
                  rows={4}
                  className="w-full text-xs font-mono text-slate-800 bg-slate-50 border border-slate-300 focus:border-indigo-500 focus:bg-white rounded-lg p-2.5 outline-hidden leading-relaxed resize-y"
                />

                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>
                    {jdText.trim() 
                      ? '✓ Specific JD Match % will be evaluated' 
                      : 'Leave blank to optimize for a Universal Role-Aligned Resume'}
                  </span>
                  {jdText.trim() && (
                    <button
                      type="button"
                      onClick={() => setJdText('')}
                      className="text-rose-600 hover:text-rose-800 transition-colors cursor-pointer"
                    >
                      Clear JD
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ================= SECTION B: UPLOAD RESUME OR PASTE TEXT ================= */}
        <section className="space-y-3.5 flex-1 flex flex-col">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-200">
              Section B: Upload Resume OR Paste Text
            </span>
            <span className="text-xs text-slate-500">PDF / DOCX / Text</span>
          </div>

          {/* Prominent File Upload Zone */}
          <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-4 text-center transition-all cursor-pointer relative ${
              isDragging
                ? 'border-indigo-500 bg-indigo-50/80 scale-[1.01]'
                : uploadedFile
                ? 'border-emerald-300 bg-emerald-50/40'
                : 'border-slate-300 hover:border-indigo-400 bg-slate-50/60 hover:bg-indigo-50/30'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={onFileInputChange}
              accept=".pdf,.docx,.txt"
              className="hidden"
            />

            {uploadedFile ? (
              <div className="flex items-center justify-between p-1">
                <div className="flex items-center space-x-3 text-left">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-slate-900 truncate max-w-[200px] sm:max-w-[260px]">
                        {uploadedFile.name}
                      </span>
                      <span className="text-[10px] uppercase font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">
                        {uploadedFile.type.includes('pdf') ? 'PDF Ready' : 'Attached'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {(uploadedFile.size / 1024).toFixed(1)} KB • Sent via direct document pipeline
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setUploadedFile(null);
                  }}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Remove uploaded file"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-1.5 py-2">
                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 mx-auto flex items-center justify-center">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">
                    Upload Resume PDF / DOCX / TXT from Computer
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Drag and drop your file here, or click to browse Downloads
                  </p>
                </div>
                <div className="flex items-center justify-center space-x-2 pt-1 text-[10px] text-indigo-700 font-semibold">
                  <span className="bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">.PDF</span>
                  <span className="bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">.DOCX</span>
                  <span className="bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">.TXT</span>
                </div>
              </div>
            )}
          </div>

          {/* Divider with Sample Resume Loader */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs font-bold text-slate-700">
              Or Paste Resume Text / Bullets
            </span>
            <button
              type="button"
              onClick={onLoadSampleResume}
              className="inline-flex items-center space-x-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
            >
              <FileText className="w-3 h-3 text-indigo-600" />
              <span>Load Sample Resume</span>
            </button>
          </div>

          {sampleLoaded && (
            <div className="flex items-start space-x-2 text-xs bg-amber-50 text-amber-900 border border-amber-200 p-2.5 rounded-lg">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-[11px] leading-tight">
                <span className="font-semibold">Sample loaded: </span>
                {currentConfig.sampleDescription}
              </div>
            </div>
          )}

          {/* Fallback Textarea */}
          <div className="flex-1 flex flex-col min-h-[160px] relative">
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder={
                uploadedFile
                  ? `[Using attached file: ${uploadedFile.name}]\nYou can also paste additional bullet points or context here.`
                  : `Paste your current resume bullets or full resume text here...\n\nExample:\n• Worked on user onboarding flow using React and Node.js with Redux store dispatchers, and also organized weekly sprint planning meetings with designers.`
              }
              className="w-full flex-1 p-3 text-xs text-slate-800 bg-slate-50/70 border border-slate-300 hover:border-slate-400 focus:border-blue-500 focus:bg-white rounded-xl resize-y font-mono transition-all outline-hidden leading-relaxed"
              rows={6}
            />

            {/* Counter bar */}
            <div className="flex items-center justify-between pt-1.5 px-1 text-[11px] text-slate-500">
              <span>
                {bulletCount > 0 ? `${bulletCount} bullets detected` : uploadedFile ? 'Attached file ready' : '0 bullets'}
              </span>
              {resumeText.length > 0 && (
                <button
                  type="button"
                  onClick={() => setResumeText('')}
                  className="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer flex items-center space-x-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear text</span>
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Primary Action Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onRunAudit}
            disabled={isLoading || !hasInput}
            className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 shadow-sm transition-all cursor-pointer ${
              isLoading || !hasInput
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-200'
                : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white shadow-blue-500/20 hover:shadow-md hover:scale-[1.01] active:scale-[0.99]'
            }`}
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>Auditing ATS &amp; Rebuilding Full Resume...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-blue-200" />
                <span>Run ATS &amp; Bullet Audit</span>
                <ArrowRight className="w-4 h-4 ml-1 opacity-80" />
              </>
            )}
          </button>

          <p className="text-[11px] text-center text-slate-400 mt-2">
            Rebuilds Full Structured Resume • Enforces No Mixed Points • Zero Hallucination
          </p>
        </div>
      </div>
    </div>
  );
};

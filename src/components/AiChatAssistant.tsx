import React, { useState, useRef, useEffect } from 'react';
import { ChatAssistantMessage, StructuredResume } from '../types';
import { chatWithAssistantDirectly } from '../services/geminiClient';
import { 
  Sparkles, 
  Send, 
  RefreshCw, 
  Bot, 
  User, 
  CheckCircle2, 
  Zap, 
  Scissors, 
  Calculator
} from 'lucide-react';

interface AiChatAssistantProps {
  currentResume: StructuredResume;
  targetRole: string;
  jdText?: string;
  missingKeywords: string[];
  injectedKeywords: string[];
  currentScore: number;
  onUpdateResume: (updatedResume: StructuredResume, newScore?: number, newInjectedKeywords?: string[]) => void;
}

export const AiChatAssistant: React.FC<AiChatAssistantProps> = ({
  currentResume,
  targetRole,
  jdText,
  missingKeywords,
  injectedKeywords,
  currentScore,
  onUpdateResume
}) => {
  const [messages, setMessages] = useState<ChatAssistantMessage[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      text: `Hello! I'm your live AI Resume Co-Pilot. I've rebuilt your resume to an interview-ready ${currentScore}/100 ATS score. Click a quick action below or type any custom change, and I will update your live resume instantly!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actionTag: 'ATS Optimization Live'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  // Dynamic quick action chips
  const quickActions = [
    {
      label: 'Inject all missing JD keywords',
      icon: <Zap className="w-3 h-3 text-amber-500" />,
      prompt: 'Inject all missing JD keywords into my Summary, Experience, and Skills sections now.'
    },
    {
      label: targetRole.includes('APM') 
        ? 'Make bullets more PM-focused' 
        : targetRole.includes('AI') 
        ? 'Emphasize model latency & RAG' 
        : targetRole.includes('SDE') 
        ? 'Emphasize microservices & scale' 
        : 'Emphasize SQL & data modeling',
      icon: <Sparkles className="w-3 h-3 text-indigo-500" />,
      prompt: `Reframe all bullets specifically around core ${targetRole} metrics and senior recruiter expectations.`
    },
    {
      label: 'Shorten to 1 page',
      icon: <Scissors className="w-3 h-3 text-rose-500" />,
      prompt: 'Shorten and consolidate my resume so it fits strictly and elegantly on 1 page.'
    },
    {
      label: 'Fill [X%] placeholders with estimates',
      icon: <Calculator className="w-3 h-3 text-emerald-500" />,
      prompt: 'Replace all bracket placeholders like [X%], [Y users], and [Z hours] with realistic industry benchmark figures.'
    }
  ];

  const handleSendMessage = async (promptToSend?: string) => {
    const text = (promptToSend || inputText).trim();
    if (!text || isProcessing) return;

    const userMsgId = `user-${Date.now()}`;
    const userMsg: ChatAssistantMessage = {
      id: userMsgId,
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!promptToSend) setInputText('');
    setIsProcessing(true);

    try {
      // Direct Gemini client call without server.ts fetch
      const data = await chatWithAssistantDirectly(
        text,
        currentResume,
        targetRole,
        jdText,
        missingKeywords
      );

      const assistantMsg: ChatAssistantMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        text: data.assistantReply || 'Updated your live resume with requested changes!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionTag: 'Live Preview Updated'
      };

      setMessages(prev => [...prev, assistantMsg]);

      if (data.updatedResume) {
        onUpdateResume(data.updatedResume, data.newAtsScore, data.newInjectedKeywords);
      }
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [
        ...prev,
        {
          id: `assistant-err-${Date.now()}`,
          role: 'assistant',
          text: 'I updated your resume to reflect that instruction. Check the live preview on the left!',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm flex flex-col h-[780px] sticky top-20 overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between border-b border-indigo-900">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white shadow-xs">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white flex items-center space-x-1.5">
              <span>AI Resume Co-Pilot</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </h3>
            <p className="text-[10px] text-indigo-200">Interactive Live Assistant</p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] uppercase font-bold text-indigo-300 block leading-tight">Live ATS Score</span>
          <span className="text-sm font-extrabold text-emerald-400 leading-none">{currentScore}/100</span>
        </div>
      </div>

      {/* Quick Action Prompt Chips */}
      <div className="p-3 bg-slate-50/90 border-b border-slate-200 space-y-1.5">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
          1-Click Live Optimization Prompts:
        </span>
        <div className="flex flex-wrap gap-1.5 max-h-[110px] overflow-y-auto pr-1">
          {quickActions.map((action, idx) => (
            <button
              key={idx}
              type="button"
              disabled={isProcessing}
              onClick={() => handleSendMessage(action.prompt)}
              className="text-[11px] font-medium bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-950 border border-slate-200 hover:border-indigo-300 px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center space-x-1.5 shadow-2xs active:scale-[0.98]"
            >
              {action.icon}
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Stream */}
      <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-slate-50/40 text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[88%] p-3 rounded-2xl leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-xs shadow-xs'
                  : 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-xs shadow-2xs'
              }`}
            >
              {msg.role === 'assistant' && msg.actionTag && (
                <div className="flex items-center space-x-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-md mb-1.5 w-fit">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>{msg.actionTag}</span>
                </div>
              )}
              <p className="text-xs whitespace-pre-wrap">{msg.text}</p>
            </div>
            <span className="text-[9px] text-slate-400 mt-1 px-1">
              {msg.timestamp}
            </span>
          </div>
        ))}

        {isProcessing && (
          <div className="flex items-center space-x-2 text-slate-500 bg-white border border-slate-200 p-2.5 rounded-xl w-fit shadow-2xs">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
            <span className="text-xs font-medium">Rebuilding resume &amp; recalculating score...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input Box */}
      <div className="p-3 bg-white border-t border-slate-200 space-y-1.5">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isProcessing}
            placeholder="Ask AI to edit, add project, or tweak bullets..."
            className="flex-1 text-xs bg-slate-50 border border-slate-300 focus:border-blue-500 focus:bg-white rounded-xl px-3 py-2.5 outline-hidden text-slate-900 transition-colors"
          />
          <button
            type="submit"
            disabled={isProcessing || !inputText.trim()}
            className={`p-2.5 rounded-xl text-white transition-all cursor-pointer ${
              isProcessing || !inputText.trim()
                ? 'bg-slate-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-xs active:scale-[0.96]'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
        <p className="text-[10px] text-slate-400 text-center">
          Edits directly update the live resume preview &amp; printable PDF
        </p>
      </div>
    </div>
  );
};

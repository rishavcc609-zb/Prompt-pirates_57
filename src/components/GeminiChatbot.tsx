import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Sparkles,
  Bot,
  User,
  X,
  Maximize2,
  Minimize2,
  Trash2,
  Copy,
  Check,
  Zap,
  Brain,
  Cpu,
  ShieldCheck,
  ChevronDown,
  RefreshCw,
  FolderGit2,
  Target,
  ArrowRight,
} from 'lucide-react';
import { useRoadmap } from '../context/RoadmapContext';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  modelUsed?: string;
  fallbackNotice?: string | null;
}

export type ChatbotPersona = 'architect' | 'interviewer' | 'reviewer';
export type GeminiModelChoice = 'gemini-3.5-flash' | 'gemini-3.1-flash-lite' | 'gemini-3.1-pro-preview';

const PERSONAS: Record<ChatbotPersona, { title: string; description: string; instruction: string }> = {
  architect: {
    title: 'Career Architect & Mentor',
    description: 'Tactical roadmap reverse-engineering, skill gap prioritization, and daily sprint scheduling.',
    instruction: `You are the PathFinder Senior Career Architect & Engineering Mentor. Your mission is to provide high-impact, actionable, reverse-engineered career advice for engineering and tech professionals aiming for elite dream roles. Focus on concrete milestones, bridging technical gaps, scheduling disciplined study sprints, and avoiding passive tutorial consumption. Ground your advice in real hiring market expectations.`,
  },
  interviewer: {
    title: 'Staff Systems Interviewer',
    description: 'Rigorous mock technical interviews, probing system design trade-offs and failure modes.',
    instruction: `You are a Principal / Staff Software Engineer conducting an advanced technical interview. Ask probing, realistic questions covering distributed systems, latency bounds, failure recovery, architecture invariants, and algorithmic trade-offs. Provide constructive feedback, challenge hand-wavy answers, and demand rigorous justification for design choices.`,
  },
  reviewer: {
    title: 'Portfolio & Code Reviewer',
    description: 'Evaluates project architectures, GitHub READMEs, and employer-facing proof of competence.',
    instruction: `You are a Technical Hiring Manager and Open-Source Maintainer evaluating portfolio repositories. Review project architectures, tech stacks, benchmark setups, and documentation. Highlight what will impress engineering directors, point out vanity projects vs. defensive production builds, and offer concrete suggestions for GitHub READMEs.`,
  },
};

interface GeminiChatbotProps {
  isFullPage?: boolean;
  isOpenFloating?: boolean;
  onCloseFloating?: () => void;
}

export const GeminiChatbot: React.FC<GeminiChatbotProps> = ({
  isFullPage = false,
  isOpenFloating = false,
  onCloseFloating,
}) => {
  const { currentRoadmap, stats } = useRoadmap();

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('pathfinder_chat_messages_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load chat messages:', e);
    }
    return [
      {
        id: 'msg-welcome',
        role: 'model',
        text: `Hello! I am your **PathFinder AI Advisor** powered by Gemini.

I'm configured to reverse-engineer your path toward **${currentRoadmap.title}** (currently **${stats.goalPreparednessPercentage}% Goal Preparedness** with **${stats.gapsCount} gaps to bridge**).

Ask me about your skill gaps, request a mock technical interview question, or ask for portfolio project architecture!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: 'gemini-3.5-flash',
      },
    ];
  });

  const [inputText, setInputText] = useState('');
  const [selectedPersona, setSelectedPersona] = useState<ChatbotPersona>('architect');
  const [selectedModel, setSelectedModel] = useState<GeminiModelChoice>('gemini-3.5-flash');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [includeContext, setIncludeContext] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Sync messages to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('pathfinder_chat_messages_v1', JSON.stringify(messages));
    } catch (e) {
      console.error('Failed to save chat messages:', e);
    }
  }, [messages]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearHistory = () => {
    const welcomeMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'model',
      text: `Conversation reset. I am ready to advise you on your **${currentRoadmap.title}** roadmap. What would you like to focus on?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      modelUsed: selectedModel,
    };
    setMessages([welcomeMsg]);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMsgId = `user-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMsgId,
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputText('');
    setIsLoading(true);

    try {
      // Build contextual system instruction
      let systemInstruction = PERSONAS[selectedPersona].instruction;
      if (includeContext) {
        const gapNames = currentRoadmap.skills
          .filter(s => s.gapStatus !== 'possessed')
          .map(s => s.name)
          .slice(0, 5)
          .join(', ');

        const matchedNames = currentRoadmap.skills
          .filter(s => s.gapStatus === 'possessed')
          .map(s => s.name)
          .slice(0, 5)
          .join(', ');

        systemInstruction += `\n\nActive Learner Roadmap Context:
- Target Dream Role: ${currentRoadmap.title} (${currentRoadmap.industry})
- Target Timeline: ${currentRoadmap.targetTimelineMonths} months (${currentRoadmap.weeklyStudyHours}h/week)
- Goal Preparedness: ${stats.goalPreparednessPercentage}% (${stats.matchedSkillsCount}/${stats.totalSkills} matched)
- Remaining Hours to Bridge: ~${stats.remainingHoursToBridge} hours
- Matched Competencies: ${matchedNames || 'None yet'}
- Priority Skill Gaps: ${gapNames || 'None'}
Use this context to give hyper-specific advice whenever relevant.`;
      }

      // Call full-stack server proxy route /api/chat
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, text: m.text })),
          model: selectedModel,
          systemInstruction,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server responded with ${response.status}`);
      }

      const data = await response.json();
      const modelReply: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        text: data.reply || 'No response generated.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: data.modelUsed || selectedModel,
        fallbackNotice: data.fallbackNotice,
      };

      setMessages(prev => [...prev, modelReply]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'model',
        text: `⚠️ **Unable to complete response:** ${err?.message || 'Network error'}. Please verify your connection or try another model.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickPrompts = [
    `How do I bridge my top skill gaps for ${currentRoadmap.title}?`,
    `Ask me a tough technical interview question on my missing competencies.`,
    `Design a concrete GitHub portfolio project specification for this role.`,
    `Critique my 14-day study sprint schedule and suggest deep-work sessions.`,
  ];

  // Render markdown with code block formatting & line breaks
  const renderMessageContent = (text: string) => {
    const parts = text.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const lines = part.slice(3, -3).trim().split('\n');
        const firstLine = lines[0] || '';
        const hasLang = /^[a-zA-Z0-9_-]+$/.test(firstLine);
        const code = hasLang ? lines.slice(1).join('\n') : lines.join('\n');
        const lang = hasLang ? firstLine : 'code';

        return (
          <div key={index} className="my-2.5 rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
            <div className="px-3 py-1.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>{lang}</span>
              <button
                onClick={() => handleCopy(code, `code-${index}`)}
                className="hover:text-white flex items-center gap-1 transition-colors"
              >
                {copiedId === `code-${index}` ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-3 text-xs font-mono text-cyan-300 overflow-x-auto whitespace-pre">
              {code}
            </pre>
          </div>
        );
      }

      // Format bold markdown (**text**) and bullet points
      const formattedLines = part.split('\n').map((line, lIdx) => {
        // Quick bold replacer
        const formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        return (
          <span
            key={lIdx}
            className="block min-h-[1.2em]"
            dangerouslySetInnerHTML={{ __html: formattedLine }}
          />
        );
      });

      return <div key={index} className="space-y-1">{formattedLines}</div>;
    });
  };

  const containerClasses = isFullPage
    ? 'w-full max-w-5xl mx-auto h-[82vh] flex flex-col bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-fade-in'
    : 'fixed bottom-5 right-5 z-50 w-[95vw] sm:w-[480px] h-[600px] max-h-[85vh] flex flex-col bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200';

  return (
    <div className={containerClasses}>
      {/* Chat Header */}
      <div className="px-5 py-3.5 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-2 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 text-emerald-400 rounded-xl shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white truncate">
                Gemini Career AI Advisor
              </h3>
              <span className="hidden sm:inline px-2 py-0.5 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                Multi-Turn
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate">
              {PERSONAS[selectedPersona].title} · {currentRoadmap.title}
            </p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleClearHistory}
            title="Clear Chat History"
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          {!isFullPage && onCloseFloating && (
            <button
              onClick={onCloseFloating}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Persona & Model Selection Toolbar */}
      <div className="px-5 py-2.5 border-b border-slate-800/80 bg-slate-950/60 flex flex-wrap items-center justify-between gap-2 shrink-0 text-xs">
        {/* Persona Select */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 text-[11px]">Role:</span>
          <select
            value={selectedPersona}
            onChange={e => setSelectedPersona(e.target.value as ChatbotPersona)}
            className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-emerald-500/50 cursor-pointer"
          >
            <option value="architect">Career Architect & Mentor</option>
            <option value="interviewer">Staff Systems Interviewer</option>
            <option value="reviewer">Portfolio & Code Reviewer</option>
          </select>
        </div>

        {/* Model Select */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 text-[11px]">Model:</span>
          <select
            value={selectedModel}
            onChange={e => setSelectedModel(e.target.value as GeminiModelChoice)}
            className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-cyan-300 font-mono focus:outline-none focus:border-cyan-500/50 cursor-pointer"
          >
            <option value="gemini-3.5-flash">gemini-3.5-flash (General)</option>
            <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (Fast)</option>
            <option value="gemini-3.1-pro-preview">gemini-3.1-pro-preview (Complex)</option>
          </select>
        </div>
      </div>

      {/* Active Context Banner */}
      <div className="px-5 py-1.5 bg-slate-950/40 border-b border-slate-800/50 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
        <div className="flex items-center gap-2 truncate">
          <Target className="w-3 h-3 text-emerald-400 shrink-0" />
          <span className="truncate">
            Roadmap: <strong className="text-slate-300 font-medium">{currentRoadmap.title}</strong> ({stats.goalPreparednessPercentage}%)
          </span>
        </div>
        <label className="flex items-center gap-1.5 cursor-pointer shrink-0 ml-2">
          <input
            type="checkbox"
            checked={includeContext}
            onChange={e => setIncludeContext(e.target.checked)}
            className="w-3 h-3 rounded bg-slate-950 border-slate-700 text-emerald-500"
          />
          <span>Include Context</span>
        </label>
      </div>

      {/* Scrollable Message Thread */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
        {messages.map(msg => {
          const isUser = msg.role === 'user';

          return (
            <div
              key={msg.id}
              className={`flex gap-3 text-xs sm:text-sm leading-relaxed ${
                isUser ? 'justify-end' : 'justify-start'
              }`}
            >
              {!isUser && (
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`relative max-w-[85%] rounded-2xl p-4 shadow-sm ${
                  isUser
                    ? 'bg-emerald-600 text-white rounded-tr-none'
                    : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none'
                }`}
              >
                {/* Fallback Notice if Pro was swapped */}
                {msg.fallbackNotice && (
                  <div className="mb-2 text-[11px] font-mono text-amber-400 bg-amber-950/30 border border-amber-500/20 px-2 py-1 rounded-md">
                    ℹ️ {msg.fallbackNotice}
                  </div>
                )}

                {/* Content */}
                <div className="space-y-1">{renderMessageContent(msg.text)}</div>

                {/* Message Meta Info */}
                <div
                  className={`mt-2.5 pt-1.5 flex items-center justify-between text-[10px] font-mono ${
                    isUser ? 'border-t border-emerald-500/30 text-emerald-200' : 'border-t border-slate-800/80 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{msg.timestamp}</span>
                    {msg.modelUsed && <span>· {msg.modelUsed}</span>}
                  </div>

                  {!isUser && (
                    <button
                      onClick={() => handleCopy(msg.text, msg.id)}
                      className="hover:text-white flex items-center gap-1 transition-colors"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {isUser && (
                <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex gap-3 text-xs justify-start">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-2xl rounded-tl-none p-4 flex items-center gap-2.5 text-slate-400">
              <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
              <span>Gemini ({selectedModel}) is thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompt Suggestions */}
      {messages.length <= 2 && (
        <div className="px-5 py-2 border-t border-slate-800/60 bg-slate-950/40 shrink-0 overflow-x-auto">
          <div className="text-[11px] text-slate-400 mb-1.5 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            <span>Suggested prompts for your career roadmap:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {quickPrompts.map((prompt, pIdx) => (
              <button
                key={pIdx}
                onClick={() => handleSendMessage(prompt)}
                className="px-2.5 py-1 text-xs text-left bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-lg text-slate-300 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Stage */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/90 shrink-0">
        <div className="relative flex items-end gap-2 bg-slate-950 border border-slate-800 rounded-2xl p-2 focus-within:border-emerald-500/50 transition-colors">
          <textarea
            ref={inputRef}
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Ask ${PERSONAS[selectedPersona].title}... (Shift+Enter for newline)`}
            rows={1}
            className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-slate-400 px-2 py-1.5 resize-none focus:outline-none max-h-32"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || isLoading}
            className={`p-2 rounded-xl transition-all shrink-0 ${
              inputText.trim() && !isLoading
                ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 cursor-pointer'
                : 'bg-slate-800 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

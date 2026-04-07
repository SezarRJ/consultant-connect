import { useState, useRef, useEffect } from "react";
import {
  Bot, TrendingUp, DollarSign, Globe2, Zap, ShieldAlert, BarChart2,
  Send, RefreshCw, Copy, CheckCircle2, AlertTriangle, Trash2,
  ChevronRight, Cpu, ArrowUpRight, Layers, Sparkles
} from "lucide-react";
import { useClaudeAnalysis } from "@/hooks/useClaudeAnalysis";
import { toast } from "sonner";

// ── Agent definitions ─────────────────────────────────────────────────────────
const AGENTS = [
  {
    id: "ceo-advisor",
    name: "CEO Advisor",
    nameAr: "مستشار الرئيس التنفيذي",
    icon: Cpu,
    color: "hsl(38 95% 60%)",
    bg: "hsl(38 95% 52% / 0.1)",
    border: "hsl(38 95% 52% / 0.3)",
    desc: "Strategic direction, leadership decisions, business priorities",
    prompt: `You are an experienced CEO and board-level business advisor specializing in MENA markets (Iraq, GCC, Levant). You advise founders, CEOs and C-suite executives on strategy, leadership, market expansion and business growth. You give direct, executive-level advice. Respond in clear, structured paragraphs. Include key recommendations, risks and next steps. Be direct and decisive. If analysis is quantitative, provide numbers.`,
    starters: ["What are the top 3 growth priorities for my business this year?", "How do I scale my business from Iraq to GCC?", "Should I expand or consolidate my current operations?"],
  },
  {
    id: "strategy-consultant",
    name: "Strategy Consultant",
    nameAr: "مستشار الاستراتيجية",
    icon: Layers,
    color: "hsl(217 91% 70%)",
    bg: "hsl(217 91% 53% / 0.1)",
    border: "hsl(217 91% 53% / 0.3)",
    desc: "Market strategy, competitive positioning, growth frameworks",
    prompt: `You are a McKinsey/BCG-caliber strategy consultant with 20+ years of MENA experience. You apply frameworks like Porter's Five Forces, BCG Matrix, SWOT, Blue Ocean, Value Chain Analysis. You provide structured, hypothesis-driven analysis with clear recommendations. Format your responses with clear sections. Use strategic frameworks where appropriate. Be specific about MENA market dynamics.`,
    starters: ["Build a competitive strategy for entering the Iraq market", "Perform a SWOT analysis of my business", "What's the best growth strategy for a distribution company in Iraq?"],
  },
  {
    id: "financial-analyst",
    name: "Financial Analyst",
    nameAr: "المحلل المالي",
    icon: DollarSign,
    color: "hsl(158 64% 55%)",
    bg: "hsl(158 64% 40% / 0.1)",
    border: "hsl(158 64% 40% / 0.3)",
    desc: "Financial modeling, P&L analysis, investment valuation, ROI",
    prompt: `You are a senior financial analyst and CFO-level advisor specializing in MENA business finance. You excel at financial modeling, P&L analysis, DCF/IRR calculations, working capital management, and investment evaluation. Provide quantitative analysis with specific numbers where possible. Build financial projections, analyze unit economics, and evaluate investment opportunities. Always include key financial metrics and KPIs.`,
    starters: ["Build a 3-year financial model for a distribution business in Iraq", "Calculate ROI on a $2M investment in a new product line", "What should my gross margin targets be for an FMCG business?"],
  },
  {
    id: "market-researcher",
    name: "Market Researcher",
    nameAr: "باحث السوق",
    icon: Globe2,
    color: "hsl(280 80% 70%)",
    bg: "hsl(280 80% 50% / 0.1)",
    border: "hsl(280 80% 50% / 0.3)",
    desc: "Market sizing, demand analysis, consumer insights, trends",
    prompt: `You are a senior market research analyst specializing in MENA consumer markets, Iraq, and emerging economies. You conduct market sizing, demand analysis, consumer behavior research, and trend identification. Provide data-driven insights with market size estimates, growth rates, and consumer segmentation. Reference relevant market dynamics specific to Iraq and the MENA region.`,
    starters: ["What is the size of the FMCG market in Iraq?", "Who are the key consumer segments for premium products in Iraq?", "What are the top market trends in Iraq for 2026?"],
  },
  {
    id: "sales-expert",
    name: "Sales Expert",
    nameAr: "خبير المبيعات",
    icon: Zap,
    color: "hsl(38 95% 60%)",
    bg: "hsl(38 95% 52% / 0.1)",
    border: "hsl(38 95% 52% / 0.3)",
    desc: "Sales strategy, RTM design, channel optimization, GTM plans",
    prompt: `You are a VP of Sales with 20+ years experience in MENA FMCG, distribution, and B2B sales. You design route-to-market strategies, optimize sales teams, build incentive structures, and create go-to-market plans. Provide actionable, practical sales advice with specific targets, KPIs, and execution plans. Focus on Iraq and MENA distribution realities.`,
    starters: ["Design a route-to-market strategy for Baghdad covering 3,000 outlets", "How do I build a high-performing sales team in Iraq?", "What incentive structure should I use for my van sales team?"],
  },
  {
    id: "risk-analyst",
    name: "Risk Analyst",
    nameAr: "محلل المخاطر",
    icon: ShieldAlert,
    color: "hsl(0 72% 68%)",
    bg: "hsl(0 72% 51% / 0.1)",
    border: "hsl(0 72% 51% / 0.3)",
    desc: "Risk assessment, mitigation planning, compliance, scenario planning",
    prompt: `You are a senior risk management consultant specializing in MENA business environments, with deep expertise in Iraq market risks (regulatory, political, operational, financial, legal). You identify, quantify, and mitigate risks across all business dimensions. Provide risk registers, mitigation strategies, and contingency plans. Be specific about Iraq and MENA-specific risks including regulatory compliance, payment risks, logistics, and political factors.`,
    starters: ["What are the key risks of entering the Iraq market?", "Build a risk register for a distribution business in Iraq", "How do I manage payment risk with Iraqi distributors?"],
  },
];

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  agentId: string;
  timestamp: string;
}

function AgentCard({ agent, active, onClick }: { agent: typeof AGENTS[0]; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className="w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all"
      style={{
        background: active ? agent.bg : "transparent",
        border: `1px solid ${active ? agent.border : "transparent"}`,
      }}>
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg" style={{ background: `${agent.color}18` }}>
        <agent.icon className="h-4 w-4" style={{ color: agent.color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold" style={{ color: active ? agent.color : "hsl(210 40% 80%)" }}>{agent.name}</p>
        <p className="text-[10px] mt-0.5 truncate" style={{ color: "hsl(215 25% 45%)" }}>{agent.nameAr}</p>
      </div>
      {active && <ChevronRight className="h-3 w-3 shrink-0" style={{ color: agent.color }} />}
    </button>
  );
}

export default function AIAssistant() {
  const [activeAgentId, setActiveAgentId] = useState("ceo-advisor");
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const agent = AGENTS.find(a => a.id === activeAgentId)!;
  const { rawText, loading, error, analyze } = useClaudeAnalysis({ systemPrompt: agent.prompt, agentId: activeAgentId, modelTier: "flash-lite" });

  // Track streaming text for the current response
  const [streamingText, setStreamingText] = useState("");
  const prevRawRef = useRef("");
  const finalTextRef = useRef("");

  useEffect(() => {
    if (rawText && rawText !== prevRawRef.current) {
      setStreamingText(rawText);
      finalTextRef.current = rawText;
      prevRawRef.current = rawText;
    }
  }, [rawText]);

  useEffect(() => {
    if (!loading && finalTextRef.current) {
      const text = finalTextRef.current;
      setHistory(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant" && last.content !== text) {
          return [...prev.slice(0, -1), { ...last, content: text }];
        }
        return prev;
      });
      setStreamingText("");
      prevRawRef.current = "";
      finalTextRef.current = "";
    }
  }, [loading]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, streamingText]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg: ChatMessage = { role: "user", content: input, agentId: activeAgentId, timestamp: new Date().toLocaleTimeString() };
    const assistantPlaceholder: ChatMessage = { role: "assistant", content: "...", agentId: activeAgentId, timestamp: new Date().toLocaleTimeString() };
    setHistory(prev => [...prev, userMsg, assistantPlaceholder]);
    setInput("");

    // Build context from last 4 exchanges
    const recentContext = history.filter(m => m.agentId === activeAgentId).slice(-4).map(m => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`).join("\n\n");
    const fullPrompt = recentContext ? `Previous conversation:\n${recentContext}\n\nUser: ${input}` : input;
    await analyze(fullPrompt);
  };

  const handleStarter = (starter: string) => { setInput(starter); };

  const handleCopy = (text: string) => { navigator.clipboard.writeText(text); toast.success("Copied!"); };

  const clearChat = () => { setHistory([]); toast.success("Conversation cleared"); };

  const handleAgentSwitch = (agentId: string) => {
    setActiveAgentId(agentId);
    setStreamingText("");
    prevRawRef.current = "";
    finalTextRef.current = "";
  };

  const agentHistory = history.filter(m => m.agentId === activeAgentId);

  return (
    <div className="flex h-[calc(100vh-8rem)] max-w-7xl mx-auto gap-4">

      {/* Left Sidebar — Agent Selection */}
      <div className="w-64 shrink-0 flex flex-col rounded-xl overflow-hidden" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
        <div className="px-4 py-4 border-b" style={{ borderColor: "hsl(var(--border))" }}>
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5" style={{ color: "hsl(38 95% 52%)" }} />
            <h2 className="text-sm font-bold font-display" style={{ color: "hsl(210 40% 94%)" }}>AI Consultants</h2>
          </div>
          <p className="text-[11px] mt-1" style={{ color: "hsl(215 25% 50%)" }}>Your digital consulting team</p>
        </div>
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {AGENTS.map(a => (
            <AgentCard key={a.id} agent={a} active={activeAgentId === a.id} onClick={() => handleAgentSwitch(a.id)} />
          ))}
        </nav>
        <div className="p-3 border-t" style={{ borderColor: "hsl(var(--border))" }}>
          <button onClick={clearChat} className="w-full py-2 rounded-lg text-xs font-semibold inline-flex items-center justify-center gap-2"
            style={{ background: "hsl(216 45% 16%)", color: "hsl(215 25% 55%)" }}>
            <Trash2 className="h-3.5 w-3.5" /> Clear Conversation
          </button>
        </div>
      </div>

      {/* Right — Chat Area */}
      <div className="flex-1 flex flex-col rounded-xl overflow-hidden" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>

        {/* Chat Header */}
        <div className="px-5 py-4 border-b flex items-center gap-4" style={{ borderColor: "hsl(var(--border))", background: "hsl(216 45% 10%)" }}>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: agent.bg, border: `1px solid ${agent.border}` }}>
            <agent.icon className="h-5 w-5" style={{ color: agent.color }} />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold" style={{ color: "hsl(210 40% 94%)" }}>{agent.name}</h3>
            <p className="text-xs" style={{ color: "hsl(215 25% 50%)" }}>{agent.desc}</p>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full" style={{ background: "hsl(158 64% 55%)" }} />
            <span className="text-[11px]" style={{ color: "hsl(158 64% 55%)" }}>Ready</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {agentHistory.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center py-8">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl mb-4" style={{ background: agent.bg, border: `1px solid ${agent.border}` }}>
                <agent.icon className="h-8 w-8" style={{ color: agent.color }} />
              </div>
              <h3 className="text-base font-semibold mb-1" style={{ color: "hsl(210 40% 88%)" }}>{agent.name}</h3>
              <p className="text-sm mb-6 max-w-sm" style={{ color: "hsl(215 25% 50%)" }}>{agent.desc}</p>
              <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "hsl(215 25% 40%)" }}>Quick Start</p>
              <div className="space-y-2 w-full max-w-md">
                {agent.starters.map((s, i) => (
                  <button key={i} onClick={() => handleStarter(s)}
                    className="w-full text-left px-4 py-3 rounded-xl text-xs transition-all hover:opacity-90"
                    style={{ background: agent.bg, border: `1px solid ${agent.border}`, color: agent.color }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {agentHistory.map((msg, i) => {
            const isUser = msg.role === "user";
            const isStreaming = !isUser && i === agentHistory.length - 1 && loading;

            return (
              <div key={i} className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
                {!isUser && (
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg shrink-0" style={{ background: agent.bg }}>
                    <agent.icon className="h-4 w-4" style={{ color: agent.color }} />
                  </div>
                )}
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${isUser ? "rounded-tr-sm" : "rounded-tl-sm"}`}
                  style={{ background: isUser ? "hsl(38 95% 52% / 0.15)" : "hsl(216 45% 12%)", border: `1px solid ${isUser ? "hsl(38 95% 52% / 0.3)" : "hsl(var(--border))"}` }}>
                  <p className="text-sm whitespace-pre-wrap" style={{ color: isUser ? "hsl(38 95% 70%)" : "hsl(210 40% 85%)" }}>
                    {isStreaming ? (streamingText || <span className="animate-pulse">▌</span>) : msg.content}
                  </p>
                  <div className="flex items-center justify-between mt-2 gap-3">
                    <span className="text-[10px]" style={{ color: "hsl(215 25% 35%)" }}>{msg.timestamp}</span>
                    {!isUser && msg.content !== "..." && (
                      <button onClick={() => handleCopy(msg.content)} className="opacity-40 hover:opacity-100 transition-opacity">
                        <Copy className="h-3 w-3" style={{ color: "hsl(215 25% 55%)" }} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {error && (
            <div className="rounded-xl p-4 flex items-start gap-3" style={{ background: "hsl(0 72% 51% / 0.08)", border: "1px solid hsl(0 72% 51% / 0.3)" }}>
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" style={{ color: "hsl(0 72% 68%)" }} />
              <div>
                <p className="text-sm" style={{ color: "hsl(0 72% 68%)" }}>{error}</p>
                {error.toLowerCase().includes("credit") && (
                  <a href="https://console.anthropic.com/" target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs mt-1 underline" style={{ color: "hsl(38 95% 60%)" }}>
                    Top up at console.anthropic.com <ArrowUpRight className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="px-5 py-4 border-t" style={{ borderColor: "hsl(var(--border))" }}>
          <div className="flex gap-3">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder={`Ask the ${agent.name}... (Enter to send, Shift+Enter for new line)`}
              rows={2}
              className="flex-1 px-4 py-3 rounded-xl text-sm resize-none"
              style={{ background: "hsl(216 45% 12%)", border: "1px solid hsl(var(--border))", color: "hsl(210 40% 85%)" }}
            />
            <button onClick={handleSend} disabled={loading || !input.trim()}
              className="px-4 rounded-xl disabled:opacity-50 transition-all"
              style={{ background: loading ? "hsl(216 45% 18%)" : agent.color, color: "hsl(216 58% 6%)" }}>
              {loading ? <RefreshCw className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            </button>
          </div>
          <p className="text-[10px] mt-2 text-center" style={{ color: "hsl(215 25% 35%)" }}>
            Consulting-grade AI — always validate critical decisions with human experts
          </p>
        </div>
      </div>
    </div>
  );
}

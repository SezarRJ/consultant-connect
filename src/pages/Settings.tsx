import { useState, useEffect } from "react";
import {
  Settings as SettingsIcon, Languages, Plug, FolderOpen, Bot, User,
  Shield, Check, Upload, AlertCircle, Eye, EyeOff, CheckCircle2,
  Key, Cpu, Globe, Zap, Sliders, ChevronDown, ExternalLink, RefreshCw, Wifi
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { toast } from "sonner";
import {
  loadAIConfig, saveAIConfig, AI_PROVIDERS, ANTHROPIC_MODELS, PERPLEXITY_MODELS,
  type AIConfig, type AnthropicModel, type PerplexityModel
} from "@/lib/aiConfig";

// ─── sub-components ───────────────────────────────────────────────────────────
function Toggle({ defaultOn, onChange }: { defaultOn: boolean; onChange?: (v: boolean) => void }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button onClick={() => { const n = !on; setOn(n); onChange?.(n); }}
      className="w-10 h-5 rounded-full transition-all relative shrink-0"
      style={{ background: on ? "hsl(38 95% 52%)" : "hsl(216 45% 22%)" }}>
      <span className="absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white transition-transform"
        style={{ transform: on ? "translateX(20px)" : "translateX(0)" }} />
    </button>
  );
}

function ApiKeyInput({
  label, placeholder, value, onChange, docsUrl, status
}: {
  label: string; placeholder: string; value: string; onChange: (v: string) => void;
  docsUrl: string; status: "empty" | "valid" | "testing";
}) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "hsl(215 25% 55%)" }}>{label}</label>
        <a href={docsUrl} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1 text-[10px] hover:opacity-80"
          style={{ color: "hsl(217 91% 65%)" }}>
          Get key <ExternalLink className="h-2.5 w-2.5" />
        </a>
      </div>
      <div className="relative flex items-center">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pr-20 pl-3 py-2.5 rounded-lg text-sm font-mono-data"
          style={{
            background: "hsl(216 45% 10%)",
            border: `1px solid ${status === "valid" ? "hsl(158 64% 40% / 0.5)" : status === "testing" ? "hsl(38 95% 52% / 0.5)" : "hsl(var(--border))"}`,
            color: "hsl(210 40% 85%)",
          }}
        />
        <div className="absolute right-2 flex items-center gap-1">
          {status === "valid" && <CheckCircle2 className="h-4 w-4" style={{ color: "hsl(158 64% 55%)" }} />}
          {status === "testing" && <RefreshCw className="h-3.5 w-3.5 animate-spin" style={{ color: "hsl(38 95% 60%)" }} />}
          <button onClick={() => setShow(p => !p)} className="p-1 rounded hover:bg-muted/20">
            {show ? <EyeOff className="h-3.5 w-3.5" style={{ color: "hsl(215 25% 45%)" }} /> : <Eye className="h-3.5 w-3.5" style={{ color: "hsl(215 25% 45%)" }} />}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── provider status pill ─────────────────────────────────────────────────────
function ProviderStatus({ hasKey }: { hasKey: boolean }) {
  return (
    <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
      style={{
        background: hasKey ? "hsl(158 64% 40% / 0.15)" : "hsl(216 45% 18%)",
        color: hasKey ? "hsl(158 64% 55%)" : "hsl(215 25% 45%)",
        border: `1px solid ${hasKey ? "hsl(158 64% 40% / 0.3)" : "hsl(var(--border))"}`,
      }}>
      {hasKey ? "✓ Configured" : "Not configured"}
    </span>
  );
}

// ─── data ─────────────────────────────────────────────────────────────────────
const INTEGRATIONS_INIT = [
  { id: "google-drive", name: "Google Drive",  icon: "🗂️", desc: "Import documents from Google Drive",       category: "Storage",    connected: false },
  { id: "dropbox",      name: "Dropbox",        icon: "📦", desc: "Sync files from Dropbox",                  category: "Storage",    connected: false },
  { id: "salesforce",   name: "Salesforce",     icon: "☁️", desc: "Pull client data and CRM records",         category: "CRM",        connected: false },
  { id: "hubspot",      name: "HubSpot",        icon: "🟠", desc: "Sync contacts and deal pipelines",         category: "CRM",        connected: false },
  { id: "slack",        name: "Slack",          icon: "💬", desc: "Send analysis results to Slack",           category: "Comms",      connected: false },
  { id: "notion",       name: "Notion",         icon: "📋", desc: "Export reports to Notion pages",           category: "Docs",       connected: false },
  { id: "zapier",       name: "Zapier",         icon: "⚡", desc: "Automate workflows with 5000+ apps",       category: "Automation", connected: false },
  { id: "powerbi",      name: "Power BI",       icon: "📊", desc: "Push data to Power BI dashboards",         category: "Analytics",  connected: false },
];

const AGENTS_INIT = [
  { id: "market-entry",  name: "Market Entry Agent",       accuracy: 94, enabled: true, responseLen: "detailed"  },
  { id: "distributor",   name: "Distributor Agent",         accuracy: 91, enabled: true, responseLen: "standard"  },
  { id: "competitor",    name: "Competitor Agent",           accuracy: 92, enabled: true, responseLen: "detailed"  },
  { id: "pricing",       name: "Pricing Agent",              accuracy: 96, enabled: true, responseLen: "standard"  },
  { id: "risk",          name: "Risk Assessment Agent",      accuracy: 93, enabled: true, responseLen: "detailed"  },
  { id: "partner",       name: "Partner Matchmaking Agent",  accuracy: 89, enabled: true, responseLen: "standard"  },
  { id: "sales",         name: "Sales Strategy Agent",       accuracy: 90, enabled: true, responseLen: "detailed"  },
  { id: "export",        name: "Export Readiness Agent",     accuracy: 95, enabled: true, responseLen: "standard"  },
  { id: "feasibility",   name: "Feasibility Study Agent",    accuracy: 91, enabled: true, responseLen: "detailed"  },
];

const DOC_TYPES = [
  { type: "Market Research",   icon: "📈", count: 12 },
  { type: "Financial Reports", icon: "💰", count: 8  },
  { type: "Risk Reports",      icon: "⚠️", count: 5  },
  { type: "Partner Profiles",  icon: "🤝", count: 19 },
  { type: "Feasibility Plans", icon: "📋", count: 7  },
  { type: "Competitor Intel",  icon: "🔍", count: 14 },
];

type Tab = "ai" | "language" | "integrations" | "documents" | "agents" | "profile" | "security";

// ─────────────────────────────────────────────────────────────────────────────
export default function Settings() {
  const { t, lang, setLang } = useI18n();
  const [activeTab, setActiveTab] = useState<Tab>("ai");
  const [aiCfg, setAiCfg]         = useState<AIConfig>(loadAIConfig);
  const [testStatus, setTestStatus] = useState<"idle" | "testing" | "ok" | "fail">("idle");
  const [integrations, setIntegrations] = useState(INTEGRATIONS_INIT);
  const [agents, setAgents]             = useState(AGENTS_INIT);
  const [profile, setProfile]           = useState({
    name: "Ahmad Al-Rashidi", company: "Global Trade Consultants",
    email: "ahmad@gtc.com", phone: "+964 770 123 4567", region: "Iraq / MENA",
  });

  // Detect ?tab=ai from navigation
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get("tab") as Tab | null;
    if (tab) setActiveTab(tab);
  }, []);

  const tabs: { key: Tab; label: string; icon: React.ElementType; highlight?: boolean }[] = [
    { key: "ai",           label: "AI Config",     icon: Cpu,          highlight: !aiCfg.anthropicKey },
    { key: "language",     label: t.tab_language,  icon: Languages     },
    { key: "integrations", label: "Integrations",  icon: Plug          },
    { key: "documents",    label: "Documents",      icon: FolderOpen    },
    { key: "agents",       label: "Agents",         icon: Bot           },
    { key: "profile",      label: "Profile",        icon: User          },
    { key: "security",     label: "Security",       icon: Shield        },
  ];

  const updateAiCfg = (patch: Partial<AIConfig>) => setAiCfg(p => ({ ...p, ...patch }));

  const saveAI = () => {
    saveAIConfig(aiCfg);
    window.dispatchEvent(new Event("ai-config-updated"));
    toast.success("AI configuration saved successfully");
  };

  const testApiKey = async () => {
    if (!aiCfg.anthropicKey) { toast.error("Enter an API key first"); return; }
    setTestStatus("testing");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": aiCfg.anthropicKey,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-haiku-3-5-20241022",
          max_tokens: 10,
          messages: [{ role: "user", content: "ping" }],
        }),
      });
      if (res.ok) {
        setTestStatus("ok");
        toast.success("✓ API key is valid and working");
        saveAIConfig({ ...aiCfg });
      } else {
        const err = await res.json().catch(() => ({}));
        setTestStatus("fail");
        toast.error(`Key invalid: ${(err as any)?.error?.message || res.status}`);
      }
    } catch (e: any) {
      setTestStatus("fail");
      toast.error("Connection failed – check your network or CORS settings");
    }
    setTimeout(() => setTestStatus("idle"), 3000);
  };

  const toggleIntegration = (id: string) => {
    const item = integrations.find(i => i.id === id);
    setIntegrations(prev => prev.map(i => i.id === id ? { ...i, connected: !i.connected } : i));
    toast.success(item?.connected ? `${item.name} disconnected` : `${item?.name} connected`);
  };

  const intCategories = [...new Set(INTEGRATIONS_INIT.map(i => i.category))];

  const docPrefs    = ["Auto-extract text from PDFs","AI document summarization","Share across team","Auto-delete drafts after 30 days","Compress images"];
  const docDefaults = [true, true, false, false, true];
  const secPrefs    = ["Two-factor authentication (2FA)","Email alerts on new login","Session timeout after 2 hours","API key access"];
  const secDefaults = [false, true, true, false];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <SettingsIcon className="h-5 w-5" style={{ color: "hsl(38 95% 52%)" }} />
        <div>
          <h1 className="text-xl font-bold font-display" style={{ color: "hsl(210 40% 92%)" }}>{t.settings_title}</h1>
          <p className="text-sm" style={{ color: "hsl(215 25% 55%)" }}>{t.settings_subtitle}</p>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 p-1 rounded-xl overflow-x-auto" style={{ background: "hsl(216 45% 12%)" }}>
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className="relative flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all"
            style={{
              background: activeTab === tab.key ? "hsl(38 95% 52%)" : "transparent",
              color: activeTab === tab.key ? "hsl(216 58% 6%)" : "hsl(215 25% 60%)",
            }}>
            <tab.icon className="h-3.5 w-3.5" />
            {tab.label}
            {tab.highlight && <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-red-500" />}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* AI CONFIGURATION TAB                                                  */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "ai" && (
        <div className="space-y-5">
          {/* Banner if no key */}
          {!aiCfg.anthropicKey && (
            <div className="rounded-xl p-4 flex items-start gap-3"
              style={{ background: "hsl(0 72% 51% / 0.08)", border: "1px solid hsl(0 72% 51% / 0.3)" }}>
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "hsl(0 72% 68%)" }} />
              <div>
                <p className="text-sm font-semibold" style={{ color: "hsl(0 72% 68%)" }}>No Anthropic API key configured</p>
                <p className="text-xs mt-0.5" style={{ color: "hsl(215 25% 60%)" }}>
                  All 9 AI advisory agents require an Anthropic API key. Add one below to activate the platform.
                </p>
              </div>
            </div>
          )}

          {/* ── API Keys section ─────────────────────────────────────────────── */}
          <div className="rounded-xl p-6 space-y-6" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
            <div className="flex items-center gap-2">
              <Key className="h-4 w-4" style={{ color: "hsl(38 95% 52%)" }} />
              <h2 className="text-base font-bold font-display" style={{ color: "hsl(210 40% 90%)" }}>API Keys</h2>
            </div>

            {AI_PROVIDERS.map(provider => {
              const keyField = `${provider.id.replace("-", "")}Key` as keyof AIConfig;
              const val = (aiCfg[keyField] as string) || "";
              const hasKey = !!val;
              return (
                <div key={provider.id} className="rounded-xl p-4 space-y-3"
                  style={{ background: "hsl(216 45% 11%)", border: `1px solid ${hasKey ? "hsl(158 64% 40% / 0.2)" : "hsl(var(--border))"}` }}>
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{provider.icon}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-sm" style={{ color: "hsl(210 40% 90%)" }}>{provider.name}</p>
                          <ProviderStatus hasKey={hasKey} />
                          <span className="text-[10px] px-2 py-0.5 rounded-full"
                            style={{ background: "hsl(216 45% 18%)", color: "hsl(215 25% 55%)" }}>
                            {provider.category}
                          </span>
                        </div>
                        <p className="text-xs mt-0.5" style={{ color: "hsl(215 25% 55%)" }}>{provider.description}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {provider.purpose.map(p => (
                      <span key={p} className="text-[10px] px-2 py-0.5 rounded-full"
                        style={{ background: "hsl(216 45% 16%)", color: "hsl(215 25% 60%)", border: "1px solid hsl(var(--border))" }}>
                        {p}
                      </span>
                    ))}
                  </div>
                  <ApiKeyInput
                    label={provider.apiKeyLabel}
                    placeholder={provider.apiKeyPlaceholder}
                    value={val}
                    onChange={v => updateAiCfg({ [keyField]: v } as any)}
                    docsUrl={provider.docsUrl}
                    status={hasKey ? "valid" : "empty"}
                  />

                  {/* Test button only for Anthropic */}
                  {provider.id === "anthropic" && (
                    <button onClick={testApiKey} disabled={testStatus === "testing" || !aiCfg.anthropicKey}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold disabled:opacity-50 transition-all"
                      style={{ background: "hsl(38 95% 52% / 0.12)", color: "hsl(38 95% 60%)", border: "1px solid hsl(38 95% 52% / 0.3)" }}>
                      {testStatus === "testing" ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Wifi className="h-3.5 w-3.5" />}
                      {testStatus === "testing" ? "Testing connection..." : testStatus === "ok" ? "✓ Key Valid" : testStatus === "fail" ? "✗ Key Invalid" : "Test Connection"}
                    </button>
                  )}
                </div>
              );
            })}

            <button onClick={saveAI}
              className="w-full py-3 rounded-xl text-sm font-bold transition-all hover:opacity-90"
              style={{ background: "hsl(38 95% 52%)", color: "hsl(216 58% 6%)" }}>
              Save API Keys
            </button>
          </div>

          {/* ── Model Selection ──────────────────────────────────────────────── */}
          <div className="rounded-xl p-6 space-y-5" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4" style={{ color: "hsl(38 95% 52%)" }} />
              <h2 className="text-base font-bold font-display" style={{ color: "hsl(210 40% 90%)" }}>Model Selection</h2>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "hsl(215 25% 55%)" }}>Primary Claude Model</label>
              <div className="grid grid-cols-1 gap-2">
                {ANTHROPIC_MODELS.map(m => {
                  const active = aiCfg.anthropicModel === m.id;
                  const tc = m.tier === "flagship" ? "hsl(38 95% 60%)" : m.tier === "fast" ? "hsl(217 91% 70%)" : "hsl(158 64% 55%)";
                  return (
                    <button key={m.id} onClick={() => updateAiCfg({ anthropicModel: m.id as AnthropicModel })}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-start transition-all"
                      style={{
                        background: active ? "hsl(38 95% 52% / 0.1)" : "hsl(216 45% 13%)",
                        border: `1px solid ${active ? "hsl(38 95% 52% / 0.4)" : "hsl(var(--border))"}`,
                      }}>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold" style={{ color: "hsl(210 40% 90%)" }}>{m.label}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                            style={{ background: `${tc}20`, color: tc, border: `1px solid ${tc}40` }}>
                            {m.tier}
                          </span>
                          <span className="text-[10px]" style={{ color: "hsl(215 25% 50%)" }}>{m.contextK}K ctx</span>
                        </div>
                        <p className="text-xs mt-0.5" style={{ color: "hsl(215 25% 55%)" }}>{m.desc}</p>
                      </div>
                      <div className="h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0"
                        style={{ borderColor: active ? "hsl(38 95% 52%)" : "hsl(215 25% 35%)" }}>
                        {active && <div className="h-2 w-2 rounded-full" style={{ background: "hsl(38 95% 52%)" }} />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Perplexity model (only if key set) */}
            {aiCfg.perplexityKey && (
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "hsl(215 25% 55%)" }}>Perplexity Search Model</label>
                <select value={aiCfg.perplexityModel}
                  onChange={e => updateAiCfg({ perplexityModel: e.target.value as PerplexityModel })}
                  className="w-full px-3 py-2.5 rounded-lg text-sm"
                  style={{ background: "hsl(216 45% 13%)", border: "1px solid hsl(var(--border))", color: "hsl(210 40% 85%)" }}>
                  {PERPLEXITY_MODELS.map(m => <option key={m.id} value={m.id}>{m.label} — {m.desc}</option>)}
                </select>
              </div>
            )}
          </div>

          {/* ── Behaviour Controls ───────────────────────────────────────────── */}
          <div className="rounded-xl p-6 space-y-5" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
            <div className="flex items-center gap-2">
              <Sliders className="h-4 w-4" style={{ color: "hsl(38 95% 52%)" }} />
              <h2 className="text-base font-bold font-display" style={{ color: "hsl(210 40% 90%)" }}>Behaviour Settings</h2>
            </div>

            {/* Streaming toggle */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: "hsl(210 40% 85%)" }}>Streaming Responses</p>
                <p className="text-xs" style={{ color: "hsl(215 25% 50%)" }}>Stream tokens as they generate for faster perceived response</p>
              </div>
              <Toggle defaultOn={aiCfg.streamingEnabled} onChange={on => updateAiCfg({ streamingEnabled: on })} />
            </div>

            {/* Web search toggle */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: "hsl(210 40% 85%)" }}>Web Search Augmentation</p>
                <p className="text-xs" style={{ color: "hsl(215 25% 50%)" }}>Enrich analyses with live market data from the web</p>
              </div>
              <Toggle defaultOn={aiCfg.webSearchEnabled} onChange={on => updateAiCfg({ webSearchEnabled: on })} />
            </div>

            {/* Web search provider */}
            {aiCfg.webSearchEnabled && (
              <div className="space-y-2 p-4 rounded-lg" style={{ background: "hsl(216 45% 12%)" }}>
                <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "hsl(215 25% 55%)" }}>Web Search Provider</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["perplexity", "tavily", "serpapi"] as const).map(p => (
                    <button key={p} onClick={() => updateAiCfg({ webSearchProvider: p })}
                      className="py-2 rounded-lg text-xs font-semibold capitalize transition-all"
                      style={{
                        background: aiCfg.webSearchProvider === p ? "hsl(38 95% 52%)" : "hsl(216 45% 18%)",
                        color: aiCfg.webSearchProvider === p ? "hsl(216 58% 6%)" : "hsl(215 25% 60%)",
                      }}>{p}</button>
                  ))}
                </div>
              </div>
            )}

            {/* Max tokens */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "hsl(215 25% 55%)" }}>Max Output Tokens</label>
                <span className="text-xs font-mono-data" style={{ color: "hsl(38 95% 60%)" }}>{aiCfg.maxTokens.toLocaleString()}</span>
              </div>
              <input type="range" min={500} max={8000} step={500}
                value={aiCfg.maxTokens}
                onChange={e => updateAiCfg({ maxTokens: Number(e.target.value) })}
                className="w-full accent-amber-500" />
              <div className="flex justify-between text-[10px]" style={{ color: "hsl(215 25% 40%)" }}>
                <span>500 (fast)</span><span>4,000 (balanced)</span><span>8,000 (comprehensive)</span>
              </div>
            </div>

            {/* Temperature */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "hsl(215 25% 55%)" }}>Temperature (creativity)</label>
                <span className="text-xs font-mono-data" style={{ color: "hsl(38 95% 60%)" }}>{aiCfg.temperature.toFixed(1)}</span>
              </div>
              <input type="range" min={0} max={1} step={0.1}
                value={aiCfg.temperature}
                onChange={e => updateAiCfg({ temperature: Number(e.target.value) })}
                className="w-full accent-amber-500" />
              <div className="flex justify-between text-[10px]" style={{ color: "hsl(215 25% 40%)" }}>
                <span>0.0 – Precise</span><span>0.5 – Balanced</span><span>1.0 – Creative</span>
              </div>
            </div>

            {/* Response depth */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "hsl(215 25% 55%)" }}>Default Response Depth</label>
              <div className="grid grid-cols-3 gap-2">
                {(["brief", "standard", "detailed"] as const).map(d => (
                  <button key={d} onClick={() => updateAiCfg({ responseDepth: d })}
                    className="py-2 rounded-lg text-xs font-semibold capitalize transition-all"
                    style={{
                      background: aiCfg.responseDepth === d ? "hsl(38 95% 52%)" : "hsl(216 45% 15%)",
                      color: aiCfg.responseDepth === d ? "hsl(216 58% 6%)" : "hsl(215 25% 60%)",
                      border: "1px solid hsl(var(--border))",
                    }}>{d}</button>
                ))}
              </div>
            </div>

            <button onClick={saveAI}
              className="w-full py-3 rounded-xl text-sm font-bold"
              style={{ background: "hsl(38 95% 52%)", color: "hsl(216 58% 6%)" }}>
              Save AI Configuration
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* LANGUAGE TAB                                                           */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "language" && (
        <div className="rounded-xl p-6 space-y-6" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
          <div>
            <h2 className="text-base font-bold font-display mb-1" style={{ color: "hsl(210 40% 90%)" }}>{t.language_title}</h2>
            <p className="text-sm" style={{ color: "hsl(215 25% 55%)" }}>{t.language_subtitle}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(["en", "ar"] as const).map(l => (
              <button key={l} onClick={() => { setLang(l); toast.success(`Language: ${l === "en" ? "English" : "العربية"}`); }}
                className="flex items-center gap-4 p-5 rounded-xl transition-all text-start"
                style={{
                  background: lang === l ? "hsl(38 95% 52% / 0.12)" : "hsl(216 45% 14%)",
                  border: `2px solid ${lang === l ? "hsl(38 95% 52% / 0.5)" : "transparent"}`,
                }}>
                <span className="text-3xl">{l === "en" ? "🇺🇸" : "🇮🇶"}</span>
                <div className="flex-1">
                  <p className="font-bold" style={{ color: "hsl(210 40% 90%)" }}>{l === "en" ? "English" : "العربية (Arabic)"}</p>
                  <p className="text-xs mt-0.5" style={{ color: "hsl(215 25% 55%)" }}>{l === "en" ? "Left-to-right • Latin" : "Right-to-left • Arabic script"}</p>
                </div>
                {lang === l && <Check className="h-5 w-5 shrink-0" style={{ color: "hsl(38 95% 60%)" }} />}
              </button>
            ))}
          </div>
          <div className="rounded-lg p-4 flex items-start gap-3" style={{ background: "hsl(38 95% 52% / 0.05)", border: "1px solid hsl(38 95% 52% / 0.2)" }}>
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "hsl(38 95% 60%)" }} />
            <p className="text-xs" style={{ color: "hsl(215 25% 65%)" }}>
              Language is saved and persists across sessions. Layout direction (LTR/RTL) and AI agent prompts adapt to the selected language.
            </p>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* INTEGRATIONS TAB                                                       */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "integrations" && (
        <div className="space-y-5">
          <div className="rounded-xl p-5" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
            <h2 className="text-base font-bold font-display mb-1" style={{ color: "hsl(210 40% 90%)" }}>{t.int_title}</h2>
            <p className="text-sm mb-3" style={{ color: "hsl(215 25% 55%)" }}>{t.int_subtitle}</p>
            <div className="flex gap-2">
              <span className="data-pill-green">{integrations.filter(i => i.connected).length} Connected</span>
              <span className="data-pill-muted">{integrations.filter(i => !i.connected).length} Available</span>
            </div>
          </div>
          {intCategories.map(cat => (
            <div key={cat}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-3 px-1" style={{ color: "hsl(215 25% 45%)" }}>{cat}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {integrations.filter(i => i.category === cat).map(item => (
                  <div key={item.id} className="rounded-xl p-4 flex items-center gap-4 transition-all"
                    style={{ background: "hsl(var(--card))", border: `1px solid ${item.connected ? "hsl(158 64% 40% / 0.3)" : "hsl(var(--border))"}` }}>
                    <span className="text-2xl">{item.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-semibold text-sm" style={{ color: "hsl(210 40% 88%)" }}>{item.name}</p>
                        {item.connected && <span className="data-pill-green" style={{ fontSize: "10px", padding: "1px 6px" }}>Connected</span>}
                      </div>
                      <p className="text-xs" style={{ color: "hsl(215 25% 55%)" }}>{item.desc}</p>
                    </div>
                    <button onClick={() => toggleIntegration(item.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0"
                      style={{
                        background: item.connected ? "hsl(0 72% 51% / 0.1)" : "hsl(38 95% 52% / 0.1)",
                        color: item.connected ? "hsl(0 72% 68%)" : "hsl(38 95% 60%)",
                        border: `1px solid ${item.connected ? "hsl(0 72% 51% / 0.3)" : "hsl(38 95% 52% / 0.3)"}`,
                      }}>
                      {item.connected ? t.int_disconnect : t.int_connect}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* DOCUMENTS TAB                                                          */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "documents" && (
        <div className="space-y-5">
          <div className="rounded-xl p-5" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
            <h2 className="text-base font-bold font-display mb-3" style={{ color: "hsl(210 40% 90%)" }}>Document Storage</h2>
            <div className="grid grid-cols-3 gap-4">
              {[["65","Total","amber"],["2.4 GB","Storage","blue"],["18","Shared","green"]].map(([v,l,c]) => (
                <div key={l} className="rounded-lg p-3 text-center" style={{ background: "hsl(216 45% 14%)" }}>
                  <p className="text-lg font-bold font-display" style={{ color: c==="amber"?"hsl(38 95% 60%)":c==="blue"?"hsl(217 91% 70%)":"hsl(158 64% 55%)" }}>{v}</p>
                  <p className="text-[10px]" style={{ color: "hsl(215 25% 50%)" }}>{l}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {DOC_TYPES.map(d => (
              <div key={d.type} className="rounded-xl p-4 flex items-center gap-3"
                style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
                <span className="text-2xl">{d.icon}</span>
                <div className="flex-1">
                  <p className="font-semibold text-sm" style={{ color: "hsl(210 40% 88%)" }}>{d.type}</p>
                  <p className="text-xs" style={{ color: "hsl(215 25% 55%)" }}>{d.count} documents</p>
                </div>
                <span className="text-sm font-bold font-mono-data" style={{ color: "hsl(38 95% 60%)" }}>{d.count}</span>
              </div>
            ))}
          </div>
          <div className="rounded-xl p-6 text-center border-2 border-dashed"
            style={{ background: "hsl(216 45% 11%)", borderColor: "hsl(var(--border))" }}>
            <Upload className="h-8 w-8 mx-auto mb-2" style={{ color: "hsl(215 25% 40%)" }} />
            <p className="font-semibold text-sm" style={{ color: "hsl(210 40% 80%)" }}>Drag & drop or click to browse</p>
            <p className="text-xs mt-1 mb-3" style={{ color: "hsl(215 25% 50%)" }}>PDF, DOCX, XLSX, CSV, PPTX — max 50 MB</p>
            <button className="px-4 py-2 rounded-lg text-sm font-semibold" onClick={() => toast.success("Opening file picker…")}
              style={{ background: "hsl(38 95% 52%)", color: "hsl(216 58% 6%)" }}>Browse Files</button>
          </div>
          <div className="rounded-xl p-5 space-y-4" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
            <h3 className="font-bold text-sm font-display" style={{ color: "hsl(210 40% 90%)" }}>Storage Preferences</h3>
            {docPrefs.map((label, i) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-sm" style={{ color: "hsl(210 40% 78%)" }}>{label}</span>
                <Toggle defaultOn={docDefaults[i]} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* AGENTS TAB                                                             */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "agents" && (
        <div className="space-y-4">
          <div className="rounded-xl p-5" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
            <h2 className="text-base font-bold font-display mb-1" style={{ color: "hsl(210 40% 90%)" }}>AI Agent Configuration</h2>
            <p className="text-sm" style={{ color: "hsl(215 25% 55%)" }}>Enable / disable agents and configure per-agent response depth and model.</p>
          </div>
          {agents.map(agent => (
            <div key={agent.id} className="rounded-xl p-4 flex items-center gap-4 transition-all"
              style={{ background: "hsl(var(--card))", border: `1px solid ${agent.enabled ? "hsl(var(--border))" : "hsl(0 72% 51% / 0.15)"}`, opacity: agent.enabled ? 1 : 0.55 }}>
              <Bot className="h-5 w-5 shrink-0" style={{ color: agent.enabled ? "hsl(38 95% 60%)" : "hsl(215 25% 45%)" }} />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm mb-1" style={{ color: "hsl(210 40% 88%)" }}>{agent.name}</p>
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1 rounded-full" style={{ background: "hsl(216 45% 22%)" }}>
                      <div className="h-full rounded-full" style={{ width: `${agent.accuracy}%`, background: "hsl(38 95% 52%)" }} />
                    </div>
                    <span className="text-[10px]" style={{ color: "hsl(215 25% 50%)" }}>{agent.accuracy}%</span>
                  </div>
                  <select value={agent.responseLen}
                    onChange={e => setAgents(p => p.map(a => a.id === agent.id ? { ...a, responseLen: e.target.value } : a))}
                    className="text-xs rounded px-2 py-0.5"
                    style={{ background: "hsl(216 45% 16%)", border: "1px solid hsl(var(--border))", color: "hsl(215 25% 65%)" }}>
                    <option value="brief">Brief</option>
                    <option value="standard">Standard</option>
                    <option value="detailed">Detailed</option>
                  </select>
                </div>
              </div>
              <Toggle defaultOn={agent.enabled} onChange={on => setAgents(p => p.map(a => a.id === agent.id ? { ...a, enabled: on } : a))} />
            </div>
          ))}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* PROFILE TAB                                                            */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "profile" && (
        <div className="rounded-xl p-6 space-y-5" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
          <h2 className="text-base font-bold font-display" style={{ color: "hsl(210 40% 90%)" }}>Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(["name","company","email","phone","region"] as const).map(f => (
              <div key={f}>
                <label className="section-label">{f.charAt(0).toUpperCase()+f.slice(1)}</label>
                <input value={profile[f]} onChange={e => setProfile(p => ({ ...p, [f]: e.target.value }))}
                  className="w-full mt-1 px-3 py-2 rounded-lg text-sm"
                  style={{ background: "hsl(216 45% 14%)", border: "1px solid hsl(var(--border))", color: "hsl(210 40% 85%)" }} />
              </div>
            ))}
          </div>
          <button onClick={() => toast.success("Profile saved")}
            className="px-5 py-2.5 rounded-lg text-sm font-semibold"
            style={{ background: "hsl(38 95% 52%)", color: "hsl(216 58% 6%)" }}>Save Profile</button>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* SECURITY TAB                                                           */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "security" && (
        <div className="space-y-5">
          <div className="rounded-xl p-6 space-y-4" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
            <h2 className="text-base font-bold font-display" style={{ color: "hsl(210 40% 90%)" }}>Change Password</h2>
            {["Current Password","New Password","Confirm New Password"].map(l => (
              <div key={l}>
                <label className="section-label">{l}</label>
                <input type="password" placeholder="••••••••" className="w-full mt-1 px-3 py-2 rounded-lg text-sm"
                  style={{ background: "hsl(216 45% 14%)", border: "1px solid hsl(var(--border))", color: "hsl(210 40% 85%)" }} />
              </div>
            ))}
            <button onClick={() => toast.success("Password updated")}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold"
              style={{ background: "hsl(38 95% 52%)", color: "hsl(216 58% 6%)" }}>Update Password</button>
          </div>
          <div className="rounded-xl p-5 space-y-4" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
            <h3 className="font-bold text-sm font-display" style={{ color: "hsl(210 40% 90%)" }}>Security Preferences</h3>
            {secPrefs.map((label, i) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-sm" style={{ color: "hsl(210 40% 78%)" }}>{label}</span>
                <Toggle defaultOn={secDefaults[i]} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

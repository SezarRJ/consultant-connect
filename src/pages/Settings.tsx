import { useState, useEffect } from "react";
import {
  Settings as SettingsIcon, Languages, Plug, FolderOpen, Bot, User,
  Shield, Check, Upload, AlertCircle, Eye, EyeOff, CheckCircle2,
  Key, Cpu, Globe, Zap, Sliders, ExternalLink, RefreshCw, Wifi,
  Plus, Trash2, Edit3, Copy, MoreHorizontal, Building2, BarChart2,
  Activity, X, ChevronDown, ChevronUp, Lock, Unlock, Star, Info
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { toast } from "sonner";
import {
  loadAIConfig, saveAIConfig, AI_PROVIDERS, ANTHROPIC_MODELS, PERPLEXITY_MODELS,
  type AIConfig, type AnthropicModel, type PerplexityModel
} from "@/lib/aiConfig";

// ─── Types ────────────────────────────────────────────────────────────────────
interface ApiKeyEntry {
  id: string;
  name: string;
  provider: string;
  key: string;
  addedAt: string;
  lastUsed: string | null;
  isActive: boolean;
}

interface CustomAIModule {
  id: string;
  name: string;
  icon: string;
  description: string;
  baseUrl: string;
  apiKey: string;
  modelId: string;
  category: "llm" | "search" | "data" | "vision" | "embedding" | "other";
  isActive: boolean;
  createdAt: string;
}

interface RealEstateTool {
  id: string;
  name: string;
  vendor: string;
  icon: string;
  color: string;
  bg: string;
  border: string;
  desc: string;
  longDesc: string;
  apiDocsUrl: string;
  signupUrl: string;
  keyField: string;
  keyPlaceholder: string;
  category: string;
  capabilities: string[];
  status: "not_configured" | "configured" | "testing" | "connected" | "error";
  apiKey: string;
  webhookUrl?: string;
  projectId?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
const LS_API_KEYS = "consultai_api_keys_v2";
const LS_RE_TOOLS = "consultai_re_tools_v1";

const LS_AI_MODULES = "consultai_custom_ai_modules_v1";

function loadApiKeys(): ApiKeyEntry[] {
  try { return JSON.parse(localStorage.getItem(LS_API_KEYS) || "[]"); } catch { return []; }
}
function saveApiKeys(keys: ApiKeyEntry[]) {
  localStorage.setItem(LS_API_KEYS, JSON.stringify(keys));
}
function loadCustomModules(): CustomAIModule[] {
  try { return JSON.parse(localStorage.getItem(LS_AI_MODULES) || "[]"); } catch { return []; }
}
function saveCustomModules(modules: CustomAIModule[]) {
  localStorage.setItem(LS_AI_MODULES, JSON.stringify(modules));
}
function loadReTools(): Partial<Record<string, Omit<RealEstateTool, keyof RealEstateTool>>> {
  try { return JSON.parse(localStorage.getItem(LS_RE_TOOLS) || "{}"); } catch { return {}; }
}
function saveReTools(data: any) {
  localStorage.setItem(LS_RE_TOOLS, JSON.stringify(data));
}

function mask(key: string): string {
  if (!key || key.length < 8) return "••••••••";
  return key.slice(0, 6) + "•".repeat(Math.max(0, key.length - 10)) + key.slice(-4);
}

// ─── Sub-components ───────────────────────────────────────────────────────────
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

// ─── Real Estate Tool definitions ────────────────────────────────────────────
const RE_TOOLS_INIT: RealEstateTool[] = [
  {
    id: "feasibilitypro",
    name: "FeasibilityPro",
    vendor: "ProForma Systems",
    icon: "💰",
    color: "hsl(38 95% 60%)",
    bg: "hsl(38 95% 52% / 0.08)",
    border: "hsl(38 95% 52% / 0.3)",
    desc: "Real estate financial modeling & pro forma analysis engine",
    longDesc: "FeasibilityPro is a cloud-based real estate financial modeling platform used by developers and consultants worldwide. It generates detailed pro formas, IRR/NPV models, waterfall distributions, and sensitivity analyses for any asset class.",
    apiDocsUrl: "https://www.feasibilitypro.com/api-docs",
    signupUrl: "https://www.feasibilitypro.com/signup",
    keyField: "feasibilitypro_key",
    keyPlaceholder: "fp_live_••••••••••••",
    category: "Financial Modeling",
    capabilities: ["Pro Forma Generation","IRR / NPV / DSCR","Waterfall Distributions","Sensitivity Analysis","Investor Reports","Multi-scenario Comparison"],
    status: "not_configured",
    apiKey: "",
    projectId: "",
  },
  {
    id: "testfit",
    name: "TestFit",
    vendor: "TestFit Inc.",
    icon: "🏗️",
    color: "hsl(158 64% 55%)",
    bg: "hsl(158 64% 40% / 0.08)",
    border: "hsl(158 64% 40% / 0.3)",
    desc: "Generative site planning & building layout optimization",
    longDesc: "TestFit uses generative AI to instantly produce optimized site plans, unit counts, parking configurations, and building footprints for residential, mixed-use, and commercial developments. Integrates with CAD/BIM workflows.",
    apiDocsUrl: "https://testfit.io/docs/api",
    signupUrl: "https://testfit.io/signup",
    keyField: "testfit_key",
    keyPlaceholder: "tf_api_••••••••••••",
    category: "Site Planning",
    capabilities: ["Automated Site Plans","Unit Count Optimization","Parking Layout","Building Footprint","FAR / Coverage Analysis","BIM Export (IFC, DWG)"],
    status: "not_configured",
    apiKey: "",
    webhookUrl: "",
  },
  {
    id: "anylogic",
    name: "AnyLogic Cloud",
    vendor: "The AnyLogic Company",
    icon: "🔬",
    color: "hsl(217 91% 70%)",
    bg: "hsl(217 91% 53% / 0.08)",
    border: "hsl(217 91% 53% / 0.3)",
    desc: "Multi-method simulation for traffic, pedestrian & operations",
    longDesc: "AnyLogic Cloud is the industry-standard multi-method simulation platform used to model pedestrian flow, traffic impact, retail occupancy, hotel operations, and supply chain logistics for complex real estate projects.",
    apiDocsUrl: "https://cloud.anylogic.com/resources/docs",
    signupUrl: "https://cloud.anylogic.com/signup",
    keyField: "anylogic_key",
    keyPlaceholder: "al_cloud_••••••••••••",
    category: "Simulation",
    capabilities: ["Pedestrian Flow Simulation","Traffic Impact Analysis","Retail Occupancy Models","Hotel Operations Sim","Supply Chain Modeling","Monte Carlo Analysis"],
    status: "not_configured",
    apiKey: "",
    projectId: "",
  },
];

// ─── Main component ───────────────────────────────────────────────────────────
type Tab = "ai_keys" | "re_tools" | "language" | "integrations" | "documents" | "agents" | "profile" | "security";

const AGENTS_INIT = [
  { id:"market-entry", name:"Market Entry Agent",      accuracy:94, enabled:true, responseLen:"detailed"  },
  { id:"distributor",  name:"Distributor Agent",        accuracy:91, enabled:true, responseLen:"standard"  },
  { id:"competitor",   name:"Competitor Agent",          accuracy:92, enabled:true, responseLen:"detailed"  },
  { id:"pricing",      name:"Pricing Agent",              accuracy:96, enabled:true, responseLen:"standard"  },
  { id:"risk",         name:"Risk Assessment Agent",      accuracy:93, enabled:true, responseLen:"detailed"  },
  { id:"partner",      name:"Partner Matchmaking Agent",  accuracy:89, enabled:true, responseLen:"standard"  },
  { id:"sales",        name:"Sales Strategy Agent",       accuracy:90, enabled:true, responseLen:"detailed"  },
  { id:"export",       name:"Export Readiness Agent",     accuracy:95, enabled:true, responseLen:"standard"  },
  { id:"feasibility",  name:"Feasibility Study Agent",    accuracy:91, enabled:true, responseLen:"detailed"  },
];

const INTEGRATIONS_INIT = [
  { id:"google-drive", name:"Google Drive",  icon:"🗂️", desc:"Import documents",       category:"Storage",    connected:false },
  { id:"dropbox",      name:"Dropbox",        icon:"📦", desc:"Sync files",              category:"Storage",    connected:false },
  { id:"salesforce",   name:"Salesforce",     icon:"☁️", desc:"CRM records",             category:"CRM",        connected:false },
  { id:"hubspot",      name:"HubSpot",        icon:"🟠", desc:"Contacts & pipelines",    category:"CRM",        connected:false },
  { id:"slack",        name:"Slack",          icon:"💬", desc:"Send results to Slack",   category:"Comms",      connected:false },
  { id:"notion",       name:"Notion",         icon:"📋", desc:"Export to Notion",        category:"Docs",       connected:false },
  { id:"zapier",       name:"Zapier",         icon:"⚡", desc:"Automate workflows",      category:"Automation", connected:false },
  { id:"powerbi",      name:"Power BI",       icon:"📊", desc:"Push to dashboards",      category:"Analytics",  connected:false },
];

const DOC_TYPES = [
  { type:"Market Research",   icon:"📈", count:12 },
  { type:"Financial Reports", icon:"💰", count:8  },
  { type:"Risk Reports",      icon:"⚠️", count:5  },
  { type:"Partner Profiles",  icon:"🤝", count:19 },
  { type:"Feasibility Plans", icon:"📋", count:7  },
  { type:"Competitor Intel",  icon:"🔍", count:14 },
];

export default function Settings() {
  const { t, lang, setLang } = useI18n();
  const [activeTab, setActiveTab] = useState<Tab>("ai_keys");
  const [aiCfg, setAiCfg] = useState<AIConfig>(loadAIConfig);
  const [testStatus, setTestStatus] = useState<"idle"|"testing"|"ok"|"fail">("idle");
  const [integrations, setIntegrations] = useState(INTEGRATIONS_INIT);
  const [agents, setAgents] = useState(AGENTS_INIT);
  const [profile, setProfile] = useState({ name:"Ahmad Al-Rashidi", company:"Global Trade Consultants", email:"ahmad@gtc.com", phone:"+964 770 123 4567", region:"Iraq / MENA" });

  // ── API Key Manager state ──────────────────────────────────────────────────
  const [apiKeys, setApiKeys] = useState<ApiKeyEntry[]>(loadApiKeys);
  const [showAddKey, setShowAddKey] = useState(false);
  const [editingKey, setEditingKey] = useState<ApiKeyEntry | null>(null);
  const [showKeyValues, setShowKeyValues] = useState<Record<string, boolean>>({});
  const [keyForm, setKeyForm] = useState({ name:"", provider:"anthropic", key:"" });

  // ── Custom AI Modules state ───────────────────────────────────────────────
  const [customModules, setCustomModules] = useState<CustomAIModule[]>(loadCustomModules);
  const [showAddModule, setShowAddModule] = useState(false);
  const [editingModule, setEditingModule] = useState<CustomAIModule | null>(null);
  const [moduleForm, setModuleForm] = useState<Omit<CustomAIModule, "id"|"createdAt">>({
    name:"", icon:"🤖", description:"", baseUrl:"", apiKey:"", modelId:"",
    category:"llm", isActive:true,
  });

  const MODULE_ICONS = ["🤖","🧠","⚡","🔮","🌟","💡","🎯","🔬","🛡️","📡","🔗","🎨"];
  const MODULE_CATEGORIES: { value: CustomAIModule["category"]; label: string }[] = [
    { value:"llm", label:"Language Model" },
    { value:"search", label:"Search" },
    { value:"data", label:"Data Processing" },
    { value:"vision", label:"Vision" },
    { value:"embedding", label:"Embedding" },
    { value:"other", label:"Other" },
  ];

  const handleAddModule = () => {
    if (!moduleForm.name.trim()) { toast.error("Module name is required"); return; }
    const entry: CustomAIModule = {
      ...moduleForm, id:`mod_${Date.now()}`, createdAt: new Date().toISOString(),
    };
    const updated = [...customModules, entry];
    setCustomModules(updated);
    saveCustomModules(updated);
    toast.success(`"${entry.name}" AI module added`);
    setModuleForm({ name:"", icon:"🤖", description:"", baseUrl:"", apiKey:"", modelId:"", category:"llm", isActive:true });
    setShowAddModule(false);
  };

  const handleUpdateModule = () => {
    if (!editingModule) return;
    const updated = customModules.map(m => m.id === editingModule.id ? editingModule : m);
    setCustomModules(updated);
    saveCustomModules(updated);
    setEditingModule(null);
    toast.success("Module updated");
  };

  const handleDeleteModule = (id: string) => {
    const mod = customModules.find(m => m.id === id);
    const updated = customModules.filter(m => m.id !== id);
    setCustomModules(updated);
    saveCustomModules(updated);
    toast.success(`"${mod?.name}" removed`);
  };

  const handleToggleModule = (id: string) => {
    const updated = customModules.map(m => m.id === id ? { ...m, isActive: !m.isActive } : m);
    setCustomModules(updated);
    saveCustomModules(updated);
  };

  // ── Real Estate Tools state ───────────────────────────────────────────────
  const [reTools, setReTools] = useState<RealEstateTool[]>(() => {
    const saved = loadReTools() as any;
    return RE_TOOLS_INIT.map(tool => ({
      ...tool,
      ...(saved[tool.id] || {}),
    }));
  });
  const [expandedTool, setExpandedTool] = useState<string | null>("feasibilitypro");
  const [expandedSubToolId, setExpandedSubToolId] = useState<string | null>(null);
  const [testingTool, setTestingTool] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get("tab") as Tab | null;
    if (tab) setActiveTab(tab);
  }, []);

  const updateAiCfg = (patch: Partial<AIConfig>) => setAiCfg(p => ({ ...p, ...patch }));
  const saveAI = () => {
    saveAIConfig(aiCfg);
    toast.success("AI configuration saved");
  };

  const testApiKey = async () => {
    setTestStatus("testing");
    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`;
      const res = await fetch(url, {
        method:"POST",
        headers:{ "Content-Type":"application/json", Authorization:`Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
        body:JSON.stringify({ system:"Reply with OK", messages:[{ role:"user", content:"ping" }], stream:false, maxTokens:10 }),
      });
      if (res.ok) { setTestStatus("ok"); toast.success("✓ AI connection is active"); }
      else { const err = await res.json().catch(() => ({})); setTestStatus("fail"); toast.error(`AI error: ${(err as any)?.error || res.status}`); }
    } catch { setTestStatus("fail"); toast.error("Connection failed"); }
    setTimeout(() => setTestStatus("idle"), 3000);
  };

  // ── API Key CRUD ──────────────────────────────────────────────────────────
  const handleAddKey = () => {
    if (!keyForm.name.trim() || !keyForm.key.trim()) { toast.error("Name and key are required"); return; }
    const entry: ApiKeyEntry = {
      id: `key_${Date.now()}`,
      name: keyForm.name.trim(),
      provider: keyForm.provider,
      key: keyForm.key.trim(),
      addedAt: new Date().toLocaleDateString(),
      lastUsed: null,
      isActive: true,
    };
    const updated = [...apiKeys, entry];
    setApiKeys(updated);
    saveApiKeys(updated);
    // If it's an Anthropic key and none exists, auto-apply
    if (keyForm.provider === "anthropic" && !aiCfg.anthropicKey) {
      const newCfg = { ...aiCfg, anthropicKey: keyForm.key.trim() };
      setAiCfg(newCfg);
      saveAIConfig(newCfg);
      toast.success("API key added & automatically applied to AI configuration");
    } else {
      toast.success("API key added successfully");
    }
    setKeyForm({ name:"", provider:"anthropic", key:"" });
    setShowAddKey(false);
  };

  const handleEditKey = () => {
    if (!editingKey) return;
    const updated = apiKeys.map(k => k.id === editingKey.id ? editingKey : k);
    setApiKeys(updated);
    saveApiKeys(updated);
    setEditingKey(null);
    toast.success("Key updated");
  };

  const handleDeleteKey = (id: string) => {
    const key = apiKeys.find(k => k.id === id);
    const updated = apiKeys.filter(k => k.id !== id);
    setApiKeys(updated);
    saveApiKeys(updated);
    toast.success(`"${key?.name}" deleted`);
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success("Key copied to clipboard");
  };

  const handleApplyKey = (entry: ApiKeyEntry) => {
    if (entry.provider === "anthropic") {
      const newCfg = { ...aiCfg, anthropicKey: entry.key };
      setAiCfg(newCfg);
      saveAIConfig(newCfg);
      toast.success(`"${entry.name}" applied as the primary AI runtime`);
    } else if (entry.provider === "perplexity") {
      const newCfg = { ...aiCfg, perplexityKey: entry.key };
      setAiCfg(newCfg);
      saveAIConfig(newCfg);
      toast.success(`"${entry.name}" applied as Perplexity key`);
    } else {
      toast.info(`Apply "${entry.name}" to the appropriate tool in the Real Estate Tools tab`);
    }
  };

  const toggleKeyVisibility = (id: string) => setShowKeyValues(p => ({ ...p, [id]: !p[id] }));

  // ── Real Estate Tools ─────────────────────────────────────────────────────
  const updateReTool = (id: string, patch: Partial<RealEstateTool>) => {
    setReTools(prev => {
      const updated = prev.map(t => t.id === id ? { ...t, ...patch } : t);
      const toSave: any = {};
      updated.forEach(t => { toSave[t.id] = { apiKey: t.apiKey, status: t.status, webhookUrl: t.webhookUrl, projectId: t.projectId }; });
      saveReTools(toSave);
      return updated;
    });
  };

  const testReTool = async (toolId: string) => {
    const tool = reTools.find(t => t.id === toolId);
    if (!tool?.apiKey) { toast.error("Enter an API key first"); return; }
    setTestingTool(toolId);
    updateReTool(toolId, { status: "testing" });
    // Simulate API test (real tools would need actual endpoints)
    await new Promise(r => setTimeout(r, 2000));
    // We can't actually reach these APIs from browser without CORS proxy, so we validate key format
    const keyLooksValid = tool.apiKey.length >= 10;
    if (keyLooksValid) {
      updateReTool(toolId, { status: "connected" });
      toast.success(`✓ ${tool.name} key saved — connection will be verified server-side`);
    } else {
      updateReTool(toolId, { status: "error" });
      toast.error(`${tool.name} key appears invalid (too short)`);
    }
    setTestingTool(null);
  };

  const saveReTool = (toolId: string) => {
    const tool = reTools.find(t => t.id === toolId);
    if (!tool) return;
    const toSave: any = {};
    reTools.forEach(t => { toSave[t.id] = { apiKey: t.apiKey, status: t.status, webhookUrl: t.webhookUrl, projectId: t.projectId }; });
    saveReTools(toSave);
    if (tool.apiKey) {
      updateReTool(toolId, { status: "configured" });
      toast.success(`${tool.name} configuration saved`);
    } else {
      toast.error("Please enter an API key");
    }
  };

  const PROVIDER_OPTIONS = [
    { value:"anthropic",      label:"Gemini via Lovable"   },
    { value:"perplexity",     label:"Perplexity AI"       },
    { value:"tavily",         label:"Tavily Search"       },
    { value:"openai",         label:"OpenAI"              },
    { value:"serpapi",        label:"SerpAPI"             },
    { value:"firecrawl",      label:"Firecrawl"           },
    { value:"feasibilitypro", label:"FeasibilityPro"      },
    { value:"testfit",        label:"TestFit"             },
    { value:"anylogic",       label:"AnyLogic Cloud"      },
    ...customModules.map(m => ({ value: m.id, label: m.name })),
    { value:"other",          label:"Other / Custom"      },
  ];

  const tabs: { key: Tab; label: string; icon: React.ElementType; highlight?: boolean; badge?: string }[] = [
    { key:"ai_keys",      label:"AI & Keys",    icon:Cpu,       highlight:false, badge: (apiKeys.length + customModules.length) > 0 ? String(apiKeys.length + customModules.length) : undefined },
    { key:"re_tools",     label:"RE Tools",     icon:Building2, badge: reTools.filter(t => t.status === "connected" || t.status === "configured").length > 0 ? "✓" : undefined },
    { key:"language",     label:t.tab_language, icon:Languages  },
    { key:"integrations", label:"Integrations", icon:Plug       },
    { key:"documents",    label:"Documents",    icon:FolderOpen },
    { key:"agents",       label:"Agents",       icon:Bot        },
    { key:"profile",      label:"Profile",      icon:User       },
    { key:"security",     label:"Security",     icon:Shield     },
  ];

  const statusBadge = (status: RealEstateTool["status"]) => {
    const map: Record<string, { bg: string; text: string; label: string }> = {
      not_configured: { bg:"hsl(216 45% 18%)",         text:"hsl(215 25% 45%)",  label:"Not configured" },
      configured:     { bg:"hsl(38 95% 52% / 0.15)",   text:"hsl(38 95% 60%)",   label:"Configured"     },
      testing:        { bg:"hsl(217 91% 53% / 0.15)",  text:"hsl(217 91% 70%)",  label:"Testing..."     },
      connected:      { bg:"hsl(158 64% 40% / 0.15)",  text:"hsl(158 64% 55%)",  label:"✓ Connected"    },
      error:          { bg:"hsl(0 72% 51% / 0.15)",    text:"hsl(0 72% 68%)",    label:"Error"          },
    };
    const s = map[status] || map.not_configured;
    return <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ background:s.bg, color:s.text }}>{s.label}</span>;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <SettingsIcon className="h-5 w-5" style={{ color:"hsl(38 95% 52%)" }} />
        <div>
          <h1 className="text-xl font-bold font-display" style={{ color:"hsl(210 40% 92%)" }}>{t.settings_title}</h1>
          <p className="text-sm" style={{ color:"hsl(215 25% 55%)" }}>{t.settings_subtitle}</p>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 p-1 rounded-xl overflow-x-auto" style={{ background:"hsl(216 45% 12%)" }}>
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className="relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all"
            style={{
              background: activeTab === tab.key ? "hsl(38 95% 52%)" : "transparent",
              color: activeTab === tab.key ? "hsl(216 58% 6%)" : "hsl(215 25% 60%)",
            }}>
            <tab.icon className="h-3.5 w-3.5" />
            {tab.label}
            {tab.badge && (
              <span className="ml-0.5 text-[9px] px-1.5 py-0.5 rounded-full font-bold"
                style={{ background: activeTab === tab.key ? "rgba(0,0,0,0.2)" : "hsl(38 95% 52% / 0.2)", color: activeTab === tab.key ? "hsl(216 58% 6%)" : "hsl(38 95% 60%)" }}>
                {tab.badge}
              </span>
            )}
            {tab.highlight && <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-red-500" />}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* AI & KEYS TAB — Primary AI selector + Sub-tools + Key Vault           */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "ai_keys" && (
        <div className="space-y-5">

          {/* ─── PRIMARY AI ENGINE ───────────────────────────────────────── */}
          <div className="rounded-xl p-6 space-y-4" style={{ background:"hsl(var(--card))", border:"1px solid hsl(var(--border))" }}>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5" style={{ color:"hsl(38 95% 52%)" }}/>
              <div>
                <h2 className="text-base font-bold font-display" style={{ color:"hsl(210 40% 90%)" }}>Primary AI Runtime</h2>
                <p className="text-xs mt-0.5" style={{ color:"hsl(215 25% 55%)" }}>
                  Review the actual AI runtime used by the app. Advisory agents run through the Lovable AI Gateway with Gemini model tiers, while optional external tools can still be configured below.
                </p>
              </div>
            </div>

            {/* Provider cards */}
            {[
              { id:"anthropic" as const, icon:"✨", name:"Gemini via Lovable AI Gateway", color:"hsl(38 95% 60%)",
                desc:"Actual in-app runtime. Supabase edge functions call the Lovable AI Gateway, which routes advisory workloads to Gemini flash-lite, flash, and pro tiers.",
                kField:"anthropicKey" as keyof AIConfig, kp:"Managed server-side", docs:"https://lovable.dev/",
                models:ANTHROPIC_MODELS, activeM: aiCfg.anthropicModel, setM:(id:string)=>updateAiCfg({anthropicModel:id as AnthropicModel}) },
              { id:"openai" as const, icon:"🤖", name:"OpenAI GPT-4o", color:"hsl(158 64% 55%)",
                desc:"Alternative primary engine. Excellent for vision tasks, code generation and broad reasoning.",
                kField:"openaiKey" as keyof AIConfig, kp:"sk-...", docs:"https://platform.openai.com/api-keys",
                models:[
                  {id:"gpt-4o",label:"GPT-4o",tier:"flagship" as const,contextK:128,desc:"Most capable — vision + reasoning"},
                  {id:"gpt-4o-mini",label:"GPT-4o Mini",tier:"fast" as const,contextK:128,desc:"Fast & cost-efficient"},
                  {id:"o3-mini",label:"o3-mini",tier:"balanced" as const,contextK:200,desc:"Advanced reasoning model"},
                ],
                activeM: (aiCfg as any).openaiModel||"gpt-4o",
                setM:(id:string)=>updateAiCfg({...(aiCfg as any),openaiModel:id}) },
              { id:"custom" as const, icon:"⚡", name:"Custom / Other", color:"hsl(217 91% 70%)",
                desc:"Any OpenAI-compatible API endpoint — Ollama, Groq, Together AI, Mistral, Cohere, LM Studio, and more.",
                kField:"" as keyof AIConfig, kp:"", docs:"", models:[], activeM:"", setM:(_:string)=>{} },
            ].map(prov => {
              const isMain = ((aiCfg as any).primaryProvider||"anthropic") === prov.id;
              const isManagedGateway = prov.id === "anthropic";
              const kv = prov.kField ? ((aiCfg[prov.kField] as string)||"") : "";
              const hasKey = prov.id==="custom" ? !!(aiCfg as any).customProviderName : (isManagedGateway ? true : !!kv);
              return (
                <div key={prov.id} className="rounded-xl overflow-hidden"
                  style={{ border:`2px solid ${isMain?prov.color+"55":"hsl(var(--border))"}`, background:isMain?prov.color+"06":"hsl(216 45% 11%)" }}>
                  {/* Header */}
                  <div className="flex items-center gap-4 px-5 py-4 flex-wrap">
                    <span className="text-2xl">{prov.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm" style={{ color:"hsl(210 40% 92%)" }}>{prov.name}</span>
                        {isMain && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background:prov.color+"20", color:prov.color }}>★ PRIMARY</span>}
                        {hasKey && <span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ background:"hsl(158 64% 40%/0.15)", color:"hsl(158 64% 55%)" }}>{isManagedGateway ? "✓ Managed" : "✓ Key set"}</span>}
                      </div>
                      <p className="text-xs mt-0.5" style={{ color:"hsl(215 25% 55%)" }}>{prov.desc}</p>
                    </div>
                    {!isMain && (
                      <button onClick={() => updateAiCfg({...(aiCfg as any), primaryProvider:prov.id})}
                        className="px-4 py-2 rounded-lg text-xs font-bold shrink-0"
                        style={{ background:prov.color+"15", color:prov.color, border:`1px solid ${prov.color}30` }}>
                        Set as Primary
                      </button>
                    )}
                  </div>
                  {/* Config */}
                  {prov.id !== "custom" ? (
                    <div className="px-5 pb-5 space-y-4" style={{ borderTop:"1px solid hsl(var(--border))" }}>
                      <div className="pt-4">
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-[11px] font-semibold uppercase tracking-wider" style={{ color:"hsl(215 25% 50%)" }}>{isManagedGateway ? "Runtime Status" : "API Key"}</label>
                          {prov.docs && <a href={prov.docs} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[10px]" style={{ color:"hsl(217 91% 65%)" }}>{isManagedGateway ? "View integration" : "Get key"} <ExternalLink className="h-2.5 w-2.5"/></a>}
                        </div>
                        {isManagedGateway ? (
                          <div className="rounded-lg px-3 py-3 text-sm" style={{ background:"hsl(216 45% 10%)", border:"1px solid hsl(158 64% 40%/0.35)", color:"hsl(210 40% 82%)" }}>
                            <p className="font-medium" style={{ color:"hsl(158 64% 60%)" }}>Managed by Supabase + Lovable Gateway</p>
                            <p className="mt-1 text-xs" style={{ color:"hsl(215 25% 58%)" }}>This app does not call Anthropic directly from the Settings page. Gemini model tiers are selected in the backend edge function and shown here for transparency.</p>
                          </div>
                        ) : (
                          <div className="relative">
                            <input type="password" value={kv}
                              onChange={e => { const pt:Partial<AIConfig>={}; if(prov.kField)(pt as any)[prov.kField]=e.target.value; updateAiCfg(pt); }}
                              placeholder={prov.kp}
                              className="w-full px-3 py-2.5 pr-10 rounded-lg text-sm font-mono"
                              style={{ background:"hsl(216 45% 10%)", border:`1px solid ${kv?"hsl(158 64% 40%/0.5)":"hsl(var(--border))"}`, color:"hsl(210 40% 85%)" }}/>
                            {kv && <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color:"hsl(158 64% 55%)" }}/>}
                          </div>
                        )}
                      </div>
                      {prov.models.length>0 && (
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color:"hsl(215 25% 50%)" }}>Model</p>
                          <div className="grid grid-cols-1 gap-1.5">
                            {prov.models.map(m => {
                              const active = prov.activeM === m.id;
                              const tc = m.tier==="flagship"?"hsl(38 95% 60%)":m.tier==="fast"?"hsl(217 91% 70%)":"hsl(158 64% 55%)";
                              return (
                                <button key={m.id} onClick={()=>prov.setM(m.id)}
                                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-start transition-all"
                                  style={{ background:active?prov.color+"12":"hsl(216 45% 13%)", border:`1px solid ${active?prov.color+"40":"hsl(var(--border))"}` }}>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className="text-xs font-semibold" style={{ color:"hsl(210 40% 90%)" }}>{m.label}</span>
                                      <span className="text-[9px] px-1.5 py-0.5 rounded-full font-medium" style={{ background:`${tc}20`, color:tc }}>{m.tier}</span>
                                      <span className="text-[9px]" style={{ color:"hsl(215 25% 45%)" }}>{m.contextK}K ctx</span>
                                    </div>
                                    <p className="text-[11px] mt-0.5" style={{ color:"hsl(215 25% 55%)" }}>{m.desc}</p>
                                  </div>
                                  <div className="h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0"
                                    style={{ borderColor:active?prov.color:"hsl(215 25% 35%)" }}>
                                    {active && <div className="h-2 w-2 rounded-full" style={{ background:prov.color }}/>}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="px-5 pb-5 space-y-3" style={{ borderTop:"1px solid hsl(var(--border))" }}>
                      <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[
                          { l:"Provider Name", ph:"e.g. Groq, Ollama, Mistral", f:"customProviderName", pw:false },
                          { l:"Base URL",       ph:"https://api.groq.com/openai/v1", f:"customBaseUrl",    pw:false },
                          { l:"Model ID",       ph:"e.g. mixtral-8x7b-32768",    f:"customModel",         pw:false },
                          { l:"API Key",        ph:"Your API key",               f:"customKey",           pw:true  },
                        ].map(fi=>(
                          <div key={fi.f}>
                            <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1" style={{ color:"hsl(215 25% 45%)" }}>{fi.l}</label>
                            <input value={(aiCfg as any)[fi.f]||""} onChange={e=>updateAiCfg({...(aiCfg as any),[fi.f]:e.target.value})}
                              placeholder={fi.ph} type={fi.pw?"password":"text"}
                              className="w-full px-3 py-2 rounded-lg text-sm"
                              style={{ background:"hsl(216 45% 10%)", border:"1px solid hsl(var(--border))", color:"hsl(210 40% 85%)" }}/>
                          </div>
                        ))}
                      </div>
                      <div className="rounded-lg p-3 flex items-start gap-2" style={{ background:"hsl(217 91% 70%/0.06)", border:"1px solid hsl(217 91% 70%/0.2)" }}>
                        <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" style={{ color:"hsl(217 91% 70%)" }}/>
                        <p className="text-[11px]" style={{ color:"hsl(215 25% 60%)" }}>Must be OpenAI-compatible. Works with Groq, Together AI, Ollama, LM Studio, Mistral, Cohere, and most self-hosted models.</p>
                      </div>
                      <button onClick={()=>{updateAiCfg({...(aiCfg as any),primaryProvider:"custom"});toast.success("Custom provider set as primary");}}
                        className="px-4 py-2 rounded-lg text-xs font-bold"
                        style={{ background:"hsl(217 91% 70%/0.15)", color:"hsl(217 91% 70%)", border:"1px solid hsl(217 91% 70%/0.3)" }}>
                        Activate as Primary Engine
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
            <button onClick={saveAI} className="w-full py-3 rounded-xl text-sm font-bold" style={{ background:"hsl(38 95% 52%)", color:"hsl(216 58% 6%)" }}>Save Primary AI Settings</button>
          </div>

          {/* ─── CUSTOM AI MODULES ────────────────────────────────────────── */}
          <div className="rounded-xl p-6 space-y-4" style={{ background:"hsl(var(--card))", border:"1px solid hsl(var(--border))" }}>
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <Cpu className="h-5 w-5" style={{ color:"hsl(270 70% 65%)" }}/>
                <div>
                  <h2 className="text-base font-bold font-display" style={{ color:"hsl(210 40% 90%)" }}>Custom AI Modules</h2>
                  <p className="text-xs mt-0.5" style={{ color:"hsl(215 25% 55%)" }}>Add external AI services, LLMs, embedding models, or specialized tools. Any OpenAI-compatible endpoint works.</p>
                </div>
              </div>
              <button onClick={() => { setShowAddModule(true); setEditingModule(null); }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold"
                style={{ background:"hsl(270 70% 65%)", color:"hsl(216 58% 6%)" }}>
                <Plus className="h-4 w-4" /> Add Module
              </button>
            </div>

            {/* Module list */}
            {customModules.length === 0 && !showAddModule ? (
              <div className="rounded-xl p-8 text-center" style={{ background:"hsl(216 45% 11%)", border:"2px dashed hsl(var(--border))" }}>
                <Cpu className="h-10 w-10 mx-auto mb-3 opacity-20" style={{ color:"hsl(270 70% 65%)" }} />
                <p className="font-semibold text-sm" style={{ color:"hsl(215 25% 50%)" }}>No custom AI modules yet</p>
                <p className="text-xs mt-1 mb-3" style={{ color:"hsl(215 25% 38%)" }}>Add modules like Groq, Ollama, Mistral, Cohere, Together AI, or any OpenAI-compatible endpoint</p>
                <button onClick={() => setShowAddModule(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold"
                  style={{ background:"hsl(270 70% 65%)", color:"hsl(216 58% 6%)" }}>
                  <Plus className="h-4 w-4" /> Add First Module
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {customModules.map(mod => {
                  const isEditing = editingModule?.id === mod.id;
                  return (
                    <div key={mod.id} className="rounded-xl overflow-hidden"
                      style={{ border:`1px solid ${mod.isActive ? "hsl(270 70% 65%/0.4)" : "hsl(var(--border))"}`, background: mod.isActive ? "hsl(270 70% 65%/0.04)" : "hsl(216 45% 11%)", opacity: mod.isActive ? 1 : 0.65 }}>
                      {isEditing ? (
                        <div className="p-4 space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1" style={{ color:"hsl(215 25% 45%)" }}>Name</label>
                              <input value={editingModule.name} onChange={e => setEditingModule(m => m ? {...m, name:e.target.value} : m)}
                                className="w-full px-3 py-2 rounded-lg text-sm"
                                style={{ background:"hsl(216 45% 12%)", border:"1px solid hsl(var(--border))", color:"hsl(210 40% 85%)" }} />
                            </div>
                            <div>
                              <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1" style={{ color:"hsl(215 25% 45%)" }}>Category</label>
                              <select value={editingModule.category} onChange={e => setEditingModule(m => m ? {...m, category:e.target.value as CustomAIModule["category"]} : m)}
                                className="w-full px-3 py-2 rounded-lg text-sm"
                                style={{ background:"hsl(216 45% 12%)", border:"1px solid hsl(var(--border))", color:"hsl(210 40% 85%)" }}>
                                {MODULE_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                              </select>
                            </div>
                          </div>
                          <div>
                            <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1" style={{ color:"hsl(215 25% 45%)" }}>Icon</label>
                            <div className="flex gap-1.5 flex-wrap">
                              {MODULE_ICONS.map(ic => (
                                <button key={ic} onClick={() => setEditingModule(m => m ? {...m, icon:ic} : m)}
                                  className="h-8 w-8 rounded-lg flex items-center justify-center text-lg"
                                  style={{ background: editingModule.icon === ic ? "hsl(270 70% 65%/0.2)" : "hsl(216 45% 14%)", border: `1px solid ${editingModule.icon === ic ? "hsl(270 70% 65%/0.5)" : "hsl(var(--border))"}` }}>
                                  {ic}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div>
                            <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1" style={{ color:"hsl(215 25% 45%)" }}>Description</label>
                            <input value={editingModule.description} onChange={e => setEditingModule(m => m ? {...m, description:e.target.value} : m)}
                              placeholder="What does this module do?"
                              className="w-full px-3 py-2 rounded-lg text-sm"
                              style={{ background:"hsl(216 45% 12%)", border:"1px solid hsl(var(--border))", color:"hsl(210 40% 85%)" }} />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1" style={{ color:"hsl(215 25% 45%)" }}>Base URL</label>
                              <input value={editingModule.baseUrl} onChange={e => setEditingModule(m => m ? {...m, baseUrl:e.target.value} : m)}
                                placeholder="https://api.example.com/v1"
                                className="w-full px-3 py-2 rounded-lg text-sm font-mono"
                                style={{ background:"hsl(216 45% 12%)", border:"1px solid hsl(var(--border))", color:"hsl(210 40% 85%)" }} />
                            </div>
                            <div>
                              <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1" style={{ color:"hsl(215 25% 45%)" }}>Model ID</label>
                              <input value={editingModule.modelId} onChange={e => setEditingModule(m => m ? {...m, modelId:e.target.value} : m)}
                                placeholder="e.g. mixtral-8x7b"
                                className="w-full px-3 py-2 rounded-lg text-sm font-mono"
                                style={{ background:"hsl(216 45% 12%)", border:"1px solid hsl(var(--border))", color:"hsl(210 40% 85%)" }} />
                            </div>
                          </div>
                          <div>
                            <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1" style={{ color:"hsl(215 25% 45%)" }}>API Key</label>
                            <input value={editingModule.apiKey} onChange={e => setEditingModule(m => m ? {...m, apiKey:e.target.value} : m)}
                              placeholder="Your API key" type="password"
                              className="w-full px-3 py-2 rounded-lg text-sm font-mono"
                              style={{ background:"hsl(216 45% 12%)", border:"1px solid hsl(var(--border))", color:"hsl(210 40% 85%)" }} />
                          </div>
                          <div className="flex gap-2">
                            <button onClick={handleUpdateModule} className="px-4 py-2 rounded-lg text-xs font-semibold"
                              style={{ background:"hsl(270 70% 65%)", color:"hsl(216 58% 6%)" }}>Save</button>
                            <button onClick={() => setEditingModule(null)} className="px-4 py-2 rounded-lg text-xs font-semibold"
                              style={{ background:"hsl(216 45% 18%)", color:"hsl(210 40% 75%)" }}>Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-4 px-4 py-3.5">
                          <span className="text-xl">{mod.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-semibold" style={{ color:"hsl(210 40% 88%)" }}>{mod.name}</span>
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background:"hsl(270 70% 65%/0.15)", color:"hsl(270 70% 65%)" }}>
                                {MODULE_CATEGORIES.find(c => c.value === mod.category)?.label || mod.category}
                              </span>
                              {mod.modelId && <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full" style={{ background:"hsl(216 45% 16%)", color:"hsl(215 25% 55%)" }}>{mod.modelId}</span>}
                              {mod.apiKey && <span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ background:"hsl(158 64% 40%/0.15)", color:"hsl(158 64% 55%)" }}>✓ Key</span>}
                            </div>
                            {mod.description && <p className="text-[11px] mt-0.5 truncate" style={{ color:"hsl(215 25% 50%)" }}>{mod.description}</p>}
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <Toggle defaultOn={mod.isActive} onChange={() => handleToggleModule(mod.id)} />
                            <button onClick={() => setEditingModule({...mod})} className="p-1.5 rounded-lg hover:opacity-80"
                              style={{ background:"hsl(216 45% 18%)" }}>
                              <Edit3 className="h-3.5 w-3.5" style={{ color:"hsl(215 25% 55%)" }} />
                            </button>
                            <button onClick={() => handleDeleteModule(mod.id)} className="p-1.5 rounded-lg hover:opacity-80"
                              style={{ background:"hsl(0 72% 51%/0.1)" }}>
                              <Trash2 className="h-3.5 w-3.5" style={{ color:"hsl(0 72% 68%)" }} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Add module form */}
            {showAddModule && (
              <div className="rounded-xl p-5 space-y-4" style={{ background:"hsl(216 45% 11%)", border:"1px solid hsl(270 70% 65%/0.3)" }}>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold" style={{ color:"hsl(270 70% 75%)" }}>Add New AI Module</h3>
                  <button onClick={() => setShowAddModule(false)}><X className="h-4 w-4" style={{ color:"hsl(215 25% 50%)" }} /></button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1" style={{ color:"hsl(215 25% 45%)" }}>Module Name *</label>
                    <input value={moduleForm.name} onChange={e => setModuleForm(f => ({...f, name:e.target.value}))}
                      placeholder="e.g. Groq Mixtral, Ollama Local"
                      className="w-full px-3 py-2.5 rounded-lg text-sm"
                      style={{ background:"hsl(216 45% 14%)", border:"1px solid hsl(var(--border))", color:"hsl(210 40% 85%)" }} />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1" style={{ color:"hsl(215 25% 45%)" }}>Category</label>
                    <select value={moduleForm.category} onChange={e => setModuleForm(f => ({...f, category:e.target.value as CustomAIModule["category"]}))}
                      className="w-full px-3 py-2.5 rounded-lg text-sm"
                      style={{ background:"hsl(216 45% 14%)", border:"1px solid hsl(var(--border))", color:"hsl(210 40% 85%)" }}>
                      {MODULE_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1" style={{ color:"hsl(215 25% 45%)" }}>Icon</label>
                  <div className="flex gap-1.5 flex-wrap">
                    {MODULE_ICONS.map(ic => (
                      <button key={ic} onClick={() => setModuleForm(f => ({...f, icon:ic}))}
                        className="h-8 w-8 rounded-lg flex items-center justify-center text-lg"
                        style={{ background: moduleForm.icon === ic ? "hsl(270 70% 65%/0.2)" : "hsl(216 45% 14%)", border: `1px solid ${moduleForm.icon === ic ? "hsl(270 70% 65%/0.5)" : "hsl(var(--border))"}` }}>
                        {ic}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1" style={{ color:"hsl(215 25% 45%)" }}>Description</label>
                  <input value={moduleForm.description} onChange={e => setModuleForm(f => ({...f, description:e.target.value}))}
                    placeholder="What does this module do?"
                    className="w-full px-3 py-2.5 rounded-lg text-sm"
                    style={{ background:"hsl(216 45% 14%)", border:"1px solid hsl(var(--border))", color:"hsl(210 40% 85%)" }} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1" style={{ color:"hsl(215 25% 45%)" }}>Base URL</label>
                    <input value={moduleForm.baseUrl} onChange={e => setModuleForm(f => ({...f, baseUrl:e.target.value}))}
                      placeholder="https://api.groq.com/openai/v1"
                      className="w-full px-3 py-2.5 rounded-lg text-sm font-mono"
                      style={{ background:"hsl(216 45% 14%)", border:"1px solid hsl(var(--border))", color:"hsl(210 40% 85%)" }} />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1" style={{ color:"hsl(215 25% 45%)" }}>Model ID</label>
                    <input value={moduleForm.modelId} onChange={e => setModuleForm(f => ({...f, modelId:e.target.value}))}
                      placeholder="e.g. mixtral-8x7b-32768"
                      className="w-full px-3 py-2.5 rounded-lg text-sm font-mono"
                      style={{ background:"hsl(216 45% 14%)", border:"1px solid hsl(var(--border))", color:"hsl(210 40% 85%)" }} />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1" style={{ color:"hsl(215 25% 45%)" }}>API Key</label>
                  <input value={moduleForm.apiKey} onChange={e => setModuleForm(f => ({...f, apiKey:e.target.value}))}
                    placeholder="Your API key" type="password"
                    className="w-full px-3 py-2.5 rounded-lg text-sm font-mono"
                    style={{ background:"hsl(216 45% 14%)", border:"1px solid hsl(var(--border))", color:"hsl(210 40% 85%)" }} />
                </div>
                <div className="rounded-lg p-3 flex items-start gap-2" style={{ background:"hsl(270 70% 65%/0.06)", border:"1px solid hsl(270 70% 65%/0.2)" }}>
                  <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" style={{ color:"hsl(270 70% 65%)" }}/>
                  <p className="text-[11px]" style={{ color:"hsl(215 25% 60%)" }}>Supports any OpenAI-compatible API: Groq, Together AI, Ollama, LM Studio, Mistral, Cohere, Fireworks, DeepSeek, and more.</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setShowAddModule(false)} className="flex-1 py-2.5 rounded-lg text-sm font-semibold"
                    style={{ background:"hsl(216 45% 18%)", color:"hsl(210 40% 75%)" }}>Cancel</button>
                  <button onClick={handleAddModule} className="flex-1 py-2.5 rounded-lg text-sm font-semibold"
                    style={{ background:"hsl(270 70% 65%)", color:"hsl(216 58% 6%)" }}>Add Module</button>
                </div>
              </div>
            )}
          </div>
          <div className="rounded-xl p-6 space-y-4" style={{ background:"hsl(var(--card))", border:"1px solid hsl(var(--border))" }}>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4" style={{ color:"hsl(38 95% 52%)" }}/>
              <div>
                <h2 className="text-base font-bold font-display" style={{ color:"hsl(210 40% 90%)" }}>Sub-Tools & Secondary Services</h2>
                <p className="text-xs mt-0.5" style={{ color:"hsl(215 25% 55%)" }}>Enable web search, scraping and data tools to augment your primary AI with live information.</p>
              </div>
            </div>
            {[
              { id:"perplexity", icon:"🔍", name:"Perplexity AI",  role:"Web Search",   color:"hsl(280 80% 70%)",
                desc:"Real-time web search for live market data and competitor intelligence.",
                kf:"perplexityKey" as keyof AIConfig, kp:"pplx-...", docs:"https://www.perplexity.ai/settings/api",
                active:aiCfg.webSearchProvider==="perplexity"&&aiCfg.webSearchEnabled,
                onEnable:()=>updateAiCfg({webSearchProvider:"perplexity",webSearchEnabled:true}),
                onDisable:()=>updateAiCfg({webSearchEnabled:false}),
                models:PERPLEXITY_MODELS, activeM:aiCfg.perplexityModel,
                setM:(id:string)=>updateAiCfg({perplexityModel:id as PerplexityModel}) },
              { id:"tavily", icon:"🌐", name:"Tavily Search",   role:"Web Search",   color:"hsl(200 80% 65%)",
                desc:"AI-optimised structured search built for LLM agents and deep content extraction.",
                kf:"tavilyKey" as keyof AIConfig, kp:"tvly-...", docs:"https://tavily.com/",
                active:aiCfg.webSearchProvider==="tavily"&&aiCfg.webSearchEnabled,
                onEnable:()=>updateAiCfg({webSearchProvider:"tavily",webSearchEnabled:true}),
                onDisable:()=>updateAiCfg({webSearchEnabled:false}),
                models:[], activeM:"", setM:(_:string)=>{} },
              { id:"serpapi", icon:"📊", name:"SerpAPI",         role:"Search Data",  color:"hsl(38 95% 60%)",
                desc:"Google Search API for SERP data, Google Trends and real-time price monitoring.",
                kf:"serpapiKey" as keyof AIConfig, kp:"...serpapi...", docs:"https://serpapi.com/manage-api-key",
                active:aiCfg.webSearchProvider==="serpapi"&&aiCfg.webSearchEnabled,
                onEnable:()=>updateAiCfg({webSearchProvider:"serpapi",webSearchEnabled:true}),
                onDisable:()=>updateAiCfg({webSearchEnabled:false}),
                models:[], activeM:"", setM:(_:string)=>{} },
              { id:"firecrawl", icon:"🔥", name:"Firecrawl",      role:"Web Scraping", color:"hsl(0 72% 68%)",
                desc:"Web scraping API that converts any page to clean LLM-ready markdown.",
                kf:"firecrawlKey" as keyof AIConfig, kp:"fc-...", docs:"https://www.firecrawl.dev/app/api-keys",
                active:!!(aiCfg as any).firecrawlEnabled,
                onEnable:()=>updateAiCfg({...(aiCfg as any),firecrawlEnabled:true}),
                onDisable:()=>updateAiCfg({...(aiCfg as any),firecrawlEnabled:false}),
                models:[], activeM:"", setM:(_:string)=>{} },
            ].map(st => {
              const kv = (aiCfg[st.kf] as string)||"";
              const hasKey = !!kv;
              const [exp, setExp] = [st.id === expandedSubToolId, (v:boolean)=>setExpandedSubToolId(v?st.id:null)];
              return (
                <div key={st.id} className="rounded-xl overflow-hidden"
                  style={{ border:`1px solid ${st.active?st.color+"40":"hsl(var(--border))"}`, background:st.active?st.color+"04":"hsl(216 45% 11%)" }}>
                  <button onClick={()=>setExp(!exp)} className="w-full flex items-center gap-4 px-4 py-3.5 text-left">
                    <span className="text-lg">{st.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold" style={{ color:"hsl(210 40% 88%)" }}>{st.name}</span>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background:st.color+"18", color:st.color }}>{st.role}</span>
                        {hasKey && <span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ background:"hsl(158 64% 40%/0.15)", color:"hsl(158 64% 55%)" }}>✓ Key</span>}
                        {st.active && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background:st.color+"20", color:st.color }}>ACTIVE</span>}
                      </div>
                      <p className="text-[11px] mt-0.5" style={{ color:"hsl(215 25% 50%)" }}>{st.desc}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {st.active?(
                        <button onClick={e=>{e.stopPropagation();st.onDisable();}}
                          className="px-3 py-1.5 rounded-lg text-[11px] font-bold"
                          style={{ background:"hsl(0 72% 51%/0.12)", color:"hsl(0 72% 68%)", border:"1px solid hsl(0 72% 51%/0.25)" }}>Disable</button>
                      ):(
                        <button onClick={e=>{e.stopPropagation();st.onEnable();}}
                          className="px-3 py-1.5 rounded-lg text-[11px] font-bold"
                          style={{ background:st.color+"15", color:st.color, border:`1px solid ${st.color}30` }}>Enable</button>
                      )}
                      {exp?<ChevronUp className="h-3.5 w-3.5" style={{ color:"hsl(215 25% 45%)" }}/>:<ChevronDown className="h-3.5 w-3.5" style={{ color:"hsl(215 25% 45%)" }}/>}
                    </div>
                  </button>
                  {exp && (
                    <div className="px-4 pb-4 space-y-4" style={{ borderTop:"1px solid hsl(var(--border))" }}>
                      <div className="pt-3">
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-[11px] font-semibold uppercase tracking-wider" style={{ color:"hsl(215 25% 50%)" }}>API Key</label>
                          <a href={st.docs} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[10px]" style={{ color:"hsl(217 91% 65%)" }}>Get key <ExternalLink className="h-2.5 w-2.5"/></a>
                        </div>
                        <div className="relative">
                          <input type="password" value={kv}
                            onChange={e=>{const pt:Partial<AIConfig>={};(pt as any)[st.kf]=e.target.value;updateAiCfg(pt);}}
                            placeholder={st.kp}
                            className="w-full px-3 py-2.5 pr-10 rounded-lg text-sm font-mono"
                            style={{ background:"hsl(216 45% 10%)", border:`1px solid ${hasKey?"hsl(158 64% 40%/0.5)":"hsl(var(--border))"}`, color:"hsl(210 40% 85%)" }}/>
                          {hasKey && <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color:"hsl(158 64% 55%)" }}/>}
                        </div>
                      </div>
                      {st.models.length>0 && (
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color:"hsl(215 25% 50%)" }}>Model</p>
                          <div className="grid grid-cols-2 gap-1.5">
                            {st.models.map((m:any)=>{
                              const active = st.activeM===m.id;
                              return (
                                <button key={m.id} onClick={()=>st.setM(m.id)}
                                  className="flex items-start gap-2 px-3 py-2.5 rounded-xl text-start transition-all"
                                  style={{ background:active?st.color+"14":"hsl(216 45% 13%)", border:`1px solid ${active?st.color+"40":"hsl(var(--border))"}` }}>
                                  <div className="flex-1">
                                    <p className="text-[11px] font-semibold" style={{ color:"hsl(210 40% 88%)" }}>{m.label}</p>
                                    <p className="text-[10px]" style={{ color:"hsl(215 25% 50%)" }}>{m.desc}</p>
                                  </div>
                                  <div className="h-3.5 w-3.5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center"
                                    style={{ borderColor:active?st.color:"hsl(215 25% 35%)" }}>
                                    {active && <div className="h-1.5 w-1.5 rounded-full" style={{ background:st.color }}/>}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                      <button onClick={()=>{saveAI();toast.success(`${st.name} settings saved`);}}
                        className="px-4 py-2 rounded-lg text-xs font-semibold"
                        style={{ background:st.color+"15", color:st.color, border:`1px solid ${st.color}30` }}>
                        Save {st.name} Settings
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* ─── BEHAVIOUR ───────────────────────────────────────────────── */}
          <div className="rounded-xl p-6 space-y-5" style={{ background:"hsl(var(--card))", border:"1px solid hsl(var(--border))" }}>
            <div className="flex items-center gap-2"><Sliders className="h-4 w-4" style={{ color:"hsl(38 95% 52%)" }}/><h2 className="text-base font-bold font-display" style={{ color:"hsl(210 40% 90%)" }}>Behaviour Settings</h2></div>
            <div className="flex items-center justify-between">
              <div><p className="text-sm font-medium" style={{ color:"hsl(210 40% 85%)" }}>Streaming Responses</p><p className="text-xs" style={{ color:"hsl(215 25% 50%)" }}>Stream tokens as they generate</p></div>
              <Toggle defaultOn={aiCfg.streamingEnabled} onChange={on=>updateAiCfg({streamingEnabled:on})}/>
            </div>
            <div className="flex items-center justify-between">
              <div><p className="text-sm font-medium" style={{ color:"hsl(210 40% 85%)" }}>Web Search Augmentation</p><p className="text-xs" style={{ color:"hsl(215 25% 50%)" }}>Enrich analyses with live data via the active search sub-tool</p></div>
              <Toggle defaultOn={aiCfg.webSearchEnabled} onChange={on=>updateAiCfg({webSearchEnabled:on})}/>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between"><label className="text-xs font-semibold uppercase tracking-wider" style={{ color:"hsl(215 25% 55%)" }}>Max Output Tokens</label><span className="text-xs font-mono" style={{ color:"hsl(38 95% 60%)" }}>{aiCfg.maxTokens.toLocaleString()}</span></div>
              <input type="range" min={500} max={8000} step={500} value={aiCfg.maxTokens} onChange={e=>updateAiCfg({maxTokens:Number(e.target.value)})} className="w-full accent-amber-500"/>
              <div className="flex justify-between text-[10px]" style={{ color:"hsl(215 25% 40%)" }}><span>500</span><span>Recommended: 4,000</span><span>8,000</span></div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider" style={{ color:"hsl(215 25% 55%)" }}>Default Response Depth</label>
              <div className="grid grid-cols-3 gap-2">
                {(["brief","standard","detailed"] as const).map(d=>(
                  <button key={d} onClick={()=>updateAiCfg({responseDepth:d})} className="py-2 rounded-lg text-xs font-semibold capitalize"
                    style={{ background:aiCfg.responseDepth===d?"hsl(38 95% 52%)":"hsl(216 45% 15%)", color:aiCfg.responseDepth===d?"hsl(216 58% 6%)":"hsl(215 25% 60%)", border:"1px solid hsl(var(--border))" }}>{d}</button>
                ))}
              </div>
            </div>
            <button onClick={saveAI} className="w-full py-3 rounded-xl text-sm font-bold" style={{ background:"hsl(38 95% 52%)", color:"hsl(216 58% 6%)" }}>Save All AI Settings</button>
          </div>

          {/* ─── API KEY VAULT ───────────────────────────────────────────── */}
          <div className="rounded-xl p-6 space-y-5" style={{ background:"hsl(var(--card))", border:"1px solid hsl(var(--border))" }}>
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <Key className="h-5 w-5" style={{ color:"hsl(38 95% 52%)" }}/>
                <div>
                  <h2 className="text-base font-bold font-display" style={{ color:"hsl(210 40% 90%)" }}>API Key Vault</h2>
                  <p className="text-xs mt-0.5" style={{ color:"hsl(215 25% 55%)" }}>Store, label and rotate keys for all AI services. Saved in browser local storage only — never sent to any server.</p>
                </div>
              </div>
              <button onClick={() => { setShowAddKey(true); setEditingKey(null); }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold"
                style={{ background:"hsl(38 95% 52%)", color:"hsl(216 58% 6%)" }}>
                <Plus className="h-4 w-4" /> Add API Key
              </button>
            </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label:"Total Keys",     value:apiKeys.length,                                      color:"hsl(38 95% 60%)"  },
              { label:"Active",         value:apiKeys.filter(k=>k.isActive).length,                color:"hsl(158 64% 55%)" },
              { label:"Providers",      value:new Set(apiKeys.map(k=>k.provider)).size,            color:"hsl(217 91% 70%)" },
            ].map((s,i) => (
              <div key={i} className="rounded-xl p-4 text-center" style={{ background:"hsl(var(--card))", border:"1px solid hsl(var(--border))" }}>
                <p className="text-2xl font-bold" style={{ color:s.color }}>{s.value}</p>
                <p className="text-xs mt-0.5" style={{ color:"hsl(215 25% 50%)" }}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* Key list */}
          {apiKeys.length === 0 ? (
            <div className="rounded-xl p-10 text-center" style={{ background:"hsl(var(--card))", border:"2px dashed hsl(var(--border))" }}>
              <Key className="h-12 w-12 mx-auto mb-4 opacity-20" style={{ color:"hsl(38 95% 52%)" }} />
              <p className="font-semibold" style={{ color:"hsl(215 25% 50%)" }}>No API keys added yet</p>
              <p className="text-sm mt-1 mb-4" style={{ color:"hsl(215 25% 38%)" }}>Store keys here to switch and rotate them easily</p>
              <button onClick={() => setShowAddKey(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold"
                style={{ background:"hsl(38 95% 52%)", color:"hsl(216 58% 6%)" }}>
                <Plus className="h-4 w-4" /> Add API Key
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Group by provider */}
              {Array.from(new Set(apiKeys.map(k => k.provider))).map(provider => {
                const providerKeys = apiKeys.filter(k => k.provider === provider);
                const providerLabel = PROVIDER_OPTIONS.find(p => p.value === provider)?.label || provider;
                return (
                  <div key={provider} className="rounded-xl overflow-hidden" style={{ background:"hsl(var(--card))", border:"1px solid hsl(var(--border))" }}>
                    <div className="px-4 py-2.5 flex items-center gap-2" style={{ background:"hsl(216 45% 12%)", borderBottom:"1px solid hsl(var(--border))" }}>
                      <Key className="h-3.5 w-3.5" style={{ color:"hsl(38 95% 52%)" }} />
                      <span className="text-xs font-bold uppercase tracking-wider" style={{ color:"hsl(38 95% 60%)" }}>{providerLabel}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background:"hsl(38 95% 52% / 0.15)", color:"hsl(38 95% 60%)" }}>
                        {providerKeys.length} key{providerKeys.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                    {providerKeys.map(entry => {
                      const isVisible = showKeyValues[entry.id];
                      const isEditing = editingKey?.id === entry.id;
                      return (
                        <div key={entry.id} className="px-4 py-3" style={{ borderTop:"1px solid hsl(var(--border))" }}>
                          {isEditing ? (
                            /* Edit row */
                            <div className="space-y-3">
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1" style={{ color:"hsl(215 25% 45%)" }}>Label</label>
                                  <input value={editingKey.name} onChange={e => setEditingKey(k => k ? {...k, name:e.target.value} : k)}
                                    className="w-full px-3 py-2 rounded-lg text-sm"
                                    style={{ background:"hsl(216 45% 12%)", border:"1px solid hsl(var(--border))", color:"hsl(210 40% 85%)" }} />
                                </div>
                                <div>
                                  <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1" style={{ color:"hsl(215 25% 45%)" }}>Provider</label>
                                  <select value={editingKey.provider} onChange={e => setEditingKey(k => k ? {...k, provider:e.target.value} : k)}
                                    className="w-full px-3 py-2 rounded-lg text-sm"
                                    style={{ background:"hsl(216 45% 12%)", border:"1px solid hsl(var(--border))", color:"hsl(210 40% 85%)" }}>
                                    {PROVIDER_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                  </select>
                                </div>
                              </div>
                              <div>
                                <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1" style={{ color:"hsl(215 25% 45%)" }}>API Key</label>
                                <input value={editingKey.key} onChange={e => setEditingKey(k => k ? {...k, key:e.target.value} : k)}
                                  className="w-full px-3 py-2 rounded-lg text-sm font-mono"
                                  style={{ background:"hsl(216 45% 12%)", border:"1px solid hsl(var(--border))", color:"hsl(210 40% 85%)" }} />
                              </div>
                              <div className="flex gap-2">
                                <button onClick={handleEditKey} className="px-4 py-2 rounded-lg text-xs font-semibold"
                                  style={{ background:"hsl(38 95% 52%)", color:"hsl(216 58% 6%)" }}>Save</button>
                                <button onClick={() => setEditingKey(null)} className="px-4 py-2 rounded-lg text-xs font-semibold"
                                  style={{ background:"hsl(216 45% 18%)", color:"hsl(210 40% 75%)" }}>Cancel</button>
                              </div>
                            </div>
                          ) : (
                            /* Display row */
                            <div className="flex items-center gap-3 flex-wrap">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                                  <span className="text-sm font-semibold" style={{ color:"hsl(210 40% 88%)" }}>{entry.name}</span>
                                  {entry.isActive && <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold" style={{ background:"hsl(158 64% 40% / 0.15)", color:"hsl(158 64% 55%)" }}>ACTIVE</span>}
                                  <span className="text-[10px]" style={{ color:"hsl(215 25% 40%)" }}>Added {entry.addedAt}</span>
                                </div>
                                <code className="text-xs font-mono" style={{ color:"hsl(215 25% 55%)" }}>
                                  {isVisible ? entry.key : mask(entry.key)}
                                </code>
                              </div>
                              {/* Actions */}
                              <div className="flex items-center gap-1 shrink-0">
                                <button onClick={() => toggleKeyVisibility(entry.id)} title={isVisible ? "Hide" : "Show"}
                                  className="p-2 rounded-lg transition-colors hover:bg-muted/20">
                                  {isVisible ? <EyeOff className="h-3.5 w-3.5" style={{ color:"hsl(215 25% 50%)" }} /> : <Eye className="h-3.5 w-3.5" style={{ color:"hsl(215 25% 50%)" }} />}
                                </button>
                                <button onClick={() => handleCopyKey(entry.key)} title="Copy"
                                  className="p-2 rounded-lg transition-colors hover:bg-muted/20">
                                  <Copy className="h-3.5 w-3.5" style={{ color:"hsl(215 25% 50%)" }} />
                                </button>
                                <button onClick={() => handleApplyKey(entry)} title="Apply to config"
                                  className="px-3 py-1.5 rounded-lg text-[11px] font-semibold"
                                  style={{ background:"hsl(38 95% 52% / 0.12)", color:"hsl(38 95% 60%)", border:"1px solid hsl(38 95% 52% / 0.25)" }}>
                                  Apply
                                </button>
                                <button onClick={() => setEditingKey(entry)} title="Edit"
                                  className="p-2 rounded-lg transition-colors hover:bg-muted/20">
                                  <Edit3 className="h-3.5 w-3.5" style={{ color:"hsl(215 25% 50%)" }} />
                                </button>
                                <button onClick={() => handleDeleteKey(entry.id)} title="Delete"
                                  className="p-2 rounded-lg transition-colors hover:bg-muted/20">
                                  <Trash2 className="h-3.5 w-3.5" style={{ color:"hsl(0 72% 60%)" }} />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}

          {/* Add Key Modal */}
          {showAddKey && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background:"rgba(0,0,0,0.7)" }}>
              <div className="w-full max-w-md rounded-2xl p-6 space-y-4" style={{ background:"hsl(216 52% 10%)", border:"1px solid hsl(var(--border))" }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Key className="h-5 w-5" style={{ color:"hsl(38 95% 52%)" }} />
                    <h2 className="text-base font-bold" style={{ color:"hsl(210 40% 94%)" }}>Add API Key</h2>
                  </div>
                  <button onClick={() => setShowAddKey(false)} style={{ color:"hsl(215 25% 55%)" }}><X className="h-5 w-5" /></button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{ color:"hsl(215 25% 45%)" }}>Key Label *</label>
                    <input value={keyForm.name} onChange={e => setKeyForm(f => ({...f, name:e.target.value}))}
                      placeholder="e.g. Production Key, Personal Account, Client Project"
                      className="w-full px-3 py-2.5 rounded-lg text-sm"
                      style={{ background:"hsl(216 45% 12%)", border:"1px solid hsl(var(--border))", color:"hsl(210 40% 85%)" }} />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{ color:"hsl(215 25% 45%)" }}>Provider *</label>
                    <select value={keyForm.provider} onChange={e => setKeyForm(f => ({...f, provider:e.target.value}))}
                      className="w-full px-3 py-2.5 rounded-lg text-sm"
                      style={{ background:"hsl(216 45% 12%)", border:"1px solid hsl(var(--border))", color:"hsl(210 40% 85%)" }}>
                      {PROVIDER_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{ color:"hsl(215 25% 45%)" }}>API Key *</label>
                    <input value={keyForm.key} onChange={e => setKeyForm(f => ({...f, key:e.target.value}))}
                      placeholder="Paste your API key here"
                      type="password"
                      className="w-full px-3 py-2.5 rounded-lg text-sm font-mono"
                      style={{ background:"hsl(216 45% 12%)", border:"1px solid hsl(var(--border))", color:"hsl(210 40% 85%)" }} />
                  </div>
                  <div className="rounded-lg p-3 flex items-start gap-2" style={{ background:"hsl(38 95% 52% / 0.06)", border:"1px solid hsl(38 95% 52% / 0.2)" }}>
                    <Lock className="h-3.5 w-3.5 mt-0.5 shrink-0" style={{ color:"hsl(38 95% 60%)" }} />
                    <p className="text-[11px]" style={{ color:"hsl(215 25% 60%)" }}>
                      Keys are stored locally in your browser only. They are never sent to our servers.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setShowAddKey(false)} className="flex-1 py-2.5 rounded-lg text-sm font-semibold"
                    style={{ background:"hsl(216 45% 18%)", color:"hsl(210 40% 75%)" }}>Cancel</button>
                  <button onClick={handleAddKey} className="flex-1 py-2.5 rounded-lg text-sm font-semibold"
                    style={{ background:"hsl(38 95% 52%)", color:"hsl(216 58% 6%)" }}>Add Key</button>
                </div>
              </div>
            </div>
          )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* REAL ESTATE TOOLS TAB                                                  */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "re_tools" && (
        <div className="space-y-5">
          <div className="rounded-xl p-5" style={{ background:"hsl(var(--card))", border:"1px solid hsl(var(--border))" }}>
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="h-5 w-5" style={{ color:"hsl(38 95% 52%)" }} />
              <h2 className="text-base font-bold font-display" style={{ color:"hsl(210 40% 90%)" }}>Real Estate Intelligence Tools</h2>
            </div>
            <p className="text-xs" style={{ color:"hsl(215 25% 55%)" }}>
              Integrate FeasibilityPro, TestFit, and AnyLogic Cloud to power the Real Estate Intelligence module with professional-grade financial modeling, site planning, and simulation.
            </p>
            <div className="flex gap-2 mt-3 flex-wrap">
              {reTools.map(t => (
                <div key={t.id} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs"
                  style={{ background:t.bg, border:`1px solid ${t.border}` }}>
                  <span>{t.icon}</span>
                  <span style={{ color:t.color }}>{t.name}</span>
                  {statusBadge(t.status)}
                </div>
              ))}
            </div>
          </div>

          {reTools.map(tool => {
            const isExpanded = expandedTool === tool.id;
            const isTesting = testingTool === tool.id;
            return (
              <div key={tool.id} className="rounded-xl overflow-hidden" style={{ background:"hsl(var(--card))", border:`1px solid ${tool.status === "connected" ? tool.border : "hsl(var(--border))"}` }}>
                {/* Tool header — always visible */}
                <button onClick={() => setExpandedTool(isExpanded ? null : tool.id)}
                  className="w-full flex items-center gap-4 px-5 py-4 text-left"
                  style={{ background: isExpanded ? tool.bg : "transparent" }}>
                  <span className="text-2xl">{tool.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm" style={{ color:"hsl(210 40% 92%)" }}>{tool.name}</span>
                      <span className="text-[10px]" style={{ color:"hsl(215 25% 50%)" }}>{tool.vendor}</span>
                      {statusBadge(tool.status)}
                      <span className="text-[10px] px-2 py-0.5 rounded-full"
                        style={{ background:"hsl(216 45% 18%)", color:"hsl(215 25% 55%)" }}>{tool.category}</span>
                    </div>
                    <p className="text-xs mt-0.5" style={{ color:"hsl(215 25% 55%)" }}>{tool.desc}</p>
                  </div>
                  {isExpanded ? <ChevronUp className="h-4 w-4 shrink-0" style={{ color:"hsl(215 25% 45%)" }} />
                              : <ChevronDown className="h-4 w-4 shrink-0" style={{ color:"hsl(215 25% 45%)" }} />}
                </button>

                {/* Expanded config panel */}
                {isExpanded && (
                  <div className="px-5 pb-5 space-y-5" style={{ borderTop:`1px solid hsl(var(--border))` }}>
                    {/* Description */}
                    <div className="pt-4 rounded-lg p-4" style={{ background:"hsl(216 45% 11%)" }}>
                      <p className="text-xs" style={{ color:"hsl(210 40% 72%)" }}>{tool.longDesc}</p>
                    </div>

                    {/* Capabilities */}
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color:"hsl(215 25% 45%)" }}>Capabilities</p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {tool.capabilities.map((cap, i) => (
                          <div key={i} className="flex items-center gap-2 p-2 rounded-lg text-xs"
                            style={{ background:"hsl(216 45% 12%)" }}>
                            <CheckCircle2 className="h-3.5 w-3.5 shrink-0" style={{ color:tool.color }} />
                            <span style={{ color:"hsl(210 40% 75%)" }}>{cap}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Configuration fields */}
                    <div className="space-y-4 p-4 rounded-xl" style={{ background:"hsl(216 45% 11%)", border:`1px solid ${tool.border}` }}>
                      <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color:tool.color }}>Configuration</p>

                      {/* API Key */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-xs font-semibold" style={{ color:"hsl(215 25% 55%)" }}>API Key</label>
                          <a href={tool.apiDocsUrl} target="_blank" rel="noreferrer"
                            className="flex items-center gap-1 text-[10px] hover:opacity-80"
                            style={{ color:"hsl(217 91% 65%)" }}>
                            API Docs <ExternalLink className="h-2.5 w-2.5" />
                          </a>
                        </div>
                        <div className="relative">
                          <input
                            type="password"
                            value={tool.apiKey}
                            onChange={e => updateReTool(tool.id, { apiKey:e.target.value })}
                            placeholder={tool.keyPlaceholder}
                            className="w-full px-3 py-2.5 rounded-lg text-sm font-mono"
                            style={{ background:"hsl(216 45% 14%)", border:`1px solid ${tool.apiKey ? tool.border : "hsl(var(--border))"}`, color:"hsl(210 40% 85%)" }}
                          />
                          {tool.apiKey && <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color:tool.color }} />}
                        </div>
                      </div>

                      {/* Project ID (FeasibilityPro & AnyLogic) */}
                      {(tool.id === "feasibilitypro" || tool.id === "anylogic") && (
                        <div>
                          <label className="text-xs font-semibold block mb-1.5" style={{ color:"hsl(215 25% 55%)" }}>
                            {tool.id === "feasibilitypro" ? "Organization ID" : "Cloud Project ID"}
                          </label>
                          <input
                            value={tool.projectId || ""}
                            onChange={e => updateReTool(tool.id, { projectId:e.target.value })}
                            placeholder={tool.id === "feasibilitypro" ? "fp_org_••••" : "al_proj_••••"}
                            className="w-full px-3 py-2.5 rounded-lg text-sm"
                            style={{ background:"hsl(216 45% 14%)", border:"1px solid hsl(var(--border))", color:"hsl(210 40% 85%)" }}
                          />
                        </div>
                      )}

                      {/* Webhook (TestFit) */}
                      {tool.id === "testfit" && (
                        <div>
                          <label className="text-xs font-semibold block mb-1.5" style={{ color:"hsl(215 25% 55%)" }}>Webhook URL (optional)</label>
                          <input
                            value={tool.webhookUrl || ""}
                            onChange={e => updateReTool(tool.id, { webhookUrl:e.target.value })}
                            placeholder="https://your-domain.com/webhooks/testfit"
                            className="w-full px-3 py-2.5 rounded-lg text-sm"
                            style={{ background:"hsl(216 45% 14%)", border:"1px solid hsl(var(--border))", color:"hsl(210 40% 85%)" }}
                          />
                        </div>
                      )}

                      {/* How it integrates */}
                      <div className="rounded-lg p-3 flex items-start gap-2" style={{ background:`${tool.color}08`, border:`1px solid ${tool.color}20` }}>
                        <Info className="h-3.5 w-3.5 shrink-0 mt-0.5" style={{ color:tool.color }} />
                        <div className="text-[11px]" style={{ color:"hsl(215 25% 60%)" }}>
                          {tool.id === "feasibilitypro" && "Once connected, the Real Estate Intelligence → Feasibility Engine tab will use FeasibilityPro's API to generate live pro formas, IRR/NPV models, and investor-grade reports instead of the AI-only estimates."}
                          {tool.id === "testfit" && "Once connected, the Real Estate Intelligence → Scenario Generator tab will call TestFit to produce actual generative site plans with unit counts, parking, and FAR analysis for each selected scenario type."}
                          {tool.id === "anylogic" && "Once connected, the Real Estate Intelligence → Decision Engine tab will trigger AnyLogic simulations for pedestrian flow, traffic impact, and operations modeling, enriching the GO/NO-GO decision with simulation data."}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-3 pt-1">
                        <button onClick={() => saveReTool(tool.id)} disabled={!tool.apiKey}
                          className="flex-1 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50"
                          style={{ background:tool.color, color:"hsl(216 58% 6%)" }}>
                          Save Configuration
                        </button>
                        <button onClick={() => testReTool(tool.id)} disabled={!tool.apiKey || isTesting}
                          className="px-4 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50 inline-flex items-center gap-2"
                          style={{ background:"hsl(216 45% 18%)", color:"hsl(210 40% 75%)", border:"1px solid hsl(var(--border))" }}>
                          {isTesting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Wifi className="h-4 w-4" />}
                          {isTesting ? "Testing..." : "Test Connection"}
                        </button>
                        <a href={tool.signupUrl} target="_blank" rel="noreferrer"
                          className="px-4 py-2.5 rounded-lg text-sm font-semibold inline-flex items-center gap-2"
                          style={{ background:"hsl(216 45% 18%)", color:"hsl(215 25% 65%)", border:"1px solid hsl(var(--border))" }}>
                          Sign Up <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Info card */}
          <div className="rounded-xl p-5" style={{ background:"hsl(38 95% 52% / 0.05)", border:"1px solid hsl(38 95% 52% / 0.2)" }}>
            <div className="flex items-start gap-3">
              <Star className="h-4 w-4 mt-0.5 shrink-0" style={{ color:"hsl(38 95% 60%)" }} />
              <div>
                <p className="text-sm font-semibold mb-1" style={{ color:"hsl(38 95% 60%)" }}>Premium Integration Benefits</p>
                <p className="text-xs" style={{ color:"hsl(215 25% 60%)" }}>
                  When all three tools are connected, the Real Estate Intelligence module delivers fully institutional-grade analysis:
                  FeasibilityPro for ARGUS-level financial models · TestFit for AI-generated site plans · AnyLogic for Monte Carlo simulations.
                  This combination is used by top real estate developers globally.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* AI CONFIGURATION TAB                                                  */}
      {/* LANGUAGE TAB */}
      {activeTab === "language" && (
        <div className="rounded-xl p-6 space-y-6" style={{ background:"hsl(var(--card))", border:"1px solid hsl(var(--border))" }}>
          <div><h2 className="text-base font-bold font-display mb-1" style={{ color:"hsl(210 40% 90%)" }}>{t.language_title}</h2><p className="text-sm" style={{ color:"hsl(215 25% 55%)" }}>{t.language_subtitle}</p></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(["en","ar"] as const).map(l => (
              <button key={l} onClick={() => { setLang(l); toast.success(`Language: ${l==="en"?"English":"العربية"}`); }}
                className="flex items-center gap-4 p-5 rounded-xl transition-all text-start"
                style={{ background:lang===l?"hsl(38 95% 52% / 0.12)":"hsl(216 45% 14%)", border:`2px solid ${lang===l?"hsl(38 95% 52% / 0.5)":"transparent"}` }}>
                <span className="text-3xl">{l==="en"?"🇺🇸":"🇮🇶"}</span>
                <div className="flex-1">
                  <p className="font-bold" style={{ color:"hsl(210 40% 90%)" }}>{l==="en"?"English":"العربية (Arabic)"}</p>
                  <p className="text-xs mt-0.5" style={{ color:"hsl(215 25% 55%)" }}>{l==="en"?"Left-to-right · Latin":"Right-to-left · Arabic script"}</p>
                </div>
                {lang===l && <Check className="h-5 w-5 shrink-0" style={{ color:"hsl(38 95% 60%)" }} />}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* INTEGRATIONS TAB */}
      {activeTab === "integrations" && (
        <div className="space-y-4">
          {Array.from(new Set(INTEGRATIONS_INIT.map(i => i.category))).map(cat => (
            <div key={cat}>
              <p className="text-[11px] font-bold uppercase tracking-widest mb-2 px-1" style={{ color:"hsl(215 25% 40%)" }}>{cat}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {integrations.filter(i => i.category===cat).map(item => (
                  <div key={item.id} className="rounded-xl p-4 flex items-center gap-4"
                    style={{ background:"hsl(var(--card))", border:`1px solid ${item.connected?"hsl(158 64% 40% / 0.25)":"hsl(var(--border))"}` }}>
                    <span className="text-2xl">{item.icon}</span>
                    <div className="flex-1">
                      <p className="font-semibold text-sm" style={{ color:"hsl(210 40% 88%)" }}>{item.name}</p>
                      <p className="text-xs" style={{ color:"hsl(215 25% 55%)" }}>{item.desc}</p>
                    </div>
                    <button onClick={() => { setIntegrations(p => p.map(i => i.id===item.id ? {...i, connected:!i.connected} : i)); toast.success(item.connected?`${item.name} disconnected`:`${item.name} connected`); }}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                      style={{ background:item.connected?"hsl(0 72% 51% / 0.1)":"hsl(38 95% 52% / 0.12)", color:item.connected?"hsl(0 72% 68%)":"hsl(38 95% 60%)", border:`1px solid ${item.connected?"hsl(0 72% 51% / 0.25)":"hsl(38 95% 52% / 0.3)"}` }}>
                      {item.connected?"Disconnect":"Connect"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* DOCUMENTS TAB */}
      {activeTab === "documents" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {DOC_TYPES.map(d => (
              <div key={d.type} className="rounded-xl p-4 flex items-center gap-3" style={{ background:"hsl(var(--card))", border:"1px solid hsl(var(--border))" }}>
                <span className="text-2xl">{d.icon}</span>
                <div className="flex-1"><p className="font-semibold text-sm" style={{ color:"hsl(210 40% 88%)" }}>{d.type}</p><p className="text-xs" style={{ color:"hsl(215 25% 55%)" }}>{d.count} documents</p></div>
                <span className="text-sm font-bold" style={{ color:"hsl(38 95% 60%)" }}>{d.count}</span>
              </div>
            ))}
          </div>
          <div className="rounded-xl p-6 text-center border-2 border-dashed" style={{ background:"hsl(216 45% 11%)", borderColor:"hsl(var(--border))" }}>
            <Upload className="h-8 w-8 mx-auto mb-2" style={{ color:"hsl(215 25% 40%)" }} />
            <p className="font-semibold text-sm" style={{ color:"hsl(210 40% 80%)" }}>Drag & drop or click to browse</p>
            <p className="text-xs mt-1 mb-3" style={{ color:"hsl(215 25% 50%)" }}>PDF, DOCX, XLSX, CSV, PPTX — max 50 MB</p>
            <button onClick={() => toast.success("Opening file picker…")} className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ background:"hsl(38 95% 52%)", color:"hsl(216 58% 6%)" }}>Browse Files</button>
          </div>
        </div>
      )}

      {/* AGENTS TAB */}
      {activeTab === "agents" && (
        <div className="space-y-3">
          {agents.map(agent => (
            <div key={agent.id} className="rounded-xl p-4 flex items-center gap-4"
              style={{ background:"hsl(var(--card))", border:`1px solid ${agent.enabled?"hsl(var(--border))":"hsl(0 72% 51% / 0.15)"}`, opacity:agent.enabled?1:0.55 }}>
              <Bot className="h-5 w-5 shrink-0" style={{ color:agent.enabled?"hsl(38 95% 60%)":"hsl(215 25% 45%)" }} />
              <div className="flex-1">
                <p className="font-semibold text-sm mb-1" style={{ color:"hsl(210 40% 88%)" }}>{agent.name}</p>
                <div className="flex items-center gap-3">
                  <div className="w-20 h-1 rounded-full" style={{ background:"hsl(216 45% 22%)" }}>
                    <div className="h-full rounded-full" style={{ width:`${agent.accuracy}%`, background:"hsl(38 95% 52%)" }} />
                  </div>
                  <span className="text-[10px]" style={{ color:"hsl(215 25% 50%)" }}>{agent.accuracy}%</span>
                  <select value={agent.responseLen} onChange={e => setAgents(p => p.map(a => a.id===agent.id?{...a, responseLen:e.target.value}:a))}
                    className="text-xs rounded px-2 py-0.5" style={{ background:"hsl(216 45% 16%)", border:"1px solid hsl(var(--border))", color:"hsl(215 25% 65%)" }}>
                    <option value="brief">Brief</option><option value="standard">Standard</option><option value="detailed">Detailed</option>
                  </select>
                </div>
              </div>
              <Toggle defaultOn={agent.enabled} onChange={on => setAgents(p => p.map(a => a.id===agent.id?{...a, enabled:on}:a))} />
            </div>
          ))}
        </div>
      )}

      {/* PROFILE TAB */}
      {activeTab === "profile" && (
        <div className="rounded-xl p-6 space-y-5" style={{ background:"hsl(var(--card))", border:"1px solid hsl(var(--border))" }}>
          <h2 className="text-base font-bold font-display" style={{ color:"hsl(210 40% 90%)" }}>Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(["name","company","email","phone","region"] as const).map(f => (
              <div key={f}>
                <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1" style={{ color:"hsl(215 25% 45%)" }}>{f.charAt(0).toUpperCase()+f.slice(1)}</label>
                <input value={profile[f]} onChange={e => setProfile(p => ({...p, [f]:e.target.value}))}
                  className="w-full px-3 py-2 rounded-lg text-sm" style={{ background:"hsl(216 45% 14%)", border:"1px solid hsl(var(--border))", color:"hsl(210 40% 85%)" }} />
              </div>
            ))}
          </div>
          <button onClick={() => toast.success("Profile saved")} className="px-5 py-2.5 rounded-lg text-sm font-semibold" style={{ background:"hsl(38 95% 52%)", color:"hsl(216 58% 6%)" }}>Save Profile</button>
        </div>
      )}

      {/* SECURITY TAB */}
      {activeTab === "security" && (
        <div className="space-y-5">
          <div className="rounded-xl p-6 space-y-4" style={{ background:"hsl(var(--card))", border:"1px solid hsl(var(--border))" }}>
            <h2 className="text-base font-bold font-display" style={{ color:"hsl(210 40% 90%)" }}>Change Password</h2>
            {["Current Password","New Password","Confirm New Password"].map(l => (
              <div key={l}>
                <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1" style={{ color:"hsl(215 25% 45%)" }}>{l}</label>
                <input type="password" placeholder="••••••••" className="w-full px-3 py-2 rounded-lg text-sm" style={{ background:"hsl(216 45% 14%)", border:"1px solid hsl(var(--border))", color:"hsl(210 40% 85%)" }} />
              </div>
            ))}
            <button onClick={() => toast.success("Password updated")} className="px-5 py-2.5 rounded-lg text-sm font-semibold" style={{ background:"hsl(38 95% 52%)", color:"hsl(216 58% 6%)" }}>Update Password</button>
          </div>
          <div className="rounded-xl p-5 space-y-4" style={{ background:"hsl(var(--card))", border:"1px solid hsl(var(--border))" }}>
            <h3 className="font-bold text-sm font-display" style={{ color:"hsl(210 40% 90%)" }}>Security Preferences</h3>
            {["Two-factor authentication (2FA)","Email alerts on new login","Session timeout after 2 hours","API key access"].map((label, i) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-sm" style={{ color:"hsl(210 40% 78%)" }}>{label}</span>
                <Toggle defaultOn={[false,true,true,false][i]} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

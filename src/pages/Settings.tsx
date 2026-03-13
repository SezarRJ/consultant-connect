import { useState } from "react";
import { Settings as SettingsIcon, Languages, Plug, FolderOpen, Bot, User, Shield, Check, Upload, AlertCircle, Trash2, Download } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { toast } from "sonner";

const INTEGRATIONS_INIT = [
  { id: "google-drive", name: "Google Drive",  icon: "🗂️", desc: "Import documents from Google Drive",      category: "Storage",    connected: false },
  { id: "dropbox",      name: "Dropbox",        icon: "📦", desc: "Sync files and folders from Dropbox",     category: "Storage",    connected: false },
  { id: "salesforce",   name: "Salesforce",     icon: "☁️", desc: "Pull client data and CRM records",        category: "CRM",        connected: false },
  { id: "hubspot",      name: "HubSpot",        icon: "🟠", desc: "Sync contacts and deal pipelines",        category: "CRM",        connected: false },
  { id: "slack",        name: "Slack",          icon: "💬", desc: "Send analysis results to Slack channels", category: "Comms",      connected: false },
  { id: "notion",       name: "Notion",         icon: "📋", desc: "Export reports to Notion pages",          category: "Docs",       connected: false },
  { id: "zapier",       name: "Zapier",         icon: "⚡", desc: "Automate workflows with 5000+ apps",      category: "Automation", connected: false },
  { id: "powerbi",      name: "Power BI",       icon: "📊", desc: "Push data to Power BI dashboards",        category: "Analytics",  connected: false },
];

const AGENTS_INIT = [
  { id: "market-entry",  name: "Market Entry Agent",       accuracy: 94, enabled: true,  responseLen: "detailed"  },
  { id: "distributor",   name: "Distributor Agent",         accuracy: 91, enabled: true,  responseLen: "standard"  },
  { id: "competitor",    name: "Competitor Agent",           accuracy: 92, enabled: true,  responseLen: "detailed"  },
  { id: "pricing",       name: "Pricing Agent",              accuracy: 96, enabled: true,  responseLen: "standard"  },
  { id: "risk",          name: "Risk Assessment Agent",      accuracy: 93, enabled: true,  responseLen: "detailed"  },
  { id: "partner",       name: "Partner Matchmaking Agent",  accuracy: 89, enabled: true,  responseLen: "standard"  },
  { id: "sales",         name: "Sales Strategy Agent",       accuracy: 90, enabled: true,  responseLen: "detailed"  },
  { id: "export",        name: "Export Readiness Agent",     accuracy: 95, enabled: true,  responseLen: "standard"  },
  { id: "feasibility",   name: "Feasibility Study Agent",    accuracy: 91, enabled: true,  responseLen: "detailed"  },
];

const DOC_TYPES = [
  { type: "Market Research",   icon: "📈", count: 12, color: "amber" },
  { type: "Financial Reports", icon: "💰", count: 8,  color: "green" },
  { type: "Risk Reports",      icon: "⚠️", count: 5,  color: "red"   },
  { type: "Partner Profiles",  icon: "🤝", count: 19, color: "blue"  },
  { type: "Feasibility Plans", icon: "📋", count: 7,  color: "amber" },
  { type: "Competitor Intel",  icon: "🔍", count: 14, color: "blue"  },
];

const colorText: Record<string, string> = {
  amber: "hsl(38 95% 60%)", green: "hsl(158 64% 55%)",
  blue: "hsl(217 91% 70%)", red: "hsl(0 72% 68%)",
};

type Tab = "language" | "integrations" | "documents" | "agents" | "profile" | "security";

// ── Toggle component (avoids hooks inside loops) ──────────────────────────────
function Toggle({ defaultOn, onChange }: { defaultOn: boolean; onChange?: (v: boolean) => void }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button onClick={() => { const next = !on; setOn(next); onChange?.(next); }}
      className="w-10 h-5 rounded-full transition-all relative shrink-0"
      style={{ background: on ? "hsl(38 95% 52%)" : "hsl(216 45% 22%)" }}>
      <span className="absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white transition-transform"
        style={{ transform: on ? "translateX(20px)" : "translateX(0)" }} />
    </button>
  );
}

export default function Settings() {
  const { t, lang, setLang } = useI18n();
  const [activeTab, setActiveTab] = useState<Tab>("language");
  const [integrations, setIntegrations] = useState(INTEGRATIONS_INIT);
  const [agents, setAgents]           = useState(AGENTS_INIT);
  const [profile, setProfile]         = useState({
    name: "Ahmad Al-Rashidi", company: "Global Trade Consultants",
    email: "ahmad@gtc.com", phone: "+964 770 123 4567", region: "Iraq / MENA",
  });

  const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: "language",     label: t.tab_language,     icon: Languages  },
    { key: "integrations", label: t.tab_integrations, icon: Plug       },
    { key: "documents",    label: t.tab_documents,    icon: FolderOpen },
    { key: "agents",       label: t.tab_agents,       icon: Bot        },
    { key: "profile",      label: t.tab_profile,      icon: User       },
    { key: "security",     label: t.tab_security,     icon: Shield     },
  ];

  const toggleIntegration = (id: string) => {
    const item = integrations.find(i => i.id === id);
    setIntegrations(prev => prev.map(i => i.id === id ? { ...i, connected: !i.connected } : i));
    toast.success(item?.connected ? `${item.name} disconnected` : `${item?.name} connected`);
  };

  const intCategories = [...new Set(INTEGRATIONS_INIT.map(i => i.category))];

  const docPrefs = [
    "Auto-extract text from PDFs",
    "Enable AI document summarization",
    "Share documents across team members",
    "Auto-delete drafts after 30 days",
    "Compress images in uploaded documents",
  ];
  const docPrefsDefaults = [true, true, false, false, true];

  const securityPrefs = [
    "Two-factor authentication (2FA)",
    "Email alerts on new login",
    "Session timeout after 2 hours",
    "API key access enabled",
  ];
  const securityDefaults = [false, true, true, false];

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
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all"
            style={{
              background: activeTab === tab.key ? "hsl(38 95% 52%)" : "transparent",
              color: activeTab === tab.key ? "hsl(216 58% 6%)" : "hsl(215 25% 60%)",
            }}>
            <tab.icon className="h-3.5 w-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── LANGUAGE ─────────────────────────────────────────────────────────── */}
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
                  <p className="font-bold" style={{ color: "hsl(210 40% 90%)" }}>
                    {l === "en" ? "English" : "العربية (Arabic)"}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "hsl(215 25% 55%)" }}>
                    {l === "en" ? "Left-to-right • Latin script" : "Right-to-left • Arabic script"}
                  </p>
                </div>
                {lang === l && <Check className="h-5 w-5 shrink-0" style={{ color: "hsl(38 95% 60%)" }} />}
              </button>
            ))}
          </div>
          <div className="rounded-lg p-4 flex items-start gap-3" style={{ background: "hsl(38 95% 52% / 0.05)", border: "1px solid hsl(38 95% 52% / 0.2)" }}>
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "hsl(38 95% 60%)" }} />
            <p className="text-xs" style={{ color: "hsl(215 25% 65%)" }}>
              Language preference is saved automatically. The layout direction (LTR/RTL) switches immediately. All AI agents respond in the selected language.
            </p>
          </div>
        </div>
      )}

      {/* ── INTEGRATIONS ─────────────────────────────────────────────────────── */}
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
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all"
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

      {/* ── DOCUMENTS ────────────────────────────────────────────────────────── */}
      {activeTab === "documents" && (
        <div className="space-y-5">
          <div className="rounded-xl p-5" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
            <h2 className="text-base font-bold font-display mb-1" style={{ color: "hsl(210 40% 90%)" }}>Document Storage</h2>
            <p className="text-sm mb-4" style={{ color: "hsl(215 25% 55%)" }}>Manage how documents are stored and organised across the platform.</p>
            <div className="grid grid-cols-3 gap-4">
              {[["65", "Total Documents", "amber"], ["2.4 GB", "Storage Used", "blue"], ["18", "Shared Docs", "green"]].map(([v, l, c]) => (
                <div key={l} className="rounded-lg p-3 text-center" style={{ background: "hsl(216 45% 14%)" }}>
                  <p className="text-lg font-bold font-display" style={{ color: colorText[c] }}>{v}</p>
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
                <span className="text-sm font-bold font-mono-data" style={{ color: colorText[d.color] }}>{d.count}</span>
              </div>
            ))}
          </div>
          {/* Upload drop zone */}
          <div className="rounded-xl p-6 text-center border-2 border-dashed"
            style={{ background: "hsl(216 45% 11%)", borderColor: "hsl(var(--border))" }}>
            <Upload className="h-8 w-8 mx-auto mb-2" style={{ color: "hsl(215 25% 40%)" }} />
            <p className="font-semibold text-sm" style={{ color: "hsl(210 40% 80%)" }}>Drag & drop files or click to browse</p>
            <p className="text-xs mt-1 mb-3" style={{ color: "hsl(215 25% 50%)" }}>PDF, DOCX, XLSX, CSV, PPTX — max 50 MB</p>
            <button className="px-4 py-2 rounded-lg text-sm font-semibold"
              style={{ background: "hsl(38 95% 52%)", color: "hsl(216 58% 6%)" }}
              onClick={() => toast.success("Opening file picker…")}>
              Browse Files
            </button>
          </div>
          {/* Storage prefs */}
          <div className="rounded-xl p-5 space-y-4" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
            <h3 className="font-bold text-sm font-display" style={{ color: "hsl(210 40% 90%)" }}>Storage Preferences</h3>
            {docPrefs.map((label, i) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-sm" style={{ color: "hsl(210 40% 78%)" }}>{label}</span>
                <Toggle defaultOn={docPrefsDefaults[i]} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── AGENTS CONFIG ─────────────────────────────────────────────────────── */}
      {activeTab === "agents" && (
        <div className="space-y-4">
          <div className="rounded-xl p-5" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
            <h2 className="text-base font-bold font-display mb-1" style={{ color: "hsl(210 40% 90%)" }}>AI Agent Configuration</h2>
            <p className="text-sm" style={{ color: "hsl(215 25% 55%)" }}>Enable / disable individual agents and configure response depth.</p>
          </div>
          {agents.map(agent => (
            <div key={agent.id} className="rounded-xl p-4 flex items-center gap-4 transition-all"
              style={{ background: "hsl(var(--card))", border: `1px solid ${agent.enabled ? "hsl(var(--border))" : "hsl(0 72% 51% / 0.15)"}`, opacity: agent.enabled ? 1 : 0.6 }}>
              <Bot className="h-5 w-5 shrink-0" style={{ color: agent.enabled ? "hsl(38 95% 60%)" : "hsl(215 25% 45%)" }} />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm mb-1" style={{ color: "hsl(210 40% 88%)" }}>{agent.name}</p>
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1 rounded-full" style={{ background: "hsl(216 45% 22%)" }}>
                      <div className="h-full rounded-full" style={{ width: `${agent.accuracy}%`, background: "hsl(38 95% 52%)" }} />
                    </div>
                    <span className="text-[10px]" style={{ color: "hsl(215 25% 50%)" }}>{agent.accuracy}% accuracy</span>
                  </div>
                  <select
                    value={agent.responseLen}
                    onChange={e => setAgents(prev => prev.map(a => a.id === agent.id ? { ...a, responseLen: e.target.value } : a))}
                    className="text-xs rounded px-2 py-0.5"
                    style={{ background: "hsl(216 45% 16%)", border: "1px solid hsl(var(--border))", color: "hsl(215 25% 65%)" }}>
                    <option value="brief">Brief</option>
                    <option value="standard">Standard</option>
                    <option value="detailed">Detailed</option>
                  </select>
                </div>
              </div>
              <Toggle defaultOn={agent.enabled} onChange={on => setAgents(prev => prev.map(a => a.id === agent.id ? { ...a, enabled: on } : a))} />
            </div>
          ))}
        </div>
      )}

      {/* ── PROFILE ───────────────────────────────────────────────────────────── */}
      {activeTab === "profile" && (
        <div className="rounded-xl p-6 space-y-5" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
          <h2 className="text-base font-bold font-display" style={{ color: "hsl(210 40% 90%)" }}>Profile Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(["name", "company", "email", "phone", "region"] as const).map(field => (
              <div key={field}>
                <label className="section-label">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                <input value={profile[field]}
                  onChange={e => setProfile(p => ({ ...p, [field]: e.target.value }))}
                  className="w-full mt-1 px-3 py-2 rounded-lg text-sm"
                  style={{ background: "hsl(216 45% 14%)", border: "1px solid hsl(var(--border))", color: "hsl(210 40% 85%)" }} />
              </div>
            ))}
          </div>
          <button onClick={() => toast.success("Profile saved")}
            className="px-5 py-2.5 rounded-lg text-sm font-semibold"
            style={{ background: "hsl(38 95% 52%)", color: "hsl(216 58% 6%)" }}>
            {t.save}
          </button>
        </div>
      )}

      {/* ── SECURITY ──────────────────────────────────────────────────────────── */}
      {activeTab === "security" && (
        <div className="space-y-5">
          <div className="rounded-xl p-6 space-y-4" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
            <h2 className="text-base font-bold font-display" style={{ color: "hsl(210 40% 90%)" }}>Change Password</h2>
            {["Current Password", "New Password", "Confirm New Password"].map(label => (
              <div key={label}>
                <label className="section-label">{label}</label>
                <input type="password" placeholder="••••••••" className="w-full mt-1 px-3 py-2 rounded-lg text-sm"
                  style={{ background: "hsl(216 45% 14%)", border: "1px solid hsl(var(--border))", color: "hsl(210 40% 85%)" }} />
              </div>
            ))}
            <button onClick={() => toast.success("Password updated")}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold"
              style={{ background: "hsl(38 95% 52%)", color: "hsl(216 58% 6%)" }}>
              Update Password
            </button>
          </div>
          <div className="rounded-xl p-5 space-y-4" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
            <h3 className="font-bold text-sm font-display" style={{ color: "hsl(210 40% 90%)" }}>Security Preferences</h3>
            {securityPrefs.map((label, i) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-sm" style={{ color: "hsl(210 40% 78%)" }}>{label}</span>
                <Toggle defaultOn={securityDefaults[i]} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

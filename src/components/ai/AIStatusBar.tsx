import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Cpu, Globe, Key, AlertCircle, CheckCircle2, Zap } from "lucide-react";
import { loadAIConfig, ANTHROPIC_MODELS } from "@/lib/aiConfig";

interface Props { tokensUsed?: number; agentName?: string; }

export function AIStatusBar({ tokensUsed, agentName }: Props) {
  const [cfg, setCfg] = useState(loadAIConfig);

  useEffect(() => {
    const refresh = () => setCfg(loadAIConfig());
    window.addEventListener("focus", refresh);
    window.addEventListener("ai-config-updated" as any, refresh);
    return () => { window.removeEventListener("focus", refresh); window.removeEventListener("ai-config-updated" as any, refresh); };
  }, []);

  const hasKey   = !!cfg.anthropicKey;
  const modelDef = ANTHROPIC_MODELS.find(m => m.id === cfg.anthropicModel);
  const tc = modelDef?.tier === "flagship" ? "hsl(38 95% 60%)" : modelDef?.tier === "fast" ? "hsl(217 91% 70%)" : "hsl(158 64% 55%)";

  return (
    <div className="flex items-center gap-3 px-4 py-2 rounded-xl flex-wrap text-[11px]"
      style={{ background: "hsl(216 52% 8%)", border: "1px solid hsl(var(--border))" }}>
      <div className="flex items-center gap-1.5">
        {hasKey ? <CheckCircle2 className="h-3.5 w-3.5" style={{ color: "hsl(158 64% 55%)" }} /> : <AlertCircle className="h-3.5 w-3.5" style={{ color: "hsl(0 72% 68%)" }} />}
        <span className="font-medium" style={{ color: hasKey ? "hsl(158 64% 55%)" : "hsl(0 72% 68%)" }}>{hasKey ? "API Active" : "No API Key"}</span>
      </div>
      <span style={{ color: "hsl(216 40% 25%)" }}>|</span>
      <div className="flex items-center gap-1.5">
        <Cpu className="h-3.5 w-3.5" style={{ color: tc }} />
        <span className="font-medium" style={{ color: tc }}>{modelDef?.label ?? cfg.anthropicModel}</span>
      </div>
      <span style={{ color: "hsl(216 40% 25%)" }}>|</span>
      <div className="flex items-center gap-1.5">
        <Globe className="h-3.5 w-3.5" style={{ color: cfg.webSearchEnabled ? "hsl(217 91% 70%)" : "hsl(215 25% 40%)" }} />
        <span style={{ color: cfg.webSearchEnabled ? "hsl(217 91% 70%)" : "hsl(215 25% 40%)" }}>{cfg.webSearchEnabled ? `Web: ${cfg.webSearchProvider}` : "Web: off"}</span>
      </div>
      <span style={{ color: "hsl(216 40% 25%)" }}>|</span>
      <div className="flex items-center gap-1">
        <Zap className="h-3 w-3" style={{ color: cfg.streamingEnabled ? "hsl(38 95% 60%)" : "hsl(215 25% 40%)" }} />
        <span style={{ color: cfg.streamingEnabled ? "hsl(38 95% 60%)" : "hsl(215 25% 40%)" }}>{cfg.streamingEnabled ? "Streaming" : "Batch"}</span>
      </div>
      {!!tokensUsed && <><span style={{ color: "hsl(216 40% 25%)" }}>|</span><span className="font-mono-data" style={{ color: "hsl(215 25% 50%)" }}>{tokensUsed.toLocaleString()} tokens</span></>}
      {agentName && <><span style={{ color: "hsl(216 40% 25%)" }}>|</span><span style={{ color: "hsl(38 95% 52%)" }}>🤖 {agentName}</span></>}
      {!hasKey && (
        <Link to="/settings?tab=ai" className="ms-auto font-semibold px-3 py-1 rounded-md"
          style={{ background: "hsl(0 72% 51% / 0.15)", color: "hsl(0 72% 68%)", border: "1px solid hsl(0 72% 51% / 0.3)" }}>
          Add API Key →
        </Link>
      )}
    </div>
  );
}

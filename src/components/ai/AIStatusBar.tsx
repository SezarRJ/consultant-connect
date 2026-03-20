import { Cpu, CheckCircle2, Zap } from "lucide-react";

interface Props { tokensUsed?: number; agentName?: string; }

export function AIStatusBar({ tokensUsed, agentName }: Props) {
  return (
    <div className="flex items-center gap-3 px-4 py-2 rounded-xl flex-wrap text-[11px]"
      style={{ background: "hsl(216 52% 8%)", border: "1px solid hsl(var(--border))" }}>
      <div className="flex items-center gap-1.5">
        <CheckCircle2 className="h-3.5 w-3.5" style={{ color: "hsl(158 64% 55%)" }} />
        <span className="font-medium" style={{ color: "hsl(158 64% 55%)" }}>AI Active</span>
      </div>
      <span style={{ color: "hsl(216 40% 25%)" }}>|</span>
      <div className="flex items-center gap-1.5">
        <Cpu className="h-3.5 w-3.5" style={{ color: "hsl(217 91% 70%)" }} />
        <span className="font-medium" style={{ color: "hsl(217 91% 70%)" }}>Lovable AI</span>
      </div>
      <span style={{ color: "hsl(216 40% 25%)" }}>|</span>
      <div className="flex items-center gap-1">
        <Zap className="h-3 w-3" style={{ color: "hsl(38 95% 60%)" }} />
        <span style={{ color: "hsl(38 95% 60%)" }}>Streaming</span>
      </div>
      {!!tokensUsed && <><span style={{ color: "hsl(216 40% 25%)" }}>|</span><span className="font-mono-data" style={{ color: "hsl(215 25% 50%)" }}>{tokensUsed.toLocaleString()} tokens</span></>}
      {agentName && <><span style={{ color: "hsl(216 40% 25%)" }}>|</span><span style={{ color: "hsl(38 95% 52%)" }}>🤖 {agentName}</span></>}
    </div>
  );
}

/**
 * AIDisclaimer — shown on every AI analysis page.
 * Makes clear that outputs are AI-generated estimates, not verified research.
 */
import { AlertTriangle } from "lucide-react";

interface Props {
  compact?: boolean;
}

export function AIDisclaimer({ compact = false }: Props) {
  if (compact) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-[10px]"
        style={{ background: "hsl(38 95% 52%/0.08)", border: "1px solid hsl(38 95% 52%/0.25)", color: "hsl(38 95% 65%)" }}>
        <AlertTriangle className="h-3 w-3 shrink-0" />
        <span>
          <strong>AI-generated estimate.</strong> Numbers and market data are produced by a language model from training data — not from live research or verified sources. Validate before using in client deliverables.
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 px-4 py-3 rounded-xl"
      style={{ background: "hsl(38 95% 52%/0.08)", border: "1px solid hsl(38 95% 52%/0.25)" }}>
      <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" style={{ color: "hsl(38 95% 60%)" }} />
      <div>
        <p className="text-xs font-bold mb-0.5" style={{ color: "hsl(38 95% 65%)" }}>AI-Generated Estimate — Not Verified Research</p>
        <p className="text-[11px] leading-relaxed" style={{ color: "hsl(38 95% 50%)" }}>
          All figures, market sizes, competitor data, pricing, and recommendations are produced by an AI language model using training data. They are directionally useful starting points but are <strong>not sourced from live databases, trade registries, or primary research</strong>. Always validate critical numbers independently before presenting to clients or making investment decisions.
        </p>
      </div>
    </div>
  );
}

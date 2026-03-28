/**
 * ActiveEngagementBanner.tsx
 * ─────────────────────────────────────────────────────────────────
 * Persistent top bar shown inside every tool page.
 * Displays the active engagement and lets the user switch or create one.
 * ─────────────────────────────────────────────────────────────────
 */
import { useState } from "react";
import { useEngagementStore, Engagement, EngagementPhase } from "@/store/engagementStore";
import {
  Briefcase, ChevronDown, Plus, X, Check, AlertTriangle
} from "lucide-react";

const PHASES: EngagementPhase[] = [
  "Discovery", "Analysis", "Strategy", "Delivery", "Review", "Closed"
];

const PHASE_COLORS: Record<EngagementPhase, string> = {
  Discovery: "hsl(38 95% 52%)",
  Analysis:  "hsl(200 80% 55%)",
  Strategy:  "hsl(270 70% 60%)",
  Delivery:  "hsl(145 65% 45%)",
  Review:    "hsl(30 90% 55%)",
  Closed:    "hsl(215 25% 45%)",
};

// ── Create / Edit Modal ────────────────────────────────────────────
function EngagementModal({
  initial,
  onSave,
  onClose,
}: {
  initial?: Partial<Engagement>;
  onSave: (data: Omit<Engagement, "id" | "createdAt" | "updatedAt">) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    clientName:  initial?.clientName  ?? "",
    industry:    initial?.industry    ?? "",
    market:      initial?.market      ?? "",
    serviceType: initial?.serviceType ?? "",
    budget:      initial?.budget      ?? "",
    timeline:    initial?.timeline    ?? "",
    objectives:  initial?.objectives  ?? "",
    risks:       initial?.risks       ?? "",
    phase:       (initial?.phase      ?? "Discovery") as EngagementPhase,
    status:      (initial?.status     ?? "Active") as Engagement["status"],
    stakeholders: initial?.stakeholders ?? [],
  });

  const field = (key: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const row = (label: string, key: keyof typeof form, type: "input" | "textarea" | "select" = "input", options?: string[]) => (
    <div key={key}>
      <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1"
        style={{ color: "hsl(215 25% 50%)" }}>{label}</label>
      {type === "textarea" ? (
        <textarea
          rows={2}
          value={form[key] as string}
          onChange={field(key)}
          className="w-full rounded-md px-3 py-2 text-sm resize-none"
          style={{ background: "hsl(216 45% 12%)", color: "hsl(210 40% 88%)", border: "1px solid hsl(216 45% 22%)" }}
        />
      ) : type === "select" ? (
        <select
          value={form[key] as string}
          onChange={field(key)}
          className="w-full rounded-md px-3 py-2 text-sm"
          style={{ background: "hsl(216 45% 12%)", color: "hsl(210 40% 88%)", border: "1px solid hsl(216 45% 22%)" }}
        >
          {options?.map((o) => <option key={o}>{o}</option>)}
        </select>
      ) : (
        <input
          type="text"
          value={form[key] as string}
          onChange={field(key)}
          className="w-full rounded-md px-3 py-2 text-sm"
          style={{ background: "hsl(216 45% 12%)", color: "hsl(210 40% 88%)", border: "1px solid hsl(216 45% 22%)" }}
        />
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.7)" }}>
      <div className="w-full max-w-lg rounded-xl p-6 space-y-4 overflow-y-auto max-h-[90vh]"
        style={{ background: "hsl(216 58% 8%)", border: "1px solid hsl(216 45% 20%)" }}>
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold" style={{ color: "hsl(210 40% 92%)" }}>
            {initial?.id ? "Edit Engagement" : "New Engagement"}
          </h2>
          <button onClick={onClose}><X className="h-4 w-4" style={{ color: "hsl(215 25% 50%)" }} /></button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {row("Client Name", "clientName")}
          {row("Industry", "industry")}
          {row("Market / Country", "market")}
          {row("Service Type", "serviceType")}
          {row("Budget", "budget")}
          {row("Timeline", "timeline")}
          {row("Phase", "phase", "select", PHASES)}
          {row("Status", "status", "select", ["Active", "On Hold", "Completed", "Cancelled"])}
        </div>
        {row("Objectives", "objectives", "textarea")}
        {row("Key Risks", "risks", "textarea")}

        <div className="flex gap-2 pt-2">
          <button
            onClick={() => { if (form.clientName) onSave(form); }}
            className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all"
            style={{ background: "hsl(38 95% 52%)", color: "hsl(216 58% 6%)" }}
          >
            Save Engagement
          </button>
          <button onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-semibold"
            style={{ background: "hsl(216 45% 18%)", color: "hsl(210 40% 72%)" }}
          >Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ── Main Banner ────────────────────────────────────────────────────
export function ActiveEngagementBanner() {
  const {
    engagements, activeEngagementId,
    setActiveEngagement, createEngagement, updateEngagement,
    getActiveEngagement,
  } = useEngagementStore();

  const active = getActiveEngagement();
  const [open, setOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Engagement | null>(null);

  const handleCreate = (data: Omit<Engagement, "id" | "createdAt" | "updatedAt">) => {
    createEngagement(data);
    setShowModal(false);
  };

  const handleEdit = (data: Omit<Engagement, "id" | "createdAt" | "updatedAt">) => {
    if (editTarget) updateEngagement(editTarget.id, data);
    setEditTarget(null);
    setShowModal(false);
  };

  return (
    <>
      <div
        className="flex items-center gap-3 px-4 py-2.5 border-b shrink-0"
        style={{
          background: "hsl(216 58% 7%)",
          borderColor: "hsl(216 45% 18%)",
          minHeight: 52,
        }}
      >
        <Briefcase className="h-4 w-4 shrink-0" style={{ color: "hsl(38 95% 52%)" }} />

        {active ? (
          <>
            {/* Phase badge */}
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0"
              style={{
                background: `${PHASE_COLORS[active.phase]}22`,
                color: PHASE_COLORS[active.phase],
                border: `1px solid ${PHASE_COLORS[active.phase]}44`,
              }}
            >
              {active.phase}
            </span>

            {/* Client + service */}
            <span className="text-sm font-semibold truncate" style={{ color: "hsl(210 40% 92%)" }}>
              {active.clientName}
            </span>
            <span className="text-xs truncate hidden sm:block" style={{ color: "hsl(215 25% 50%)" }}>
              {active.serviceType} · {active.market}
            </span>

            {/* Edit button */}
            <button
              onClick={() => { setEditTarget(active); setShowModal(true); }}
              className="ml-auto text-[11px] px-2 py-1 rounded-md shrink-0 transition-all hover:opacity-80"
              style={{ background: "hsl(216 45% 18%)", color: "hsl(215 25% 60%)" }}
            >
              Edit
            </button>
          </>
        ) : (
          <span className="text-sm flex items-center gap-1.5" style={{ color: "hsl(215 25% 50%)" }}>
            <AlertTriangle className="h-3.5 w-3.5" style={{ color: "hsl(38 85% 50%)" }} />
            No active engagement — select or create one
          </span>
        )}

        {/* Switcher */}
        <div className="relative ml-auto shrink-0" style={active ? { marginLeft: 4 } : {}}>
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg transition-all"
            style={{ background: "hsl(216 45% 16%)", color: "hsl(38 95% 55%)" }}
          >
            Switch <ChevronDown className="h-3 w-3" />
          </button>

          {open && (
            <div
              className="absolute right-0 top-9 z-40 w-64 rounded-xl py-2 shadow-2xl"
              style={{ background: "hsl(216 58% 8%)", border: "1px solid hsl(216 45% 20%)" }}
            >
              {engagements.length === 0 && (
                <p className="px-4 py-3 text-xs" style={{ color: "hsl(215 25% 45%)" }}>
                  No engagements yet.
                </p>
              )}
              {engagements.map((e) => (
                <button
                  key={e.id}
                  onClick={() => { setActiveEngagement(e.id); setOpen(false); }}
                  className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-xs transition-all hover:opacity-80"
                  style={{
                    background: e.id === activeEngagementId ? "hsl(38 95% 52% / 0.1)" : "transparent",
                    color: "hsl(210 40% 82%)",
                  }}
                >
                  {e.id === activeEngagementId && <Check className="h-3 w-3 shrink-0" style={{ color: "hsl(38 95% 52%)" }} />}
                  <span className="flex-1 truncate font-medium">{e.clientName}</span>
                  <span style={{ color: "hsl(215 25% 45%)" }}>{e.phase}</span>
                </button>
              ))}
              <div className="border-t mt-1 pt-1" style={{ borderColor: "hsl(216 45% 18%)" }}>
                <button
                  onClick={() => { setOpen(false); setEditTarget(null); setShowModal(true); }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-xs font-semibold transition-all"
                  style={{ color: "hsl(38 95% 52%)" }}
                >
                  <Plus className="h-3.5 w-3.5" /> New Engagement
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <EngagementModal
          initial={editTarget ?? undefined}
          onSave={editTarget ? handleEdit : handleCreate}
          onClose={() => { setShowModal(false); setEditTarget(null); }}
        />
      )}
    </>
  );
}

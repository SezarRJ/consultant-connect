/**
 * engagementStore.ts
 * ─────────────────────────────────────────────────────────────────
 * Global "Active Engagement" context.
 * Any page that needs client / project context pulls from here.
 * All AI tool system-prompts should include `buildEngagementContext()`
 * so every model call gets the shared brief automatically.
 * ─────────────────────────────────────────────────────────────────
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";

// ── Types ─────────────────────────────────────────────────────────

export type EngagementPhase =
  | "Discovery"
  | "Analysis"
  | "Strategy"
  | "Delivery"
  | "Review"
  | "Closed";

export type EngagementStatus = "Active" | "On Hold" | "Completed" | "Cancelled";

export interface Stakeholder {
  id: string;
  name: string;
  role: string;
  influence: "High" | "Medium" | "Low";
  stance: "Champion" | "Supporter" | "Neutral" | "Skeptic" | "Blocker";
}

export interface Engagement {
  id: string;
  clientName: string;
  industry: string;
  market: string;          // e.g. "Iraq", "Saudi Arabia", "MENA"
  serviceType: string;     // e.g. "Market Entry", "Feasibility Study"
  budget: string;          // free text, e.g. "$120,000"
  timeline: string;        // e.g. "6 months"
  objectives: string;
  risks: string;
  phase: EngagementPhase;
  status: EngagementStatus;
  stakeholders: Stakeholder[];
  createdAt: string;       // ISO date
  updatedAt: string;
}

// ── Store ─────────────────────────────────────────────────────────

interface EngagementStore {
  engagements: Engagement[];
  activeEngagementId: string | null;

  // CRUD
  createEngagement: (data: Omit<Engagement, "id" | "createdAt" | "updatedAt">) => string;
  updateEngagement: (id: string, patch: Partial<Engagement>) => void;
  deleteEngagement: (id: string) => void;

  // Active selection
  setActiveEngagement: (id: string | null) => void;
  getActiveEngagement: () => Engagement | null;

  // Stakeholders (on active engagement)
  addStakeholder: (engagementId: string, s: Omit<Stakeholder, "id">) => void;
  removeStakeholder: (engagementId: string, stakeholderId: string) => void;
}

export const useEngagementStore = create<EngagementStore>()(
  persist(
    (set, get) => ({
      engagements: [],
      activeEngagementId: null,

      createEngagement: (data) => {
        const id = `eng_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
        const now = new Date().toISOString();
        const engagement: Engagement = { ...data, id, createdAt: now, updatedAt: now };
        set((s) => ({ engagements: [...s.engagements, engagement], activeEngagementId: id }));
        return id;
      },

      updateEngagement: (id, patch) =>
        set((s) => ({
          engagements: s.engagements.map((e) =>
            e.id === id ? { ...e, ...patch, updatedAt: new Date().toISOString() } : e
          ),
        })),

      deleteEngagement: (id) =>
        set((s) => ({
          engagements: s.engagements.filter((e) => e.id !== id),
          activeEngagementId: s.activeEngagementId === id ? null : s.activeEngagementId,
        })),

      setActiveEngagement: (id) => set({ activeEngagementId: id }),

      getActiveEngagement: () => {
        const { engagements, activeEngagementId } = get();
        return engagements.find((e) => e.id === activeEngagementId) ?? null;
      },

      addStakeholder: (engagementId, s) => {
        const id = `sh_${Date.now()}`;
        set((state) => ({
          engagements: state.engagements.map((e) =>
            e.id === engagementId
              ? { ...e, stakeholders: [...e.stakeholders, { ...s, id }], updatedAt: new Date().toISOString() }
              : e
          ),
        }));
      },

      removeStakeholder: (engagementId, stakeholderId) =>
        set((state) => ({
          engagements: state.engagements.map((e) =>
            e.id === engagementId
              ? { ...e, stakeholders: e.stakeholders.filter((s) => s.id !== stakeholderId) }
              : e
          ),
        })),
    }),
    { name: "consultai-engagements" }
  )
);

// ── Helper: build a context string to inject into every AI system prompt ──────

export function buildEngagementContext(engagement: Engagement | null): string {
  if (!engagement) return "";
  return `
ACTIVE ENGAGEMENT CONTEXT:
- Client: ${engagement.clientName}
- Industry: ${engagement.industry}
- Market / Country: ${engagement.market}
- Service Type: ${engagement.serviceType}
- Budget: ${engagement.budget}
- Timeline: ${engagement.timeline}
- Current Phase: ${engagement.phase}
- Objectives: ${engagement.objectives}
- Key Risks: ${engagement.risks}
- Key Stakeholders: ${engagement.stakeholders.map((s) => `${s.name} (${s.role}, ${s.stance})`).join(", ") || "None listed"}

Always tailor your analysis and recommendations specifically to this engagement context.
`.trim();
}

# ConsultAI Pro — Redesign Integration Guide

## What changed and why

The app has been redesigned from **30+ scattered pages** into a **5-hub engagement-centered workspace**.
Every AI tool now automatically shares the active client's context (name, industry, market, objectives, risks)
so you stop re-entering the same information on every page.

---

## Files to replace / add

### Replace these existing files:

| File | Replace at |
|------|-----------|
| `Dashboard.tsx` | `src/pages/Dashboard.tsx` |
| `App.tsx` | `src/App.tsx` |
| `AppSidebar.tsx` | `src/components/layout/AppSidebar.tsx` |
| `AppLayout.tsx` | `src/components/layout/AppLayout.tsx` |
| `appStore.ts` | `src/store/appStore.js` → rename to `.ts` |

### Add these new files:

| File | Add at |
|------|--------|
| `engagementStore.ts` | `src/store/engagementStore.ts` |
| `ActiveEngagementBanner.tsx` | `src/components/layout/ActiveEngagementBanner.tsx` |
| `EngagementHub.tsx` | `src/pages/EngagementHub.tsx` |
| `AnalysisHub.tsx` | `src/pages/AnalysisHub.tsx` |
| `StrategyHub.tsx` | `src/pages/StrategyHub.tsx` |
| `DeliverablesHub.tsx` | `src/pages/DeliverablesHub.tsx` |
| `PracticeOpsHub.tsx` | `src/pages/PracticeOpsHub.tsx` |

### Keep all other existing files as-is:

All original pages (CRM, Projects, Tasks, Financial, DocumentHub, AIAssistant, Agents,
RealEstateIntelligence, ISOPreparation, CompanyDevelopment, ServiceModules, Settings, etc.)
remain untouched. The new hub architecture links to them — they do not need to be deleted.

---

## Install one new dependency

The engagement store uses `zustand/middleware` for persistence (already used in the project).
If you see an import error, run:

```bash
npm install zustand
```

---

## New routing structure

```
/                  → Dashboard (engagement-aware)
/engagement        → Hub A: Client Briefing, Stakeholders, Tracker, Docs, Log
/analysis          → Hub B: 8 analysis tools
/strategy          → Hub C: Workshop, Benchmarking, Sales, Partner, Playbooks
/deliverables      → Hub D: Proposal, Report, Deliverables, Exec Summary
/practice-ops      → Hub E: CRM, Projects, Tasks, Financial

/crm               → CRM (full page, linked from Practice Ops)
/projects          → Projects (full page)
/tasks             → Tasks (full page)
/financial         → Financial (full page)
/documents         → DocumentHub (full page)
/ai-assistant      → AIAssistant
/agents            → Agents
/settings          → Settings

/real-estate-intelligence  → Specialist module (not in sidebar)
/iso-preparation           → Specialist module
/company-development       → Specialist module
/service-modules           → Specialist module
```

All old routes (`/market-entry`, `/competitor-analysis`, etc.) redirect to the
appropriate hub so any bookmarks keep working.

---

## How the Active Engagement context works

### 1. Create an engagement

Click **Switch → New Engagement** in the top banner, or go to `/engagement`.
Fill in: client name, industry, market, service type, budget, timeline, objectives, risks.

### 2. Select it as active

The banner at the top of every page shows the active engagement.
Click **Switch** to change between engagements.

### 3. Every AI tool inherits the context automatically

Each hub page calls `buildEngagementContext(eng)` from `engagementStore.ts`
and injects it into the AI system prompt. This means:

- You never type the client name again after creating the engagement.
- Market Entry analysis knows the target market.
- Risk Assessment knows the known risks.
- Proposal Builder knows the budget and timeline.
- All outputs are consistently scoped to the same engagement.

### 4. Saving outputs (next step)

Currently outputs are displayed in the UI. The recommended next step is to
save AI outputs back into the engagement record by extending `engagementStore.ts`
with an `outputs` field per engagement, keyed by tool ID.

---

## Extending the system

### Adding a new analysis tool to AnalysisHub

In `AnalysisHub.tsx`, add an entry to the `SUB_SERVICES` array:

```typescript
{
  id: "my-tool",
  label: "My Tool",
  icon: SomeIcon,
  tier: "flash",
  description: "What this tool does.",
  promptKey: "my analysis type",
  extraFields: [{ key: "param1", label: "Parameter", placeholder: "…" }],
}
```

That's it. The `SubServiceRunner` component handles the UI, AI call, and output display.

### Wiring outputs to the next tool

To make Analysis feed into Strategy (output chaining), you can:

1. Add an `outputs` map to `engagementStore.ts`:
   ```typescript
   outputs: Record<string, string>; // toolId → last result text
   saveOutput: (toolId: string, text: string) => void;
   ```

2. In each hub, call `saveOutput(sub.id, rawText)` after a successful run.

3. In the next hub's system prompt, pull relevant outputs:
   ```typescript
   const prior = eng.outputs?.['market-entry'] ?? '';
   const systemPrompt = `…${buildEngagementContext(eng)}
   Prior market entry findings: ${prior}`;
   ```

### Adding a niche specialist module

Keep it out of the sidebar. Add it as:
- A new route in `App.tsx` with its own page component.
- A link in the "Specialist Modules" section of the Dashboard.
- Optionally, a link inside the relevant hub's tab panel.

---

## Architecture diagram

```
┌─────────────────────────────────────────────────────────┐
│                      AppLayout                          │
│  ┌───────────────┐  ┌───────────────────────────────┐  │
│  │  AppSidebar   │  │  ActiveEngagementBanner        │  │
│  │               │  │  [client · phase · switch]     │  │
│  │  Dashboard    │  ├───────────────────────────────┤  │
│  │  ──────────   │  │                               │  │
│  │  Engagement   │  │         Page / Hub            │  │
│  │  Analysis     │  │                               │  │
│  │  Strategy     │  │  all AI calls pull from:      │  │
│  │  Deliverables │  │  useEngagementStore()          │  │
│  │  Practice Ops │  │  buildEngagementContext()      │  │
│  │               │  │                               │  │
│  │  Settings     │  └───────────────────────────────┘  │
│  └───────────────┘                                      │
└─────────────────────────────────────────────────────────┘

                  engagementStore (Zustand + persist)
                  ┌──────────────────────────────────┐
                  │  engagements[]                   │
                  │  activeEngagementId              │
                  │  buildEngagementContext()        │
                  └──────────────────────────────────┘
                           ↑ used by all hubs
```

---

## Recommended next priorities

1. **Save outputs per engagement** — store AI results inside the engagement record.
2. **Output chaining** — pass prior analysis results into subsequent tool prompts.
3. **Database migration** — move engagement data from localStorage to Supabase.
4. **Export to PDF** — add a "Download as PDF" button on Deliverables outputs.
5. **Engagement templates** — pre-fill engagement fields based on service type.

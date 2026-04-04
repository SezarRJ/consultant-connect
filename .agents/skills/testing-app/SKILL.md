# Testing consultant-connect

## Dev Server

```bash
npm run dev
# Runs on http://localhost:8080/
```

No backend or API keys required — the app uses Zustand local state management.

## Key Navigation Paths

| Page | URL | What to verify |
|------|-----|----------------|
| Dashboard | `/` | Active engagement banner, guided workflow, domain cards |
| CRM | `/crm` | Contact management |
| Engagement | `/engagement` | Phase tracker, RequirementsPanel, stakeholders |
| Data Collection | `/data-collection` | Data input forms |
| Analysis Hub | `/analysis` | 8 analysis tools, RequirementsPanel with phase requirements |
| Strategy Hub | `/strategy` | Strategy frameworks (SWOT, Porter's, etc.), RequirementsPanel |
| Deliverables Hub | `/deliverables` | Proposal Builder, Report Generator, RequirementsPanel |
| Real Estate Intelligence | `/real-estate-intelligence` | Location, Feasibility, Sensitivity, Decision tabs |
| Workflow Guide | `/workflow-guide` | Step-by-step workflow documentation |

## Engagement Workflow

Phases: Discovery → Data Collection → Analysis → Strategy → Deliverables → Review → Closed

To create a new engagement:
1. Click "Switch" button in top banner
2. Click "+ New Engagement"
3. Fill Engagement Name + Client Name (minimum required)
4. Click "Create & Set Active"

The engagement banner at the top shows: client name, phase, health status.

## Key Components to Test

- **RequirementsPanel**: Used in Analysis, Strategy, and Deliverables hubs. Shows phase requirements (required info, required documents, readiness badge). Uses `getPhaseRequirement()` from `engagementStore.ts`.
- **ActiveEngagementBanner**: Top bar with engagement switcher and "New Engagement" modal.
- **Phase progression**: Each hub page has "Complete [Phase] and open next step" button.

## Build & Lint

```bash
npm run build   # Production build
npm run lint    # ESLint check
```

Note: ~220 pre-existing `@typescript-eslint/no-explicit-any` lint warnings exist across the codebase.

## Architecture Notes

- ~24 legacy page files in `src/pages/` exist without direct routes — they are superseded by hub pages (AnalysisHub, StrategyHub, DeliverablesHub) with redirect routes for backward compatibility.
- State management: Zustand store at `src/store/engagementStore.ts`
- Routing: React Router in `src/App.tsx`

// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface Client {
  id: string;
  name: string;
  industry: string;
  revenue: string;
  location: string;
  healthScore: number;
  logo: string;
  contactName: string;
  contactRole: string;
  description: string;
}

export interface Engagement {
  id: string;
  clientId: string;
  clientName: string;
  type: string;
  phase: 'Discovery' | 'Analysis' | 'Strategy' | 'Reporting' | 'Complete';
  progress: number;
  status: 'On Track' | 'Needs Attention' | 'Complete';
  startDate: string;
  dueDate: string;
}

export interface Insight {
  id: string;
  clientId: string;
  clientName: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  source: string;
}

export interface AIAgent {
  id: string;
  name: string;
  model: string;
  task: string;
  status: 'queued' | 'running' | 'complete' | 'error';
  progress: number;
  lastRun: string;
  description: string;
}

export interface Strategy {
  id: string;
  clientId: string;
  label: string;
  title: string;
  description: string;
  impactScore: number;
  riskScore: number;
  investmentLevel: 'Low' | 'Medium' | 'High';
  revenueChange: string;
  costChange: string;
  roiBreakeven: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface SimulationResult {
  strategyId: string;
  months: string[];
  p10: number[];
  p50: number[];
  p90: number[];
  npv: { p10: number; p50: number; p90: number };
}

export interface Document {
  id: string;
  clientId: string;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  extractionStatus: 'pending' | 'processing' | 'complete' | 'error';
}

export interface Deliverable {
  id: string;
  clientId: string;
  clientName: string;
  type: string;
  audience: string;
  format: string;
  status: 'generating' | 'complete' | 'error';
  createdAt: string;
  downloadUrl?: string;
}

export interface Playbook {
  id: string;
  title: string;
  category: string;
  successRate: number;
  timesUsed: number;
  description: string;
}

export interface KPI {
  id: string;
  goal: string;
  status: 'On Track' | 'Behind' | 'At Risk';
  progress: number;
}

export interface ActivityLogItem {
  id: string;
  action: string;
  timestamp: string;
  type: string;
  clientId?: string;
}

// ─── Data (empty — all real data comes from the database) ─────────────────────

export const clients: Client[] = [];
export const engagements: Engagement[] = [];
export const insights: Insight[] = [];
export const agents: AIAgent[] = [];
export const strategies: Strategy[] = [];
export const simulationResults: SimulationResult[] = [];
export const documents: Document[] = [];
export const deliverables: Deliverable[] = [];
export const playbooks: Playbook[] = [];
export const clientKPIs: Record<string, KPI[]> = {};
export const revenueData: { month: string; actual: number; target: number }[] = [];
export const regionalData: { name: string; value: number; fill: string }[] = [];
export const activityLog: ActivityLogItem[] = [];

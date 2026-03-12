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

// G-10: simulation data per strategy (P10/P50/P90 ROI %, monthly snapshots)
export interface SimulationResult {
  strategyId: string;
  months: string[];
  p10: number[];  // pessimistic
  p50: number[];  // base case
  p90: number[];  // optimistic
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

// G-13: per-client KPIs stored in mockData
export interface KPI {
  id: string;
  goal: string;
  status: 'On Track' | 'Behind' | 'At Risk';
  progress: number;
}

// G-12 FIX: activityLog items now have clientId for per-client filtering
export interface ActivityLogItem {
  id: string;
  action: string;
  timestamp: string;
  type: string;
  clientId?: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

export const clients: Client[] = [
  {
    id: '1',
    name: 'ABC Distribution',
    industry: 'Distribution & Logistics',
    revenue: '$45M',
    location: 'Chicago, IL',
    healthScore: 78,
    logo: 'A',
    contactName: 'Sarah Chen',
    contactRole: 'VP of Operations',
    description:
      'Mid-market distribution company specialising in last-mile delivery for e-commerce brands. Currently facing margin compression and operational inefficiencies.',
  },
  {
    id: '2',
    name: 'XYZ Manufacturing',
    industry: 'Manufacturing',
    revenue: '$120M',
    location: 'Detroit, MI',
    healthScore: 92,
    logo: 'X',
    contactName: 'James Rodriguez',
    contactRole: 'CEO',
    description:
      'Precision manufacturing firm serving aerospace and defence clients. Exploring digital transformation and predictive maintenance.',
  },
  {
    id: '3',
    name: 'Retail Plus Co',
    industry: 'Retail',
    revenue: '$28M',
    location: 'Austin, TX',
    healthScore: 54,
    logo: 'R',
    contactName: 'Emily Watson',
    contactRole: 'COO',
    description:
      'Omnichannel retail brand with 40 stores and growing online presence. Struggling with inventory optimisation and customer retention.',
  },
];

export const engagements: Engagement[] = [
  { id: '1', clientId: '1', clientName: 'ABC Distribution',  type: 'Strategic Assessment',   phase: 'Analysis',   progress: 65, status: 'On Track',       startDate: '2026-01-15', dueDate: '2026-04-15' },
  { id: '2', clientId: '2', clientName: 'XYZ Manufacturing',  type: 'Digital Transformation', phase: 'Strategy',   progress: 80, status: 'On Track',       startDate: '2025-11-01', dueDate: '2026-03-30' },
  { id: '3', clientId: '3', clientName: 'Retail Plus Co',     type: 'Operational Review',     phase: 'Discovery',  progress: 30, status: 'Needs Attention', startDate: '2026-02-01', dueDate: '2026-05-01' },
];

export const insights: Insight[] = [
  { id: '1', clientId: '1', clientName: 'ABC Distribution',  severity: 'critical', title: 'Revenue Decline Detected',         description: 'Q1 revenue is trending 12% below forecast. Primary driver: loss of 3 key accounts in the midwest region.',              timestamp: '2026-03-11T08:30:00Z', isRead: false, source: 'Revenue Analysis Agent'         },
  { id: '2', clientId: '2', clientName: 'XYZ Manufacturing',  severity: 'info',     title: 'New Market Opportunity',            description: 'Analysis of defence contracts reveals a $15M opportunity in unmanned systems components.',                          timestamp: '2026-03-11T07:15:00Z', isRead: false, source: 'Market Intelligence Agent'      },
  { id: '3', clientId: '3', clientName: 'Retail Plus Co',     severity: 'warning',  title: 'Inventory Carrying Costs Rising',   description: 'Carrying costs increased 23% YoY. Slow-moving SKUs account for 35% of warehouse space.',                           timestamp: '2026-03-10T16:45:00Z', isRead: true,  source: 'Operations Agent'               },
  { id: '4', clientId: '1', clientName: 'ABC Distribution',  severity: 'info',     title: 'Competitor Analysis Update',        description: "FastShip Inc. expanded same-day delivery to 3 new metro areas overlapping with ABC's service territory.",           timestamp: '2026-03-10T14:20:00Z', isRead: true,  source: 'Competitive Intelligence Agent' },
  { id: '5', clientId: '2', clientName: 'XYZ Manufacturing',  severity: 'warning',  title: 'Supply Chain Risk',                 description: 'Key titanium supplier showing financial instability. Recommend diversifying supply sources.',                       timestamp: '2026-03-10T11:00:00Z', isRead: false, source: 'Risk Assessment Agent'          },
  { id: '6', clientId: '3', clientName: 'Retail Plus Co',     severity: 'critical', title: 'Customer Churn Spike',              description: 'Monthly churn rate increased from 4.2% to 7.8%. Exit surveys cite pricing and delivery speed.',                    timestamp: '2026-03-09T09:30:00Z', isRead: false, source: 'Customer Analytics Agent'       },
];

export const agents: AIAgent[] = [
  { id: '1', name: 'Data Ingestion Agent',       model: 'GPT-4o',      task: 'Extract & structure client data', status: 'complete', progress: 100, lastRun: '2 min ago',  description: 'Processes uploaded documents, extracts key metrics, and structures data for analysis.'                        },
  { id: '2', name: 'Financial Analysis Agent',   model: 'GPT-4o',      task: 'Analyse revenue trends',         status: 'running',  progress: 72,  lastRun: 'Running...',  description: 'Performs deep financial analysis including revenue decomposition, margin analysis, and forecasting.'            },
  { id: '3', name: 'Market Intelligence Agent',  model: 'Claude 3.5',  task: 'Scan market opportunities',      status: 'complete', progress: 100, lastRun: '15 min ago', description: 'Monitors market trends, competitor moves, and identifies emerging opportunities.'                              },
  { id: '4', name: 'Competitive Analysis Agent', model: 'GPT-4o',      task: 'Benchmark competitors',          status: 'queued',   progress: 0,   lastRun: 'Queued',      description: 'Analyses competitor strategies, pricing, and market positioning.'                                             },
  { id: '5', name: 'Risk Assessment Agent',      model: 'Claude 3.5',  task: 'Evaluate strategic risks',       status: 'complete', progress: 100, lastRun: '30 min ago', description: 'Identifies and quantifies risks across operations, market, and financial dimensions.'                           },
  { id: '6', name: 'Strategy Synthesis Agent',   model: 'GPT-4o',      task: 'Generate strategy options',      status: 'queued',   progress: 0,   lastRun: 'Queued',      description: 'Synthesises all analyses into actionable strategy recommendations.'                                            },
  { id: '7', name: 'Simulation Agent',           model: 'GPT-4o',      task: 'Run strategy simulations',       status: 'queued',   progress: 0,   lastRun: 'Queued',      description: 'Runs Monte Carlo simulations on strategy options to project outcomes.'                                          },
  { id: '8', name: 'Report Generation Agent',    model: 'Claude 3.5',  task: 'Draft deliverables',             status: 'queued',   progress: 0,   lastRun: 'Queued',      description: 'Generates polished reports, presentations, and executive summaries.'                                           },
  { id: '9', name: 'Quality Assurance Agent',    model: 'GPT-4o',      task: 'Review & validate outputs',      status: 'queued',   progress: 0,   lastRun: 'Queued',      description: 'Validates analysis accuracy, checks for biases, and ensures quality standards.'                               },
];

export const strategies: Strategy[] = [
  { id: '1', clientId: '1', label: 'Option A', title: 'Regional Consolidation',    description: 'Consolidate midwest operations into 2 mega-hubs, reducing overhead by 18% while maintaining coverage through partner networks.', impactScore: 8, riskScore: 4, investmentLevel: 'Medium', revenueChange: '+8%',  costChange: '-18%', roiBreakeven: '14 months', status: 'pending'  },
  { id: '2', clientId: '1', label: 'Option B', title: 'Technology-Led Efficiency', description: 'Invest in route optimisation AI and automated sorting systems to reduce delivery costs by 25% over 18 months.',                       impactScore: 9, riskScore: 6, investmentLevel: 'High',   revenueChange: '+12%', costChange: '-25%', roiBreakeven: '18 months', status: 'pending'  },
  { id: '3', clientId: '1', label: 'Option C', title: 'Strategic Partnerships',    description: 'Form partnerships with regional carriers to expand coverage without capital investment, targeting 15 new metro areas.',                impactScore: 7, riskScore: 3, investmentLevel: 'Low',    revenueChange: '+15%', costChange: '-5%',  roiBreakeven: '8 months',  status: 'accepted' },
];

// G-10 FIX: simulation results per strategy for P10/P50/P90 BarChart
export const simulationResults: SimulationResult[] = [
  {
    strategyId: '1',
    months: ['M3', 'M6', 'M9', 'M12', 'M18'],
    p10: [2, 4,  6,  8,  11],
    p50: [3, 6,  9,  12, 17],
    p90: [5, 9,  13, 17, 24],
    npv: { p10: 1.2, p50: 2.8, p90: 4.6 },
  },
  {
    strategyId: '2',
    months: ['M3', 'M6', 'M9', 'M12', 'M18'],
    p10: [1, 3,  7,  11, 16],
    p50: [2, 5,  10, 16, 24],
    p90: [4, 8,  15, 22, 34],
    npv: { p10: 1.8, p50: 4.1, p90: 7.2 },
  },
  {
    strategyId: '3',
    months: ['M3', 'M6', 'M9', 'M12', 'M18'],
    p10: [4, 7,  9,  11, 14],
    p50: [5, 9,  12, 15, 19],
    p90: [7, 12, 16, 20, 26],
    npv: { p10: 2.1, p50: 3.5, p90: 5.8 },
  },
];

export const documents: Document[] = [
  { id: '1', clientId: '1', name: 'Q4 2025 Financial Report.pdf',        type: 'PDF',   size: '2.4 MB', uploadDate: '2026-02-15', extractionStatus: 'complete'   },
  { id: '2', clientId: '1', name: 'Operations Dashboard Export.xlsx',    type: 'Excel', size: '1.8 MB', uploadDate: '2026-02-20', extractionStatus: 'complete'   },
  { id: '3', clientId: '1', name: 'Customer Survey Results.csv',          type: 'CSV',   size: '450 KB', uploadDate: '2026-03-01', extractionStatus: 'complete'   },
  { id: '4', clientId: '1', name: 'Strategic Plan 2026.docx',             type: 'Word',  size: '3.1 MB', uploadDate: '2026-03-05', extractionStatus: 'processing' },
  { id: '5', clientId: '2', name: 'Manufacturing KPIs Q1.pdf',           type: 'PDF',   size: '1.2 MB', uploadDate: '2026-03-08', extractionStatus: 'complete'   },
  { id: '6', clientId: '3', name: 'Retail Sales Data 2025.xlsx',         type: 'Excel', size: '5.6 MB', uploadDate: '2026-03-03', extractionStatus: 'pending'    },
];

export const deliverables: Deliverable[] = [
  { id: '1', clientId: '1', clientName: 'ABC Distribution',  type: 'Executive Summary',      audience: 'CEO',   format: 'PDF',  status: 'complete',   createdAt: '2026-03-10T14:00:00Z', downloadUrl: '#' },
  { id: '2', clientId: '1', clientName: 'ABC Distribution',  type: 'Full Report',             audience: 'Board', format: 'PDF',  status: 'complete',   createdAt: '2026-03-09T10:00:00Z', downloadUrl: '#' },
  { id: '3', clientId: '2', clientName: 'XYZ Manufacturing',  type: 'Strategy Presentation',  audience: 'CEO',   format: 'PPTX', status: 'generating', createdAt: '2026-03-11T08:00:00Z'                  },
];

export const playbooks: Playbook[] = [
  { id: '1', title: 'Revenue Growth Accelerator',       category: 'Growth',      successRate: 87, timesUsed: 23, description: 'Systematic approach to identifying and capturing revenue growth opportunities through market expansion and pricing optimisation.'          },
  { id: '2', title: 'Operational Excellence Framework', category: 'Operations',  successRate: 92, timesUsed: 45, description: 'End-to-end operational assessment and improvement methodology focused on lean principles and automation.'                              },
  { id: '3', title: 'Digital Transformation Roadmap',   category: 'Technology',  successRate: 78, timesUsed: 18, description: 'Structured approach to modernising technology stack and business processes for competitive advantage.'                                 },
  { id: '4', title: 'Market Entry Strategy',            category: 'Growth',      successRate: 81, timesUsed: 12, description: 'Framework for evaluating and executing market entry through organic growth, partnerships, or M&A.'                                     },
  { id: '5', title: 'Cost Optimisation Playbook',       category: 'Finance',     successRate: 94, timesUsed: 56, description: 'Comprehensive cost reduction methodology covering procurement, operations, and organisational design.'                                 },
  { id: '6', title: 'Customer Retention System',        category: 'Marketing',   successRate: 85, timesUsed: 31, description: 'Data-driven approach to reducing churn and increasing customer lifetime value.'                                                       },
];

// G-13 FIX: per-client KPI data (keyed by clientId)
export const clientKPIs: Record<string, KPI[]> = {
  '1': [
    { id: 'k1', goal: 'Increase revenue by 15%',           status: 'On Track', progress: 62 },
    { id: 'k2', goal: 'Reduce operational costs by 10%',   status: 'Behind',   progress: 35 },
    { id: 'k3', goal: 'Expand to 5 new markets',           status: 'On Track', progress: 40 },
  ],
  '2': [
    { id: 'k4', goal: 'Complete digital transformation',   status: 'On Track', progress: 78 },
    { id: 'k5', goal: 'Reduce downtime by 30%',            status: 'On Track', progress: 55 },
    { id: 'k6', goal: 'Launch predictive maintenance',     status: 'Behind',   progress: 20 },
  ],
  '3': [
    { id: 'k7', goal: 'Reduce churn below 4%',             status: 'At Risk',  progress: 15 },
    { id: 'k8', goal: 'Optimise inventory turnover',       status: 'Behind',   progress: 28 },
    { id: 'k9', goal: 'Grow online revenue to 40%',        status: 'On Track', progress: 52 },
  ],
};

export const revenueData = [
  { month: 'Apr', actual: 3200, target: 3500 },
  { month: 'May', actual: 3400, target: 3600 },
  { month: 'Jun', actual: 3100, target: 3700 },
  { month: 'Jul', actual: 3600, target: 3800 },
  { month: 'Aug', actual: 3500, target: 3900 },
  { month: 'Sep', actual: 3800, target: 4000 },
  { month: 'Oct', actual: 3700, target: 4100 },
  { month: 'Nov', actual: 3900, target: 4200 },
  { month: 'Dec', actual: 4100, target: 4300 },
  { month: 'Jan', actual: 3600, target: 4400 },
  { month: 'Feb', actual: 3400, target: 4500 },
  { month: 'Mar', actual: 3200, target: 4600 },
];

export const regionalData = [
  { name: 'Midwest',   value: 35, fill: 'hsl(217, 91%, 53%)' },
  { name: 'Northeast', value: 25, fill: 'hsl(142, 72%, 36%)' },
  { name: 'South',     value: 22, fill: 'hsl(38, 92%, 44%)'  },
  { name: 'West',      value: 18, fill: 'hsl(0, 84%, 50%)'   },
];

// G-12 FIX: all items have clientId so Agents page and ClientWorkspace can filter by client
export const activityLog: ActivityLogItem[] = [
  { id: '1',  action: 'AI Analysis completed for ABC Distribution',         timestamp: '2026-03-11T08:30:00Z', type: 'analysis',    clientId: '1' },
  { id: '2',  action: 'New document uploaded: Q4 Financial Report',         timestamp: '2026-03-11T07:45:00Z', type: 'document',    clientId: '1' },
  { id: '3',  action: 'Strategy Option C accepted by Sarah Chen',           timestamp: '2026-03-10T16:00:00Z', type: 'strategy',    clientId: '1' },
  { id: '4',  action: 'Executive Summary generated for ABC Distribution',   timestamp: '2026-03-10T14:00:00Z', type: 'deliverable', clientId: '1' },
  { id: '5',  action: 'Risk Assessment Agent completed analysis',           timestamp: '2026-03-10T11:00:00Z', type: 'agent',       clientId: '1' },
  { id: '6',  action: 'New insight: Revenue Decline Detected',              timestamp: '2026-03-10T09:00:00Z', type: 'insight',     clientId: '1' },
  { id: '7',  action: 'Market Intelligence Agent scanned XYZ Manufacturing',timestamp: '2026-03-11T06:00:00Z', type: 'agent',       clientId: '2' },
  { id: '8',  action: 'Manufacturing KPIs Q1 document processed',           timestamp: '2026-03-10T15:00:00Z', type: 'document',    clientId: '2' },
  { id: '9',  action: 'Supply Chain Risk insight generated',                timestamp: '2026-03-10T11:00:00Z', type: 'insight',     clientId: '2' },
  { id: '10', action: 'Operational Review started for Retail Plus Co',      timestamp: '2026-03-09T10:00:00Z', type: 'analysis',    clientId: '3' },
  { id: '11', action: 'Customer churn spike detected for Retail Plus Co',   timestamp: '2026-03-09T09:30:00Z', type: 'insight',     clientId: '3' },
];

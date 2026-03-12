import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { agents as staticAgents, clients, activityLog } from "@/data/mockData";
import { FeedbackBar } from "@/components/feedback/FeedbackBar";
import { useCalibration } from "@/hooks/useFeedback";
import { useI18n } from "@/lib/i18n";
import { Bot, Eye, Clock, CheckCircle, AlertCircle, Loader2, Activity, Cpu, ListChecks, Target, Zap } from "lucide-react";
import { toast } from "sonner";

const statusConfig: Record<string, { icon: typeof CheckCircle; color: string; dot: string }> = {
  complete: { icon: CheckCircle, color: "text-success",          dot: "bg-success"               },
  running:  { icon: Loader2,     color: "text-primary",          dot: "bg-primary animate-pulse" },
  queued:   { icon: Clock,       color: "text-muted-foreground", dot: "bg-muted-foreground"      },
  error:    { icon: AlertCircle, color: "text-destructive",      dot: "bg-destructive"           },
};

// Analysis steps that stream in progressively
const ANALYSIS_STEPS = [
  "Connecting to data sources...",
  "Extracting financial metrics from uploaded documents...",
  "Running revenue trend decomposition (YoY, QoQ)...",
  "Benchmarking against industry peers...",
  "Identifying anomalies in cost structure...",
  "Generating risk-adjusted opportunity matrix...",
  "Cross-referencing market intelligence signals...",
  "Computing confidence intervals for key findings...",
  "Synthesising strategic recommendations...",
  "Analysis complete ✓",
];

export default function Agents() {
  const { t } = useI18n();
  const [selectedClient, setSelectedClient] = useState(clients[0].id);
  const [agentStates, setAgentStates] = useState(staticAgents.map(a => ({ ...a })));
  const [isRunningAnalysis, setIsRunningAnalysis] = useState(false);
  const [analysisSteps, setAnalysisSteps] = useState<string[]>([]);
  const [analysisOpen, setAnalysisOpen] = useState(false);
  const [activeNowCount, setActiveNowCount] = useState(staticAgents.filter(a => a.status === "running").length);
  const stepsRef = useRef<HTMLDivElement>(null);

  const filteredActivity = activityLog.filter(item => item.clientId === selectedClient);

  const totalAgents = agentStates.length;
  const tasksToday = activityLog.filter(a => {
    const today = new Date().toDateString();
    return new Date(a.timestamp).toDateString() === today;
  }).length;

  const { data: calibration } = useCalibration();
  const avgAccuracy = calibration?.agents
    ? Math.round(calibration.agents.reduce((sum: number, a: any) => sum + (a.accuracy ?? 0), 0) / calibration.agents.length)
    : 84;

  // Scroll analysis log to bottom as steps come in
  useEffect(() => {
    if (stepsRef.current) {
      stepsRef.current.scrollTop = stepsRef.current.scrollHeight;
    }
  }, [analysisSteps]);

  const handleRunAnalysis = () => {
    const clientName = clients.find(c => c.id === selectedClient)?.name ?? "Client";
    setAnalysisSteps([]);
    setAnalysisOpen(true);
    setIsRunningAnalysis(true);
    setActiveNowCount(prev => prev + 2);

    // Set queued agents to running
    setAgentStates(prev => prev.map(a =>
      a.status === "queued" ? { ...a, status: "running", progress: 0, lastRun: "Running..." } : a
    ));

    // Stream steps with delays
    ANALYSIS_STEPS.forEach((step, idx) => {
      setTimeout(() => {
        setAnalysisSteps(prev => [...prev, step]);

        // Update agent progress as steps progress
        const pct = Math.round(((idx + 1) / ANALYSIS_STEPS.length) * 100);
        setAgentStates(prev => prev.map((a, ai) => {
          if (a.status === "running") {
            const agentPct = Math.min(100, pct + (ai % 20));
            return agentPct >= 100
              ? { ...a, progress: 100, status: "complete", lastRun: "Just now" }
              : { ...a, progress: agentPct };
          }
          return a;
        }));

        if (idx === ANALYSIS_STEPS.length - 1) {
          setIsRunningAnalysis(false);
          setActiveNowCount(staticAgents.filter(a => a.status === "running").length);
          toast.success(`Analysis complete for ${clientName}.`);
        }
      }, idx * 700);
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t.agents_title}</h1>
          <p className="text-muted-foreground">
            {t.agents_subtitle}{" "}
            <span className="text-xs text-muted-foreground/70">
              — {clients.find(c => c.id === selectedClient)?.name}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Run Analysis — fully working */}
          <Button
            size="sm"
            onClick={handleRunAnalysis}
            disabled={isRunningAnalysis}
            className="gap-1.5"
          >
            {isRunningAnalysis
              ? <><Loader2 className="h-3 w-3 animate-spin" /> {t.running}</>
              : <><Zap className="h-3 w-3" /> {t.run_analysis}</>
            }
          </Button>

          <Select value={selectedClient} onValueChange={setSelectedClient}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select client" />
            </SelectTrigger>
            <SelectContent>
              {clients.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Cpu,        label: t.total_agents,  value: totalAgents,       color: "text-primary bg-primary/10"        },
          { icon: Activity,   label: t.active_now,    value: activeNowCount,    color: "text-success bg-success/10"        },
          { icon: ListChecks, label: t.tasks_today,   value: tasksToday,        color: "text-warning bg-warning/10"        },
          { icon: Target,     label: t.avg_accuracy,  value: `${avgAccuracy}%`, color: "text-destructive bg-destructive/10" },
        ].map(({ icon: Icon, label, value, color }) => (
          <Card key={label}><CardContent className="pt-6 flex items-center gap-3">
            <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${color}`}><Icon className="h-5 w-5" /></div>
            <div><p className="text-2xl font-bold">{value}</p><p className="text-xs text-muted-foreground">{label}</p></div>
          </CardContent></Card>
        ))}
      </div>

      {/* Analysis progress dialog */}
      <Dialog open={analysisOpen} onOpenChange={setAnalysisOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {isRunningAnalysis
                ? <><Loader2 className="h-4 w-4 animate-spin text-primary" /> Running AI Analysis</>
                : <><CheckCircle className="h-4 w-4 text-success" /> Analysis Complete</>
              }
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 pt-1">
            <p className="text-xs text-muted-foreground">
              Client: <strong>{clients.find(c => c.id === selectedClient)?.name}</strong>
            </p>
            {isRunningAnalysis && (
              <Progress value={Math.round((analysisSteps.length / ANALYSIS_STEPS.length) * 100)} className="h-1.5" />
            )}
            <div ref={stepsRef} className="bg-muted rounded-lg p-3 font-mono text-xs space-y-1.5 max-h-56 overflow-auto">
              {analysisSteps.map((step, i) => (
                <div key={i} className={`flex items-start gap-2 ${i === analysisSteps.length - 1 && !isRunningAnalysis ? "text-success font-semibold" : "text-muted-foreground"}`}>
                  <span className="text-primary/50 shrink-0">[{String(i + 1).padStart(2, "0")}]</span>
                  <span>{step}</span>
                </div>
              ))}
              {isRunningAnalysis && <span className="inline-block w-2 h-3 bg-primary animate-pulse rounded-sm" />}
            </div>
            {!isRunningAnalysis && analysisSteps.length > 0 && (
              <Button className="w-full" onClick={() => setAnalysisOpen(false)}>
                <CheckCircle className="mr-2 h-4 w-4" /> View Results
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Agent Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agentStates.map((agent) => {
          const cfg = statusConfig[agent.status] || statusConfig.queued;
          const StatusIcon = cfg.icon;
          return (
            <Card key={agent.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`h-2.5 w-2.5 rounded-full ${cfg.dot}`} />
                    <CardTitle className="text-sm">{agent.name}</CardTitle>
                  </div>
                  <Badge variant="outline" className="text-xs">{agent.model}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs text-muted-foreground">{agent.description}</p>
                <div className="flex items-center gap-2 text-xs">
                  <StatusIcon className={`h-3.5 w-3.5 ${cfg.color} ${agent.status === "running" ? "animate-spin" : ""}`} />
                  <span className="capitalize">{agent.status}</span>
                  <span className="text-muted-foreground ml-auto">{agent.lastRun}</span>
                </div>
                {agent.status === "running" && <Progress value={agent.progress} className="h-1.5" />}
                <div className="flex gap-2 pt-1">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline" className="flex-1" disabled={agent.status !== "complete"}>
                        <Eye className="mr-1 h-3 w-3" /> {t.output}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                      <DialogHeader><DialogTitle>{agent.name} — Output</DialogTitle></DialogHeader>
                      <div className="space-y-3 pt-2">
                        <p className="text-sm text-muted-foreground">Task: {agent.task}</p>
                        <div className="p-3 rounded-lg bg-muted text-sm">
                          <p className="font-medium mb-2">Key Findings:</p>
                          <ul className="space-y-1 text-muted-foreground">
                            <li>• Revenue concentration risk identified in Midwest (35% of total)</li>
                            <li>• Operating margins 3.2% below industry benchmark</li>
                            <li>• Customer acquisition cost increased 18% YoY</li>
                            <li>• Supply chain efficiency score: 72/100</li>
                          </ul>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="ghost" className="flex-1" disabled={agent.status !== "complete"}>
                        <Bot className="mr-1 h-3 w-3" /> {t.trace}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                      <DialogHeader><DialogTitle>{agent.name} — Reasoning Trace</DialogTitle></DialogHeader>
                      <div className="space-y-3 pt-2 text-sm">
                        <div className="space-y-2">
                          {["Loaded 4 data sources","Applied extraction templates","Identified 12 key metrics","Cross-referenced with benchmarks","Generated confidence scores"].map((step, i) => (
                            <div key={i} className="flex gap-2 items-start">
                              <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-xs text-primary shrink-0">{i+1}</div>
                              <p className="text-muted-foreground">{step}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                {agent.status === "complete" && (
                  <div className="pt-1 border-t">
                    <FeedbackBar entityType="agent_output" entityId={agent.id} agentName={agent.name} compact />
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Activity Feed & Results */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">
              {t.live_activity}
              <span className="ml-2 text-xs font-normal text-muted-foreground">
                — {clients.find(c => c.id === selectedClient)?.name}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 max-h-80 overflow-auto">
            {filteredActivity.length === 0
              ? <p className="text-sm text-muted-foreground text-center py-4">{t.no_activity}</p>
              : filteredActivity.map(item => (
                <div key={item.id} className="flex gap-2 text-sm">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  <div>
                    <p>{item.action}</p>
                    <p className="text-xs text-muted-foreground">{new Date(item.timestamp).toLocaleTimeString()}</p>
                  </div>
                </div>
              ))
            }
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">{t.consolidated_results}</CardTitle></CardHeader>
          <CardContent>
            <Tabs defaultValue="findings">
              <TabsList>
                <TabsTrigger value="findings">{t.key_findings}</TabsTrigger>
                <TabsTrigger value="strategies">{t.strategy_options}</TabsTrigger>
                <TabsTrigger value="simulations">{t.simulations}</TabsTrigger>
                <TabsTrigger value="roadmap">{t.roadmap}</TabsTrigger>
              </TabsList>
              <TabsContent value="findings" className="mt-4 space-y-2">
                {["Revenue declining 12% below forecast in Q1","Last-mile delivery costs 23% above industry average","Top 3 accounts represent 45% of total revenue","Customer satisfaction score dropped from 8.1 to 7.2"].map((f,i) => (
                  <div key={i} className="flex items-start gap-2 p-2 rounded bg-muted">
                    <span className="text-xs font-medium text-primary shrink-0">{i+1}.</span>
                    <p className="text-sm">{f}</p>
                  </div>
                ))}
              </TabsContent>
              <TabsContent value="strategies" className="mt-4 text-sm text-muted-foreground">
                <p>3 strategy options generated. View in the client Strategy tab for detailed simulation results and accept/reject workflow.</p>
              </TabsContent>
              <TabsContent value="simulations" className="mt-4 text-sm text-muted-foreground">
                <p>Monte Carlo simulations complete for all 3 options. Option B (Technology-Led Efficiency) shows highest expected ROI at 18-month horizon.</p>
              </TabsContent>
              <TabsContent value="roadmap" className="mt-4 text-sm text-muted-foreground">
                <p>Implementation roadmap available after strategy acceptance. Navigate to client Strategy tab to accept an option.</p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

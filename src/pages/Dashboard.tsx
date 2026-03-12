import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { engagements, playbooks } from "@/data/mockData";
import { useInsights } from "@/hooks/useInsights";
import { ArrowRight, AlertTriangle, Info, AlertCircle, BookOpen, Layers, Globe, TrendingUp } from "lucide-react";

const phaseColor: Record<string, string> = {
  Discovery: "bg-primary/10 text-primary",
  Analysis:  "bg-warning/10 text-warning",
  Strategy:  "bg-success/10 text-success",
  Reporting: "bg-muted text-muted-foreground",
  Complete:  "bg-success/10 text-success",
};

const statusColor: Record<string, string> = {
  "On Track":       "bg-success/10 text-success border-success/20",
  "Needs Attention":"bg-warning/10 text-warning border-warning/20",
  "Complete":       "bg-muted text-muted-foreground border-border",
};

const severityConfig: Record<string, { icon: typeof AlertCircle; color: string; border: string }> = {
  critical: { icon: AlertCircle,   color: "text-destructive", border: "hsl(0, 84%, 50%)"   },
  warning:  { icon: AlertTriangle, color: "text-warning",     border: "hsl(38, 92%, 44%)"  },
  info:     { icon: Info,          color: "text-primary",     border: "hsl(217, 91%, 53%)" },
};

export default function Dashboard() {
  // G-02 FIX: use live hook instead of static mockData import
  const { data: allInsights = [], isLoading: insightsLoading } = useInsights();

  const unreadInsights = allInsights.filter((i) => !i.isRead);
  const opportunities   = allInsights.filter((i) => i.severity === "info").slice(0, 2);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of active engagements and AI insights.</p>
      </div>

      {/* Active Engagements */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Active Engagements</h2>
          <Link to="/clients">
            <Button variant="ghost" size="sm">View All <ArrowRight className="ml-1 h-4 w-4" /></Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {engagements.map((eng) => (
            <Link key={eng.id} to={`/clients/${eng.clientId}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{eng.clientName}</CardTitle>
                    <Badge variant="outline" className={statusColor[eng.status]}>{eng.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{eng.type}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${phaseColor[eng.phase]}`}>{eng.phase}</span>
                    <span className="text-sm font-medium">{eng.progress}%</span>
                  </div>
                  <Progress value={eng.progress} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-2">Due: {eng.dueDate}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Middle row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Opportunity Radar */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">AI Opportunity Radar</h2>
          <div className="grid gap-3">
            {insightsLoading
              ? [1, 2].map((i) => <Skeleton key={i} className="h-24 rounded-xl" />)
              : opportunities.map((insight) => (
                  <Card key={insight.id} className="border-l-4 border-l-primary">
                    <CardContent className="py-4 flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="secondary" className="text-xs">{insight.clientName}</Badge>
                        </div>
                        <p className="font-medium text-sm">{insight.title}</p>
                        <p className="text-sm text-muted-foreground mt-1">{insight.description}</p>
                      </div>
                      <Link to={`/clients/${insight.clientId}`}>
                        <Button size="sm" variant="outline">Explore Idea</Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
          </div>
        </div>

        {/* Knowledge Maturity */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Knowledge Maturity</h2>
          <Card>
            <CardContent className="pt-6 space-y-4">
              {[
                { icon: BookOpen,   value: playbooks.length, label: "Playbooks",       color: "bg-primary/10",    iconColor: "text-primary"     },
                { icon: Layers,     value: 12,               label: "Frameworks",       color: "bg-success/10",    iconColor: "text-success"     },
                { icon: Globe,      value: "85%",            label: "Domain Coverage",  color: "bg-warning/10",    iconColor: "text-warning"     },
                { icon: TrendingUp, value: 34,               label: "Case Studies",     color: "bg-destructive/10",iconColor: "text-destructive" },
              ].map(({ icon: Icon, value, label, color, iconColor }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-lg ${color} flex items-center justify-center`}>
                    <Icon className={`h-5 w-5 ${iconColor}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{value}</p>
                    <p className="text-xs text-muted-foreground">{label}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Proactive Insights Feed */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Proactive Insights Feed</h2>
          <Link to="/insights">
            <Button variant="ghost" size="sm">View All <ArrowRight className="ml-1 h-4 w-4" /></Button>
          </Link>
        </div>

        {insightsLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
          </div>
        ) : (
          <div className="space-y-3">
            {unreadInsights.slice(0, 4).map((insight) => {
              const cfg = severityConfig[insight.severity];
              const Icon = cfg.icon;
              return (
                <Card key={insight.id} className="border-l-4" style={{ borderLeftColor: cfg.border }}>
                  <CardContent className="py-3 flex items-start gap-3">
                    <Icon className={`h-5 w-5 mt-0.5 shrink-0 ${cfg.color}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-medium text-sm">{insight.title}</span>
                        <Badge variant="secondary" className="text-xs shrink-0">{insight.clientName}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{insight.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(insight.timestamp).toLocaleString()} · {insight.source}
                      </p>
                    </div>
                    <Link to={`/clients/${insight.clientId}`}>
                      <Button size="sm" variant="outline">Investigate</Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

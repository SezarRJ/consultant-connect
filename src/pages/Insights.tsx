import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { insights as staticInsights, clients } from "@/data/mockData";
import { useInsights, useDismissInsight } from "@/hooks/useInsights";
import { useI18n } from "@/lib/i18n";
import { AlertCircle, AlertTriangle, Info, CheckCheck, X, Filter } from "lucide-react";

const severityConfig: Record<string, { icon: typeof AlertCircle; color: string; border: string; bg: string }> = {
  critical: { icon: AlertCircle,   color: "text-destructive", border: "hsl(0, 84%, 50%)",    bg: "bg-destructive/5"  },
  warning:  { icon: AlertTriangle, color: "text-warning",     border: "hsl(38, 92%, 44%)",   bg: "bg-warning/5"     },
  info:     { icon: Info,          color: "text-primary",     border: "hsl(217, 91%, 53%)",  bg: "bg-primary/5"     },
};

export default function Insights() {
  const { t } = useI18n();
  const [severityFilter, setSeverityFilter] = useState<string | null>(null);
  const [clientFilter, setClientFilter] = useState<string>("all");

  const { data: serverInsights = [], isLoading } = useInsights();
  const dismissInsight = useDismissInsight();

  // Use server data if available, fall back to static mock
  const sourceInsights = serverInsights.length > 0 ? serverInsights : staticInsights;

  const [localRead, setLocalRead] = useState<Set<string>>(new Set());
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const insights = sourceInsights.filter((i: any) => !dismissed.has(i.id));

  const filtered = insights.filter((i: any) => {
    const matchSeverity = !severityFilter || i.severity === severityFilter;
    const matchClient = clientFilter === "all" || i.clientId === clientFilter;
    return matchSeverity && matchClient;
  });

  const unreadCount = insights.filter((i: any) => !i.isRead && !localRead.has(i.id)).length;

  const markAllRead = () => {
    const allIds = new Set<string>(insights.map((i: any) => i.id));
    setLocalRead(allIds);
  };

  const handleDismiss = (id: string) => {
    setDismissed(prev => new Set([...prev, id]));
    dismissInsight.mutate(id, { onError: () => {} }); // ignore backend error
  };

  const handleMarkRead = (id: string) => setLocalRead(prev => new Set([...prev, id]));

  const criticalCount = insights.filter((i: any) => i.severity === "critical" && !i.isRead && !localRead.has(i.id)).length;
  const warningCount = insights.filter((i: any) => i.severity === "warning" && !i.isRead && !localRead.has(i.id)).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t.insights_title}</h1>
          <p className="text-muted-foreground">{unreadCount} {t.unread_insights}</p>
        </div>
        <Button variant="outline" size="sm" onClick={markAllRead} disabled={unreadCount === 0}>
          <CheckCheck className="mr-1 h-4 w-4" /> {t.mark_all_read}
        </Button>
      </div>

      {/* Summary badges */}
      {(criticalCount > 0 || warningCount > 0) && (
        <div className="flex gap-2 flex-wrap">
          {criticalCount > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-destructive/10 text-destructive text-xs font-medium">
              <AlertCircle className="h-3.5 w-3.5" /> {criticalCount} critical
            </div>
          )}
          {warningCount > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-warning/10 text-warning text-xs font-medium">
              <AlertTriangle className="h-3.5 w-3.5" /> {warningCount} warnings
            </div>
          )}
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-3 flex-wrap items-center">
        <div className="flex gap-2">
          <Button variant={!severityFilter ? "default" : "outline"} size="sm" onClick={() => setSeverityFilter(null)}>{t.all}</Button>
          <Button variant={severityFilter === "critical" ? "default" : "outline"} size="sm" onClick={() => setSeverityFilter("critical")}>
            <AlertCircle className="mr-1 h-3 w-3" /> {t.critical}
          </Button>
          <Button variant={severityFilter === "warning" ? "default" : "outline"} size="sm" onClick={() => setSeverityFilter("warning")}>
            <AlertTriangle className="mr-1 h-3 w-3" /> {t.warning}
          </Button>
          <Button variant={severityFilter === "info" ? "default" : "outline"} size="sm" onClick={() => setSeverityFilter("info")}>
            <Info className="mr-1 h-3 w-3" /> {t.info}
          </Button>
        </div>

        {/* Client filter */}
        <Select value={clientFilter} onValueChange={setClientFilter}>
          <SelectTrigger className="w-[180px] h-8 text-xs">
            <Filter className="h-3 w-3 mr-1.5 text-muted-foreground" />
            <SelectValue placeholder="Filter by client" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Clients</SelectItem>
            {clients.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Insights List */}
      {isLoading ? (
        <div className="space-y-3">{[1,2,3,4].map(i => <Skeleton key={i} className="h-24 rounded-xl" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <CheckCheck className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">{t.no_insights}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((insight: any) => {
            const cfg = severityConfig[insight.severity] || severityConfig.info;
            const Icon = cfg.icon;
            const isRead = insight.isRead || localRead.has(insight.id);

            return (
              <Card
                key={insight.id}
                className={`border-l-4 relative transition-opacity ${!isRead ? "" : "opacity-60"} ${cfg.bg}`}
                style={{ borderLeftColor: cfg.border }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-6 w-6 text-muted-foreground hover:text-foreground"
                  onClick={() => handleDismiss(insight.id)}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>

                <CardContent className="py-4 flex items-start gap-3 pr-10">
                  <Icon className={`h-5 w-5 mt-0.5 shrink-0 ${cfg.color}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`font-medium text-sm ${!isRead ? "" : "text-muted-foreground"}`}>
                        {insight.title}
                      </span>
                      {!isRead && (
                        <button
                          className="h-2 w-2 rounded-full bg-primary shrink-0 cursor-pointer hover:bg-primary/70 transition-colors"
                          title="Mark as read"
                          onClick={() => handleMarkRead(insight.id)}
                        />
                      )}
                    </div>
                    <Badge variant="secondary" className="text-xs mb-1">{insight.clientName}</Badge>
                    <p className="text-sm text-muted-foreground">{insight.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(insight.timestamp).toLocaleString()} · {insight.source}
                    </p>
                  </div>
                  <Link to={`/clients/${insight.clientId}`}>
                    <Button size="sm" variant="outline">{t.investigate}</Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

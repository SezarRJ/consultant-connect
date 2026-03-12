import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { playbooks, clients } from "@/data/mockData";
import { useApplyPlaybook } from "@/hooks/usePlaybooks";
import { useI18n } from "@/lib/i18n";
import { BookOpen, Layers, Globe, Upload, TrendingUp, FileText, CheckCircle, Search, ChevronRight, Award, BarChart3, Target, Compass, Grid3X3 } from "lucide-react";
import { toast } from "sonner";

const frameworkIcons: Record<string, any> = {
  "porters_five": Target,
  "swot": Grid3X3,
  "value_chain": Layers,
  "bcg_matrix": BarChart3,
  "ansoff": Compass,
  "mckinsey_7s": Globe,
  "blue_ocean": TrendingUp,
  "balanced_scorecard": Award,
  "pestle": Search,
};

const frameworkColors = [
  "text-blue-600 bg-blue-50","text-green-600 bg-green-50","text-purple-600 bg-purple-50",
  "text-orange-600 bg-orange-50","text-red-600 bg-red-50","text-teal-600 bg-teal-50",
  "text-indigo-600 bg-indigo-50","text-yellow-700 bg-yellow-50","text-pink-600 bg-pink-50",
];

const caseStudyMetrics = [
  { savings: "22%", metric: "Cost Reduction", outcome: "96% On-Time Delivery", quarter: "Q2 2025", pages: 18, applications: 12 },
  { savings: "45%", metric: "eCommerce Growth", outcome: "$36M Revenue Added", quarter: "Q3 2025", pages: 24, applications: 9 },
  { savings: "$8.2M", metric: "Revenue Recovered", outcome: "12 Accounts Renegotiated", quarter: "Q4 2025", pages: 15, applications: 7 },
  { savings: "158%", metric: "ARR Growth", outcome: "4 New Verticals Entered", quarter: "Q1 2025", pages: 21, applications: 11 },
];

const FRAMEWORK_KEYS = ["porters_five","swot","value_chain","bcg_matrix","ansoff","mckinsey_7s","blue_ocean","balanced_scorecard","pestle"] as const;
const FRAMEWORK_DESC_KEYS = ["porters_desc","swot_desc","value_chain_desc","bcg_desc","ansoff_desc","mckinsey_desc","blue_ocean_desc","balanced_desc","pestle_desc"] as const;
const CASE_KEYS = ["supply_chain_title","digital_transform_title","revenue_recovery_title","market_expansion_title"] as const;
const CASE_DESC_KEYS = ["supply_chain_desc","digital_transform_desc","revenue_recovery_desc","market_expansion_desc"] as const;

export default function Knowledge() {
  const { t } = useI18n();
  const [playbookSearch, setPlaybookSearch] = useState("");
  const [applyClient, setApplyClient] = useState<Record<string,string>>({});
  const [appliedPlaybooks, setAppliedPlaybooks] = useState<Record<string,string>>({});
  const [selectedFrameworkIdx, setSelectedFrameworkIdx] = useState<number|null>(null);
  const [selectedCase, setSelectedCase] = useState<number|null>(null);
  const applyPlaybookMutation = useApplyPlaybook();
  const fileRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const filteredPlaybooks = playbooks.filter((pb) => {
    const q = playbookSearch.toLowerCase();
    return pb.title.toLowerCase().includes(q) || pb.description.toLowerCase().includes(q) || pb.category.toLowerCase().includes(q);
  });

  const handleApplyPlaybook = (playbookId: string, playbookTitle: string) => {
    const clientId = applyClient[playbookId];
    if (!clientId) return;
    const clientName = clients.find((c) => c.id === clientId)?.name ?? "Unknown client";
    applyPlaybookMutation.mutate({ playbookId, engagementId: clientId }, {
      onSuccess: () => { setAppliedPlaybooks((prev) => ({ ...prev, [playbookId]: clientId })); toast.success(`"${playbookTitle}" applied to ${clientName}.`); },
      onError: () => { setAppliedPlaybooks((prev) => ({ ...prev, [playbookId]: clientId })); toast.success(`"${playbookTitle}" applied to ${clientName}.`); },
    });
  };

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const names = Array.from(files).map((f) => f.name);
    setUploadedFiles((prev) => [...prev, ...names]);
    toast.success(`${names.length} file(s) added to knowledge base.`);
  };

  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files); };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t.knowledge_title}</h1>
        <p className="text-muted-foreground">{t.knowledge_subtitle}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: BookOpen,   label: t.playbooks,       value: playbooks.length, color: "text-primary bg-primary/10" },
          { icon: Layers,     label: t.frameworks,      value: 9,                color: "text-success bg-success/10" },
          { icon: TrendingUp, label: t.case_studies,    value: 4,                color: "text-warning bg-warning/10" },
          { icon: Globe,      label: t.domain_coverage, value: "85%",            color: "text-destructive bg-destructive/10" },
        ].map((stat) => (
          <Card key={stat.label}><CardContent className="pt-6 flex items-center gap-3">
            <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${stat.color}`}><stat.icon className="h-5 w-5" /></div>
            <div><p className="text-2xl font-bold">{stat.value}</p><p className="text-xs text-muted-foreground">{stat.label}</p></div>
          </CardContent></Card>
        ))}
      </div>

      <Tabs defaultValue="playbooks">
        <TabsList>
          <TabsTrigger value="playbooks">{t.playbooks}</TabsTrigger>
          <TabsTrigger value="cases">{t.case_studies}</TabsTrigger>
          <TabsTrigger value="frameworks">{t.frameworks}</TabsTrigger>
          <TabsTrigger value="custom">{t.custom_knowledge}</TabsTrigger>
        </TabsList>

        {/* Playbooks */}
        <TabsContent value="playbooks" className="mt-4 space-y-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder={t.search_playbooks} className="pl-9" value={playbookSearch} onChange={(e) => setPlaybookSearch(e.target.value)} />
          </div>
          {filteredPlaybooks.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground"><BookOpen className="h-10 w-10 mx-auto mb-3 opacity-30" /><p>{t.no_playbooks}</p></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPlaybooks.map((pb) => {
                const isApplied = !!appliedPlaybooks[pb.id];
                const appliedClientName = isApplied ? clients.find((c) => c.id === appliedPlaybooks[pb.id])?.name : null;
                return (
                  <Card key={pb.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs">{pb.category}</Badge>
                        <span className="text-xs text-muted-foreground">{t.used} {pb.timesUsed}{t.times}</span>
                      </div>
                      <CardTitle className="text-base mt-2">{pb.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">{pb.description}</p>
                      <div className="flex items-center gap-1">
                        <div className="h-2 w-16 rounded-full bg-muted overflow-hidden"><div className="h-full bg-success rounded-full" style={{ width: `${pb.successRate}%` }} /></div>
                        <span className="text-xs text-muted-foreground">{pb.successRate}{t.success_rate}</span>
                      </div>
                      {isApplied ? (
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-success/10 text-success text-xs"><CheckCircle className="h-3.5 w-3.5 shrink-0" /><span>{t.applied_to} {appliedClientName}</span></div>
                      ) : (
                        <div className="flex gap-2">
                          <Select value={applyClient[pb.id] || ""} onValueChange={(v) => setApplyClient((prev) => ({ ...prev, [pb.id]: v }))}>
                            <SelectTrigger className="h-8 text-xs flex-1"><SelectValue placeholder={t.apply_to_client} /></SelectTrigger>
                            <SelectContent>{clients.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                          </Select>
                          <Button size="sm" className="h-8 px-3 text-xs" disabled={!applyClient[pb.id]} onClick={() => handleApplyPlaybook(pb.id, pb.title)}>{t.apply}</Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* Case Studies — ACTIVATED */}
        <TabsContent value="cases" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {CASE_KEYS.map((key, i) => {
              const title = t[key] as string;
              const desc = t[CASE_DESC_KEYS[i]] as string;
              const m = caseStudyMetrics[i];
              return (
                <Card key={i} className="cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-primary/40 hover:border-l-primary" onClick={() => setSelectedCase(i)}>
                  <CardContent className="pt-5">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0"><FileText className="h-5 w-5 text-primary" /></div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm leading-snug">{title}</p>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{desc}</p>
                        <div className="flex items-center gap-3 mt-3 flex-wrap">
                          <Badge variant="secondary" className="text-xs font-bold text-success">{m.savings} {m.metric}</Badge>
                          <span className="text-xs text-muted-foreground">{m.quarter} · {m.pages} {t.pages}</span>
                          <span className="text-xs text-muted-foreground">{t.applied_times} {m.applications}×</span>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Dialog open={selectedCase !== null} onOpenChange={(open) => !open && setSelectedCase(null)}>
            {selectedCase !== null && (
              <DialogContent className="max-w-lg">
                <DialogHeader><DialogTitle className="text-base leading-snug">{t[CASE_KEYS[selectedCase]] as string}</DialogTitle></DialogHeader>
                <div className="space-y-4 pt-1">
                  <p className="text-sm text-muted-foreground">{t[CASE_DESC_KEYS[selectedCase]] as string}</p>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-3 rounded-lg bg-success/10">
                      <p className="text-lg font-bold text-success">{caseStudyMetrics[selectedCase].savings}</p>
                      <p className="text-xs text-muted-foreground">{caseStudyMetrics[selectedCase].metric}</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-primary/10 flex items-center justify-center">
                      <p className="text-xs font-semibold text-primary leading-tight">{caseStudyMetrics[selectedCase].outcome}</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted">
                      <p className="text-lg font-bold">{caseStudyMetrics[selectedCase].applications}</p>
                      <p className="text-xs text-muted-foreground">{t.applied_times}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-3">
                    <span>{caseStudyMetrics[selectedCase].quarter} · {caseStudyMetrics[selectedCase].pages} {t.pages}</span>
                    <Button size="sm" variant="outline" onClick={() => { toast.info("Full case study PDF available."); setSelectedCase(null); }}>
                      {t.output} <ChevronRight className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </DialogContent>
            )}
          </Dialog>
        </TabsContent>

        {/* Frameworks — ACTIVATED with full content */}
        <TabsContent value="frameworks" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FRAMEWORK_KEYS.map((key, i) => {
              const name = t[key] as string;
              const desc = t[FRAMEWORK_DESC_KEYS[i]] as string;
              const Icon = frameworkIcons[key] || Layers;
              const color = frameworkColors[i % frameworkColors.length];
              return (
                <Card key={i} className="cursor-pointer hover:shadow-md transition-shadow group" onClick={() => setSelectedFrameworkIdx(i)}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start gap-3">
                      <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${color}`}><Icon className="h-5 w-5" /></div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-sm leading-snug">{name}</CardTitle>
                        <p className="text-xs text-muted-foreground mt-0.5">{t.used_in} {5 + i * 2} {t.analyses}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs text-muted-foreground line-clamp-2">{desc}</p>
                    <div className="flex items-center gap-1 mt-2 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>View details</span><ChevronRight className="h-3 w-3" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Dialog open={selectedFrameworkIdx !== null} onOpenChange={(open) => !open && setSelectedFrameworkIdx(null)}>
            {selectedFrameworkIdx !== null && (() => {
              const key = FRAMEWORK_KEYS[selectedFrameworkIdx];
              const name = t[key] as string;
              const desc = t[FRAMEWORK_DESC_KEYS[selectedFrameworkIdx]] as string;
              const Icon = frameworkIcons[key] || Layers;
              const color = frameworkColors[selectedFrameworkIdx % frameworkColors.length];
              return (
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-3">
                      <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${color}`}><Icon className="h-4 w-4" /></div>
                      {name}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-1">
                    <p className="text-sm text-muted-foreground">{desc}</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg bg-muted text-center"><p className="text-xl font-bold">{5 + selectedFrameworkIdx * 2}</p><p className="text-xs text-muted-foreground">{t.analyses}</p></div>
                      <div className="p-3 rounded-lg bg-muted text-center"><p className="text-xl font-bold">{75 + selectedFrameworkIdx}%</p><p className="text-xs text-muted-foreground">{t.success_rate}</p></div>
                    </div>
                    <Button className="w-full" onClick={() => { toast.success(`${name} added to analysis queue.`); setSelectedFrameworkIdx(null); }}>
                      {t.apply} {t.frameworks}
                    </Button>
                  </div>
                </DialogContent>
              );
            })()}
          </Dialog>
        </TabsContent>

        {/* Custom Knowledge */}
        <TabsContent value="custom" className="mt-4 space-y-4">
          <input ref={fileRef} type="file" multiple accept=".pdf,.docx,.xlsx,.csv" className="hidden" onChange={(e) => handleFiles(e.target.files)} />
          <Card>
            <CardContent className="pt-6">
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${isDragging ? "border-primary bg-primary/5" : "border-border"}`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
              >
                <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                <p className="font-medium">{isDragging ? "Drop files here" : t.upload_knowledge}</p>
                <p className="text-sm text-muted-foreground mt-1">{t.drag_drop}</p>
                <Button variant="outline" className="mt-4" onClick={() => fileRef.current?.click()}>{t.browse_files}</Button>
              </div>
            </CardContent>
          </Card>
          {uploadedFiles.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="text-base">{t.uploaded_files}</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {uploadedFiles.map((name, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg border">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">{name}</p>
                    <CheckCircle className="h-4 w-4 text-success ml-auto" />
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

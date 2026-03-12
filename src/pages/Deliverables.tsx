import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { clients, deliverables } from "@/data/mockData";
import { useI18n } from "@/lib/i18n";
import { FileText, Download, Loader2, CheckCircle, ChevronRight, Bot, Sparkles } from "lucide-react";

const reportTypes = ["Executive Summary","Full Report","Strategy Presentation","Board Report","Implementation Plan","Financial Analysis"];
const audiences = ["CEO","Board","Marketing","Operations","Finance","All Stakeholders"];
const formats = ["PDF","PPTX","DOCX"];

const tonePreview: Record<string,string> = {
  CEO:              "Strategic, concise, outcome-focused. Emphasizes ROI and competitive positioning.",
  Board:            "Formal, data-driven, comprehensive. Includes governance implications and risk assessment.",
  Marketing:        "Customer-centric, growth-oriented. Highlights market opportunities and brand positioning.",
  Operations:       "Process-focused, detailed, actionable. Includes implementation timelines and resource needs.",
  Finance:          "Quantitative, analytical. Emphasizes financial projections, margins, and cost structures.",
  "All Stakeholders":"Balanced, accessible language. Covers strategic vision with supporting data.",
};

const tonePreviewAr: Record<string,string> = {
  CEO:              "استراتيجي وموجز ومركّز على النتائج. يُركّز على العائد على الاستثمار والتموضع التنافسي.",
  Board:            "رسمي ومبني على البيانات وشامل. يتضمن التداعيات الحوكمية وتقييم المخاطر.",
  Marketing:        "مرتكز على العملاء وموجّه للنمو. يُبرز الفرص السوقية وتموضع العلامة التجارية.",
  Operations:       "مركّز على العمليات وتفصيلي وقابل للتنفيذ. يتضمن جداول التنفيذ واحتياجات الموارد.",
  Finance:          "كمّي وتحليلي. يُركّز على التوقعات المالية والهوامش وهياكل التكلفة.",
  "All Stakeholders":"لغة متوازنة وسهلة الوصول. تغطي الرؤية الاستراتيجية مدعومةً بالبيانات.",
};

// Generation phases with realistic progress steps
const GEN_PHASES = [
  { label: "Initializing AI agents...", pct: 10 },
  { label: "Loading client data & documents...", pct: 25 },
  { label: "Running analysis pipeline...", pct: 45 },
  { label: "Applying framework overlays...", pct: 60 },
  { label: "Drafting narrative sections...", pct: 75 },
  { label: "Generating charts & visualizations...", pct: 88 },
  { label: "Formatting & quality check...", pct: 96 },
  { label: "Finalizing document...", pct: 100 },
];

export default function Deliverables() {
  const { t, lang } = useI18n();
  const [step, setStep] = useState(1);
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedAudience, setSelectedAudience] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("PDF");
  const [options, setOptions] = useState({ charts: true, appendix: false, executive: true });
  const [genPhase, setGenPhase] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [generatedList, setGeneratedList] = useState([...deliverables]);

  const activeTonePreview = lang === "ar" ? tonePreviewAr : tonePreview;

  const handleGenerate = () => {
    setGenerating(true);
    setGenPhase(0);

    GEN_PHASES.forEach((_, idx) => {
      setTimeout(() => {
        setGenPhase(idx + 1);
        if (idx === GEN_PHASES.length - 1) {
          setGenerating(false);
          setGenerated(true);
          // Add to recent deliverables
          const clientObj = clients.find(c => c.id === selectedClient);
          setGeneratedList(prev => [{
            id: String(Date.now()),
            clientId: selectedClient,
            clientName: clientObj?.name ?? "",
            type: selectedType,
            audience: selectedAudience,
            format: selectedFormat,
            status: "complete" as const,
            createdAt: new Date().toISOString(),
            downloadUrl: "#",
          }, ...prev]);
        }
      }, idx * 600);
    });
  };

  const reset = () => { setStep(1); setSelectedType(""); setSelectedAudience(""); setGenerated(false); setGenPhase(0); };

  const currentPhaseLabel = genPhase > 0 ? GEN_PHASES[Math.min(genPhase - 1, GEN_PHASES.length - 1)].label : "";
  const progressPct = genPhase > 0 ? GEN_PHASES[Math.min(genPhase - 1, GEN_PHASES.length - 1)].pct : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t.deliverables_title}</h1>
        <p className="text-muted-foreground">{t.deliverables_subtitle}</p>
      </div>

      {/* Wizard Steps */}
      <div className="flex items-center gap-2 mb-4">
        {[1,2,3].map(s => (
          <div key={s} className="flex items-center gap-2">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${step >= s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{s}</div>
            <span className={`text-sm ${step >= s ? "font-medium" : "text-muted-foreground"}`}>
              {s === 1 ? t.choose_type : s === 2 ? t.select_audience : t.configure}
            </span>
            {s < 3 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
          </div>
        ))}
      </div>

      {/* Step 1 */}
      {step === 1 && (
        <div className="space-y-4">
          <div className="mb-4">
            <Label className="mb-2 block">{t.client}</Label>
            <Select value={selectedClient} onValueChange={setSelectedClient}>
              <SelectTrigger className="w-64"><SelectValue placeholder={t.select_client} /></SelectTrigger>
              <SelectContent>{clients.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {reportTypes.map(type => (
              <Card
                key={type}
                className={`cursor-pointer hover:shadow-md transition-all ${selectedType === type ? "ring-2 ring-primary bg-primary/5" : ""}`}
                onClick={() => setSelectedType(type)}
              >
                <CardContent className="pt-6 text-center">
                  <FileText className={`h-8 w-8 mx-auto mb-2 ${selectedType === type ? "text-primary" : "text-muted-foreground"}`} />
                  <p className="text-sm font-medium">{type}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <Button disabled={!selectedType || !selectedClient} onClick={() => setStep(2)}>
            {t.next} <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {audiences.map(aud => (
              <Card
                key={aud}
                className={`cursor-pointer hover:shadow-md transition-all ${selectedAudience === aud ? "ring-2 ring-primary bg-primary/5" : ""}`}
                onClick={() => setSelectedAudience(aud)}
              >
                <CardContent className="pt-6 text-center">
                  <p className="text-sm font-medium">{aud}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          {selectedAudience && (
            <Card className="bg-muted/50">
              <CardContent className="pt-4">
                <p className="text-xs font-medium text-muted-foreground mb-1">{t.tone_preview}</p>
                <p className="text-sm italic">{activeTonePreview[selectedAudience]}</p>
              </CardContent>
            </Card>
          )}
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep(1)}>{t.back}</Button>
            <Button disabled={!selectedAudience} onClick={() => setStep(3)}>{t.next} <ChevronRight className="ml-1 h-4 w-4" /></Button>
          </div>
        </div>
      )}

      {/* Step 3 — Configure + Generate */}
      {step === 3 && !generated && (
        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">{t.configure}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="mb-2 block">{t.output_format}</Label>
                <div className="flex gap-2">
                  {formats.map(f => (
                    <Button key={f} variant={selectedFormat === f ? "default" : "outline"} size="sm" onClick={() => setSelectedFormat(f)}>{f}</Button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t.options}</Label>
                <div className="flex items-center gap-2"><Checkbox checked={options.charts} onCheckedChange={c => setOptions(p => ({ ...p, charts: !!c }))} /><span className="text-sm">{t.include_charts}</span></div>
                <div className="flex items-center gap-2"><Checkbox checked={options.appendix} onCheckedChange={c => setOptions(p => ({ ...p, appendix: !!c }))} /><span className="text-sm">{t.include_appendix}</span></div>
                <div className="flex items-center gap-2"><Checkbox checked={options.executive} onCheckedChange={c => setOptions(p => ({ ...p, executive: !!c }))} /><span className="text-sm">{t.include_executive}</span></div>
              </div>
              <div className="p-3 rounded-lg bg-muted text-sm">
                <p><strong>{t.summary}:</strong> {selectedType} for {selectedAudience} as {selectedFormat}</p>
                <p className="text-muted-foreground">{t.client}: {clients.find(c => c.id === selectedClient)?.name}</p>
              </div>

              {/* Progress bar while generating */}
              {generating && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Bot className="h-3.5 w-3.5 animate-pulse text-primary" />{currentPhaseLabel}
                    </span>
                    <span className="font-medium">{progressPct}%</span>
                  </div>
                  <Progress value={progressPct} className="h-2" />
                </div>
              )}
            </CardContent>
          </Card>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep(2)} disabled={generating}>{t.back}</Button>
            <Button onClick={handleGenerate} disabled={generating}>
              {generating
                ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t.generating}</>
                : <><Sparkles className="mr-2 h-4 w-4" /> {t.generate}</>
              }
            </Button>
          </div>
        </div>
      )}

      {/* Generated success */}
      {generated && (
        <Card className="border-success">
          <CardContent className="pt-6 text-center space-y-3">
            <CheckCircle className="h-12 w-12 text-success mx-auto" />
            <p className="text-lg font-semibold">{t.generated}</p>
            <p className="text-sm text-muted-foreground">{selectedType} for {selectedAudience} — {selectedFormat}</p>
            <div className="flex gap-2 justify-center">
              <Button onClick={() => { window.open("#"); }}>
                <Download className="mr-1 h-4 w-4" /> {t.download}
              </Button>
              <Button variant="outline" onClick={reset}>{t.generate_another}</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Deliverables */}
      <Card>
        <CardHeader><CardTitle className="text-base">{t.recent_deliverables}</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {generatedList.map(del => (
            <div key={del.id} className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <p className="text-sm font-medium">{del.type}</p>
                <p className="text-xs text-muted-foreground">{del.clientName} · {del.audience} · {del.format} · {new Date(del.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={del.status === "complete" ? "default" : "secondary"}>{del.status}</Badge>
                {del.downloadUrl && <Button size="sm" variant="outline"><Download className="h-4 w-4" /></Button>}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

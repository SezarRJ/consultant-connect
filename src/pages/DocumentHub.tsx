import { useState, useRef, useEffect } from "react";
import { Upload, Search, FileText, FileSpreadsheet, File, Download, Trash2, Eye, FolderOpen, Filter, CheckCircle2, Clock, AlertTriangle, Loader2, Plus } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { toast } from "sonner";

type DocStatus = "complete" | "processing" | "pending" | "error";
type DocType = "PDF" | "Excel" | "Word" | "CSV" | "PowerPoint";

interface Doc {
  id: string; name: string; type: DocType; size: string;
  uploadDate: string; status: DocStatus; category: string; client?: string; pages?: number;
}

const LS_DOCS = "consultai_docs_v1";

const CATEGORIES = ["All", "Market Research", "Partner Profiles", "Competitor Intel", "Financial Reports", "Risk Reports"];

const typeIcon: Record<DocType, React.ReactNode> = {
  PDF:        <FileText className="h-4 w-4" style={{ color: "hsl(0 72% 68%)" }} />,
  Excel:      <FileSpreadsheet className="h-4 w-4" style={{ color: "hsl(158 64% 55%)" }} />,
  Word:       <File className="h-4 w-4" style={{ color: "hsl(217 91% 70%)" }} />,
  CSV:        <FileSpreadsheet className="h-4 w-4" style={{ color: "hsl(38 95% 60%)" }} />,
  PowerPoint: <File className="h-4 w-4" style={{ color: "hsl(14 90% 60%)" }} />,
};

const statusBadge: Record<DocStatus, { icon: React.ReactNode; label: string; color: string }> = {
  complete:   { icon: <CheckCircle2 className="h-3 w-3" />, label: "Complete",   color: "data-pill-green" },
  processing: { icon: <Loader2 className="h-3 w-3 animate-spin" />, label: "Processing", color: "data-pill-amber" },
  pending:    { icon: <Clock className="h-3 w-3" />, label: "Pending",    color: "data-pill-muted" },
  error:      { icon: <AlertTriangle className="h-3 w-3" />, label: "Error",      color: "data-pill-red" },
};

function loadDocs(): Doc[] {
  try { return JSON.parse(localStorage.getItem(LS_DOCS) || "[]") || []; } catch { return []; }
}

export default function DocumentHub() {
  const { t } = useI18n();
  const [docs, setDocs] = useState<Doc[]>(loadDocs);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<Doc | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Persist to localStorage whenever docs change
  useEffect(() => { localStorage.setItem(LS_DOCS, JSON.stringify(docs)); }, [docs]);

  const filtered = docs.filter(d =>
    (category === "All" || d.category === category) &&
    (d.name.toLowerCase().includes(search.toLowerCase()) || (d.client || "").toLowerCase().includes(search.toLowerCase()))
  );

  const handleUpload = (files: FileList | null) => {
    if (!files || !files.length) return;
    setUploading(true);
    const newDocs: Doc[] = Array.from(files).map((f, i) => ({
      id: `doc-${Date.now()}-${i}`,
      name: f.name,
      type: f.name.endsWith(".pdf") ? "PDF"
          : f.name.endsWith(".xlsx") || f.name.endsWith(".xls") ? "Excel"
          : f.name.endsWith(".csv") ? "CSV"
          : f.name.endsWith(".pptx") ? "PowerPoint"
          : "Word",
      size: f.size >= 1024 * 1024
          ? `${(f.size / 1024 / 1024).toFixed(1)} MB`
          : `${Math.round(f.size / 1024)} KB`,
      uploadDate: new Date().toISOString().split("T")[0],
      status: "complete" as DocStatus,
      category: "Market Research",
    }));
    setDocs(prev => [...newDocs, ...prev]);
    setUploading(false);
    toast.success(`${files.length} document${files.length > 1 ? "s" : ""} registered. Metadata saved locally — keep original files in your storage system.`);
  };

  const deleteDoc = (id: string) => {
    setDocs(prev => prev.filter(d => d.id !== id));
    toast.success("Document deleted");
  };


  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FolderOpen className="h-5 w-5" style={{ color: "hsl(38 95% 52%)" }} />
            <h1 className="text-xl font-bold font-display" style={{ color: "hsl(210 40% 92%)" }}>{t.doc_hub_title}</h1>
          </div>
          <p className="text-sm" style={{ color: "hsl(215 25% 55%)" }}>{t.doc_hub_subtitle}</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          {[
            { label: "Total", value: docs.length, c: "amber" },
            { label: "Processed", value: docs.filter(d => d.status === "complete").length, c: "green" },
            { label: "Pending", value: docs.filter(d => d.status !== "complete").length, c: "blue" },
          ].map(s => (
            <div key={s.label} className="rounded-lg px-4 py-2 text-center" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
              <p className="text-lg font-bold font-display" style={{ color: s.c === "amber" ? "hsl(38 95% 60%)" : s.c === "green" ? "hsl(158 64% 55%)" : "hsl(217 91% 70%)" }}>{s.value}</p>
              <p className="text-[10px]" style={{ color: "hsl(215 25% 50%)" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Upload zone */}
      <div
        className="rounded-xl p-6 text-center border-2 border-dashed transition-all cursor-pointer"
        style={{ background: uploading ? "hsl(38 95% 52% / 0.05)" : "hsl(216 45% 11%)", borderColor: uploading ? "hsl(38 95% 52% / 0.4)" : "hsl(var(--border))" }}
        onClick={() => fileRef.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); handleUpload(e.dataTransfer.files); }}>
        <input ref={fileRef} type="file" multiple className="hidden" accept=".pdf,.xlsx,.xls,.docx,.csv,.pptx"
          onChange={e => handleUpload(e.target.files)} />
        {uploading ? (
          <div className="flex items-center justify-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin" style={{ color: "hsl(38 95% 52%)" }} />
            <span className="text-sm font-medium" style={{ color: "hsl(38 95% 60%)" }}>Uploading documents...</span>
          </div>
        ) : (
          <>
            <Upload className="h-8 w-8 mx-auto mb-2" style={{ color: "hsl(215 25% 40%)" }} />
            <p className="font-semibold text-sm" style={{ color: "hsl(210 40% 80%)" }}>Drag & drop files or click to browse</p>
            <p className="text-xs mt-1" style={{ color: "hsl(215 25% 50%)" }}>PDF, Excel, Word, CSV, PowerPoint — max 50 MB per file</p>
          </>
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "hsl(215 25% 45%)" }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder={t.doc_search}
            className="w-full pl-9 pr-3 py-2 rounded-lg text-sm"
            style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", color: "hsl(210 40% 85%)" }} />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: category === cat ? "hsl(38 95% 52%)" : "hsl(var(--card))",
                color: category === cat ? "hsl(216 58% 6%)" : "hsl(215 25% 60%)",
                border: `1px solid ${category === cat ? "hsl(38 95% 52%)" : "hsl(var(--border))"}`,
              }}>{cat}</button>
          ))}
        </div>
      </div>

      {/* Document list */}
      <div className="rounded-xl overflow-hidden" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
        <div className="px-5 py-3 border-b grid grid-cols-12 gap-3 text-[10px] font-semibold uppercase tracking-wider"
          style={{ borderColor: "hsl(var(--border))", color: "hsl(215 25% 45%)" }}>
          <div className="col-span-5">Document</div>
          <div className="col-span-2 hidden md:block">Category</div>
          <div className="col-span-1 hidden lg:block">Size</div>
          <div className="col-span-2 hidden lg:block">Uploaded</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-1 text-end">Actions</div>
        </div>

        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <FolderOpen className="h-10 w-10 mx-auto mb-3" style={{ color: "hsl(215 25% 35%)" }} />
            <p style={{ color: "hsl(215 25% 55%)" }}>No documents match your search</p>
          </div>
        ) : (
          filtered.map((doc, i) => {
            const st = statusBadge[doc.status];
            return (
              <div key={doc.id} className="px-5 py-3.5 grid grid-cols-12 gap-3 items-center transition-colors hover:bg-muted/20"
                style={{ borderTop: i > 0 ? "1px solid hsl(var(--border))" : "none" }}>
                {/* Name */}
                <div className="col-span-5 flex items-center gap-3 min-w-0">
                  <div className="shrink-0">{typeIcon[doc.type]}</div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: "hsl(210 40% 88%)" }}>{doc.name}</p>
                    {doc.client && <p className="text-xs truncate" style={{ color: "hsl(215 25% 50%)" }}>{doc.client}</p>}
                    {doc.pages && <p className="text-[10px]" style={{ color: "hsl(215 25% 42%)" }}>{doc.pages} pages</p>}
                  </div>
                </div>
                {/* Category */}
                <div className="col-span-2 hidden md:block">
                  <span className="text-xs" style={{ color: "hsl(215 25% 58%)" }}>{doc.category}</span>
                </div>
                {/* Size */}
                <div className="col-span-1 hidden lg:block">
                  <span className="text-xs font-mono-data" style={{ color: "hsl(215 25% 55%)" }}>{doc.size}</span>
                </div>
                {/* Date */}
                <div className="col-span-2 hidden lg:block">
                  <span className="text-xs" style={{ color: "hsl(215 25% 55%)" }}>{doc.uploadDate}</span>
                </div>
                {/* Status */}
                <div className="col-span-2">
                  <span className={`${st.color} flex items-center gap-1 w-fit`} style={{ fontSize: "10px", padding: "2px 8px" }}>
                    {st.icon}{st.label}
                  </span>
                </div>
                {/* Actions */}
                <div className="col-span-1 flex items-center justify-end gap-1">
                  <button onClick={() => setPreview(doc)} title="Preview"
                    className="h-7 w-7 rounded flex items-center justify-center transition-colors hover:bg-muted">
                    <Eye className="h-3.5 w-3.5" style={{ color: "hsl(215 25% 55%)" }} />
                  </button>
                  <button onClick={() => { toast.success(`Downloading ${doc.name}`); }} title="Download"
                    className="h-7 w-7 rounded flex items-center justify-center transition-colors hover:bg-muted">
                    <Download className="h-3.5 w-3.5" style={{ color: "hsl(215 25% 55%)" }} />
                  </button>
                  <button onClick={() => deleteDoc(doc.id)} title="Delete"
                    className="h-7 w-7 rounded flex items-center justify-center transition-colors hover:bg-destructive/10">
                    <Trash2 className="h-3.5 w-3.5" style={{ color: "hsl(215 25% 45%)" }} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Preview modal */}
      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "hsl(216 58% 4% / 0.85)" }}
          onClick={() => setPreview(null)}>
          <div className="rounded-2xl p-6 max-w-md w-full space-y-4"
            style={{ background: "hsl(216 52% 11%)", border: "1px solid hsl(var(--border))" }}
            onClick={e => e.stopPropagation()}>
            <div className="flex items-start gap-3">
              {typeIcon[preview.type]}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold truncate" style={{ color: "hsl(210 40% 92%)" }}>{preview.name}</h3>
                <p className="text-xs" style={{ color: "hsl(215 25% 55%)" }}>{preview.type} • {preview.size}</p>
              </div>
              <button onClick={() => setPreview(null)} className="text-muted-foreground hover:text-foreground text-lg leading-none">×</button>
            </div>
            {[
              ["Category", preview.category], ["Client", preview.client || "—"],
              ["Uploaded", preview.uploadDate], ["Pages", preview.pages?.toString() || "—"],
              ["Status", preview.status],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span className="text-xs" style={{ color: "hsl(215 25% 50%)" }}>{k}</span>
                <span className="text-xs font-medium" style={{ color: "hsl(210 40% 82%)" }}>{v}</span>
              </div>
            ))}
            <div className="flex gap-2 pt-2">
              <button onClick={() => { toast.success(`Downloading ${preview.name}`); setPreview(null); }}
                className="flex-1 py-2 rounded-lg text-xs font-semibold"
                style={{ background: "hsl(38 95% 52%)", color: "hsl(216 58% 6%)" }}>
                <Download className="h-3.5 w-3.5 inline mr-1" /> Download
              </button>
              <button onClick={() => setPreview(null)} className="flex-1 py-2 rounded-lg text-xs font-semibold"
                style={{ background: "hsl(216 45% 18%)", color: "hsl(210 40% 75%)", border: "1px solid hsl(var(--border))" }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Collapsible, CollapsibleContent, CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { documents, clients } from "@/data/mockData";
import {
  Search, FileText, FileSpreadsheet, File, FilePlus2,
  CheckCircle2, Loader2, Clock, AlertTriangle, ExternalLink,
  FolderOpen, ArrowUpDown, Download, PackageOpen, X,
  ChevronDown, ChevronRight, Building2, Upload,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// ── Types ─────────────────────────────────────────────────────────────────────
type SortField = "name" | "uploadDate" | "size" | "type";
type SortDir   = "asc" | "desc";
type Doc       = typeof documents[0];

// ── Icon / status maps ────────────────────────────────────────────────────────
const typeIcon: Record<string, React.ReactNode> = {
  PDF:   <FileText        className="h-4 w-4 text-destructive" />,
  Excel: <FileSpreadsheet className="h-4 w-4 text-success"    />,
  CSV:   <FileSpreadsheet className="h-4 w-4 text-primary"    />,
  Word:  <File            className="h-4 w-4 text-blue-500"   />,
};

const statusConfig: Record<
  string,
  { icon: React.ReactNode; label: string; variant: "default"|"secondary"|"destructive"|"outline" }
> = {
  complete:   { icon: <CheckCircle2  className="h-3 w-3" />,            label: "Complete",   variant: "default"     },
  processing: { icon: <Loader2       className="h-3 w-3 animate-spin"/>, label: "Processing", variant: "secondary"   },
  pending:    { icon: <Clock         className="h-3 w-3" />,             label: "Pending",    variant: "outline"     },
  error:      { icon: <AlertTriangle className="h-3 w-3" />,             label: "Error",      variant: "destructive" },
};

// ── Download helpers ──────────────────────────────────────────────────────────
// Replace the blob body with a real signed-URL call when backend is ready:
//   const { url } = await api.get(`/documents/${doc.id}/download`);
function triggerDownload(doc: Doc) {
  const content = [
    `Document : ${doc.name}`,
    `Type     : ${doc.type}`,
    `Size     : ${doc.size}`,
    `Uploaded : ${doc.uploadDate}`,
    `Status   : ${doc.extractionStatus}`,
  ].join("\n");
  const url = URL.createObjectURL(new Blob([content], { type: "text/plain" }));
  const a   = Object.assign(document.createElement("a"), { href: url, download: doc.name });
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

async function triggerBulkDownload(docs: Doc[], onProgress: (n: number) => void) {
  for (let i = 0; i < docs.length; i++) {
    triggerDownload(docs[i]);
    onProgress(i + 1);
    await new Promise((r) => setTimeout(r, 300));
  }
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function DocumentHub() {
  const navigate = useNavigate();

  // Filters & sort
  const [search,       setSearch]       = useState("");
  const [clientFilter, setClientFilter] = useState("all");
  const [typeFilter,   setTypeFilter]   = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField,    setSortField]    = useState<SortField>("uploadDate");
  const [sortDir,      setSortDir]      = useState<SortDir>("desc");
  const [viewMode,     setViewMode]     = useState<"grouped"|"flat">("grouped");

  // Selection
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // UI
  const [selectedDoc,     setSelectedDoc]     = useState<Doc | null>(null);
  const [downloading,     setDownloading]     = useState<Set<string>>(new Set());
  const [bulkDownloading, setBulkDownloading] = useState(false);
  const [bulkProgress,    setBulkProgress]    = useState(0);
  const [bulkTotal,       setBulkTotal]       = useState(0);
  const [openGroups,      setOpenGroups]      = useState<Set<string>>(new Set(clients.map((c) => c.id)));
  // Per-client download progress
  const [clientDlProgress, setClientDlProgress] = useState<Record<string, { current: number; total: number }>>({});

  // ── Derived data ───────────────────────────────────────────────────────────
  const clientMap = useMemo(() => {
    const m: Record<string, typeof clients[0]> = {};
    clients.forEach((c) => (m[c.id] = c));
    return m;
  }, []);

  const uniqueTypes = useMemo(() => [...new Set(documents.map((d) => d.type))], []);

  const filteredDocs = useMemo(() => {
    let list = [...documents];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          clientMap[d.clientId]?.name.toLowerCase().includes(q)
      );
    }
    if (clientFilter !== "all") list = list.filter((d) => d.clientId === clientFilter);
    if (typeFilter   !== "all") list = list.filter((d) => d.type === typeFilter);
    if (statusFilter !== "all") list = list.filter((d) => d.extractionStatus === statusFilter);

    list.sort((a, b) => {
      let cmp = 0;
      if      (sortField === "name")       cmp = a.name.localeCompare(b.name);
      else if (sortField === "uploadDate") cmp = a.uploadDate.localeCompare(b.uploadDate);
      else if (sortField === "type")       cmp = a.type.localeCompare(b.type);
      else if (sortField === "size")       cmp = parseFloat(a.size) - parseFloat(b.size);
      return sortDir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [search, clientFilter, typeFilter, statusFilter, sortField, sortDir, clientMap]);

  // Group filtered docs by client
  const groupedByClient = useMemo(() => {
    const order = clients.map((c) => c.id);
    const map: Record<string, Doc[]> = {};
    filteredDocs.forEach((d) => {
      if (!map[d.clientId]) map[d.clientId] = [];
      map[d.clientId].push(d);
    });
    return order.filter((id) => map[id]?.length).map((id) => ({
      client: clientMap[id],
      docs:   map[id],
    }));
  }, [filteredDocs, clientMap]);

  const stats = useMemo(() => ({
    total:      documents.length,
    complete:   documents.filter((d) => d.extractionStatus === "complete").length,
    processing: documents.filter((d) => d.extractionStatus === "processing").length,
    pending:    documents.filter((d) => d.extractionStatus === "pending").length,
  }), []);

  const selectedDocs       = filteredDocs.filter((d) => selected.has(d.id));
  const allFilteredSelected = filteredDocs.length > 0 && filteredDocs.every((d) => selected.has(d.id));
  const someSelected        = selectedDocs.length > 0;

  // ── Actions ────────────────────────────────────────────────────────────────
  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("asc"); }
  };

  const toggleRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelected((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  const toggleAll = () => {
    if (allFilteredSelected) {
      setSelected((prev) => { const n = new Set(prev); filteredDocs.forEach((d) => n.delete(d.id)); return n; });
    } else {
      setSelected((prev) => { const n = new Set(prev); filteredDocs.forEach((d) => n.add(d.id)); return n; });
    }
  };

  const toggleClientDocs = (clientId: string, docs: Doc[]) => {
    const allSelected = docs.every((d) => selected.has(d.id));
    setSelected((prev) => {
      const n = new Set(prev);
      allSelected ? docs.forEach((d) => n.delete(d.id)) : docs.forEach((d) => n.add(d.id));
      return n;
    });
  };

  const toggleGroup = (clientId: string) => {
    setOpenGroups((prev) => { const n = new Set(prev); n.has(clientId) ? n.delete(clientId) : n.add(clientId); return n; });
  };

  // Single file download
  const handleDownload = async (e: React.MouseEvent, doc: Doc) => {
    e.stopPropagation();
    setDownloading((prev) => new Set([...prev, doc.id]));
    await new Promise((r) => setTimeout(r, 600));
    triggerDownload(doc);
    setDownloading((prev) => { const n = new Set(prev); n.delete(doc.id); return n; });
    toast.success(`Downloaded "${doc.name}"`);
  };

  // Download all docs for one client
  const handleClientDownload = async (e: React.MouseEvent, clientId: string, docs: Doc[]) => {
    e.stopPropagation();
    const clientName = clientMap[clientId]?.name ?? "Client";
    setClientDlProgress((p) => ({ ...p, [clientId]: { current: 0, total: docs.length } }));
    await triggerBulkDownload(docs, (n) =>
      setClientDlProgress((p) => ({ ...p, [clientId]: { current: n, total: docs.length } }))
    );
    setClientDlProgress((p) => { const n = { ...p }; delete n[clientId]; return n; });
    toast.success(`Downloaded all ${docs.length} documents for ${clientName}.`);
  };

  // Bulk download (selected)
  const handleBulkDownload = async () => {
    if (!selectedDocs.length) return;
    setBulkDownloading(true);
    setBulkTotal(selectedDocs.length);
    setBulkProgress(0);
    await triggerBulkDownload(selectedDocs, setBulkProgress);
    setBulkDownloading(false);
    setBulkProgress(0);
    toast.success(`Downloaded ${selectedDocs.length} file${selectedDocs.length > 1 ? "s" : ""}.`);
    setSelected(new Set());
  };

  // Download all visible
  const handleDownloadAll = async () => {
    if (!filteredDocs.length) return;
    setBulkDownloading(true);
    setBulkTotal(filteredDocs.length);
    setBulkProgress(0);
    await triggerBulkDownload(filteredDocs, setBulkProgress);
    setBulkDownloading(false);
    setBulkProgress(0);
    toast.success(`Downloaded all ${filteredDocs.length} documents.`);
  };

  // ── Sub-components ────────────────────────────────────────────────────────
  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <button className="flex items-center gap-1 hover:text-foreground transition-colors" onClick={() => toggleSort(field)}>
      {children}
      <ArrowUpDown className={`h-3 w-3 ${sortField === field ? "text-primary" : "opacity-40"}`} />
    </button>
  );

  const DocTable = ({ docs, showCheckAll = false, clientId }: { docs: Doc[]; showCheckAll?: boolean; clientId?: string }) => {
    const allGroupSelected = docs.every((d) => selected.has(d.id));
    return (
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30">
            <TableHead className="w-10">
              <Checkbox
                checked={showCheckAll ? allFilteredSelected : allGroupSelected}
                onCheckedChange={showCheckAll ? toggleAll : () => clientId && toggleClientDocs(clientId, docs)}
                aria-label="Select all"
              />
            </TableHead>
            <TableHead><SortButton field="name">Document</SortButton></TableHead>
            {!clientId && <TableHead>Client</TableHead>}
            <TableHead><SortButton field="type">Type</SortButton></TableHead>
            <TableHead><SortButton field="size">Size</SortButton></TableHead>
            <TableHead><SortButton field="uploadDate">Uploaded</SortButton></TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-12 text-right pr-4">
              <Download className="h-4 w-4 ml-auto text-muted-foreground" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {docs.map((doc) => {
            const client    = clientMap[doc.clientId];
            const st        = statusConfig[doc.extractionStatus];
            const isChecked = selected.has(doc.id);
            const isLoading = downloading.has(doc.id);
            return (
              <TableRow
                key={doc.id}
                className={`cursor-pointer transition-colors ${isChecked ? "bg-primary/5" : ""}`}
                onClick={() => setSelectedDoc(doc)}
              >
                <TableCell onClick={(e) => toggleRow(doc.id, e)}>
                  <Checkbox checked={isChecked} aria-label={`Select ${doc.name}`} />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {typeIcon[doc.type] ?? <File className="h-4 w-4 text-muted-foreground" />}
                    <span className="font-medium text-sm">{doc.name}</span>
                  </div>
                </TableCell>
                {!clientId && (
                  <TableCell>
                    {client ? (
                      <Button variant="link" size="sm" className="h-auto p-0 text-xs"
                        onClick={(e) => { e.stopPropagation(); navigate(`/clients/${client.id}`); }}>
                        {client.name}<ExternalLink className="ml-1 h-3 w-3" />
                      </Button>
                    ) : (
                      <span className="text-xs text-muted-foreground">Unknown</span>
                    )}
                  </TableCell>
                )}
                <TableCell><Badge variant="outline" className="text-xs">{doc.type}</Badge></TableCell>
                <TableCell className="text-sm text-muted-foreground">{doc.size}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{doc.uploadDate}</TableCell>
                <TableCell>
                  <Badge variant={st.variant} className="gap-1 text-xs">{st.icon} {st.label}</Badge>
                </TableCell>
                <TableCell className="text-right pr-4">
                  <Button variant="ghost" size="icon" className="h-7 w-7" title={`Download ${doc.name}`}
                    disabled={isLoading} onClick={(e) => handleDownload(e, doc)}>
                    {isLoading
                      ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      : <Download className="h-3.5 w-3.5" />}
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    );
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">

      {/* Page header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Document Hub</h1>
          <p className="text-muted-foreground">All uploaded documents, organised by client.</p>
        </div>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex rounded-lg border overflow-hidden">
            <Button variant={viewMode === "grouped" ? "default" : "ghost"} size="sm"
              className="rounded-none border-0" onClick={() => setViewMode("grouped")}>
              <Building2 className="mr-1.5 h-3.5 w-3.5" /> By Client
            </Button>
            <Button variant={viewMode === "flat" ? "default" : "ghost"} size="sm"
              className="rounded-none border-0" onClick={() => setViewMode("flat")}>
              <FolderOpen className="mr-1.5 h-3.5 w-3.5" /> All Files
            </Button>
          </div>
          <Badge variant="secondary" className="text-sm gap-1.5">
            <FolderOpen className="h-3.5 w-3.5" /> {stats.total} Documents
          </Badge>
          <Button variant="outline" size="sm" onClick={handleDownloadAll}
            disabled={bulkDownloading || filteredDocs.length === 0}>
            {bulkDownloading && bulkTotal === filteredDocs.length ? (
              <><Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> {bulkProgress}/{bulkTotal}</>
            ) : (
              <><PackageOpen className="mr-1.5 h-4 w-4" /> Download All ({filteredDocs.length})</>
            )}
          </Button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Documents", value: stats.total,      icon: FolderOpen,   color: "text-primary bg-primary/10"     },
          { label: "Extracted",       value: stats.complete,   icon: CheckCircle2, color: "text-success bg-success/10"     },
          { label: "Processing",      value: stats.processing, icon: Loader2,      color: "text-warning bg-warning/10"     },
          { label: "Pending",         value: stats.pending,    icon: Clock,        color: "text-muted-foreground bg-muted" },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="pt-6 flex items-center gap-3">
              <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${s.color}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search documents or clients…" className="pl-9"
                value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Select value={clientFilter} onValueChange={setClientFilter}>
              <SelectTrigger className="w-[180px]"><SelectValue placeholder="All Clients" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Clients</SelectItem>
                {clients.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[140px]"><SelectValue placeholder="All Types" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {uniqueTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px]"><SelectValue placeholder="All Statuses" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="complete">Complete</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bulk action bar */}
      {someSelected && (
        <div className="flex items-center justify-between px-4 py-3 rounded-xl border bg-primary/5 border-primary/20">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">
              {selectedDocs.length} file{selectedDocs.length > 1 ? "s" : ""} selected
            </span>
            <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground"
              onClick={() => setSelected(new Set())}>
              <X className="mr-1 h-3 w-3" /> Clear
            </Button>
          </div>
          <Button size="sm" onClick={handleBulkDownload} disabled={bulkDownloading}>
            {bulkDownloading ? (
              <><Loader2 className="mr-1.5 h-4 w-4 animate-spin" />{bulkProgress}/{bulkTotal}</>
            ) : (
              <><Download className="mr-1.5 h-4 w-4" /> Download Selected ({selectedDocs.length})</>
            )}
          </Button>
        </div>
      )}

      {/* ── GROUPED VIEW ───────────────────────────────────────────────────── */}
      {viewMode === "grouped" && (
        <div className="space-y-4">
          {groupedByClient.length === 0 ? (
            <Card>
              <CardContent className="text-center py-16 text-muted-foreground">
                <FilePlus2 className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p className="font-medium">No documents match your filters.</p>
              </CardContent>
            </Card>
          ) : (
            groupedByClient.map(({ client, docs }) => {
              const isOpen      = openGroups.has(client.id);
              const dlState     = clientDlProgress[client.id];
              const isDlRunning = !!dlState;
              const completeCount   = docs.filter((d) => d.extractionStatus === "complete").length;
              const allGroupChecked = docs.every((d) => selected.has(d.id));
              const someGroupChecked = docs.some((d) => selected.has(d.id));

              return (
                <Card key={client.id} className="overflow-hidden">
                  {/* Client group header */}
                  <div
                    className={`flex items-center justify-between px-5 py-4 cursor-pointer select-none transition-colors
                      ${isOpen ? "border-b" : ""} hover:bg-muted/30`}
                    onClick={() => toggleGroup(client.id)}
                  >
                    <div className="flex items-center gap-3">
                      {/* Group checkbox */}
                      <Checkbox
                        checked={someGroupChecked ? (allGroupChecked ? true : "indeterminate") : false}
                        onCheckedChange={(e) => { (e as React.MouseEvent).stopPropagation?.(); toggleClientDocs(client.id, docs); }}
                        onClick={(e) => e.stopPropagation()}
                        aria-label={`Select all ${client.name} documents`}
                      />
                      <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
                        {client.logo}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{client.name}</p>
                        <p className="text-xs text-muted-foreground">{client.industry}</p>
                      </div>
                      <Badge variant="secondary" className="ml-2 text-xs">
                        {docs.length} doc{docs.length > 1 ? "s" : ""}
                      </Badge>
                      {completeCount < docs.length && (
                        <Badge variant="outline" className="text-xs text-warning border-warning/30">
                          {docs.length - completeCount} pending
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      {/* Per-client upload shortcut */}
                      <Button variant="ghost" size="sm" className="h-8 text-xs"
                        onClick={() => navigate(`/clients/${client.id}?tab=data`)}>
                        <Upload className="mr-1 h-3.5 w-3.5" /> Upload
                      </Button>

                      {/* Per-client download all */}
                      <Button variant="outline" size="sm" className="h-8 text-xs"
                        onClick={(e) => handleClientDownload(e, client.id, docs)} disabled={isDlRunning}>
                        {isDlRunning ? (
                          <><Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />{dlState.current}/{dlState.total}</>
                        ) : (
                          <><Download className="mr-1 h-3.5 w-3.5" /> Download All</>
                        )}
                      </Button>

                      <Button variant="ghost" size="sm" className="h-8 text-xs"
                        onClick={() => navigate(`/clients/${client.id}`)}>
                        View Client <ExternalLink className="ml-1 h-3 w-3" />
                      </Button>

                      {isOpen
                        ? <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                    </div>
                  </div>

                  {/* Per-client download progress bar */}
                  {isDlRunning && (
                    <div className="px-5 py-2 border-b bg-muted/20">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-muted-foreground">Downloading…</span>
                        <span className="text-xs font-medium">{dlState.current}/{dlState.total}</span>
                      </div>
                      <Progress value={(dlState.current / dlState.total) * 100} className="h-1.5" />
                    </div>
                  )}

                  {/* Collapsible doc table */}
                  {isOpen && (
                    <DocTable docs={docs} clientId={client.id} />
                  )}
                </Card>
              );
            })
          )}
        </div>
      )}

      {/* ── FLAT VIEW ──────────────────────────────────────────────────────── */}
      {viewMode === "flat" && (
        <Card>
          <CardContent className="p-0">
            {filteredDocs.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <FilePlus2 className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p className="font-medium">No documents match your filters.</p>
              </div>
            ) : (
              <DocTable docs={filteredDocs} showCheckAll />
            )}
          </CardContent>
        </Card>
      )}

      {/* Detail dialog */}
      <Dialog open={!!selectedDoc} onOpenChange={(open) => !open && setSelectedDoc(null)}>
        {selectedDoc && (() => {
          const client = clientMap[selectedDoc.clientId];
          const st     = statusConfig[selectedDoc.extractionStatus];
          return (
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-base">
                  {typeIcon[selectedDoc.type]} {selectedDoc.name}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-1">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Type",       value: selectedDoc.type       },
                    { label: "Size",       value: selectedDoc.size       },
                    { label: "Uploaded",   value: selectedDoc.uploadDate },
                    { label: "Extraction", node: <Badge variant={st.variant} className="gap-1 text-xs">{st.icon} {st.label}</Badge> },
                  ].map(({ label, value, node }) => (
                    <div key={label} className="p-3 rounded-lg bg-muted">
                      <p className="text-xs text-muted-foreground">{label}</p>
                      {node ?? <p className="text-sm font-medium mt-0.5">{value}</p>}
                    </div>
                  ))}
                </div>

                {client && (
                  <Card className="border">
                    <CardContent className="pt-4 pb-4">
                      <p className="text-xs text-muted-foreground mb-2">Client</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                            {client.logo}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{client.name}</p>
                            <p className="text-xs text-muted-foreground">{client.industry}</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm"
                          onClick={() => { setSelectedDoc(null); navigate(`/clients/${client.id}`); }}>
                          View <ExternalLink className="ml-1 h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Button className="w-full"
                  onClick={(e) => { handleDownload(e as any, selectedDoc); setSelectedDoc(null); }}
                  disabled={downloading.has(selectedDoc.id)}>
                  <Download className="mr-2 h-4 w-4" /> Download {selectedDoc.name}
                </Button>
              </div>
            </DialogContent>
          );
        })()}
      </Dialog>
    </div>
  );
}

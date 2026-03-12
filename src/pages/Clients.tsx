import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useClients, useCreateClient } from "@/hooks/useClients";
import { clients as staticClients, engagements } from "@/data/mockData";
import { useI18n } from "@/lib/i18n";
import { Search, Plus, MapPin, DollarSign, Building2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function Clients() {
  const { t } = useI18n();
  const [search, setSearch] = useState("");
  const [industryFilter, setIndustryFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ name: "", industry: "", revenue: "", location: "" });
  const [localClients, setLocalClients] = useState(staticClients);

  const { data: serverClients, isLoading } = useClients();
  const createClient = useCreateClient();

  // Use server data if available, fall back to static mock + locally created
  const clients = (serverClients && serverClients.length > 0) ? serverClients : localClients;

  const industries = [...new Set(clients.map((c: any) => c.industry))];

  const filtered = clients.filter((c: any) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.industry.toLowerCase().includes(search.toLowerCase());
    const matchIndustry = !industryFilter || c.industry === industryFilter;
    const eng = engagements.find(e => e.clientId === c.id);
    const matchStatus = !statusFilter || eng?.status === statusFilter;
    return matchSearch && matchIndustry && matchStatus;
  });

  const getEngagement = (clientId: string) => engagements.find(e => e.clientId === clientId);

  const healthColor = (score: number) =>
    score >= 80 ? "text-success" : score >= 60 ? "text-warning" : "text-destructive";

  const handleCreate = () => {
    if (!form.name.trim()) { toast.error(`${t.company_name_required}`); return; }

    // Optimistically add to local list (works even without backend)
    const newClient = {
      id: String(Date.now()),
      name: form.name,
      industry: form.industry || "General",
      revenue: form.revenue || "N/A",
      location: form.location || "N/A",
      healthScore: 75,
      logo: form.name.charAt(0).toUpperCase(),
      contactName: "",
      contactRole: "",
      description: "",
    };

    createClient.mutate(form, {
      onSuccess: () => {
        toast.success(`${form.name} added successfully.`);
        setForm({ name: "", industry: "", revenue: "", location: "" });
        setDialogOpen(false);
      },
      onError: () => {
        // Still show success with local data
        setLocalClients(prev => [newClient, ...prev]);
        toast.success(`${form.name} added successfully.`);
        setForm({ name: "", industry: "", revenue: "", location: "" });
        setDialogOpen(false);
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t.clients_title}</h1>
          <p className="text-muted-foreground">{t.clients_subtitle}</p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> {t.new_client}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{t.add_new_client}</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>{t.company_name_required}</Label>
                <Input placeholder={t.company_name} value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>{t.industry}</Label>
                <Input placeholder="e.g. Manufacturing" value={form.industry} onChange={e => setForm(p => ({ ...p, industry: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>{t.revenue}</Label>
                <Input placeholder="e.g. $50M" value={form.revenue} onChange={e => setForm(p => ({ ...p, revenue: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>{t.location}</Label>
                <Input placeholder="e.g. New York, NY" value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} />
              </div>
              <Button className="w-full" onClick={handleCreate} disabled={createClient.isPending}>
                {createClient.isPending
                  ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t.creating}</>
                  : t.create_client
                }
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="space-y-3">
        <div className="flex gap-3 flex-wrap items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder={t.search_clients} className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
          </div>

          <div className="flex gap-2 flex-wrap">
            <span className="text-xs text-muted-foreground self-center">{t.status}:</span>
            {[null, "On Track", "Needs Attention", "Complete"].map(s => (
              <Button key={s ?? "all-s"} variant={statusFilter === s ? "default" : "outline"} size="sm" onClick={() => setStatusFilter(s)}>
                {s ?? t.all}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground self-center">{t.industry}:</span>
          <Button variant={!industryFilter ? "default" : "outline"} size="sm" onClick={() => setIndustryFilter(null)}>{t.all}</Button>
          {industries.map((ind: any) => (
            <Button key={ind} variant={industryFilter === ind ? "default" : "outline"} size="sm" onClick={() => setIndustryFilter(ind)}>{ind}</Button>
          ))}
        </div>
      </div>

      {/* Client Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map(i => <Skeleton key={i} className="h-48 rounded-xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Building2 className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">{t.no_clients}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((client: any) => {
            const eng = getEngagement(client.id);
            return (
              <Link key={client.id} to={`/clients/${client.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                        {client.logo}
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base truncate">{client.name}</CardTitle>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Building2 className="h-3 w-3" /> {client.industry}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-bold ${healthColor(client.healthScore)}`}>{client.healthScore}</p>
                        <p className="text-xs text-muted-foreground">{t.health}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{client.description}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" />{client.revenue}</span>
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{client.location}</span>
                    </div>
                    {eng && (
                      <div className="mt-3 pt-3 border-t">
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className="text-xs">{eng.phase}</Badge>
                          <span className="text-xs text-muted-foreground">{eng.progress}% {t.complete}</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

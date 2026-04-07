import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Milestone { id:string; title:string; dueDate:string; done:boolean; }
export interface Project {
  id:string; name:string; client:string; country:string; industry:string; type:string;
  status:"pipeline"|"active"|"review"|"completed"|"on_hold";
  priority:"critical"|"high"|"medium"|"low";
  value:number; currency:string; startDate:string; endDate:string;
  progress:number; leadName:string; team:string[]; tags:string[];
  milestones:Milestone[]; notes:string; createdAt:string;
}

function fromRow(r: any): Project {
  return { id:r.id, name:r.name, client:r.client, country:r.country, industry:r.industry,
    type:r.type, status:r.status, priority:r.priority, value:Number(r.value||0),
    currency:r.currency, startDate:r.start_date||"", endDate:r.end_date||"",
    progress:r.progress||0, leadName:r.lead_name||"", team:r.team||[], tags:r.tags||[],
    milestones:r.milestones||[], notes:r.notes||"", createdAt:r.created_at };
}

export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await (supabase as any).from("projects").select("*").order("created_at",{ascending:false});
      if (error) throw error;
      return (data ?? []).map(fromRow);
    },
    staleTime: 60_000,
  });
}

export function useCreateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (p: Omit<Project,"id"|"createdAt">) => {
      const { data, error } = await supabase.from("projects").insert({
        name:p.name, client:p.client, country:p.country, industry:p.industry, type:p.type,
        status:p.status, priority:p.priority, value:p.value, currency:p.currency,
        start_date:p.startDate||null, end_date:p.endDate||null, progress:p.progress,
        lead_name:p.leadName, team:p.team, tags:p.tags, milestones:p.milestones, notes:p.notes,
      }).select().single();
      if (error) throw error;
      return fromRow(data);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey:["projects"] }),
  });
}

export function useUpdateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...p }: Partial<Project> & { id:string }) => {
      const patch: any = {};
      if (p.name       !== undefined) patch.name       = p.name;
      if (p.client     !== undefined) patch.client     = p.client;
      if (p.status     !== undefined) patch.status     = p.status;
      if (p.priority   !== undefined) patch.priority   = p.priority;
      if (p.progress   !== undefined) patch.progress   = p.progress;
      if (p.value      !== undefined) patch.value      = p.value;
      if (p.leadName   !== undefined) patch.lead_name  = p.leadName;
      if (p.team       !== undefined) patch.team       = p.team;
      if (p.tags       !== undefined) patch.tags       = p.tags;
      if (p.milestones !== undefined) patch.milestones = p.milestones;
      if (p.notes      !== undefined) patch.notes      = p.notes;
      if (p.startDate  !== undefined) patch.start_date = p.startDate||null;
      if (p.endDate    !== undefined) patch.end_date   = p.endDate||null;
      const { data, error } = await supabase.from("projects").update(patch).eq("id",id).select().single();
      if (error) throw error;
      return fromRow(data);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey:["projects"] }),
  });
}

export function useDeleteProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id:string) => {
      const { error } = await supabase.from("projects").delete().eq("id",id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey:["projects"] }),
  });
}

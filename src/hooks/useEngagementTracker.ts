import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type HealthStatus = "on_track" | "at_risk" | "critical" | "completed";
export type Phase = "discovery" | "analysis" | "strategy" | "delivery" | "review";

export interface BillableEntry {
  id: string; date: string; hours: number;
  activity: string; consultant: string; billable: boolean;
}

export interface TrackerEngagement {
  id: string;
  projectName: string;
  client: string;
  lead: string;
  health: HealthStatus;
  currentPhase: Phase;
  startDate: string;
  endDate: string;
  contractValue: number;
  billedToDate: number;
  budgetBurned: number;
  hoursLogged: number;
  hoursTotal: number;
  npsScore: number | null;
  lastClientContact: string;
  nextMilestone: string;
  nextMilestoneDate: string;
  risks: string[];
  notes: string;
  billableEntries: BillableEntry[];
  createdAt: string;
}

function fromRow(r: any): TrackerEngagement {
  return {
    id: r.id,
    projectName: r.project_name || r.type || "",
    client: r.client_name || "",
    lead: r.lead_name || "",
    health: (r.health as HealthStatus) || "on_track",
    currentPhase: (r.phase?.toLowerCase() as Phase) || "discovery",
    startDate: r.start_date || "",
    endDate: r.due_date || "",
    contractValue: Number(r.contract_value || 0),
    billedToDate: Number(r.billed_to_date || 0),
    budgetBurned: Number(r.budget_burned || r.progress || 0),
    hoursLogged: Number(r.hours_logged || 0),
    hoursTotal: Number(r.hours_total || 0),
    npsScore: r.nps_score ?? null,
    lastClientContact: r.last_client_contact || "",
    nextMilestone: r.next_milestone || "",
    nextMilestoneDate: r.next_milestone_date || "",
    risks: r.risks || [],
    notes: r.notes || "",
    billableEntries: Array.isArray(r.billable_entries) ? r.billable_entries : [],
    createdAt: r.created_at,
  };
}

export function useTrackerEngagements() {
  return useQuery({
    queryKey: ["tracker-engagements"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("engagements")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map(fromRow);
    },
    staleTime: 30_000,
  });
}

export function useCreateTrackerEngagement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (e: Omit<TrackerEngagement, "id" | "createdAt">) => {
      // First ensure a client row exists or create one
      let clientId: string;
      const { data: existing } = await supabase
        .from("clients")
        .select("id")
        .ilike("name", e.client)
        .limit(1)
        .single();

      if (existing) {
        clientId = existing.id;
      } else {
        const { data: newClient, error: cErr } = await supabase
          .from("clients")
          .insert({ name: e.client, industry: "General", health_score: 50 })
          .select()
          .single();
        if (cErr) throw cErr;
        clientId = newClient.id;
      }

      const { data, error } = await supabase.from("engagements").insert({
        client_id: clientId,
        client_name: e.client,
        type: e.projectName,
        phase: e.currentPhase.charAt(0).toUpperCase() + e.currentPhase.slice(1),
        status: e.health === "completed" ? "Complete" : e.health === "at_risk" ? "Needs Attention" : "On Track",
        start_date: e.startDate || null,
        due_date: e.endDate || null,
        progress: e.budgetBurned,
        // Extended fields
        project_name: e.projectName,
        lead_name: e.lead,
        health: e.health,
        contract_value: e.contractValue,
        billed_to_date: e.billedToDate,
        budget_burned: e.budgetBurned,
        hours_logged: e.hoursLogged,
        hours_total: e.hoursTotal,
        nps_score: e.npsScore,
        last_client_contact: e.lastClientContact || null,
        next_milestone: e.nextMilestone,
        next_milestone_date: e.nextMilestoneDate || null,
        risks: e.risks,
        notes: e.notes,
        billable_entries: e.billableEntries,
      }).select().single();
      if (error) throw error;
      return fromRow(data);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tracker-engagements"] });
      qc.invalidateQueries({ queryKey: ["exec-engagements"] });
      qc.invalidateQueries({ queryKey: ["engagements"] });
    },
  });
}

export function useUpdateTrackerEngagement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...e }: Partial<TrackerEngagement> & { id: string }) => {
      const patch: any = {};
      if (e.projectName       !== undefined) { patch.project_name       = e.projectName; patch.type = e.projectName; }
      if (e.client            !== undefined) patch.client_name          = e.client;
      if (e.lead              !== undefined) patch.lead_name             = e.lead;
      if (e.health            !== undefined) { patch.health = e.health; patch.status = e.health === "completed" ? "Complete" : e.health === "at_risk" ? "Needs Attention" : "On Track"; }
      if (e.currentPhase      !== undefined) { patch.phase = e.currentPhase.charAt(0).toUpperCase() + e.currentPhase.slice(1); }
      if (e.startDate         !== undefined) patch.start_date            = e.startDate || null;
      if (e.endDate           !== undefined) patch.due_date              = e.endDate   || null;
      if (e.contractValue     !== undefined) patch.contract_value        = e.contractValue;
      if (e.billedToDate      !== undefined) patch.billed_to_date        = e.billedToDate;
      if (e.budgetBurned      !== undefined) { patch.budget_burned = e.budgetBurned; patch.progress = e.budgetBurned; }
      if (e.hoursLogged       !== undefined) patch.hours_logged          = e.hoursLogged;
      if (e.hoursTotal        !== undefined) patch.hours_total           = e.hoursTotal;
      if (e.npsScore          !== undefined) patch.nps_score             = e.npsScore;
      if (e.lastClientContact !== undefined) patch.last_client_contact   = e.lastClientContact || null;
      if (e.nextMilestone     !== undefined) patch.next_milestone        = e.nextMilestone;
      if (e.nextMilestoneDate !== undefined) patch.next_milestone_date   = e.nextMilestoneDate || null;
      if (e.risks             !== undefined) patch.risks                 = e.risks;
      if (e.notes             !== undefined) patch.notes                 = e.notes;
      if (e.billableEntries   !== undefined) patch.billable_entries      = e.billableEntries;

      const { data, error } = await supabase.from("engagements").update(patch).eq("id", id).select().single();
      if (error) throw error;
      return fromRow(data);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tracker-engagements"] });
      qc.invalidateQueries({ queryKey: ["exec-engagements"] });
    },
  });
}

export function useDeleteTrackerEngagement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("engagements").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tracker-engagements"] });
      qc.invalidateQueries({ queryKey: ["exec-engagements"] });
    },
  });
}

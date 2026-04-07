import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type LeadStatus = "New"|"Contacted"|"Qualified"|"Opportunity"|"Active Client"|"Closed Won"|"Closed Lost";

export interface CRMContact {
  id:string; fullName:string; jobTitle:string; email:string; phone:string;
  country:string; companyName:string; industry:string; sector:string;
  leadSource:string; interestedService:string; estimatedBudget:string;
  urgency:"High"|"Medium"|"Low"; leadStatus:LeadStatus; nextActionDate:string;
  notes:string; tags:string[];
  qualificationStatus:"Pending"|"Qualified"|"Rejected";
  qualificationNotes:string; clientNeed:string; businessProblem:string;
  decisionMaker:string; priorityLevel:"High"|"Medium"|"Low";
  engagementId:string|null; requestedOutputs:string[]; initialResourceNotes:string[];
  createdAt:string; updatedAt:string;
}

function fromRow(r: any): CRMContact {
  return {
    id:r.id, fullName:r.full_name, jobTitle:r.job_title||"", email:r.email||"",
    phone:r.phone||"", country:r.country||"Iraq", companyName:r.company_name||"",
    industry:r.industry||"", sector:r.sector||"", leadSource:r.lead_source||"Direct",
    interestedService:r.interested_service||"", estimatedBudget:r.estimated_budget||"",
    urgency:r.urgency||"Medium", leadStatus:r.lead_status, nextActionDate:r.next_action_date||"",
    notes:r.notes||"", tags:r.tags||[], qualificationStatus:r.qualification_status||"Pending",
    qualificationNotes:r.qualification_notes||"", clientNeed:r.client_need||"",
    businessProblem:r.business_problem||"", decisionMaker:r.decision_maker||"",
    priorityLevel:r.priority_level||"Medium", engagementId:r.engagement_id||null,
    requestedOutputs:r.requested_outputs||[], initialResourceNotes:r.initial_resource_notes||[],
    createdAt:r.created_at, updatedAt:r.updated_at,
  };
}

function toInsert(c: Omit<CRMContact,"id"|"createdAt"|"updatedAt">) {
  return {
    full_name:c.fullName, job_title:c.jobTitle, email:c.email, phone:c.phone,
    country:c.country, company_name:c.companyName, industry:c.industry, sector:c.sector,
    lead_source:c.leadSource, interested_service:c.interestedService,
    estimated_budget:c.estimatedBudget, urgency:c.urgency, lead_status:c.leadStatus,
    next_action_date:c.nextActionDate||null, notes:c.notes, tags:c.tags,
    qualification_status:c.qualificationStatus, qualification_notes:c.qualificationNotes,
    client_need:c.clientNeed, business_problem:c.businessProblem,
    decision_maker:c.decisionMaker, priority_level:c.priorityLevel,
    engagement_id:c.engagementId||null,
    requested_outputs:c.requestedOutputs||[],
    initial_resource_notes:c.initialResourceNotes||[],
  };
}

export function useCRMContacts() {
  return useQuery({
    queryKey: ["crm_contacts"],
    queryFn: async () => {
      const { data, error } = await supabase.from("crm_contacts").select("*").order("created_at",{ascending:false});
      if (error) throw error;
      return (data ?? []).map(fromRow);
    },
    staleTime: 60_000,
  });
}

export function useCreateCRMContact() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (c: Omit<CRMContact,"id"|"createdAt"|"updatedAt">) => {
      const { data, error } = await supabase.from("crm_contacts").insert(toInsert(c)).select().single();
      if (error) throw error;
      return fromRow(data);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey:["crm_contacts"] }),
  });
}

export function useUpdateCRMContact() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...c }: Partial<CRMContact> & { id:string }) => {
      const patch: any = {};
      if (c.fullName            !== undefined) patch.full_name            = c.fullName;
      if (c.jobTitle            !== undefined) patch.job_title            = c.jobTitle;
      if (c.email               !== undefined) patch.email               = c.email;
      if (c.phone               !== undefined) patch.phone               = c.phone;
      if (c.country             !== undefined) patch.country             = c.country;
      if (c.companyName         !== undefined) patch.company_name        = c.companyName;
      if (c.industry            !== undefined) patch.industry            = c.industry;
      if (c.leadStatus          !== undefined) patch.lead_status         = c.leadStatus;
      if (c.urgency             !== undefined) patch.urgency             = c.urgency;
      if (c.nextActionDate      !== undefined) patch.next_action_date    = c.nextActionDate||null;
      if (c.notes               !== undefined) patch.notes               = c.notes;
      if (c.tags                !== undefined) patch.tags                = c.tags;
      if (c.qualificationStatus !== undefined) patch.qualification_status = c.qualificationStatus;
      if (c.estimatedBudget     !== undefined) patch.estimated_budget    = c.estimatedBudget;
      if (c.engagementId        !== undefined) patch.engagement_id       = c.engagementId||null;
      if (c.clientNeed          !== undefined) patch.client_need         = c.clientNeed;
      if (c.businessProblem     !== undefined) patch.business_problem    = c.businessProblem;
      if (c.priorityLevel       !== undefined) patch.priority_level      = c.priorityLevel;
      const { data, error } = await supabase.from("crm_contacts").update(patch).eq("id",id).select().single();
      if (error) throw error;
      return fromRow(data);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey:["crm_contacts"] }),
  });
}

export function useDeleteCRMContact() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id:string) => {
      const { error } = await supabase.from("crm_contacts").delete().eq("id",id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey:["crm_contacts"] }),
  });
}

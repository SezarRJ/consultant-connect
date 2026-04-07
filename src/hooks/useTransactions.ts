import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Transaction {
  id: string; type: "invoice"|"expense"|"payment"|"refund";
  status: "pending"|"paid"|"overdue"|"cancelled";
  description: string; project: string; client: string;
  amount: number; currency: string; date: string; dueDate: string; notes: string;
  createdAt: string;
}

function fromRow(r: any): Transaction {
  return { id:r.id, type:r.type, status:r.status, description:r.description,
    project:r.project, client:r.client, amount:Number(r.amount), currency:r.currency,
    date:r.date, dueDate:r.due_date, notes:r.notes||"", createdAt:r.created_at };
}

export function useTransactions() {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const { data, error } = await supabase.from("transactions").select("*").order("date", { ascending: false });
      if (error) throw error;
      return (data ?? []).map(fromRow);
    },
    staleTime: 60_000,
  });
}

export function useCreateTransaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (t: Omit<Transaction,"id"|"createdAt">) => {
      const { data, error } = await supabase.from("transactions").insert({
        type:t.type, status:t.status, description:t.description, project:t.project,
        client:t.client, amount:t.amount, currency:t.currency, date:t.date,
        due_date:t.dueDate, notes:t.notes,
      }).select().single();
      if (error) throw error;
      return fromRow(data);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey:["transactions"] }),
  });
}

export function useUpdateTransaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...t }: Partial<Transaction> & { id: string }) => {
      const patch: any = {};
      if (t.type        !== undefined) patch.type        = t.type;
      if (t.status      !== undefined) patch.status      = t.status;
      if (t.description !== undefined) patch.description = t.description;
      if (t.project     !== undefined) patch.project     = t.project;
      if (t.client      !== undefined) patch.client      = t.client;
      if (t.amount      !== undefined) patch.amount      = t.amount;
      if (t.currency    !== undefined) patch.currency    = t.currency;
      if (t.date        !== undefined) patch.date        = t.date;
      if (t.dueDate     !== undefined) patch.due_date    = t.dueDate;
      if (t.notes       !== undefined) patch.notes       = t.notes;
      const { data, error } = await supabase.from("transactions").update(patch).eq("id",id).select().single();
      if (error) throw error;
      return fromRow(data);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey:["transactions"] }),
  });
}

export function useDeleteTransaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("transactions").delete().eq("id",id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey:["transactions"] }),
  });
}

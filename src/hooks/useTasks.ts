import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Task {
  id:string; title:string; description:string;
  status:"todo"|"in_progress"|"blocked"|"done";
  priority:"urgent"|"high"|"medium"|"low";
  dueDate:string; project:string; assignee:string; tags:string[]; createdAt:string;
}

function fromRow(r: any): Task {
  return { id:r.id, title:r.title, description:r.description||"", status:r.status,
    priority:r.priority, dueDate:r.due_date||"", project:r.project||"",
    assignee:r.assignee||"", tags:r.tags||[], createdAt:r.created_at };
}

export function useTasks() {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const { data, error } = await supabase.from("tasks").select("*").order("due_date",{ascending:true});
      if (error) throw error;
      return (data ?? []).map(fromRow);
    },
    staleTime: 60_000,
  });
}

export function useCreateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (t: Omit<Task,"id"|"createdAt">) => {
      const { data, error } = await supabase.from("tasks").insert({
        title:t.title, description:t.description, status:t.status, priority:t.priority,
        due_date:t.dueDate||null, project:t.project, assignee:t.assignee, tags:t.tags,
      }).select().single();
      if (error) throw error;
      return fromRow(data);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey:["tasks"] }),
  });
}

export function useUpdateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...t }: Partial<Task> & { id:string }) => {
      const patch: any = {};
      if (t.title       !== undefined) patch.title       = t.title;
      if (t.description !== undefined) patch.description = t.description;
      if (t.status      !== undefined) patch.status      = t.status;
      if (t.priority    !== undefined) patch.priority    = t.priority;
      if (t.dueDate     !== undefined) patch.due_date    = t.dueDate||null;
      if (t.project     !== undefined) patch.project     = t.project;
      if (t.assignee    !== undefined) patch.assignee    = t.assignee;
      if (t.tags        !== undefined) patch.tags        = t.tags;
      const { data, error } = await supabase.from("tasks").update(patch).eq("id",id).select().single();
      if (error) throw error;
      return fromRow(data);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey:["tasks"] }),
  });
}

export function useDeleteTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id:string) => {
      const { error } = await supabase.from("tasks").delete().eq("id",id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey:["tasks"] }),
  });
}

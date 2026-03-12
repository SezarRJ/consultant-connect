import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const usePlaybooks = () => {
  return useQuery({
    queryKey: ['playbooks'],
    queryFn: async () => {
      const { data, error } = await supabase.from('playbooks').select('*').order('times_used', { ascending: false });
      if (error) throw error;
      return data.map(p => ({
        id: p.id,
        title: p.title,
        category: p.category,
        successRate: p.success_rate,
        timesUsed: p.times_used,
        description: p.description,
      }));
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useSuggestPlaybook = (problem, industry) => {
  return useQuery({
    queryKey: ['playbooks', 'suggest', problem, industry],
    queryFn: async () => {
      // For now return all playbooks as suggestions
      const { data, error } = await supabase.from('playbooks').select('*');
      if (error) throw error;
      return data.map(p => ({
        id: p.id,
        title: p.title,
        category: p.category,
        successRate: p.success_rate,
        timesUsed: p.times_used,
        description: p.description,
      }));
    },
    enabled: !!problem && !!industry,
    staleTime: 5 * 60 * 1000,
  });
};

export const useApplyPlaybook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ playbookId }) => {
      // Increment times_used
      const { data: current } = await supabase.from('playbooks').select('times_used').eq('id', playbookId).single();
      const { error } = await supabase.from('playbooks').update({ times_used: (current?.times_used || 0) + 1 }).eq('id', playbookId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playbooks'] });
    },
  });
};

export const usePlaybookFeedback = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ playbookId }) => {
      // No-op for now
      return { id: playbookId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playbooks'] });
    },
  });
};

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useAgents = () => {
  return useQuery({
    queryKey: ['agents'],
    queryFn: async () => {
      const { data, error } = await supabase.from('ai_agents').select('*').order('created_at');
      if (error) throw error;
      return data.map(a => ({
        id: a.id,
        name: a.name,
        model: a.model,
        task: a.task,
        status: a.status,
        progress: a.progress,
        lastRun: a.last_run,
        description: a.description,
      }));
    },
    staleTime: 5 * 60 * 1000,
  });
};

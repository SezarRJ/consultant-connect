import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useEngagements = () => {
  return useQuery({
    queryKey: ['engagements'],
    queryFn: async () => {
      const { data, error } = await supabase.from('engagements').select('*').order('due_date');
      if (error) throw error;
      return data.map(e => ({
        id: e.id,
        clientId: e.client_id,
        clientName: e.client_name,
        type: e.type,
        phase: e.phase,
        progress: e.progress,
        status: e.status,
        startDate: e.start_date,
        dueDate: e.due_date,
      }));
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useClientEngagements = (clientId) => {
  return useQuery({
    queryKey: ['engagements', clientId],
    queryFn: async () => {
      const { data, error } = await supabase.from('engagements').select('*').eq('client_id', clientId);
      if (error) throw error;
      return data.map(e => ({
        id: e.id,
        clientId: e.client_id,
        clientName: e.client_name,
        type: e.type,
        phase: e.phase,
        progress: e.progress,
        status: e.status,
        startDate: e.start_date,
        dueDate: e.due_date,
      }));
    },
    enabled: !!clientId,
    staleTime: 5 * 60 * 1000,
  });
};

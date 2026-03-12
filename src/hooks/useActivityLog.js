import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useActivityLog = (clientId) => {
  return useQuery({
    queryKey: ['activityLog', clientId],
    queryFn: async () => {
      let query = supabase.from('activity_log').select('*').order('timestamp', { ascending: false }).limit(20);
      if (clientId) query = query.eq('client_id', clientId);
      const { data, error } = await query;
      if (error) throw error;
      return data.map(a => ({
        id: a.id,
        action: a.action,
        timestamp: a.timestamp,
        type: a.type,
        clientId: a.client_id,
      }));
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useClientKPIs = (clientId) => {
  return useQuery({
    queryKey: ['clientKPIs', clientId],
    queryFn: async () => {
      const { data, error } = await supabase.from('client_kpis').select('*').eq('client_id', clientId);
      if (error) throw error;
      return data.map(k => ({
        id: k.id,
        goal: k.goal,
        status: k.status,
        progress: k.progress,
      }));
    },
    enabled: !!clientId,
    staleTime: 5 * 60 * 1000,
  });
};

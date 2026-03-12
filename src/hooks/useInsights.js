import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useInsights = () => {
  return useQuery({
    queryKey: ['insights'],
    queryFn: async () => {
      const { data, error } = await supabase.from('insights').select('*').order('timestamp', { ascending: false });
      if (error) throw error;
      return data.map(i => ({
        id: i.id,
        clientId: i.client_id,
        clientName: i.client_name,
        severity: i.severity,
        title: i.title,
        description: i.description,
        timestamp: i.timestamp,
        isRead: i.is_read,
        source: i.source,
      }));
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useClientInsights = (clientId) => {
  return useQuery({
    queryKey: ['insights', clientId],
    queryFn: async () => {
      const { data, error } = await supabase.from('insights').select('*').eq('client_id', clientId).order('timestamp', { ascending: false });
      if (error) throw error;
      return data.map(i => ({
        id: i.id,
        clientId: i.client_id,
        clientName: i.client_name,
        severity: i.severity,
        title: i.title,
        description: i.description,
        timestamp: i.timestamp,
        isRead: i.is_read,
        source: i.source,
      }));
    },
    enabled: !!clientId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useDismissInsight = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (insightId) => {
      const { error } = await supabase.from('insights').update({ is_read: true }).eq('id', insightId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['insights'] });
    },
  });
};

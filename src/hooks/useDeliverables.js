import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useDeliverables = () => {
  return useQuery({
    queryKey: ['deliverables'],
    queryFn: async () => {
      const { data, error } = await supabase.from('deliverables').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data.map(d => ({
        id: d.id,
        clientId: d.client_id,
        clientName: d.client_name,
        type: d.type,
        audience: d.audience,
        format: d.format,
        status: d.status,
        createdAt: d.created_at,
        downloadUrl: d.download_url,
      }));
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useClientDeliverables = (clientId) => {
  return useQuery({
    queryKey: ['deliverables', clientId],
    queryFn: async () => {
      const { data, error } = await supabase.from('deliverables').select('*').eq('client_id', clientId).order('created_at', { ascending: false });
      if (error) throw error;
      return data.map(d => ({
        id: d.id,
        clientId: d.client_id,
        clientName: d.client_name,
        type: d.type,
        audience: d.audience,
        format: d.format,
        status: d.status,
        createdAt: d.created_at,
        downloadUrl: d.download_url,
      }));
    },
    enabled: !!clientId,
    staleTime: 5 * 60 * 1000,
  });
};

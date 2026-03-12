import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export const useInsights = () => {
  return useQuery({
    queryKey: ['insights'],
    queryFn: async () => {
      const { data } = await api.get('/insights/proactive');
      return data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useClientInsights = (clientId) => {
  return useQuery({
    queryKey: ['insights', clientId],
    queryFn: async () => {
      const { data } = await api.get(`/clients/${clientId}/insights`);
      return data;
    },
    enabled: !!clientId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useDismissInsight = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (insightId) => {
      await api.put(`/insights/${insightId}/dismiss`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['insights'] });
    },
  });
};

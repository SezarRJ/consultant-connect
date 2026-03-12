import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export const useStrategies = (clientId) => {
  return useQuery({
    queryKey: ['strategies', clientId],
    queryFn: async () => {
      const { data } = await api.get(`/clients/${clientId}/strategy`);
      return data;
    },
    enabled: !!clientId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useGenerateStrategy = (clientId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (strategyData) => {
      const { data } = await api.post(`/clients/${clientId}/strategy/generate`, strategyData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['strategies', clientId] });
    },
  });
};

export const useAcceptStrategy = (clientId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (strategyId) => {
      const { data } = await api.put(`/clients/${clientId}/strategy/${strategyId}/accept`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['strategies', clientId] });
    },
  });
};

export const useRejectStrategy = (clientId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ strategyId, reason }) => {
      const { data } = await api.put(`/clients/${clientId}/strategy/${strategyId}/reject`, { reason });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['strategies', clientId] });
    },
  });
};

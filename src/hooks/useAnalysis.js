import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export const useRunAnalysis = (clientId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (analysisData) => {
      const { data } = await api.post(`/clients/${clientId}/analysis/run`, analysisData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analysis', clientId] });
    },
  });
};

export const useAnalysis = (clientId) => {
  return useQuery({
    queryKey: ['analysis', clientId],
    queryFn: async () => {
      const { data } = await api.get(`/clients/${clientId}/analysis`);
      return data;
    },
    enabled: !!clientId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useAnalysisDetail = (clientId, analysisId) => {
  return useQuery({
    queryKey: ['analysis', clientId, analysisId],
    queryFn: async () => {
      const { data } = await api.get(`/clients/${clientId}/analysis/${analysisId}`);
      return data;
    },
    enabled: !!clientId && !!analysisId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useJobStatus = (jobId) => {
  return useQuery({
    queryKey: ['job', jobId],
    queryFn: async () => {
      const { data } = await api.get(`/jobs/${jobId}/status`);
      return data;
    },
    enabled: !!jobId,
    refetchInterval: 3000, // Poll every 3 seconds
  });
};

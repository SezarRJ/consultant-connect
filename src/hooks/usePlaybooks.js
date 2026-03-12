import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export const usePlaybooks = () => {
  return useQuery({
    queryKey: ['playbooks'],
    queryFn: async () => {
      const { data } = await api.get('/playbooks');
      return data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useSuggestPlaybook = (problem, industry) => {
  return useQuery({
    queryKey: ['playbooks', 'suggest', problem, industry],
    queryFn: async () => {
      const { data } = await api.get('/playbooks/suggest', {
        params: { problem, industry },
      });
      return data;
    },
    enabled: !!problem && !!industry,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useApplyPlaybook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ playbookId, engagementId }) => {
      const { data } = await api.post(`/playbooks/${playbookId}/apply`, { engagementId });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playbooks'] });
    },
  });
};

export const usePlaybookFeedback = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ playbookId, outcome }) => {
      const { data } = await api.put(`/playbooks/${playbookId}/feedback`, { outcome });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playbooks'] });
    },
  });
};

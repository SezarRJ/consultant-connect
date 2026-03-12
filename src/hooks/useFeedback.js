import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export const useSubmitFeedback = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (feedbackData) => {
      const { data } = await api.post('/feedback', feedbackData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calibration'] });
    },
  });
};

export const useCalibration = () => {
  return useQuery({
    queryKey: ['calibration'],
    queryFn: async () => {
      const { data } = await api.get('/agents/calibration');
      return data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

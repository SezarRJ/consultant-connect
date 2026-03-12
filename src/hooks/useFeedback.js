import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useSubmitFeedback = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (feedbackData) => {
      // Store feedback locally for now
      console.log('Feedback submitted:', feedbackData);
      return feedbackData;
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
      // Return default calibration data
      return {
        accuracy: 0.87,
        totalFeedback: 42,
        positive: 36,
        negative: 6,
      };
    },
    staleTime: 5 * 60 * 1000,
  });
};

import { useQuery, useMutation } from '@tanstack/react-query';
import api from '@/lib/api';

export const useUpcomingMeetings = (clientId) => {
  return useQuery({
    queryKey: ['meetings', clientId],
    queryFn: async () => {
      const { data } = await api.get('/integrations/calendar/upcoming', {
        params: { clientId },
      });
      return data;
    },
    enabled: !!clientId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useGoogleAuthUrl = () => {
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.get('/integrations/google/auth-url');
      return data;
    },
  });
};

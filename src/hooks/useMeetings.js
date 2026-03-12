import { useQuery } from '@tanstack/react-query';

export const useUpcomingMeetings = (clientId) => {
  return useQuery({
    queryKey: ['meetings', clientId],
    queryFn: async () => {
      // Return empty meetings - calendar integration not yet set up
      return [];
    },
    enabled: !!clientId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useGoogleAuthUrl = () => {
  return {
    mutateAsync: async () => {
      return { url: '#' };
    },
  };
};

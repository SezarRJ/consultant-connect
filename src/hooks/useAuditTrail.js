import { useQuery } from '@tanstack/react-query';

export const useAuditTrail = (entityId) => {
  return useQuery({
    queryKey: ['auditTrail', entityId],
    queryFn: async () => {
      // Return empty audit trail - will be populated when actions occur
      return [];
    },
    enabled: !!entityId,
    staleTime: 5 * 60 * 1000,
  });
};

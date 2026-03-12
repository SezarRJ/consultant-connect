import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export const useAuditTrail = (entityId) => {
  return useQuery({
    queryKey: ['auditTrail', entityId],
    queryFn: async () => {
      const { data } = await api.get(`/audit-trail/${entityId}`);
      return data;
    },
    enabled: !!entityId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

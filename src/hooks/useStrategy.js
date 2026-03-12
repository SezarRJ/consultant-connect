import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useStrategies = (clientId) => {
  return useQuery({
    queryKey: ['strategies', clientId],
    queryFn: async () => {
      const { data, error } = await supabase.from('strategies').select('*').eq('client_id', clientId);
      if (error) throw error;
      return data.map(s => ({
        id: s.id,
        clientId: s.client_id,
        label: s.label,
        title: s.title,
        description: s.description,
        impactScore: s.impact_score,
        riskScore: s.risk_score,
        investmentLevel: s.investment_level,
        revenueChange: s.revenue_change,
        costChange: s.cost_change,
        roiBreakeven: s.roi_breakeven,
        status: s.status,
      }));
    },
    enabled: !!clientId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useGenerateStrategy = (clientId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (strategyData) => {
      const { data, error } = await supabase.from('strategies').insert({
        client_id: clientId,
        ...strategyData,
      }).select().single();
      if (error) throw error;
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
      const { error } = await supabase.from('strategies').update({ status: 'accepted' }).eq('id', strategyId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['strategies', clientId] });
    },
  });
};

export const useRejectStrategy = (clientId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ strategyId }) => {
      const { error } = await supabase.from('strategies').update({ status: 'rejected' }).eq('id', strategyId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['strategies', clientId] });
    },
  });
};

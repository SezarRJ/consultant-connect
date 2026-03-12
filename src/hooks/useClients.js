import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useClients = () => {
  return useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const { data, error } = await supabase.from('clients').select('*').order('name');
      if (error) throw error;
      return data.map(c => ({
        id: c.id,
        name: c.name,
        industry: c.industry,
        revenue: c.revenue,
        location: c.location,
        healthScore: c.health_score,
        logo: c.logo,
        contactName: c.contact_name,
        contactRole: c.contact_role,
        description: c.description,
      }));
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useClient = (id) => {
  return useQuery({
    queryKey: ['client', id],
    queryFn: async () => {
      const { data, error } = await supabase.from('clients').select('*').eq('id', id).single();
      if (error) throw error;
      return {
        id: data.id,
        name: data.name,
        industry: data.industry,
        revenue: data.revenue,
        location: data.location,
        healthScore: data.health_score,
        logo: data.logo,
        contactName: data.contact_name,
        contactRole: data.contact_role,
        description: data.description,
      };
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateClient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (clientData) => {
      const { data, error } = await supabase.from('clients').insert({
        name: clientData.name,
        industry: clientData.industry,
        revenue: clientData.revenue,
        location: clientData.location,
        health_score: clientData.healthScore || 50,
        logo: clientData.name?.charAt(0) || '?',
        contact_name: clientData.contactName || '',
        contact_role: clientData.contactRole || '',
        description: clientData.description || '',
      }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
};

export const useUpdateClient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...clientData }) => {
      const updateData = {};
      if (clientData.name !== undefined) updateData.name = clientData.name;
      if (clientData.industry !== undefined) updateData.industry = clientData.industry;
      if (clientData.revenue !== undefined) updateData.revenue = clientData.revenue;
      if (clientData.location !== undefined) updateData.location = clientData.location;
      if (clientData.healthScore !== undefined) updateData.health_score = clientData.healthScore;
      if (clientData.contactName !== undefined) updateData.contact_name = clientData.contactName;
      if (clientData.contactRole !== undefined) updateData.contact_role = clientData.contactRole;
      if (clientData.description !== undefined) updateData.description = clientData.description;
      
      const { data, error } = await supabase.from('clients').update(updateData).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['client', data.id] });
    },
  });
};

export const useDeleteClient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from('clients').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
};

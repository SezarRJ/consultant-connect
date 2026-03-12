import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useDocuments = (clientId) => {
  return useQuery({
    queryKey: ['documents', clientId],
    queryFn: async () => {
      let query = supabase.from('documents').select('*').order('upload_date', { ascending: false });
      if (clientId) query = query.eq('client_id', clientId);
      const { data, error } = await query;
      if (error) throw error;
      return data.map(d => ({
        id: d.id,
        clientId: d.client_id,
        name: d.name,
        type: d.type,
        size: d.size,
        uploadDate: d.upload_date,
        extractionStatus: d.extraction_status,
      }));
    },
    enabled: clientId ? !!clientId : true,
    staleTime: 5 * 60 * 1000,
  });
};

export const useAllDocuments = () => {
  return useQuery({
    queryKey: ['documents', 'all'],
    queryFn: async () => {
      const { data, error } = await supabase.from('documents').select('*').order('upload_date', { ascending: false });
      if (error) throw error;
      return data.map(d => ({
        id: d.id,
        clientId: d.client_id,
        name: d.name,
        type: d.type,
        size: d.size,
        uploadDate: d.upload_date,
        extractionStatus: d.extraction_status,
      }));
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useUploadDocument = (clientId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (docData) => {
      const { data, error } = await supabase.from('documents').insert({
        client_id: clientId,
        name: docData.name || 'Untitled',
        type: docData.type || 'PDF',
        size: docData.size || '0 KB',
        upload_date: new Date().toISOString().split('T')[0],
        extraction_status: 'pending',
      }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
};

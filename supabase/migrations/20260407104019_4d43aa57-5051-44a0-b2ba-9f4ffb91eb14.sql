
CREATE TABLE public.crm_contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  job_title TEXT DEFAULT '',
  email TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  country TEXT DEFAULT 'Iraq',
  company_name TEXT DEFAULT '',
  industry TEXT DEFAULT '',
  sector TEXT DEFAULT '',
  lead_source TEXT DEFAULT 'Direct',
  interested_service TEXT DEFAULT '',
  estimated_budget TEXT DEFAULT '',
  urgency TEXT DEFAULT 'Medium',
  lead_status TEXT NOT NULL DEFAULT 'New',
  next_action_date TEXT,
  notes TEXT DEFAULT '',
  tags TEXT[] DEFAULT '{}',
  qualification_status TEXT DEFAULT 'Pending',
  qualification_notes TEXT DEFAULT '',
  client_need TEXT DEFAULT '',
  business_problem TEXT DEFAULT '',
  decision_maker TEXT DEFAULT '',
  priority_level TEXT DEFAULT 'Medium',
  engagement_id UUID,
  requested_outputs TEXT[] DEFAULT '{}',
  initial_resource_notes TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.crm_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON public.crm_contacts FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON public.crm_contacts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON public.crm_contacts FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON public.crm_contacts FOR DELETE USING (true);

CREATE TRIGGER update_crm_contacts_updated_at
  BEFORE UPDATE ON public.crm_contacts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

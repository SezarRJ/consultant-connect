
-- Create clients table
CREATE TABLE public.clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  industry TEXT NOT NULL,
  revenue TEXT,
  location TEXT,
  health_score INTEGER DEFAULT 0,
  logo TEXT,
  contact_name TEXT,
  contact_role TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create engagements table
CREATE TABLE public.engagements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
  client_name TEXT NOT NULL,
  type TEXT NOT NULL,
  phase TEXT NOT NULL CHECK (phase IN ('Discovery', 'Analysis', 'Strategy', 'Reporting', 'Complete')),
  progress INTEGER DEFAULT 0,
  status TEXT NOT NULL CHECK (status IN ('On Track', 'Needs Attention', 'Complete')),
  start_date DATE,
  due_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create insights table
CREATE TABLE public.insights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
  client_name TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('critical', 'warning', 'info')),
  title TEXT NOT NULL,
  description TEXT,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_read BOOLEAN DEFAULT false,
  source TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create ai_agents table
CREATE TABLE public.ai_agents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  model TEXT NOT NULL,
  task TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('queued', 'running', 'complete', 'error')),
  progress INTEGER DEFAULT 0,
  last_run TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create strategies table
CREATE TABLE public.strategies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
  label TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  impact_score INTEGER DEFAULT 0,
  risk_score INTEGER DEFAULT 0,
  investment_level TEXT CHECK (investment_level IN ('Low', 'Medium', 'High')),
  revenue_change TEXT,
  cost_change TEXT,
  roi_breakeven TEXT,
  status TEXT NOT NULL CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create documents table
CREATE TABLE public.documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  size TEXT,
  upload_date DATE,
  extraction_status TEXT NOT NULL CHECK (extraction_status IN ('pending', 'processing', 'complete', 'error')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create deliverables table
CREATE TABLE public.deliverables (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
  client_name TEXT NOT NULL,
  type TEXT NOT NULL,
  audience TEXT,
  format TEXT,
  status TEXT NOT NULL CHECK (status IN ('generating', 'complete', 'error')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  download_url TEXT
);

-- Create playbooks table
CREATE TABLE public.playbooks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  success_rate INTEGER DEFAULT 0,
  times_used INTEGER DEFAULT 0,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create client_kpis table
CREATE TABLE public.client_kpis (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
  goal TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('On Track', 'Behind', 'At Risk')),
  progress INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create activity_log table
CREATE TABLE public.activity_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  action TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  type TEXT NOT NULL,
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.engagements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.strategies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deliverables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playbooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_kpis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

-- Since this is a consultant app without user auth yet, allow public read access
-- These can be tightened later when auth is added
CREATE POLICY "Allow public read access" ON public.clients FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.engagements FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.insights FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.ai_agents FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.strategies FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.documents FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.deliverables FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.playbooks FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.client_kpis FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.activity_log FOR SELECT USING (true);

-- Allow public insert/update/delete for now (tighten with auth later)
CREATE POLICY "Allow public insert" ON public.clients FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON public.clients FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON public.clients FOR DELETE USING (true);

CREATE POLICY "Allow public insert" ON public.engagements FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON public.engagements FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON public.engagements FOR DELETE USING (true);

CREATE POLICY "Allow public insert" ON public.insights FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON public.insights FOR UPDATE USING (true);

CREATE POLICY "Allow public insert" ON public.ai_agents FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON public.ai_agents FOR UPDATE USING (true);

CREATE POLICY "Allow public insert" ON public.strategies FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON public.strategies FOR UPDATE USING (true);

CREATE POLICY "Allow public insert" ON public.documents FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON public.documents FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON public.documents FOR DELETE USING (true);

CREATE POLICY "Allow public insert" ON public.deliverables FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON public.deliverables FOR UPDATE USING (true);

CREATE POLICY "Allow public insert" ON public.playbooks FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public insert" ON public.client_kpis FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON public.client_kpis FOR UPDATE USING (true);

CREATE POLICY "Allow public insert" ON public.activity_log FOR INSERT WITH CHECK (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add triggers
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON public.clients FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_engagements_updated_at BEFORE UPDATE ON public.engagements FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_ai_agents_updated_at BEFORE UPDATE ON public.ai_agents FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_strategies_updated_at BEFORE UPDATE ON public.strategies FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON public.documents FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

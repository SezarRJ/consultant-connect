-- ============================================================
-- Migration: extend engagements + add transactions, projects,
-- tasks, crm_contacts tables so all pages read/write Supabase
-- ============================================================

-- 1. Extend engagements with full EngagementTracker fields
ALTER TABLE public.engagements
  ADD COLUMN IF NOT EXISTS project_name     TEXT,
  ADD COLUMN IF NOT EXISTS lead_name        TEXT,
  ADD COLUMN IF NOT EXISTS health           TEXT DEFAULT 'on_track'
    CHECK (health IN ('on_track','at_risk','critical','completed')),
  ADD COLUMN IF NOT EXISTS contract_value   NUMERIC(12,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS billed_to_date   NUMERIC(12,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS budget_burned    INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS hours_logged     NUMERIC(8,1)  DEFAULT 0,
  ADD COLUMN IF NOT EXISTS hours_total      NUMERIC(8,1)  DEFAULT 0,
  ADD COLUMN IF NOT EXISTS nps_score        INTEGER,
  ADD COLUMN IF NOT EXISTS last_client_contact DATE,
  ADD COLUMN IF NOT EXISTS next_milestone   TEXT,
  ADD COLUMN IF NOT EXISTS next_milestone_date DATE,
  ADD COLUMN IF NOT EXISTS risks            TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS notes            TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS billable_entries JSONB DEFAULT '[]';

-- 2. transactions table (replaces FinancialOverview localStorage)
CREATE TABLE IF NOT EXISTS public.transactions (
  id          UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type        TEXT NOT NULL CHECK (type IN ('invoice','expense','payment','refund')),
  status      TEXT NOT NULL DEFAULT 'pending'
              CHECK (status IN ('pending','paid','overdue','cancelled')),
  description TEXT NOT NULL DEFAULT '',
  project     TEXT NOT NULL DEFAULT '',
  client      TEXT NOT NULL DEFAULT '',
  amount      NUMERIC(12,2) NOT NULL DEFAULT 0,
  currency    TEXT NOT NULL DEFAULT 'USD',
  date        DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date    DATE NOT NULL DEFAULT CURRENT_DATE,
  notes       TEXT DEFAULT '',
  created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. projects table (replaces Projects localStorage)
CREATE TABLE IF NOT EXISTS public.projects (
  id          UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL,
  client      TEXT NOT NULL DEFAULT '',
  country     TEXT NOT NULL DEFAULT 'Iraq',
  industry    TEXT NOT NULL DEFAULT 'FMCG',
  type        TEXT NOT NULL DEFAULT 'Market Entry',
  status      TEXT NOT NULL DEFAULT 'pipeline'
              CHECK (status IN ('pipeline','active','review','completed','on_hold')),
  priority    TEXT NOT NULL DEFAULT 'medium'
              CHECK (priority IN ('critical','high','medium','low')),
  value       NUMERIC(12,2) DEFAULT 0,
  currency    TEXT NOT NULL DEFAULT 'USD',
  start_date  DATE,
  end_date    DATE,
  progress    INTEGER DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  lead_name   TEXT DEFAULT '',
  team        TEXT[] DEFAULT '{}',
  tags        TEXT[] DEFAULT '{}',
  milestones  JSONB DEFAULT '[]',
  notes       TEXT DEFAULT '',
  created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 4. tasks table (replaces Tasks localStorage)
CREATE TABLE IF NOT EXISTS public.tasks (
  id          UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title       TEXT NOT NULL,
  description TEXT DEFAULT '',
  status      TEXT NOT NULL DEFAULT 'todo'
              CHECK (status IN ('todo','in_progress','blocked','done')),
  priority    TEXT NOT NULL DEFAULT 'medium'
              CHECK (priority IN ('urgent','high','medium','low')),
  due_date    DATE,
  project     TEXT DEFAULT '',
  assignee    TEXT DEFAULT '',
  tags        TEXT[] DEFAULT '{}',
  created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 5. crm_contacts table (replaces Zustand engagementStore)
CREATE TABLE IF NOT EXISTS public.crm_contacts (
  id                    UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name             TEXT NOT NULL,
  job_title             TEXT DEFAULT '',
  email                 TEXT DEFAULT '',
  phone                 TEXT DEFAULT '',
  country               TEXT DEFAULT 'Iraq',
  company_name          TEXT DEFAULT '',
  industry              TEXT DEFAULT '',
  sector                TEXT DEFAULT '',
  lead_source           TEXT DEFAULT 'Direct',
  interested_service    TEXT DEFAULT '',
  estimated_budget      TEXT DEFAULT '',
  urgency               TEXT DEFAULT 'Medium' CHECK (urgency IN ('High','Medium','Low')),
  lead_status           TEXT NOT NULL DEFAULT 'New'
                        CHECK (lead_status IN ('New','Contacted','Qualified','Opportunity','Active Client','Closed Won','Closed Lost')),
  next_action_date      DATE,
  notes                 TEXT DEFAULT '',
  tags                  TEXT[] DEFAULT '{}',
  qualification_status  TEXT DEFAULT 'Pending' CHECK (qualification_status IN ('Pending','Qualified','Rejected')),
  qualification_notes   TEXT DEFAULT '',
  client_need           TEXT DEFAULT '',
  business_problem      TEXT DEFAULT '',
  decision_maker        TEXT DEFAULT '',
  priority_level        TEXT DEFAULT 'Medium' CHECK (priority_level IN ('High','Medium','Low')),
  engagement_id         UUID REFERENCES public.engagements(id) ON DELETE SET NULL,
  created_at            TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at            TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- RLS: allow public access (same pattern as existing tables)
ALTER TABLE public.transactions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_contacts  ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  -- transactions
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='transactions' AND policyname='Allow public read') THEN
    CREATE POLICY "Allow public read"   ON public.transactions FOR SELECT USING (true);
    CREATE POLICY "Allow public insert" ON public.transactions FOR INSERT WITH CHECK (true);
    CREATE POLICY "Allow public update" ON public.transactions FOR UPDATE USING (true);
    CREATE POLICY "Allow public delete" ON public.transactions FOR DELETE USING (true);
  END IF;
  -- projects
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='projects' AND policyname='Allow public read') THEN
    CREATE POLICY "Allow public read"   ON public.projects FOR SELECT USING (true);
    CREATE POLICY "Allow public insert" ON public.projects FOR INSERT WITH CHECK (true);
    CREATE POLICY "Allow public update" ON public.projects FOR UPDATE USING (true);
    CREATE POLICY "Allow public delete" ON public.projects FOR DELETE USING (true);
  END IF;
  -- tasks
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='tasks' AND policyname='Allow public read') THEN
    CREATE POLICY "Allow public read"   ON public.tasks FOR SELECT USING (true);
    CREATE POLICY "Allow public insert" ON public.tasks FOR INSERT WITH CHECK (true);
    CREATE POLICY "Allow public update" ON public.tasks FOR UPDATE USING (true);
    CREATE POLICY "Allow public delete" ON public.tasks FOR DELETE USING (true);
  END IF;
  -- crm_contacts
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='crm_contacts' AND policyname='Allow public read') THEN
    CREATE POLICY "Allow public read"   ON public.crm_contacts FOR SELECT USING (true);
    CREATE POLICY "Allow public insert" ON public.crm_contacts FOR INSERT WITH CHECK (true);
    CREATE POLICY "Allow public update" ON public.crm_contacts FOR UPDATE USING (true);
    CREATE POLICY "Allow public delete" ON public.crm_contacts FOR DELETE USING (true);
  END IF;
END $$;

-- updated_at triggers for new tables
CREATE TRIGGER update_transactions_updated_at  BEFORE UPDATE ON public.transactions  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_projects_updated_at      BEFORE UPDATE ON public.projects      FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at         BEFORE UPDATE ON public.tasks         FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_crm_contacts_updated_at  BEFORE UPDATE ON public.crm_contacts  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

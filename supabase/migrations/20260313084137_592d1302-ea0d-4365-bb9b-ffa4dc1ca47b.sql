
-- Drop all existing public write policies and replace with authenticated-only policies

-- CLIENTS
DROP POLICY IF EXISTS "Allow public insert" ON public.clients;
DROP POLICY IF EXISTS "Allow public update" ON public.clients;
DROP POLICY IF EXISTS "Allow public delete" ON public.clients;
CREATE POLICY "Authenticated insert" ON public.clients FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated update" ON public.clients FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated delete" ON public.clients FOR DELETE TO authenticated USING (true);

-- ENGAGEMENTS
DROP POLICY IF EXISTS "Allow public insert" ON public.engagements;
DROP POLICY IF EXISTS "Allow public update" ON public.engagements;
DROP POLICY IF EXISTS "Allow public delete" ON public.engagements;
CREATE POLICY "Authenticated insert" ON public.engagements FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated update" ON public.engagements FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated delete" ON public.engagements FOR DELETE TO authenticated USING (true);

-- INSIGHTS
DROP POLICY IF EXISTS "Allow public insert" ON public.insights;
DROP POLICY IF EXISTS "Allow public update" ON public.insights;
CREATE POLICY "Authenticated insert" ON public.insights FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated update" ON public.insights FOR UPDATE TO authenticated USING (true);

-- AI_AGENTS
DROP POLICY IF EXISTS "Allow public insert" ON public.ai_agents;
DROP POLICY IF EXISTS "Allow public update" ON public.ai_agents;
CREATE POLICY "Authenticated insert" ON public.ai_agents FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated update" ON public.ai_agents FOR UPDATE TO authenticated USING (true);

-- STRATEGIES
DROP POLICY IF EXISTS "Allow public insert" ON public.strategies;
DROP POLICY IF EXISTS "Allow public update" ON public.strategies;
CREATE POLICY "Authenticated insert" ON public.strategies FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated update" ON public.strategies FOR UPDATE TO authenticated USING (true);

-- DOCUMENTS
DROP POLICY IF EXISTS "Allow public insert" ON public.documents;
DROP POLICY IF EXISTS "Allow public update" ON public.documents;
DROP POLICY IF EXISTS "Allow public delete" ON public.documents;
CREATE POLICY "Authenticated insert" ON public.documents FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated update" ON public.documents FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated delete" ON public.documents FOR DELETE TO authenticated USING (true);

-- DELIVERABLES
DROP POLICY IF EXISTS "Allow public insert" ON public.deliverables;
DROP POLICY IF EXISTS "Allow public update" ON public.deliverables;
CREATE POLICY "Authenticated insert" ON public.deliverables FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated update" ON public.deliverables FOR UPDATE TO authenticated USING (true);

-- PLAYBOOKS
DROP POLICY IF EXISTS "Allow public insert" ON public.playbooks;
CREATE POLICY "Authenticated insert" ON public.playbooks FOR INSERT TO authenticated WITH CHECK (true);

-- CLIENT_KPIS
DROP POLICY IF EXISTS "Allow public insert" ON public.client_kpis;
DROP POLICY IF EXISTS "Allow public update" ON public.client_kpis;
CREATE POLICY "Authenticated insert" ON public.client_kpis FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated update" ON public.client_kpis FOR UPDATE TO authenticated USING (true);

-- ACTIVITY_LOG
DROP POLICY IF EXISTS "Allow public insert" ON public.activity_log;
CREATE POLICY "Authenticated insert" ON public.activity_log FOR INSERT TO authenticated WITH CHECK (true);

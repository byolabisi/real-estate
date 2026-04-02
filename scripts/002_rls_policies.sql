-- Users table RLS policies
create policy "Users can view all profiles" on public.users for select using (true);
create policy "Users can update own profile" on public.users for update using (auth.uid() = id);

-- Listings table RLS policies
create policy "Anyone can view listings" on public.listings for select using (true);
create policy "Agents can insert listings" on public.listings for insert with check (auth.uid() = agent_id and auth.uid() in (select id from public.users where user_type = 'agent'));
create policy "Agents can update own listings" on public.listings for update using (auth.uid() = agent_id);
create policy "Agents can delete own listings" on public.listings for delete using (auth.uid() = agent_id);

-- Agent ratings RLS policies
create policy "Anyone can view ratings" on public.agent_ratings for select using (true);
create policy "Users can create ratings" on public.agent_ratings for insert with check (auth.uid() = reviewer_id);

-- Tenant reviews RLS policies
create policy "Anyone can view reviews" on public.tenant_reviews for select using (true);
create policy "Tenants can create reviews" on public.tenant_reviews for insert with check (auth.uid() = reviewer_id);

-- Tenant history RLS policies
create policy "Agents can view tenant history for their listings" on public.tenant_history for select using (
  listing_id in (select id from public.listings where agent_id = auth.uid())
  or tenant_id = auth.uid()
);
create policy "Agents can insert tenant history" on public.tenant_history for insert with check (
  listing_id in (select id from public.listings where agent_id = auth.uid())
);

-- Maintenance notices RLS policies
create policy "Anyone can view maintenance notices" on public.maintenance_notices for select using (true);
create policy "Agents can create maintenance notices" on public.maintenance_notices for insert with check (
  listing_id in (select id from public.listings where agent_id = auth.uid())
);

-- Waitlist RLS policies
create policy "Anyone can join waitlist" on public.waitlist for insert with check (true);

-- Email logs RLS policies
create policy "Service can insert email logs" on public.email_logs for insert with check (true);

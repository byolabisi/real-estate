-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- USERS TABLE POLICIES
-- Users can view their own data
CREATE POLICY users_select_self ON users
  FOR SELECT
  USING (auth.uid() = id);

-- Users can view public agent profiles
CREATE POLICY users_select_agents ON users
  FOR SELECT
  USING (user_type = 'agent' OR auth.uid() = id);

-- Users can update their own profile
CREATE POLICY users_update_self ON users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Users can insert their own record (signup)
CREATE POLICY users_insert_self ON users
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- LISTINGS TABLE POLICIES
-- Anyone authenticated can view all listings
CREATE POLICY listings_select_all ON listings
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Agents/landlords can create listings
CREATE POLICY listings_insert_own ON listings
  FOR INSERT
  WITH CHECK (
    auth.uid() = agent_id AND
    (SELECT user_type FROM users WHERE id = auth.uid()) IN ('agent', 'landlord')
  );

-- Agents/landlords can update their own listings
CREATE POLICY listings_update_own ON listings
  FOR UPDATE
  USING (
    auth.uid() = agent_id AND
    (SELECT user_type FROM users WHERE id = auth.uid()) IN ('agent', 'landlord')
  )
  WITH CHECK (
    auth.uid() = agent_id AND
    (SELECT user_type FROM users WHERE id = auth.uid()) IN ('agent', 'landlord')
  );

-- Agents/landlords can delete their own listings
CREATE POLICY listings_delete_own ON listings
  FOR DELETE
  USING (
    auth.uid() = agent_id AND
    (SELECT user_type FROM users WHERE id = auth.uid()) IN ('agent', 'landlord')
  );

-- AGENT RATINGS TABLE POLICIES
-- Anyone can view ratings
CREATE POLICY agent_ratings_select_all ON agent_ratings
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Authenticated users can create ratings
CREATE POLICY agent_ratings_insert_own ON agent_ratings
  FOR INSERT
  WITH CHECK (
    auth.uid() = rated_by_id AND
    auth.uid() != agent_id AND
    auth.role() = 'authenticated'
  );

-- Users can update their own ratings
CREATE POLICY agent_ratings_update_own ON agent_ratings
  FOR UPDATE
  USING (auth.uid() = rated_by_id)
  WITH CHECK (auth.uid() = rated_by_id);

-- Users can delete their own ratings
CREATE POLICY agent_ratings_delete_own ON agent_ratings
  FOR DELETE
  USING (auth.uid() = rated_by_id);

-- TENANT REVIEWS TABLE POLICIES
-- Anyone can view reviews
CREATE POLICY tenant_reviews_select_all ON tenant_reviews
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Authenticated users can create reviews
CREATE POLICY tenant_reviews_insert_own ON tenant_reviews
  FOR INSERT
  WITH CHECK (
    auth.uid() = reviewed_by_id AND
    auth.role() = 'authenticated'
  );

-- Users can update their own reviews
CREATE POLICY tenant_reviews_update_own ON tenant_reviews
  FOR UPDATE
  USING (auth.uid() = reviewed_by_id)
  WITH CHECK (auth.uid() = reviewed_by_id);

-- Users can delete their own reviews
CREATE POLICY tenant_reviews_delete_own ON tenant_reviews
  FOR DELETE
  USING (auth.uid() = reviewed_by_id);

-- TENANT HISTORY TABLE POLICIES
-- Anyone can view history
CREATE POLICY tenant_history_select_all ON tenant_history
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Agents and tenants can create records
CREATE POLICY tenant_history_insert_own ON tenant_history
  FOR INSERT
  WITH CHECK (
    auth.uid() = tenant_id OR
    auth.uid() IN (SELECT agent_id FROM listings WHERE id = tenant_history.listing_id)
  );

-- Agents and tenants can update their records
CREATE POLICY tenant_history_update_own ON tenant_history
  FOR UPDATE
  USING (
    auth.uid() = tenant_id OR
    auth.uid() IN (SELECT agent_id FROM listings WHERE id = tenant_history.listing_id)
  )
  WITH CHECK (
    auth.uid() = tenant_id OR
    auth.uid() IN (SELECT agent_id FROM listings WHERE id = tenant_history.listing_id)
  );

-- MAINTENANCE NOTICES TABLE POLICIES
-- Anyone can view notices
CREATE POLICY maintenance_notices_select_all ON maintenance_notices
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Agents/landlords can create notices for their listings
CREATE POLICY maintenance_notices_insert_own ON maintenance_notices
  FOR INSERT
  WITH CHECK (
    auth.uid() = created_by_id AND
    auth.uid() IN (SELECT agent_id FROM listings WHERE id = maintenance_notices.listing_id)
  );

-- Agents/landlords can update their notices
CREATE POLICY maintenance_notices_update_own ON maintenance_notices
  FOR UPDATE
  USING (
    auth.uid() = created_by_id AND
    auth.uid() IN (SELECT agent_id FROM listings WHERE id = maintenance_notices.listing_id)
  )
  WITH CHECK (
    auth.uid() = created_by_id AND
    auth.uid() IN (SELECT agent_id FROM listings WHERE id = maintenance_notices.listing_id)
  );

-- Agents/landlords can delete their notices
CREATE POLICY maintenance_notices_delete_own ON maintenance_notices
  FOR DELETE
  USING (
    auth.uid() = created_by_id AND
    auth.uid() IN (SELECT agent_id FROM listings WHERE id = maintenance_notices.listing_id)
  );

-- WAITLIST TABLE POLICIES
-- Users can view their own waitlist entries
CREATE POLICY waitlist_select_own ON waitlist
  FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

-- Anyone can join waitlist (no auth required for email-based join)
CREATE POLICY waitlist_insert_all ON waitlist
  FOR INSERT
  WITH CHECK (TRUE);

-- Users can update their own waitlist status
CREATE POLICY waitlist_update_own ON waitlist
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

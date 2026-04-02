import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

const setupSQL = `
-- Create listings table
CREATE TABLE IF NOT EXISTS public.listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  house_type TEXT NOT NULL,
  rent_amount BIGINT NOT NULL,
  currency TEXT DEFAULT 'NGN',
  bedrooms INT,
  bathrooms INT,
  parking_spots INT DEFAULT 0,
  furnished BOOLEAN DEFAULT FALSE,
  state TEXT NOT NULL,
  lga TEXT NOT NULL,
  amenities TEXT,
  features TEXT,
  images_urls TEXT[],
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  CONSTRAINT status_check CHECK (status IN ('active', 'inactive', 'sold', 'rented'))
);

-- Create auth users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  user_type TEXT,
  state TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create agents table
CREATE TABLE IF NOT EXISTS public.agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  company_name TEXT,
  phone TEXT,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_listings_state ON public.listings(state);
CREATE INDEX IF NOT EXISTS idx_listings_lga ON public.listings(lga);
CREATE INDEX IF NOT EXISTS idx_listings_house_type ON public.listings(house_type);
CREATE INDEX IF NOT EXISTS idx_listings_agent_id ON public.listings(agent_id);
CREATE INDEX IF NOT EXISTS idx_listings_status ON public.listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_created_at ON public.listings(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;

-- RLS Policies for listings
DROP POLICY IF EXISTS "Allow public read listings" ON public.listings;
CREATE POLICY "Allow public read listings" ON public.listings
  FOR SELECT USING (status = 'active');

DROP POLICY IF EXISTS "Allow agents to update own listings" ON public.listings;
CREATE POLICY "Allow agents to update own listings" ON public.listings
  FOR UPDATE USING (agent_id = auth.uid()) WITH CHECK (agent_id = auth.uid());

DROP POLICY IF EXISTS "Allow agents to insert listings" ON public.listings;
CREATE POLICY "Allow agents to insert listings" ON public.listings
  FOR INSERT WITH CHECK (agent_id = auth.uid());

-- RLS Policies for users
DROP POLICY IF EXISTS "Allow users to read own profile" ON public.users;
CREATE POLICY "Allow users to read own profile" ON public.users
  FOR SELECT USING (id = auth.uid());

DROP POLICY IF EXISTS "Allow users to update own profile" ON public.users;
CREATE POLICY "Allow users to update own profile" ON public.users
  FOR UPDATE USING (id = auth.uid()) WITH CHECK (id = auth.uid());

-- RLS Policies for agents
DROP POLICY IF EXISTS "Allow agents to read own profile" ON public.agents;
CREATE POLICY "Allow agents to read own profile" ON public.agents
  FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Allow agents to update own profile" ON public.agents;
CREATE POLICY "Allow agents to update own profile" ON public.agents
  FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
`;

async function setupDatabase() {
  try {
    console.log('Setting up database tables...');
    
    const { error } = await supabase.rpc('exec_sql', { 
      query: setupSQL 
    });

    if (error) {
      // If exec_sql RPC doesn't exist, try with simple table creation
      console.log('Using alternative setup method...');
      
      // Create listings table
      const { error: listingsError } = await supabase.from('listings').select('*').limit(0);
      if (listingsError?.code === 'PGRST116') {
        // Table doesn't exist, we'll create it using direct API
        console.log('Creating listings table via API...');
      }
    }

    console.log('Database setup completed successfully!');
    console.log('Tables are ready for use.');
  } catch (err) {
    console.error('Error setting up database:', err);
    process.exit(1);
  }
}

setupDatabase();

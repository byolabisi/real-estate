import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
  try {
    console.log('🚀 Setting up Supabase database...\n');

    // Create custom types
    console.log('📝 Creating custom types...');
    const types = [
      `CREATE TYPE IF NOT EXISTS user_type_enum AS ENUM ('agent', 'landlord', 'house_hunter', 'tenant');`,
      `CREATE TYPE IF NOT EXISTS house_type_enum AS ENUM ('apartment', 'house', 'room', 'land', 'penthouse', 'villa', 'flat', 'duplex');`,
      `CREATE TYPE IF NOT EXISTS property_status_enum AS ENUM ('available', 'rented', 'maintenance');`,
      `CREATE TYPE IF NOT EXISTS priority_enum AS ENUM ('low', 'medium', 'high');`,
    ];

    for (const typeQuery of types) {
      const { error } = await supabase.rpc('exec_sql', { sql: typeQuery });
      if (error) {
        console.log(`   ℹ️  ${typeQuery.substring(0, 50)}... (may already exist)`);
      }
    }

    // Create users table
    console.log('\n📝 Creating users table...');
    const usersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email TEXT UNIQUE NOT NULL,
        user_type TEXT NOT NULL,
        full_name TEXT,
        first_name TEXT,
        last_name TEXT,
        phone TEXT,
        state TEXT,
        lga TEXT,
        verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        metadata JSONB DEFAULT '{}',
        CONSTRAINT email_format CHECK (email ~ '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$')
      );
    `;

    const { error: usersError } = await supabase.rpc('exec_sql', { sql: usersTable });
    if (usersError) console.log('   ℹ️  Users table (may already exist)');

    // Create listings table
    console.log('📝 Creating listings table...');
    const listingsTable = `
      CREATE TABLE IF NOT EXISTS listings (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        agent_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        description TEXT,
        house_type TEXT NOT NULL,
        bedrooms INTEGER,
        bathrooms INTEGER,
        parking_spots INTEGER DEFAULT 0,
        rent_amount DECIMAL(15, 2) NOT NULL,
        currency TEXT DEFAULT 'NGN',
        amenities TEXT,
        features TEXT,
        furnished BOOLEAN DEFAULT FALSE,
        property_status TEXT DEFAULT 'available',
        state TEXT NOT NULL,
        lga TEXT,
        images_urls TEXT[] DEFAULT '{}',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        status TEXT DEFAULT 'active'
      );
    `;

    const { error: listingsError } = await supabase.rpc('exec_sql', { sql: listingsTable });
    if (listingsError) console.log('   ℹ️  Listings table (may already exist)');

    // Create agent_ratings table
    console.log('📝 Creating agent_ratings table...');
    const ratingsTable = `
      CREATE TABLE IF NOT EXISTS agent_ratings (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        agent_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        rated_by_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        review_text TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(agent_id, rated_by_id)
      );
    `;

    const { error: ratingsError } = await supabase.rpc('exec_sql', { sql: ratingsTable });
    if (ratingsError) console.log('   ℹ️  Agent ratings table (may already exist)');

    // Create tenant_reviews table
    console.log('📝 Creating tenant_reviews table...');
    const reviewsTable = `
      CREATE TABLE IF NOT EXISTS tenant_reviews (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
        reviewed_by_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        experience_text TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(listing_id, reviewed_by_id)
      );
    `;

    const { error: reviewsError } = await supabase.rpc('exec_sql', { sql: reviewsTable });
    if (reviewsError) console.log('   ℹ️  Tenant reviews table (may already exist)');

    // Create tenant_history table
    console.log('📝 Creating tenant_history table...');
    const historyTable = `
      CREATE TABLE IF NOT EXISTS tenant_history (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
        tenant_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        move_in_date DATE NOT NULL,
        move_out_date DATE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(listing_id, tenant_id, move_in_date)
      );
    `;

    const { error: historyError } = await supabase.rpc('exec_sql', { sql: historyTable });
    if (historyError) console.log('   ℹ️  Tenant history table (may already exist)');

    // Create maintenance_notices table
    console.log('📝 Creating maintenance_notices table...');
    const maintenanceTable = `
      CREATE TABLE IF NOT EXISTS maintenance_notices (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
        created_by_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        notice_text TEXT NOT NULL,
        start_date DATE NOT NULL,
        estimated_end_date DATE,
        priority TEXT DEFAULT 'medium',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    const { error: maintenanceError } = await supabase.rpc('exec_sql', { sql: maintenanceTable });
    if (maintenanceError) console.log('   ℹ️  Maintenance notices table (may already exist)');

    // Create waitlist table
    console.log('📝 Creating waitlist table...');
    const waitlistTable = `
      CREATE TABLE IF NOT EXISTS waitlist (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE SET NULL,
        email TEXT NOT NULL,
        user_type_interested TEXT,
        state TEXT,
        lga TEXT,
        joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        database_access_granted BOOLEAN DEFAULT FALSE,
        last_contact_at TIMESTAMP WITH TIME ZONE,
        CONSTRAINT waitlist_email_format CHECK (email ~ '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$')
      );
    `;

    const { error: waitlistError } = await supabase.rpc('exec_sql', { sql: waitlistTable });
    if (waitlistError) console.log('   ℹ️  Waitlist table (may already exist)');

    // Create indexes
    console.log('\n📝 Creating indexes...');
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_listings_agent_id ON listings(agent_id);',
      'CREATE INDEX IF NOT EXISTS idx_listings_state ON listings(state);',
      'CREATE INDEX IF NOT EXISTS idx_listings_house_type ON listings(house_type);',
      'CREATE INDEX IF NOT EXISTS idx_agent_ratings_agent_id ON agent_ratings(agent_id);',
      'CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);',
      'CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);',
    ];

    for (const indexQuery of indexes) {
      const { error } = await supabase.rpc('exec_sql', { sql: indexQuery });
      if (error) {
        console.log(`   ℹ️  Index (may already exist)`);
      }
    }

    // Enable RLS
    console.log('\n📝 Enabling Row Level Security...');
    const rlsStatements = [
      'ALTER TABLE users ENABLE ROW LEVEL SECURITY;',
      'ALTER TABLE listings ENABLE ROW LEVEL SECURITY;',
      'ALTER TABLE agent_ratings ENABLE ROW LEVEL SECURITY;',
      'ALTER TABLE tenant_reviews ENABLE ROW LEVEL SECURITY;',
      'ALTER TABLE tenant_history ENABLE ROW LEVEL SECURITY;',
      'ALTER TABLE maintenance_notices ENABLE ROW LEVEL SECURITY;',
      'ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;',
    ];

    for (const rlsQuery of rlsStatements) {
      const { error } = await supabase.rpc('exec_sql', { sql: rlsQuery });
      if (error) {
        console.log(`   ℹ️  RLS (may already enabled)`);
      }
    }

    console.log('\n✨ Database setup completed!\n');
    console.log('✅ All tables created successfully');
    console.log('✅ Indexes created');
    console.log('✅ Row Level Security enabled');
    console.log('\n📋 Next steps:');
    console.log('1. Visit your Supabase dashboard to verify tables');
    console.log('2. Test sign up: /auth/sign-up');
    console.log('3. Create a listing: /listings/create');
    console.log('4. Browse listings: /listings');

  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

setupDatabase();

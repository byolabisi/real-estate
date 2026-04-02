-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_type_enum AS ENUM ('agent', 'landlord', 'house_hunter', 'tenant');
CREATE TYPE house_type_enum AS ENUM ('apartment', 'house', 'room', 'land', 'penthouse', 'villa', 'flat', 'duplex');
CREATE TYPE property_status_enum AS ENUM ('available', 'rented', 'maintenance');
CREATE TYPE priority_enum AS ENUM ('low', 'medium', 'high');

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  user_type user_type_enum NOT NULL,
  full_name TEXT,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  state TEXT,
  lga TEXT,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  metadata JSONB DEFAULT '{}'::jsonb,
  CONSTRAINT email_format CHECK (email ~ '^[^\s@]+@[^\s@]+\.[^\s@]+$')
);

-- Listings table
CREATE TABLE IF NOT EXISTS listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  house_type house_type_enum NOT NULL,
  bedrooms INTEGER,
  bathrooms INTEGER,
  parking_spots INTEGER DEFAULT 0,
  rent_amount DECIMAL(15, 2) NOT NULL,
  currency TEXT DEFAULT 'NGN',
  amenities TEXT,
  features TEXT,
  furnished BOOLEAN DEFAULT FALSE,
  property_status property_status_enum DEFAULT 'available',
  state TEXT NOT NULL,
  lga TEXT,
  images_urls TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  status TEXT DEFAULT 'active'
);

-- Agent ratings table
CREATE TABLE IF NOT EXISTS agent_ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rated_by_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(agent_id, rated_by_id)
);

-- Tenant reviews table
CREATE TABLE IF NOT EXISTS tenant_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  reviewed_by_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  experience_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(listing_id, reviewed_by_id)
);

-- Tenant history table
CREATE TABLE IF NOT EXISTS tenant_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  move_in_date DATE NOT NULL,
  move_out_date DATE,
  days_remaining INTEGER GENERATED ALWAYS AS (
    CASE WHEN move_out_date IS NOT NULL
    THEN EXTRACT(DAY FROM move_out_date - CURRENT_DATE)::INTEGER
    ELSE NULL
    END
  ) STORED,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(listing_id, tenant_id, move_in_date)
);

-- Maintenance notices table
CREATE TABLE IF NOT EXISTS maintenance_notices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  created_by_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  notice_text TEXT NOT NULL,
  start_date DATE NOT NULL,
  estimated_end_date DATE,
  priority priority_enum DEFAULT 'medium',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Waitlist table
CREATE TABLE IF NOT EXISTS waitlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  user_type_interested user_type_enum,
  state TEXT,
  lga TEXT,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  database_access_granted BOOLEAN DEFAULT FALSE,
  last_contact_at TIMESTAMP WITH TIME ZONE,
  CONSTRAINT waitlist_email_format CHECK (email ~ '^[^\s@]+@[^\s@]+\.[^\s@]+$')
);

-- Create indexes
CREATE INDEX idx_listings_agent_id ON listings(agent_id);
CREATE INDEX idx_listings_state ON listings(state);
CREATE INDEX idx_listings_house_type ON listings(house_type);
CREATE INDEX idx_listings_status ON listings(property_status);
CREATE INDEX idx_agent_ratings_agent_id ON agent_ratings(agent_id);
CREATE INDEX idx_agent_ratings_rated_by ON agent_ratings(rated_by_id);
CREATE INDEX idx_tenant_reviews_listing_id ON tenant_reviews(listing_id);
CREATE INDEX idx_tenant_reviews_reviewed_by ON tenant_reviews(reviewed_by_id);
CREATE INDEX idx_tenant_history_listing_id ON tenant_history(listing_id);
CREATE INDEX idx_tenant_history_tenant_id ON tenant_history(tenant_id);
CREATE INDEX idx_maintenance_notices_listing_id ON maintenance_notices(listing_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_waitlist_email ON waitlist(email);

-- Create a function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_listings_updated_at
BEFORE UPDATE ON listings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create users table
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  user_type text not null check (user_type in ('agent', 'landlord', 'house_hunter', 'tenant')),
  first_name text,
  last_name text,
  email text,
  phone text,
  state text,
  lga text,
  profile_image_url text,
  bio text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create listings table
create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  description text,
  house_type text not null check (house_type in ('apartment', 'house', 'duplex', 'room', 'flat', 'bungalow', 'villa', 'penthouse')),
  rent_amount numeric(15,2) not null,
  currency text default 'NGN',
  bedrooms integer,
  bathrooms integer,
  parking_spots integer,
  furnished boolean default false,
  state text not null,
  lga text,
  amenities text,
  features text,
  images_urls text,
  status text default 'active' check (status in ('active', 'rented', 'maintenance', 'archived')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create agent ratings table
create table if not exists public.agent_ratings (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references public.users(id) on delete cascade,
  reviewer_id uuid not null references public.users(id) on delete cascade,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamp with time zone default now()
);

-- Create tenant reviews table
create table if not exists public.tenant_reviews (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  reviewer_id uuid not null references public.users(id) on delete cascade,
  condition_rating integer check (condition_rating >= 1 and condition_rating <= 5),
  landlord_rating integer check (landlord_rating >= 1 and landlord_rating <= 5),
  neighborhood_rating integer check (neighborhood_rating >= 1 and neighborhood_rating <= 5),
  comment text,
  created_at timestamp with time zone default now()
);

-- Create tenant history table
create table if not exists public.tenant_history (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  tenant_id uuid not null references public.users(id) on delete cascade,
  move_in_date date,
  move_out_date date,
  duration_months integer,
  created_at timestamp with time zone default now()
);

-- Create maintenance notices table
create table if not exists public.maintenance_notices (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  notice_type text not null,
  description text,
  start_date date,
  end_date date,
  status text default 'ongoing' check (status in ('ongoing', 'completed')),
  created_at timestamp with time zone default now()
);

-- Create waitlist table
create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  user_id uuid references public.users(id) on delete set null,
  user_type text not null check (user_type in ('agent', 'landlord', 'house_hunter', 'tenant')),
  state text,
  lga text,
  joined_at timestamp with time zone default now(),
  welcome_email_sent boolean default false,
  status text default 'active' check (status in ('active', 'inactive'))
);

-- Create email logs table
create table if not exists public.email_logs (
  id uuid primary key default gen_random_uuid(),
  recipient_email text not null,
  email_type text not null,
  subject text,
  user_id uuid references public.users(id) on delete set null,
  related_listing_id uuid references public.listings(id) on delete set null,
  sent_at timestamp with time zone default now(),
  status text default 'sent'
);

-- Create indexes for performance
create index if not exists idx_listings_agent_id on public.listings(agent_id);
create index if not exists idx_listings_state on public.listings(state);
create index if not exists idx_listings_status on public.listings(status);
create index if not exists idx_agent_ratings_agent_id on public.agent_ratings(agent_id);
create index if not exists idx_tenant_reviews_listing_id on public.tenant_reviews(listing_id);
create index if not exists idx_tenant_history_listing_id on public.tenant_history(listing_id);
create index if not exists idx_maintenance_notices_listing_id on public.maintenance_notices(listing_id);
create index if not exists idx_email_logs_recipient on public.email_logs(recipient_email);

-- Enable RLS on all tables
alter table public.users enable row level security;
alter table public.listings enable row level security;
alter table public.agent_ratings enable row level security;
alter table public.tenant_reviews enable row level security;
alter table public.tenant_history enable row level security;
alter table public.maintenance_notices enable row level security;
alter table public.waitlist enable row level security;
alter table public.email_logs enable row level security;

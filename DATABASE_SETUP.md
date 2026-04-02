# Database Setup Instructions

The real estate platform is designed to work with Supabase. While the app includes mock data as a fallback, follow these steps to set up the actual database.

## Quick Setup

### Option 1: Manual SQL (Recommended)

1. Go to your Supabase dashboard
2. Navigate to the SQL Editor
3. Create a new query and paste the contents of `scripts/setup-database.sql`
4. Execute the query

### Option 2: Using the Setup Script

From your project directory, run:

```bash
node scripts/setup-db.js
```

Make sure your environment variables are properly configured:
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## What Gets Created

The setup script creates the following tables:

### `listings` Table
- Core property listings table
- Fields: id, agent_id, title, description, house_type, rent_amount, currency, bedrooms, bathrooms, parking_spots, furnished, state, lga, amenities, features, images_urls, status, created_at, updated_at
- Indexes for efficient filtering by state, LGA, house type, and agent

### `users` Table
- User profiles for agents and buyers
- Fields: id, email, full_name, user_type, state, created_at, updated_at

### `agents` Table
- Agent-specific information
- Fields: id, user_id, company_name, phone, verified, created_at, updated_at

## Row Level Security (RLS)

All tables have RLS enabled with the following policies:

### Listings
- **Public Read**: Anyone can view active listings
- **Agent Write**: Agents can only update/insert their own listings
- **Agent Insert**: Agents can create new listings

### Users
- **Self Read**: Users can view their own profile
- **Self Update**: Users can update their own profile

### Agents
- **Self Read**: Agents can view their own profile
- **Self Update**: Agents can update their own profile

## Testing the Setup

After setting up the database, the app will:
1. Try to fetch listings from the database
2. Automatically fall back to mock data if the tables don't exist
3. No console errors - the fallback is intentional

To verify your database is working:
1. Go to Supabase dashboard
2. Check the `listings` table in the SQL Editor
3. You should see the tables listed under `public` schema

## Adding Sample Data

After creating the tables, you can add properties manually via:
1. Supabase Dashboard → listings table → Insert rows
2. Or through the app's property creation interface (once authenticated)

## Troubleshooting

**"Could not find the table" error**: This is normal and expected when tables don't exist. The app will use mock data automatically.

**Database connection issues**: Verify your Supabase credentials are correct in `.env.development.local`

**RLS policy errors**: Ensure you're using the Supabase auth service properly. Check that `SUPABASE_SERVICE_ROLE_KEY` is set for admin operations.

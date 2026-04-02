# Supabase Database Setup Guide

## Overview
This guide walks you through setting up the Nigerian Real Estate Platform database in Supabase with all necessary tables, indexes, and Row Level Security (RLS) policies.

## Prerequisites
- Supabase project already created and connected to this v0 project
- Admin/Owner access to your Supabase project
- All environment variables configured (should be automatic if using Vercel integration)

## Setup Method 1: Using Supabase SQL Editor (Recommended)

### Step 1: Access Supabase Console
1. Go to https://app.supabase.com
2. Select your project
3. Go to **SQL Editor** in the left sidebar

### Step 2: Copy and Paste SQL
In this repository, you'll find migration scripts:

#### 2A: Create Tables
1. Open `/scripts/01_create_tables.sql`
2. Copy the entire content
3. In Supabase SQL Editor, create a new query
4. Paste the entire content
5. Click **Run** or press `Cmd/Ctrl + Enter`
6. You should see success messages for each table

#### 2B: Configure RLS Policies
1. Open `/scripts/02_rls_policies.sql`
2. Repeat the same process (copy → paste → run)
3. This sets up all security policies

### Step 3: Verify Tables
1. Go to **Table Editor** in Supabase
2. You should see these tables:
   - `users`
   - `listings`
   - `agent_ratings`
   - `tenant_reviews`
   - `tenant_history`
   - `maintenance_notices`
   - `waitlist`

## Setup Method 2: Using Node Script (Automated)

### Step 1: Prepare Environment
```bash
# Make sure your Supabase credentials are in .env
# They should be automatically set if using Vercel integration
```

### Step 2: Run Setup Script
```bash
# Option A: Using npm (if package.json has the script)
npm run setup:db

# Option B: Manual execution
npx ts-node scripts/setup-database.ts

# Option C: Direct SQL execution
# You can also manually execute the SQL files in your Supabase SQL Editor
```

### Step 3: Verify Output
You should see:
```
🚀 Setting up Supabase database...
📝 Creating custom types...
📝 Creating users table...
...
✨ Database setup completed!
✅ All tables created successfully
```

## Database Schema

### Users Table
Stores user profiles with authentication info.
```sql
Fields:
- id (UUID, Primary Key)
- email (unique, required)
- user_type (agent, landlord, house_hunter, tenant)
- first_name, last_name
- phone (optional)
- state, lga (location)
- verified (boolean)
- created_at, updated_at
```

### Listings Table
Real estate properties available for rent/sale.
```sql
Fields:
- id (UUID, Primary Key)
- agent_id (FK to users)
- title, description
- house_type (apartment, house, room, land, etc.)
- bedrooms, bathrooms, parking_spots
- rent_amount, currency
- amenities, features (JSON/text)
- furnished (boolean)
- property_status (available, rented, maintenance)
- state, lga
- images_urls (array)
- created_at, updated_at
```

### Agent Ratings Table
Ratings and reviews for real estate agents.
```sql
Fields:
- id (UUID, Primary Key)
- agent_id (FK to users)
- rated_by_id (FK to users - who gave the rating)
- rating (1-5 stars)
- review_text (optional)
- created_at
```

### Tenant Reviews Table
Reviews about properties from tenants.
```sql
Fields:
- id (UUID, Primary Key)
- listing_id (FK to listings)
- reviewed_by_id (FK to users)
- rating (1-5 stars)
- experience_text
- created_at
```

### Tenant History Table
Track who lived in properties and when.
```sql
Fields:
- id (UUID, Primary Key)
- listing_id (FK to listings)
- tenant_id (FK to users)
- move_in_date, move_out_date
- created_at
```

### Maintenance Notices Table
Alerts about property maintenance.
```sql
Fields:
- id (UUID, Primary Key)
- listing_id (FK to listings)
- created_by_id (FK to users - agent/landlord)
- notice_text
- start_date, estimated_end_date
- priority (low, medium, high)
- created_at
```

### Waitlist Table
Users waiting for platform access.
```sql
Fields:
- id (UUID, Primary Key)
- user_id (FK to users, nullable)
- email
- user_type_interested
- state, lga
- joined_at
- database_access_granted (boolean)
- last_contact_at (nullable)
```

## Row Level Security (RLS)

All tables have RLS enabled with these policies:

### Users
- ✅ Users can view their own profile
- ✅ Anyone can view public agent profiles
- ✅ Users can only edit their own profile

### Listings
- ✅ Authenticated users can view all listings
- ✅ Only agents/landlords can create listings
- ✅ Can only edit/delete own listings

### Agent Ratings
- ✅ Anyone can view ratings
- ✅ Authenticated users can create ratings
- ✅ Users can only edit/delete their own ratings

### Tenant Reviews
- ✅ Anyone can view reviews
- ✅ Authenticated users can review
- ✅ Can only edit/delete own reviews

### Tenant History
- ✅ Anyone can view history
- ✅ Agents and tenants can manage records
- ✅ Normal privacy boundaries apply

### Maintenance Notices
- ✅ Anyone can view notices
- ✅ Only agents/landlords can create for their properties
- ✅ Can only edit/delete own notices

### Waitlist
- ✅ Users can view their own entries
- ✅ Anyone can join the waitlist
- ✅ Can only edit own entry

## Testing the Setup

### 1. Test User Creation
```bash
# Try signing up at /auth/sign-up
# You should be able to:
- Enter email, password, name
- Select user type (agent, landlord, house_hunter, tenant)
- Select state
- Account should be created in users table
```

### 2. Test Listings Creation
```bash
# After signing in as an agent/landlord:
# Go to /listings/create
# You should be able to:
- Create a new listing
- List should appear in /listings
- Only you can edit/delete it
```

### 3. Test Ratings
```bash
# After signing in as different user:
# Go to agent profile
# You should be able to:
- Rate the agent (1-5 stars)
- Add review text
- Rating appears immediately
```

### 4. Verify RLS
```sql
-- In Supabase SQL Editor, test RLS:

-- This should work (user viewing their own data):
SELECT * FROM users WHERE id = auth.uid();

-- This should fail unless user is agent (RLS check):
-- Try to view someone else's private data
SELECT email, phone FROM users WHERE id != auth.uid() AND user_type != 'agent';
```

## Troubleshooting

### Issue: "Could not find the table" error
**Solution:** 
- The SQL wasn't executed successfully
- Check Supabase SQL Editor for error messages
- Re-run the migration scripts one more time
- Clear browser cache and refresh

### Issue: RLS prevents operations
**Solution:**
- Make sure you're authenticated (signed in)
- Verify the RLS policy allows your operation
- For agents, ensure `user_type = 'agent'` in your profile

### Issue: Foreign key constraint errors
**Solution:**
- Ensure parent records exist first
- E.g., create a user before creating listings for that user
- Check that IDs match correctly

### Issue: Email validation fails
**Solution:**
- Ensure email format is correct
- Check constraints in table definition
- Email regex: `^[^\s@]+@[^\s@]+\.[^\s@]+$`

## Next Steps

1. ✅ Complete database setup (this guide)
2. ✅ Verify all tables created
3. Go to `/auth/sign-up` and create a test account
4. Create a test listing
5. Browse listings and test filters
6. Test the rating system
7. Deploy to production with full database backup

## Environment Variables

These should already be set by Vercel Supabase integration:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx
SUPABASE_SERVICE_ROLE_KEY=xxxxx
POSTGRES_URL=postgresql://user:password@host/db
```

## Support

If you encounter issues:
1. Check Supabase logs: Project Settings → Logs
2. Review SQL errors in the SQL Editor
3. Verify environment variables are correctly set
4. Check browser console for client-side errors
5. Review network tab for API failures

## Security Notes

- All tables have RLS enabled ✅
- Sensitive data (emails, phones) protected ✅
- Users can only access own data ✅
- Agents' data is public for transparency ✅
- Service role key only used server-side ✅
- Anon key used for client-side operations ✅

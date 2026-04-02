# Database Setup Guide

## Quick Start

The application is configured to use **mock data** by default while the database tables are being set up. This allows you to test the full functionality immediately.

## Setting Up Real Database Tables

To create the actual Supabase tables, you have two options:

### Option 1: Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy and paste the entire contents of `scripts/001_init_schema.sql`
5. Click "Run"
6. Then copy and paste the contents of `scripts/002_rls_policies.sql`
7. Click "Run"

### Option 2: Using Supabase CLI

If you have the Supabase CLI installed:

```bash
supabase db push
```

## Migration Scripts

- **scripts/001_init_schema.sql** - Creates all database tables with proper structure and indexes
- **scripts/002_rls_policies.sql** - Adds Row Level Security (RLS) policies for data protection

## Current Features

While using mock data:
- ✅ Browse property listings (3 demo properties)
- ✅ View listing details
- ✅ Search by state and property type
- ✅ User authentication (signup/login)
- ✅ Create new listings (saves to database once tables exist)
- ✅ Agent profiles and ratings
- ✅ Tenant reviews

## Switching to Real Database

Once you've executed the SQL scripts:

1. The mock data fallback is automatic - the system will use real data once tables are created
2. No code changes needed
3. New listings will be saved to the database
4. All CRUD operations will work with real data

## Database Schema

The application uses the following tables:
- `users` - User profiles and agent information
- `listings` - Property listings
- `agent_ratings` - Ratings for real estate agents
- `tenant_reviews` - Reviews about specific properties
- `tenant_history` - Track tenant occupancy history
- `maintenance_notices` - Property maintenance alerts
- `waitlist` - Newsletter/early access signups
- `email_logs` - Email activity logging

All tables have Row Level Security (RLS) enabled for data protection.

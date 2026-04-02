# Supabase Database Setup - Complete Package

## What I've Created For You

I've fully prepared your Nigerian Real Estate Platform for database integration. Everything is ready to set up in Supabase.

## Files Created

### 1. Migration Scripts (in `/scripts/`)
- **`01_create_tables.sql`** - Creates all 7 database tables with proper structure
- **`02_rls_policies.sql`** - Sets up Row Level Security for data privacy
- **`setup-database.ts`** - Node.js script to automate setup (optional)
- **`run-migrations.js`** - JavaScript migration runner (optional)

### 2. Documentation (in root directory)
- **`DB_QUICK_START.md`** ⭐ **START HERE** - 5-minute setup guide
- **`SUPABASE_SETUP.md`** - Comprehensive setup guide with troubleshooting
- **`DATABASE_SETUP_COMPLETE.md`** - This file

## Database Architecture Created

### 7 Core Tables

```
users
├── id (UUID)
├── email (unique)
├── user_type (agent, landlord, house_hunter, tenant)
├── first_name, last_name
├── phone, state, lga
├── verified, created_at, updated_at
└── metadata (JSON)

listings
├── id (UUID)
├── agent_id (who listed it)
├── title, description
├── house_type (apartment, house, room, etc)
├── bedrooms, bathrooms, parking_spots
├── rent_amount, currency (NGN)
├── amenities, features
├── furnished, property_status
├── state, lga, images_urls
└── created_at, updated_at

agent_ratings
├── id (UUID)
├── agent_id
├── rated_by_id (who rated them)
├── rating (1-5 stars)
├── review_text
└── created_at

tenant_reviews
├── id (UUID)
├── listing_id
├── reviewed_by_id
├── rating (1-5 stars)
├── experience_text
└── created_at

tenant_history
├── id (UUID)
├── listing_id
├── tenant_id
├── move_in_date, move_out_date
└── created_at

maintenance_notices
├── id (UUID)
├── listing_id
├── created_by_id
├── notice_text
├── start_date, estimated_end_date
├── priority (low, medium, high)
└── created_at

waitlist
├── id (UUID)
├── user_id (optional)
├── email
├── user_type_interested
├── state, lga
├── joined_at
├── database_access_granted
└── last_contact_at
```

## Setup Instructions (Choose One Method)

### Method 1: Copy-Paste (Recommended - Takes 5 Minutes)

**Step 1:** Go to Supabase Dashboard
- https://app.supabase.com
- Select your project

**Step 2:** Open SQL Editor
- Click "SQL Editor" in sidebar
- Click "New Query"

**Step 3:** Copy & Run First Script
- Open `/scripts/01_create_tables.sql` in this repo
- Copy entire content
- Paste into Supabase SQL Editor
- Click "Run"
- Wait for success

**Step 4:** Copy & Run Second Script
- Open `/scripts/02_rls_policies.sql` in this repo
- Copy entire content
- Paste into Supabase SQL Editor (new query)
- Click "Run"
- Wait for success

**Step 5:** Verify
- Go to "Table Editor" in Supabase
- You should see all 7 tables listed

### Method 2: Command Line (Automated)

```bash
# Option A: TypeScript version
npm run setup:db:ts

# Option B: JavaScript version
npm run setup:db

# Option C: Manual TypeScript execution
npx ts-node scripts/setup-database.ts
```

### Method 3: Supabase CLI (If installed)

```bash
# Initialize Supabase CLI
supabase init

# Run migrations
supabase migration up

# Or link to your project and migrate
supabase link
supabase migration push
```

## Features Included

### ✅ Complete Schema
- All 7 tables with proper relationships
- UUID primary keys
- Timestamps (created_at, updated_at)
- Proper constraints and validation

### ✅ Row Level Security (RLS)
- Users can only see their own data
- Agents' public profiles are visible
- Listings visible to authenticated users
- Ratings and reviews are public
- Users can only edit their own content
- Waitlist is public (no auth required)

### ✅ Indexes for Performance
- Index on agent_id for fast agent lookups
- Index on state for location-based searches
- Index on house_type for filtering
- Email indexes for unique constraints
- Tenant ID/listing ID indexes

### ✅ Data Integrity
- Foreign key relationships
- Unique constraints (email, user ratings)
- NOT NULL constraints on required fields
- Check constraints (rating 1-5, email format)
- Automatic timestamp updates

### ✅ Privacy Protection
- No full addresses stored (state/LGA only)
- Personal data (phone, email) protected
- User authentication via Supabase Auth
- Transparent rating system (rater identifiable)

## What's Already Connected

Your Supabase integration is already configured in Vercel:
- ✅ NEXT_PUBLIC_SUPABASE_URL
- ✅ NEXT_PUBLIC_SUPABASE_ANON_KEY
- ✅ SUPABASE_SERVICE_ROLE_KEY
- ✅ All PostgreSQL connection variables

Just run the migration scripts and you're ready!

## Testing the Setup

After setup, test these features:

### Test 1: User Registration
```
1. Go to /auth/sign-up
2. Create account with test email
3. Select user type (agent/landlord/house_hunter/tenant)
4. Verify in Supabase: users table should have new row
```

### Test 2: Create Listing (if agent/landlord)
```
1. Go to /listings/create
2. Fill in property details
3. Submit
4. Verify in Supabase: listings table has new row
5. Check that agent_id matches your user ID
```

### Test 3: Browse Listings
```
1. Go to /listings
2. Should see created listing
3. Test filters by state, type, price
4. Click on listing details
```

### Test 4: Rate an Agent
```
1. Go to agent profile
2. Leave 1-5 star rating
3. Verify in agent_ratings table
4. Rating should be visible to other users
```

### Test 5: RLS Security
```
1. Try to view another user's phone number
2. Should fail (RLS blocks access)
3. Your own data should be visible
4. This proves security is working
```

## Troubleshooting

### Issue: "Could not find table" Error
**Solution:**
1. Verify tables were created in Supabase Table Editor
2. Check for error messages in SQL Editor
3. Re-run the migration scripts
4. Clear browser cache (Ctrl+Shift+Delete)
5. Refresh page

### Issue: RLS Blocks My Operations
**Solution:**
1. Make sure you're signed in
2. Check that your user_id matches the data
3. Verify RLS policy allows the operation
4. For agents, ensure user_type = 'agent'

### Issue: Foreign Key Constraint Error
**Solution:**
1. Create parent records first
2. E.g., create a user before creating listings
3. Ensure IDs are correct and exist
4. Check data types match (all UUIDs)

### Issue: Can't See Tables in Table Editor
**Solution:**
1. Refresh the browser (F5)
2. Log out and back into Supabase
3. Check you're in the right project
4. Look in Database → Public → Tables

## Next Steps

1. ✅ **Now:** Follow "Setup Instructions" above
2. ✅ **Verify:** Check tables exist in Supabase
3. ✅ **Test:** Try signup and listing creation
4. ✅ **Customize:** Modify schema if needed
5. ✅ **Deploy:** Push changes to production
6. ✅ **Monitor:** Check Supabase logs for issues

## Key Features Ready to Use

### Authentication
- Email signup with verification
- Password authentication
- Session management
- Role-based access (user_type)

### Listings Management
- Create, read, update, delete properties
- Filter by state, type, rent, amenities
- Multi-image support
- Maintenance notifications

### Agent Features
- Manage own listings
- View ratings received
- Track property status
- Tenant history tracking

### User Features
- Browse all listings
- Rate agents 1-5 stars
- Review properties
- Join waitlist
- View rental history

### Security
- Row Level Security enabled
- Authentication required for sensitive operations
- Public read access for listings/profiles
- Privacy of personal data

## Environment Variables (Already Set)

```
NEXT_PUBLIC_SUPABASE_URL=<your-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-key>
SUPABASE_SERVICE_ROLE_KEY=<your-key>
POSTGRES_URL=<connection-string>
```

All automatically configured via Vercel Supabase integration.

## Support Resources

- **Supabase Docs:** https://supabase.com/docs
- **Supabase Dashboard:** https://app.supabase.com
- **PostgreSQL Docs:** https://www.postgresql.org/docs/
- **SQL Tutorial:** https://www.w3schools.com/sql/

## Summary

You have:
1. ✅ Complete database schema (7 tables)
2. ✅ Row Level Security configured
3. ✅ Proper indexes for performance
4. ✅ Migration scripts ready to run
5. ✅ Comprehensive documentation
6. ✅ All Supabase credentials set up

**Next Action:** Open `DB_QUICK_START.md` and follow the 5-minute setup guide.

Your Nigerian Real Estate Platform is ready to launch! 🚀

# Quick Database Setup - 5 Minutes

## The Fastest Way to Get Started

### Option 1: Copy-Paste in Supabase Console (Easiest)

1. **Go to Supabase Dashboard**
   - https://app.supabase.com
   - Select your project

2. **Open SQL Editor**
   - Click "SQL Editor" in left sidebar
   - Click "New Query"

3. **Copy Everything from `/scripts/01_create_tables.sql`**
   - Open the file in this repo
   - Select ALL (Ctrl+A or Cmd+A)
   - Copy

4. **Paste into Supabase**
   - Click in the SQL editor
   - Paste (Ctrl+V or Cmd+V)
   - Click "Run" or press Ctrl+Enter
   - Wait for "Success" message

5. **Repeat with `/scripts/02_rls_policies.sql`**
   - Create another new query
   - Paste the RLS policies
   - Run

6. **Done!** ✅
   - Your database is now fully set up
   - Tables: users, listings, agent_ratings, tenant_reviews, etc.
   - Security: Row Level Security enabled

### Option 2: Using Command Line (If you prefer)

```bash
# Make sure you're in the project root directory
cd /path/to/project

# Run the setup script
npm run setup:db:ts

# Or if that doesn't work:
npx ts-node scripts/setup-database.ts
```

## Verify It Worked

Go to Supabase → Table Editor and look for these tables:
- ✅ users
- ✅ listings  
- ✅ agent_ratings
- ✅ tenant_reviews
- ✅ tenant_history
- ✅ maintenance_notices
- ✅ waitlist

All tables should appear with no errors.

## What Got Created

### Tables (7 total)
1. **users** - User profiles and auth
2. **listings** - Properties for rent
3. **agent_ratings** - Reviews of agents (1-5 stars)
4. **tenant_reviews** - Reviews of properties (1-5 stars)
5. **tenant_history** - Who lived where and when
6. **maintenance_notices** - Alerts about property maintenance
7. **waitlist** - Email signup list

### Security (RLS - Row Level Security)
- Users can only see their own data
- Agents' profiles are public
- Listings are visible to authenticated users
- Ratings and reviews are public
- Each user can only edit their own content

### Indexes (For Speed)
- Listings by agent_id
- Listings by state
- Listings by house_type
- And more for common searches

## Ready to Test!

Now you can:

1. **Sign Up**: Go to `/auth/sign-up`
   - Create an account with any email
   - Choose user type (agent, landlord, house_hunter, tenant)

2. **Create a Listing** (if you chose agent/landlord)
   - Go to `/listings/create`
   - Fill in property details
   - Click Submit

3. **Browse Listings**: Go to `/listings`
   - See all available properties
   - Filter by state, type, price

4. **Rate an Agent**: View agent profile
   - Leave 1-5 star rating
   - Add comments

5. **Review a Property**: After visiting
   - Leave 1-5 star review
   - Share your experience

## Troubleshooting

**Error: "Could not find table"**
- The SQL didn't run successfully
- Check if you're in the right project
- Look for error messages in Supabase SQL Editor
- Try running the SQL again

**Error: "Permission denied"**
- You need to be signed in
- Some tables require authenticated access
- This is intentional for security

**Can't see tables in Table Editor?**
- Refresh the page (F5)
- Try logging out and back in
- Check Supabase → Database → Public schema

## Database Structure Quick Reference

```
Users
├── First Name, Last Name
├── Email
├── User Type (agent/landlord/house_hunter/tenant)
├── Phone
└── Location (State, LGA)

Listings
├── Property Details (type, beds, baths, etc)
├── Rent Amount (in NGN)
├── Location (State, LGA)
├── Amenities & Features
├── Images
└── Agent ID (who listed it)

Ratings & Reviews
├── Agent Ratings (1-5 stars + text)
└── Tenant Reviews (1-5 stars + text)

Tenant History
├── Property History
├── Move-in Date
├── Move-out Date
└── Days Remaining

Maintenance
├── Notice Text
├── Start & End Dates
└── Priority Level

Waitlist
├── Email Address
├── User Type Interested
└── Access Grant Status
```

## Next: Enable Email Notifications (Optional)

For welcome emails and notifications, set up Resend:
1. Get API key from https://resend.com
2. Add to environment variables: `RESEND_API_KEY=...`
3. Emails will send automatically on signup

## Support

Having issues? Check:
1. Are all 7 tables visible in Supabase Table Editor?
2. Are you signed in when testing the app?
3. Check browser console for JavaScript errors
4. Check Supabase Logs for database errors

## You're All Set! 🚀

Your Nigerian Real Estate Platform is ready to use. Start exploring and building!

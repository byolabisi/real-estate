# Supabase Setup Checklist - Follow This!

## 🎯 Your Mission (If You Choose to Accept It)

Get the database running in 5 minutes.

---

## ⚡ Quick Setup (Copy-Paste Method)

### Step 1: ☐ Open Supabase Dashboard
- Go to: https://app.supabase.com
- Select your project "real-estate"
- ✅ You should see your project name at top

### Step 2: ☐ Open SQL Editor
- Click **SQL Editor** in left sidebar
- Click **New Query** button
- ✅ You should see an empty SQL editor

### Step 3: ☐ Copy First Migration
- In your code editor, open: **`scripts/01_create_tables.sql`**
- Select all (Ctrl+A / Cmd+A)
- Copy (Ctrl+C / Cmd+C)
- ✅ You have the file content copied

### Step 4: ☐ Paste & Run Tables
- Click in the Supabase SQL editor
- Paste (Ctrl+V / Cmd+V)
- Click **Run** button (or Ctrl+Enter / Cmd+Enter)
- Wait for green checkmark ✅
- ✅ Tables created successfully

### Step 5: ☐ Copy Second Migration
- In your code editor, open: **`scripts/02_rls_policies.sql`**
- Select all (Ctrl+A / Cmd+A)
- Copy (Ctrl+C / Cmd+C)
- ✅ You have the RLS policies copied

### Step 6: ☐ Paste & Run RLS
- In Supabase, click **New Query** again
- Paste (Ctrl+V / Cmd+V)
- Click **Run** button
- Wait for green checkmark ✅
- ✅ RLS policies enabled

### Step 7: ☐ Verify Tables Exist
- Click **Table Editor** in left sidebar
- You should see these tables listed:
  - ☐ users
  - ☐ listings
  - ☐ agent_ratings
  - ☐ tenant_reviews
  - ☐ tenant_history
  - ☐ maintenance_notices
  - ☐ waitlist
- ✅ All 7 tables visible

---

## 🧪 Test It Works

### Test 1: ☐ Sign Up
- Open your app: `http://localhost:3000` (or your domain)
- Click **Sign Up** / go to `/auth/sign-up`
- Fill in:
  - Email: `test@example.com`
  - Password: `TestPassword123!`
  - First Name: `Test`
  - Last Name: `User`
  - User Type: `agent`
  - State: `Lagos`
- Click **Create Account**
- ✅ Account created & you see success page

### Test 2: ☐ Sign In
- Go to `/auth/login`
- Enter same email and password
- Click **Sign In**
- ✅ You're logged in & see dashboard

### Test 3: ☐ Create Listing (if agent)
- Go to `/listings/create`
- Fill in property details:
  - Title: `Beautiful Apartment`
  - Bedrooms: `2`
  - Bathrooms: `1`
  - Rent: `500000`
  - State: `Lagos`
  - Type: `apartment`
- Click **Submit**
- ✅ Listing created

### Test 4: ☐ Browse Listings
- Go to `/listings`
- ✅ You see your listing displayed
- Test filter by state
- ✅ Filters work correctly

### Test 5: ☐ Rate Agent
- Go to agent profile
- Click **Rate Agent**
- Give 5 stars & write comment
- Click **Submit**
- ✅ Rating appears immediately

---

## 🔒 Verify Security

### Check RLS is Working
- Open your listing in browser dev tools
- Network tab → Find API calls
- ✅ Data loads successfully for you
- ☐ Log out
- ✅ You're redirected to login

---

## 📊 Verify Data in Supabase

### Check Users Table
- Supabase → Table Editor → **users**
- You should see:
  - ☐ Your test account
  - ☐ email = test@example.com
  - ☐ user_type = agent
  - ☐ created_at populated
- ✅ Data looks correct

### Check Listings Table
- Supabase → Table Editor → **listings**
- You should see:
  - ☐ Your test listing
  - ☐ agent_id matches your user id
  - ☐ bedrooms = 2
  - ☐ rent_amount = 500000
- ✅ Data looks correct

### Check Ratings Table
- Supabase → Table Editor → **agent_ratings**
- You should see:
  - ☐ Your rating entry
  - ☐ rating = 5
  - ☐ agent_id matches agent
- ✅ Data looks correct

---

## 🚀 Ready for Production?

Before deploying, check:

- ☐ All 7 tables created
- ☐ RLS policies enabled
- ☐ Can sign up & log in
- ☐ Can create listings
- ☐ Can rate agents
- ☐ Filters work
- ☐ Data appears in Supabase
- ☐ No console errors
- ☐ No SQL errors in Supabase logs

---

## 📚 Learn More

If you want to understand deeper:
- **DB Schema:** Read `DATABASE_SETUP_COMPLETE.md`
- **Full Setup Guide:** Read `SUPABASE_SETUP.md`
- **Quick Start:** Read `DB_QUICK_START.md`
- **Plan Details:** Read `v0_plans/creative-route.md`

---

## ⚠️ If Something Goes Wrong

### Error: "Could not find table"
1. Go to Supabase SQL Editor
2. Re-run: `01_create_tables.sql`
3. Wait for success message
4. Refresh your app

### Error: "Permission denied"
1. Make sure you're signed in
2. Check you created the record (not someone else's)
3. This is RLS working - it's good!

### Error: Foreign key constraint
1. Create a user first
2. Then create listing with that user's ID
3. Check IDs match exactly

### No tables showing
1. Go to Supabase Table Editor
2. Refresh (F5)
3. Check you're in right project
4. Check "Public" schema selected

---

## ✅ Success Checklist

When complete, you've got:

- ✅ 7 database tables created
- ✅ Row Level Security enabled
- ✅ Indexes for performance
- ✅ Test account created
- ✅ Test listing created
- ✅ Ratings working
- ✅ All data in Supabase
- ✅ App fully functional
- ✅ Ready for users!

---

## 🎉 You're Done!

Your Nigerian Real Estate Platform is now fully operational with:
- User authentication
- Listing management
- Agent ratings
- Property reviews
- Tenant tracking
- Maintenance notices
- Waitlist system

**Start inviting users to test it out!** 🚀

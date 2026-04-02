# Supabase Authentication Setup Guide

This guide explains how to set up Supabase authentication for the Nigerian Real Estate Platform.

## Prerequisites

- Supabase project created and connected to this v0 project
- Environment variables properly configured in Vercel

## Environment Variables

Make sure these environment variables are set in your Vercel project settings (Settings > Environment Variables):

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

You can find these in your Supabase project settings under **Settings > API**.

## Authentication Providers

The app supports the following authentication methods:

### 1. Email & Password (Built-in)

Users can sign up and log in using email and password.

**Sign Up Flow:**
1. User fills out the signup form with:
   - Email
   - Password (with confirmation)
   - First and Last Name
   - User Type (Agent, Landlord, House Hunter, Tenant)
   - State
2. Supabase sends a confirmation email
3. User clicks the confirmation link
4. User is redirected to sign-up success page
5. User can then sign in

**Configuration:**
- Email confirmations are enabled by default
- Confirmation emails are sent automatically
- Redirect URL: `{your-domain}/auth/sign-up-success`

### 2. User Metadata

When users sign up, the following user metadata is stored in Supabase:

```json
{
  "first_name": "John",
  "last_name": "Doe",
  "user_type": "agent",
  "state": "Lagos"
}
```

This metadata is automatically retrieved in the dashboard and profile pages.

## Supabase Configuration Steps

### 1. Enable Email Authentication

1. Go to your Supabase dashboard
2. Navigate to **Authentication > Providers**
3. Enable the "Email" provider
4. In settings, ensure:
   - ✓ Confirm email is enabled
   - Email templates are configured (optional, defaults work fine)

### 2. Configure Email Settings

1. Go to **Authentication > Email Templates**
2. You can customize:
   - Confirmation email
   - Password reset email
   - Magic link email (if enabled)

### 3. Set up JWT Secrets

1. Go to **Settings > API**
2. Copy the JWT secret - this is used to sign tokens
3. Tokens are valid for 1 hour by default

## User Creation Flow

### Via Sign-Up Form

1. User submits signup form with email, password, and profile info
2. Supabase creates auth user with confirmation email
3. App stores metadata automatically
4. User receives confirmation email
5. After confirming, user can sign in

### Via Dashboard

Users can only be created through the sign-up form - admin user creation is not implemented yet.

## Session Management

### Authentication State

Sessions are managed client-side using Supabase client:

```typescript
const supabase = createClient()
const { data: { user } } = await supabase.auth.getUser()
```

### Session Duration

- Sessions last for 1 hour (refreshed automatically)
- Tokens are stored in local storage
- PKCE flow is used for secure authentication

### Logout

Users can sign out from the dashboard:

```typescript
await supabase.auth.signOut()
```

This clears the local session and redirects to home page.

## Protected Pages

The following pages require authentication:

- `/dashboard` - User dashboard
- `/listings/create` - Create new listings
- `/profile` - User profile
- `/reviews/create` - Create reviews

Unauthenticated users are automatically redirected to `/auth/login`.

## Common Issues

### "Could not find the table" Error

This happens when database tables don't exist yet. Follow the Database Setup instructions in `DATABASE_SETUP.md`.

The app has a graceful fallback to mock data, so the UI still works.

### Email Not Received

1. Check spam/promotions folder
2. Check the email address is correct (no typos)
3. Verify email provider settings in Supabase
4. Check email logs in Supabase dashboard

### Password Reset

Users can reset their password through the "Forgot password?" link on the login page (not yet implemented - coming soon).

## Testing

### Test Accounts

For testing, you can create test accounts in Supabase:

1. Go to **Authentication > Users**
2. Click **Add user** button
3. Enter test email and password
4. User is created and confirmed by default

### Test Sign-Up Flow

1. Navigate to `/auth/sign-up`
2. Fill in all required fields
3. Check that confirmation email is received
4. Click confirmation link
5. Verify redirect to success page
6. Sign in with credentials

## Production Checklist

- [ ] Email provider configured in Supabase
- [ ] Email from address set correctly
- [ ] Email templates customized with your branding
- [ ] JWT secret secured
- [ ] CORS settings configured for your domain
- [ ] Database tables created
- [ ] RLS policies verified
- [ ] Authentication policies tested

## Security Recommendations

1. **Enable rate limiting** in Supabase to prevent brute force attacks
2. **Use strong password requirements** - minimum 8 characters recommended
3. **Enable MFA** for agents and admins (future feature)
4. **Monitor authentication logs** regularly
5. **Keep secrets out of code** - always use environment variables
6. **Use HTTPS only** - required for secure authentication

## Support

For more information, visit:
- Supabase Auth Documentation: https://supabase.com/docs/guides/auth
- This project's README.md

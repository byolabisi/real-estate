# Nigerian Real Estate Platform - Complete Setup Guide

Welcome to the Nigerian Real Estate Platform! This guide walks you through setting up the application for development and production.

## Quick Start (5 minutes)

The app works out of the box with mock data! Here's what you need:

1. **Environment Variables**: Make sure your Supabase keys are in Vercel project settings
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

2. **Run the dev server**:
   ```bash
   npm run dev
   ```

3. **Visit** http://localhost:3000

That's it! The app will display mock data for all properties. Users can view listings and sign up, but data won't be persisted without database setup.

## Full Setup (Optional, 20 minutes)

To enable full functionality including:
- User registration persistence
- Listing creation and management
- Email notifications
- Waitlist storage

Follow these guides:

### 1. Database Setup
See `DATABASE_SETUP.md` for instructions on:
- Creating Supabase tables
- Setting up indexes
- Configuring Row Level Security (RLS)

### 2. Authentication Setup
See `AUTHENTICATION_SETUP.md` for instructions on:
- Configuring email authentication
- Setting up user metadata
- Managing user sessions
- Protected routes

### 3. Email Configuration (Optional)
To send email notifications (waitlist confirmations, property alerts, etc.):

1. Get a Resend API key: https://resend.com
2. Add to Vercel environment variables:
   ```
   RESEND_API_KEY=your_key_here
   RESEND_FROM_EMAIL=noreply@yourdomain.com
   ```

3. The app will automatically send emails to waitlist signups

## File Structure

```
/app
  /api                    - API routes (waitlist, etc.)
  /auth                   - Authentication pages
    /login               - Login page
    /sign-up             - Sign up page
    /sign-up-success     - Sign up confirmation
  /dashboard             - User dashboard
  /listings              - Property listings
    /[id]               - Property details
    /create             - Create new listing
  /agents                - Find agents
  /profile               - User profile
  /reviews               - Write reviews
  /page.tsx              - Homepage
  /layout.tsx            - Root layout

/lib
  /supabase              - Supabase utilities
    /client.ts           - Browser client
    /db.ts               - Database functions
  /email.ts              - Email templates

/components
  /ui                    - UI components (buttons, forms, cards, etc.)
  /theme-provider.tsx    - Theme configuration

/public                  - Static assets
  /building-*.jpg        - Property images
```

## Features

### For House Hunters
- ✅ Browse thousands of listings with filters
- ✅ View property details, images, and amenities
- ✅ Leave reviews and ratings
- ✅ Save favorite listings (coming soon)
- ✅ Schedule viewings (coming soon)

### For Agents
- ✅ List properties quickly
- ✅ Manage property photos
- ✅ View inquiries
- ✅ Respond to reviews
- ✅ Track analytics (coming soon)

### For Landlords
- ✅ List multiple properties
- ✅ Manage tenant applications
- ✅ Set rent amounts
- ✅ Track lease status (coming soon)

### Platform Features
- ✅ Lagos Island, Lekki, and Mainland coverage
- ✅ Modern responsive design
- ✅ Professional color scheme (blue, teal, orange)
- ✅ Mobile-optimized
- ✅ Dark mode support (coming soon)

## Technology Stack

- **Frontend**: React 19, Next.js 16
- **Styling**: Tailwind CSS v4
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Email**: Resend (optional)
- **Deployment**: Vercel

## Troubleshooting

### "Could not find the table 'public.listings'" Error

This is expected if you haven't set up the database yet. The app gracefully falls back to mock data.

**To fix**: Follow the Database Setup guide in `DATABASE_SETUP.md`

### Sign-up Not Working

1. Check Supabase connection in Vercel settings
2. Verify environment variables are set correctly
3. Check Supabase email provider is enabled
4. See `AUTHENTICATION_SETUP.md` for detailed troubleshooting

### Images Not Loading

Check that the building images exist in `/public/`:
- `/building-1.jpg` - Modern luxury building
- `/building-2.jpg` - Penthouse interior
- `/building-3.jpg` - Gated estate

If missing, they'll be auto-generated on first request.

## Development Tips

### Adding New Features

1. Create a new page in `/app`
2. Add components in `/components`
3. Use Supabase utilities from `/lib/supabase/db.ts`
4. Update navigation links in `/app/page.tsx`

### Database Queries

Use the utility functions in `/lib/supabase/db.ts`:

```typescript
// Get listings
const listings = await getListings({ state: 'Lagos' })

// Get specific listing
const listing = await getListing(listingId)

// Create listing (requires auth)
const newListing = await createListing(listing)
```

### Styling

The app uses Tailwind CSS with semantic design tokens defined in `app/globals.css`:

- Colors: Primary blue, secondary teal, accent orange
- Spacing: Based on Tailwind scale (4px increments)
- Components: Use existing shadcn/ui components in `/components/ui`

## Deployment

### Deploy to Vercel

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel Settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `RESEND_API_KEY` (if using email)
3. Deploy! Vercel will automatically build and deploy on push

### Custom Domain

1. In Vercel, go to Settings > Domains
2. Add your custom domain
3. Update DNS records as shown
4. Update Supabase allowed redirect URLs if needed

## Support

For help:
1. Check the relevant setup guide (AUTHENTICATION_SETUP.md, DATABASE_SETUP.md)
2. Review Supabase documentation: https://supabase.com/docs
3. Check Next.js docs: https://nextjs.org/docs
4. Contact support: support@propertiesng.com (coming soon)

## License

All rights reserved. This platform is proprietary.

## Next Steps

1. **Start**: Make sure the dev server is running
2. **Explore**: Visit different pages to see the features
3. **Configure**: Set up Supabase if you want to persist data
4. **Customize**: Modify colors, text, and features as needed
5. **Deploy**: Push to GitHub and deploy to Vercel

Happy building! 🚀

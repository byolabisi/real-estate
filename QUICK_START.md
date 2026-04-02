# Quick Start Guide - Nigerian Real Estate Platform

## Get Running in 30 Seconds

```bash
# 1. Make sure you have Node.js 18+ and npm installed
npm --version

# 2. Start the development server
npm run dev

# 3. Open http://localhost:3000 in your browser
```

## What You'll See

- ✅ **Homepage** with hero section and featured listings
- ✅ **Browse Listings** - Filter by state, property type, price
- ✅ **Sign Up / Login** - Create an account
- ✅ **Dashboard** - User dashboard (after login)
- ✅ **20 Mock Properties** - Lagos Island, Lekki, and Mainland

## Common Tasks

### View Available Listings
1. Click "Browse" or the big search button on homepage
2. Use filters to find properties
3. Click any property to see details

### Sign Up
1. Click "Sign Up" button
2. Fill in your details
3. Check email for confirmation
4. Click confirmation link
5. Now you can sign in

### Sign In
1. Click "Sign In" button
2. Enter email and password
3. You're now in your dashboard

### Create a Property Listing
1. Sign in as an agent/landlord
2. Click "List Property" in footer or dashboard
3. Fill in property details
4. Submit

### Leave a Review
1. Sign in
2. Go to a property listing
3. Scroll to reviews section
4. Click "Write Review"
5. Rate and comment

## Important Files to Know

- **Homepage**: `/app/page.tsx` - Main landing page
- **Listings**: `/app/listings/page.tsx` - All properties
- **Auth**: `/app/auth/login/page.tsx` and `/app/auth/sign-up/page.tsx`
- **Styles**: `/app/globals.css` - Colors and theme
- **Components**: `/components/ui/` - UI building blocks

## Key Features

### For Everyone
- Browse properties
- View property details and images
- See reviews and ratings
- Sign up and create account

### For Agents
- List properties
- Upload multiple images
- Manage listings
- Respond to inquiries

### For House Hunters
- Advanced filters
- Save favorites
- Schedule viewings
- Leave reviews

### For Landlords
- List properties
- Accept applications
- Manage tenants
- Track rent payments

## Make Changes

### Add New Navigation Link
Edit `/app/page.tsx` and add to navigation:
```jsx
<Link href="/your-page" className="...">Your Link</Link>
```

### Change Colors
Edit `/app/globals.css` and modify `--primary`, `--secondary`, `--accent` colors

### Add New Page
Create `/app/your-page/page.tsx`:
```tsx
export default function YourPage() {
  return <div>Your content</div>
}
```

### Modify Homepage
Edit `/app/page.tsx` - it's a single file with everything

## Troubleshooting

### "Module not found" Error
```bash
npm install
```

### Port 3000 Already in Use
```bash
npm run dev -- -p 3001
```

### Styling Not Working
```bash
npm run dev
# Wait 10 seconds for Tailwind to compile
```

### Database Errors (Expected!)
These are fine - app uses mock data as fallback. To fix, follow `DATABASE_SETUP.md`

## Database (Optional)

The app works great without a database - it uses mock data. To enable persistence:

1. Create a Supabase project
2. Follow `DATABASE_SETUP.md`
3. Set environment variables
4. Tables will be created

## Email Notifications (Optional)

To send emails (waitlist confirmations, property alerts):

1. Get free Resend account: https://resend.com
2. Add `RESEND_API_KEY` to environment variables
3. Emails will be sent automatically

## Deploy to Vercel

```bash
# 1. Push to GitHub
git push origin main

# 2. Go to https://vercel.com
# 3. Click "New Project"
# 4. Select your repository
# 5. Add environment variables
# 6. Click "Deploy"
```

Done! Your site is live! 🎉

## Performance Tips

### For Development
- Keep dev server running
- Changes reload automatically
- Check browser console for errors

### For Production
- All images optimized
- CSS minified
- JavaScript bundled
- Ready for high traffic

## Help & Support

- **Setup Questions**: See `SETUP.md`
- **Auth Issues**: See `AUTHENTICATION_SETUP.md`
- **Database Help**: See `DATABASE_SETUP.md`
- **See What's Fixed**: See `FIXES_APPLIED.md`
- **Supabase Docs**: https://supabase.com/docs
- **Next.js Docs**: https://nextjs.org/docs

## Next Steps

1. ✅ Start dev server - `npm run dev`
2. ✅ Explore the app - Click around, try features
3. ✅ Sign up and log in - Test authentication
4. ✅ Browse listings - Check out properties
5. ✅ Set up Supabase - Optional, for persistence
6. ✅ Deploy to Vercel - Share with others

## Project Structure Overview

```
PropertiesNG/
├── app/                    # Pages and routes
│   ├── page.tsx           # Homepage
│   ├── layout.tsx         # Root layout
│   ├── auth/              # Login, signup pages
│   ├── listings/          # Property listings
│   ├── dashboard/         # User dashboard
│   └── api/               # API endpoints
├── components/
│   └── ui/                # Reusable components
├── lib/
│   └── supabase/          # Database utilities
├── public/                # Images and static files
└── styles/                # Global CSS
```

## Fun Facts About This Platform

- 🏠 **20 Real Mock Properties** across Lagos Island, Lekki, and Mainland
- 💰 **Affordable Housing Focus** - From ₦450K to ₦15M annually
- 🎨 **Modern Design** - Professional real estate color scheme
- 📱 **Mobile First** - Works perfectly on all devices
- ⚡ **Fast** - Built with Next.js 16 and optimized
- 🔒 **Secure** - Supabase authentication
- 🌍 **Ready to Scale** - Production-ready architecture

## Ready to Build?

You now have everything you need. Start with `npm run dev` and explore!

Have questions? Check the detailed guides:
- SETUP.md
- AUTHENTICATION_SETUP.md
- DATABASE_SETUP.md
- FIXES_APPLIED.md

Happy building! 🚀

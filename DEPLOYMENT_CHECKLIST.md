# Pritti Deployment Checklist ✅

Use this checklist to ensure everything is properly configured before going live.

## 🔧 Pre-Deployment

### Database Setup
- [ ] Supabase project created
- [ ] Migration SQL executed successfully
- [ ] All 8 categories seeded
- [ ] Settings table populated
- [ ] Category images uploaded or placeholder URLs set
- [ ] RLS policies verified and tested
- [ ] Storage bucket `item-images` created and public
- [ ] Storage policies for upload/view/delete configured

### Authentication
- [ ] Admin secret password set in environment variables
- [ ] First admin user created (if using Auth0/Supabase Auth)
- [ ] Auth0 or Supabase Auth configured (future)

### Payment Integration
- [ ] Stripe account created
- [ ] Stripe API keys (test) working in development
- [ ] Stripe webhook endpoint created
- [ ] Webhook secret configured
- [ ] Test payment completed successfully

### Environment Configuration
- [ ] `.env` file created from `.env.example`
- [ ] All Supabase credentials filled in
- [ ] All Stripe credentials filled in
- [ ] `ADMIN_SECRET` set to secure password
- [ ] `NEXT_PUBLIC_SITE_URL` set correctly

## 🚀 Deployment Steps

### 1. Code Repository
- [ ] Git repository initialized
- [ ] `.gitignore` properly configured
- [ ] `.env` NOT committed (verify)
- [ ] Code pushed to GitHub/GitLab

### 2. Vercel Deployment
- [ ] Vercel project created
- [ ] GitHub repository connected
- [ ] Environment variables added to Vercel:
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] `SUPABASE_SERVICE_ROLE_KEY`
  - [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
  - [ ] `STRIPE_SECRET_KEY`
  - [ ] `STRIPE_WEBHOOK_SECRET`
  - [ ] `ADMIN_SECRET`
  - [ ] `NEXT_PUBLIC_SITE_URL` (set to Vercel domain)
- [ ] First deployment successful
- [ ] No build errors

### 3. Post-Deployment Configuration
- [ ] Update Stripe webhook URL to production domain
- [ ] Test webhook is receiving events
- [ ] Verify all pages load correctly
- [ ] Test responsive design on mobile
- [ ] RTL layout verified on all pages

## 🧪 Testing Checklist

### Seller Flow
- [ ] Visit `/sell` page
- [ ] Upload images (test with 1, 4, and 8 images)
- [ ] Submit form with all required fields
- [ ] Verify item appears in admin panel as "pending_approval"
- [ ] Images display correctly

### Admin Flow
- [ ] Login with admin password
- [ ] See all pending items
- [ ] Approve an item
- [ ] Verify item appears on `/buy`
- [ ] Feature an item (star icon)
- [ ] Mark item as sold
- [ ] Delete an item
- [ ] View leads tab
- [ ] View orders tab

### Buyer Flow
- [ ] Visit `/buy` page
- [ ] See approved items
- [ ] Search by keyword
- [ ] Filter by category
- [ ] Filter by city
- [ ] Empty state shows lead capture form
- [ ] Submit lead capture form
- [ ] Verify lead appears in admin panel

### Product Detail Flow
- [ ] Click on a product
- [ ] Image slider works (navigate between images)
- [ ] Thumbnails clickable
- [ ] Price breakdown displays correctly
- [ ] Pickup location shows city/neighborhood

### Purchase Flow - Delivery
- [ ] Click "לרכישה עד הבית"
- [ ] Modal opens for buyer details
- [ ] Fill in all fields
- [ ] Redirected to Stripe Checkout
- [ ] Complete payment with test card (`4242 4242 4242 4242`)
- [ ] Redirected to success page
- [ ] Order appears in admin panel with status "paid"
- [ ] Item marked as sold (optional feature)

### Purchase Flow - Pickup
- [ ] Click "לרכישה באיסוף עצמי"
- [ ] Modal opens for buyer details
- [ ] Fill in all fields
- [ ] WhatsApp opens with pre-filled message
- [ ] Order created with status "initiated"
- [ ] Order appears in admin panel

### Category Pages
- [ ] Visit each of the 8 category pages
- [ ] Only approved items show
- [ ] Empty state with lead capture if no items
- [ ] Product cards display correctly

### Homepage
- [ ] Hero section displays with two buttons
- [ ] All 8 categories display as tiles
- [ ] "How it works" section displays
- [ ] "About" section displays
- [ ] Social links present (even if placeholder)
- [ ] Footer displays with links
- [ ] All links work correctly

## 🔐 Security Verification

- [ ] `.env` file NOT in repository
- [ ] Service role key only used server-side
- [ ] RLS policies prevent unauthorized access
- [ ] Admin panel requires authentication
- [ ] Stripe webhook signature verified
- [ ] No API keys exposed in client code
- [ ] HTTPS enforced (automatic on Vercel)

## 📊 Performance & Analytics

- [ ] Vercel Analytics enabled
- [ ] Images optimized and using Next.js Image component
- [ ] No console errors in browser
- [ ] Pages load in < 3 seconds
- [ ] Lighthouse score > 80

## 🌐 SEO & Accessibility

- [ ] Page titles are descriptive (Hebrew)
- [ ] Meta descriptions present
- [ ] Images have alt text
- [ ] Keyboard navigation works
- [ ] Focus states visible
- [ ] RTL text displays correctly
- [ ] Font rendering is good (Hebrew support)

## 📱 Mobile Testing

- [ ] Test on iOS Safari
- [ ] Test on Android Chrome
- [ ] All buttons are tap-friendly (min 44px)
- [ ] Forms work on mobile
- [ ] Image upload works on mobile
- [ ] Modals work on mobile
- [ ] No horizontal scroll

## 🔄 Post-Launch

- [ ] Monitor Vercel deployment logs
- [ ] Monitor Stripe webhook events
- [ ] Check Supabase database for errors
- [ ] Set up error tracking (Sentry recommended)
- [ ] Set up uptime monitoring
- [ ] Backup database regularly
- [ ] Document any issues found
- [ ] Plan for future features

## 🚨 Troubleshooting Guide

### If Payments Don't Work
1. Check Stripe keys are correct in Vercel
2. Verify webhook URL is production domain
3. Check webhook signing secret matches
4. Look at Stripe Dashboard → Webhooks → Events

### If Images Don't Upload
1. Verify Supabase Storage bucket is public
2. Check storage policies are correct
3. Verify file size within limits
4. Check network tab for CORS errors

### If Items Don't Show
1. Check item status is 'approved'
2. Verify RLS policies allow public read for approved items
3. Check Supabase logs for query errors

### If Admin Panel Doesn't Work
1. Verify ADMIN_SECRET matches
2. Clear browser localStorage
3. Check console for errors
4. Try incognito mode

## 📈 Success Metrics

Track these after launch:
- Number of items listed
- Number of successful purchases
- Conversion rate (views → purchases)
- Average time to approve items
- Number of leads captured
- Most popular categories
- Delivery vs Pickup preference

---

**Deployment Status**: ⬜ Not Started | 🟨 In Progress | ✅ Complete

Mark your progress and good luck with the launch! 🚀


# Pritti Setup Guide - פריטי

Complete step-by-step guide to get your Pritti marketplace up and running.

## 📋 Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works)
- A Stripe account (test mode for development)
- Vercel account (optional, for deployment)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

#### Create a New Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in project details and wait for setup to complete

#### Run the Database Migration

1. Go to **SQL Editor** in your Supabase dashboard
2. Click "New Query"
3. Copy the entire contents of `supabase/migrations/001_initial_schema.sql`
4. Paste and click **Run**

This will create:
- All database tables
- Row Level Security policies
- 8 default categories
- Default settings

#### Set Up Storage for Images

1. Go to **Storage** in Supabase dashboard
2. Click "Create bucket"
3. Name it `item-images`
4. Make it **Public**
5. Go to **Policies** tab and add these:

**Insert Policy:**
```sql
CREATE POLICY "Anyone can upload images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'item-images');
```

**Select Policy:**
```sql
CREATE POLICY "Anyone can view images"
ON storage.objects FOR SELECT
USING (bucket_id = 'item-images');
```

**Delete Policy (Admin only):**
```sql
CREATE POLICY "Admins can delete images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'item-images' 
  AND EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);
```

### 3. Set Up Stripe

1. Go to [stripe.com](https://stripe.com) and sign up
2. Go to **Developers** → **API keys**
3. Copy your **Publishable key** and **Secret key** (use test mode keys)
4. For webhooks (needed for production):
   - Go to **Developers** → **Webhooks**
   - Click "Add endpoint"
   - URL: `https://your-domain.com/api/webhook/stripe`
   - Select events: `checkout.session.completed`, `checkout.session.expired`
   - Copy the **Signing secret**

### 4. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Fill in your credentials:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Admin
ADMIN_SECRET=your_secure_admin_password_here

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 5. Add Placeholder Images

The app expects category images. You can either:

**Option A:** Use placeholder URLs (temporary)
```sql
-- Run in Supabase SQL Editor
UPDATE categories SET image_url = 'https://via.placeholder.com/400' WHERE image_url IS NULL;
```

**Option B:** Upload your own images
1. Prepare 8 category images (400x400px recommended)
2. Upload to Supabase Storage under `item-images/categories/`
3. Update the `image_url` in the categories table

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your site!

## 👤 Creating Your First Admin User

Since there's no sign-up flow yet (using Auth0 in future), create an admin manually:

1. Visit `/admin` and use your `ADMIN_SECRET` password to log in
2. The simple password authentication is sufficient for MVP

For production, you would:
1. Set up Auth0 or Supabase Auth
2. Create a user account
3. Run this SQL to promote to admin:

```sql
-- Replace with your email
UPDATE profiles 
SET role = 'admin' 
WHERE id = (
  SELECT id FROM auth.users WHERE email = 'your@email.com'
);
```

## 🧪 Testing the App

### Test the Seller Flow

1. Go to `/sell`
2. Fill out the form with sample data
3. Upload 1-3 images
4. Submit
5. Go to `/admin` and approve the item

### Test the Buyer Flow

1. Go to `/buy`
2. Search for your item
3. Click on it to view details
4. Try both "delivery" and "pickup" options

For **pickup**, make sure the seller phone number is valid (it will open WhatsApp).

For **delivery**, use Stripe test card:
- Card: `4242 4242 4242 4242`
- Expiry: Any future date
- CVC: Any 3 digits

### Test Lead Capture

1. Go to `/buy`
2. Search for something that doesn't exist
3. Fill out the lead capture form
4. Check `/admin` → Leads tab

## 📱 Features Checklist

- ✅ Home page with split hero and categories
- ✅ Seller form with image upload
- ✅ Buyer search with filters
- ✅ Category pages
- ✅ Product detail pages with image slider
- ✅ Price breakdown (item price + Pritti fee + optional shipping)
- ✅ Delivery flow (Stripe Checkout)
- ✅ Pickup flow (WhatsApp deep link)
- ✅ Lead capture for unavailable items
- ✅ Admin panel (items, leads, orders)
- ✅ RLS policies enforced
- ✅ RTL Hebrew interface
- ✅ Responsive design

## 🚢 Deploying to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial Pritti marketplace"
git remote add origin your-repo-url
git push -u origin main
```

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Add all environment variables from `.env`
5. Update `NEXT_PUBLIC_SITE_URL` to your Vercel domain
6. Click "Deploy"

### 3. Update Stripe Webhook

After deployment:
1. Go to Stripe Dashboard → Webhooks
2. Update the webhook URL to `https://your-vercel-domain.com/api/webhook/stripe`

## 🔐 Security Notes

### For Production:

1. **Change ADMIN_SECRET** to a strong password
2. **Rotate Supabase keys** if they've been exposed
3. **Use Stripe live keys** (not test keys)
4. **Set up proper authentication** with Auth0 or Supabase Auth
5. **Enable HTTPS only** for production
6. **Review RLS policies** to ensure they match your security requirements
7. **Add rate limiting** to prevent abuse
8. **Set up monitoring** (Vercel Analytics is already integrated)

## 🐛 Troubleshooting

### Images Not Uploading
- Check Supabase Storage bucket is public
- Verify storage policies are correctly set
- Check file size limits

### Payments Not Working
- Verify Stripe keys are correct
- Check webhook is receiving events
- Use Stripe test cards for testing

### Items Not Showing
- Check item status is 'approved' in admin panel
- Verify RLS policies allow reading

### Admin Panel Not Loading
- Clear browser storage
- Check ADMIN_SECRET in .env matches what you're entering

## 📚 Next Steps

1. Add actual category images
2. Set up Auth0 for proper user authentication
3. Add email notifications (SendGrid, Postmark)
4. Implement seller dashboard
5. Add item reviews/ratings
6. Implement favorites/watchlist
7. Add more payment methods
8. Set up proper error tracking (Sentry)
9. Add analytics tracking
10. Implement search with Algolia or similar

## 💡 Tips

- Use Supabase Studio to inspect database directly
- Stripe has excellent test mode for development
- Keep test data separate from production
- Regular backups of Supabase database recommended

## 📞 Support

For issues specific to:
- **Supabase**: [supabase.com/docs](https://supabase.com/docs)
- **Stripe**: [stripe.com/docs](https://stripe.com/docs)
- **Next.js**: [nextjs.org/docs](https://nextjs.org/docs)

---

**Happy Selling! 🎉**

Built with ❤️ for the Israeli second-hand market


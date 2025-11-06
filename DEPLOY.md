# 🚀 Deploy to Vercel - Quick Start

> **TL;DR**: Connect GitHub repo to Vercel, add environment variables, deploy. Takes ~10 minutes.

## Prerequisites Checklist

Before deploying, make sure you have:

- ✅ Supabase project set up with migrations run
- ✅ Stripe account with API keys ready
- ✅ GitHub account with repository
- ✅ Vercel account (free tier is fine)

## Step-by-Step Deployment

### 1️⃣ Prepare Your Repository

```bash
# If not already a git repo
git init

# Add all files
git add .

# Commit
git commit -m "Ready for Vercel deployment"

# Push to GitHub
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

### 2️⃣ Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New Project"**
3. **Import your GitHub repository**
4. Vercel auto-detects Next.js settings ✓

### 3️⃣ Add Environment Variables

In Vercel Dashboard, go to **Settings → Environment Variables** and add:

#### Supabase (3 variables)
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Where to find:** Supabase Dashboard → Settings → API

#### Stripe (3 variables)
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_... (or pk_test_...)
STRIPE_SECRET_KEY=sk_live_... (or sk_test_...)
STRIPE_WEBHOOK_SECRET=whsec_...
```

**Where to find:** 
- Keys: Stripe Dashboard → Developers → API keys
- Webhook: Set up after first deployment (see Step 4)

**Note:** For initial deployment, you can use `whsec_placeholder` temporarily and update it after configuring the webhook.

#### Admin & Site (2 variables)
```
ADMIN_SECRET=your-super-secure-password
NEXT_PUBLIC_SITE_URL=https://your-project.vercel.app
```

**Note:** Use your actual Vercel domain for `NEXT_PUBLIC_SITE_URL`

### 4️⃣ Deploy!

1. Click **"Deploy"** in Vercel
2. Wait 2-3 minutes for build
3. Visit your live site! 🎉

### 5️⃣ Configure Stripe Webhook (IMPORTANT!)

After your first deployment:

1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Click **"Add endpoint"**
3. Enter URL: `https://your-project.vercel.app/api/webhook/stripe`
4. Select events:
   - `checkout.session.completed`
   - `checkout.session.expired`
5. Click **"Add endpoint"**
6. Copy the **Signing secret** (starts with `whsec_`)
7. Go back to **Vercel → Settings → Environment Variables**
8. Update `STRIPE_WEBHOOK_SECRET` with the real value
9. **Redeploy** your project (Deployments → ... → Redeploy)

## Verify Deployment

### Quick Test Checklist

- [ ] Homepage loads without errors
- [ ] Visit `/sell` - Form is accessible
- [ ] Visit `/buy` - Page loads
- [ ] Visit `/admin` - Login works
- [ ] Images display correctly
- [ ] Mobile view works (check on phone)

### Test a Complete Flow

1. **Post an item** on `/sell`
2. **Login to admin** at `/admin`
3. **Approve the item**
4. **View it on** `/buy`
5. **Click the item** - Detail page loads
6. **Try checkout** - Stripe opens (use test card: `4242 4242 4242 4242`)
7. **Complete payment** - Redirects to success page
8. **Check admin** - Order appears in Orders tab

## Troubleshooting

### Build Fails

**"Missing environment variables"**
- Add all 8 environment variables in Vercel
- Check for typos in variable names
- Redeploy

### Images Don't Load

**Supabase images broken**
- Check `next.config.js` has correct Supabase hostname
- Verify Supabase storage bucket is public
- Check browser console for CORS errors

### Payments Don't Work

**Stripe checkout fails**
- Verify you're using matching keys (both test or both live)
- Check webhook secret is set
- Look at Stripe Dashboard → Webhooks → Events for errors
- Check Vercel Functions logs

### Admin Panel Issues

**Login doesn't work**
- Verify `ADMIN_SECRET` is set in Vercel
- Clear browser localStorage
- Try incognito mode

## Environment Variables Quick Reference

| Variable | Type | Where to Get |
|----------|------|--------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Public | Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | Supabase → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | **Secret** | Supabase → Settings → API |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Public | Stripe → Developers → API keys |
| `STRIPE_SECRET_KEY` | **Secret** | Stripe → Developers → API keys |
| `STRIPE_WEBHOOK_SECRET` | **Secret** | Stripe → Webhooks → [endpoint] |
| `ADMIN_SECRET` | **Secret** | Choose your own |
| `NEXT_PUBLIC_SITE_URL` | Public | Your Vercel URL |

## Next Steps

After successful deployment:

- [ ] Set up custom domain (optional)
- [ ] Switch to Stripe live keys (when ready to go live)
- [ ] Update webhook URL to custom domain (if applicable)
- [ ] Enable Vercel Analytics
- [ ] Set up monitoring/alerts
- [ ] Test on multiple devices

## Need More Help?

- **Detailed guide**: [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)
- **Environment setup**: [env-setup-guide.md](./env-setup-guide.md)
- **Complete checklist**: [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)
- **Project overview**: [README.md](./README.md)

## Check Before Deploy

Run this command to validate your environment variables:

```bash
npm run check-env
```

This will verify all required variables are set correctly.

---

**You're ready to deploy!** 🚀

The entire process should take about 10-15 minutes from start to finish.

Good luck! 🎉


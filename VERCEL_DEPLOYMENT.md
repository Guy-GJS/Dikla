# 🚀 Vercel Deployment Guide

Complete guide for deploying the Dikla (Pritti) project to Vercel.

## Prerequisites

Before deploying, ensure you have:
- ✅ A GitHub/GitLab/Bitbucket account
- ✅ A Vercel account (free tier works)
- ✅ Supabase project set up with migrations run
- ✅ Stripe account with API keys
- ✅ All environment variables ready

## Step 1: Prepare Your Repository

### 1.1 Initialize Git (if not already done)

```bash
cd /Users/guyschneider/code/Dikla
git init
git add .
git commit -m "Initial commit - Ready for Vercel deployment"
```

### 1.2 Push to GitHub

```bash
# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy to Vercel

### 2.1 Connect Repository

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js settings

### 2.2 Configure Build Settings

Vercel should auto-detect these settings from `vercel.json`:
- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install`

## Step 3: Environment Variables

Add these environment variables in Vercel Dashboard → Project Settings → Environment Variables:

### Supabase Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**Where to find these:**
- Go to your Supabase project
- Click Settings → API
- Copy the values

### Stripe Variables

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your-publishable-key
STRIPE_SECRET_KEY=sk_live_your-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
```

**Important:**
- Use **test keys** (`pk_test_` and `sk_test_`) for staging
- Use **live keys** (`pk_live_` and `sk_live_`) for production
- Webhook secret is obtained after setting up the webhook (Step 4)

### Admin & Site Variables

```bash
ADMIN_SECRET=your-secure-admin-password
NEXT_PUBLIC_SITE_URL=https://your-project.vercel.app
```

**Notes:**
- Make `ADMIN_SECRET` strong and unique
- `NEXT_PUBLIC_SITE_URL` will be your Vercel domain (e.g., `https://dikla.vercel.app`)

### Environment Scopes

For each variable, set the scope:
- ✅ **Production** - Live site
- ✅ **Preview** - Preview deployments (optional)
- ⬜ **Development** - Local development (use `.env.local` instead)

## Step 4: Configure Stripe Webhook

After your first deployment:

### 4.1 Get Your Webhook URL

Your webhook URL will be:
```
https://your-project.vercel.app/api/webhook/stripe
```

### 4.2 Add Webhook in Stripe Dashboard

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Developers → Webhooks**
3. Click **Add endpoint**
4. Enter your webhook URL
5. Select these events:
   - `checkout.session.completed`
   - `checkout.session.expired`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`

### 4.3 Get Webhook Secret

1. After creating the webhook, click on it
2. Copy the **Signing secret** (starts with `whsec_`)
3. Add it to Vercel environment variables as `STRIPE_WEBHOOK_SECRET`
4. **Redeploy** your project for the change to take effect

## Step 5: Update Next.js Config (if needed)

If your Supabase hostname is different, update `next.config.js`:

```javascript
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    domains: ['YOUR-PROJECT-ID.supabase.co'],
  },
}
```

## Step 6: Deploy!

1. Click **Deploy** in Vercel
2. Wait for the build to complete (usually 2-3 minutes)
3. Visit your live site

## Post-Deployment Checklist

### ✅ Verify Deployment

- [ ] Site loads without errors
- [ ] All pages are accessible
- [ ] Images display correctly
- [ ] Hebrew RTL layout works
- [ ] Mobile responsive design works

### ✅ Test Core Functionality

- [ ] Visit `/sell` - Upload an item
- [ ] Visit `/admin` - Login works
- [ ] Approve an item in admin
- [ ] Visit `/buy` - See approved items
- [ ] Test search and filters
- [ ] Click on an item - Detail page loads
- [ ] Test lead capture form

### ✅ Test Payment Flow

- [ ] Click "לרכישה עד הבית" (Buy with Delivery)
- [ ] Complete Stripe checkout with test card: `4242 4242 4242 4242`
- [ ] Verify redirect to success page
- [ ] Check order appears in admin panel
- [ ] Verify Stripe webhook received the event

### ✅ Test WhatsApp Flow

- [ ] Click "לרכישה באיסוף עצמי" (Buy with Pickup)
- [ ] WhatsApp opens with pre-filled message
- [ ] Order created in database

## Troubleshooting

### Build Fails

**Error: Missing environment variables**
- Solution: Add all required env vars in Vercel Dashboard
- Check spelling and formatting

**Error: Module not found**
- Solution: Run `npm install` locally to update `package-lock.json`
- Commit and push changes

### Runtime Errors

**Images don't load**
- Check `next.config.js` includes your Supabase hostname
- Verify Supabase storage bucket is public

**Payments fail**
- Verify Stripe keys are correct (test vs. live)
- Check webhook secret is set
- Look at Stripe Dashboard → Webhooks → Events for errors

**Admin login doesn't work**
- Verify `ADMIN_SECRET` env var is set in Vercel
- Clear browser localStorage and try again

### Performance Issues

**Slow page loads**
- Check Vercel Analytics for insights
- Consider upgrading to Pro for better performance
- Optimize images (use Next.js Image component)

## Continuous Deployment

Vercel automatically deploys when you push to your repository:

- **Push to `main`** → Production deployment
- **Push to other branches** → Preview deployments
- **Pull requests** → Automatic preview URLs

## Custom Domain (Optional)

### Add Custom Domain

1. Go to Vercel Dashboard → Project → Settings → Domains
2. Click "Add Domain"
3. Enter your domain (e.g., `pritti.co.il`)
4. Follow DNS configuration instructions
5. Wait for DNS propagation (up to 48 hours)

### Update Environment Variables

After adding custom domain, update:
```bash
NEXT_PUBLIC_SITE_URL=https://your-custom-domain.com
```

And update Stripe webhook URL to use custom domain.

## Monitoring & Maintenance

### Enable Vercel Analytics

1. Go to Vercel Dashboard → Project → Analytics
2. Enable Analytics (included in all plans)
3. View real-time performance metrics

### Monitor Logs

- **Vercel Dashboard → Deployments → Functions**
- Filter by function or timeframe
- Look for errors or warnings

### Database Monitoring

- Check Supabase Dashboard regularly
- Monitor database size (free tier: 500MB)
- Review RLS policies and query performance

### Regular Updates

```bash
# Update dependencies
npm update

# Check for security vulnerabilities
npm audit

# Commit and push to trigger deployment
git add package-lock.json
git commit -m "Update dependencies"
git push
```

## Scaling Considerations

### Free Tier Limits

- 100 GB bandwidth/month
- 6,000 build minutes/month
- Serverless function execution limit

### When to Upgrade

Consider Vercel Pro when you reach:
- High traffic (> 100K visits/month)
- Need faster build times
- Want advanced analytics
- Need preview deployment protection

## Security Best Practices

- ✅ Never commit `.env` files
- ✅ Rotate API keys regularly
- ✅ Use separate Stripe keys for test/production
- ✅ Keep `SUPABASE_SERVICE_ROLE_KEY` secret
- ✅ Use strong `ADMIN_SECRET`
- ✅ Enable Vercel deployment protection for sensitive branches

## Support

### Vercel Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Vercel Community](https://github.com/vercel/vercel/discussions)

### Project Resources

- [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) - Comprehensive testing
- [SETUP.md](./SETUP.md) - Local setup guide
- [README.md](./README.md) - Project overview

## Quick Reference

### Essential Commands

```bash
# Deploy from CLI (alternative to GitHub integration)
npx vercel

# Deploy to production
npx vercel --prod

# View logs
npx vercel logs

# List environment variables
npx vercel env ls
```

### Important URLs

After deployment, bookmark these:
- Your site: `https://your-project.vercel.app`
- Vercel Dashboard: `https://vercel.com/dashboard`
- Supabase Dashboard: `https://app.supabase.com`
- Stripe Dashboard: `https://dashboard.stripe.com`

---

## Deployment Status

- ⬜ Repository connected to Vercel
- ⬜ Environment variables configured
- ⬜ First deployment successful
- ⬜ Stripe webhook configured
- ⬜ Core functionality tested
- ⬜ Payment flow tested
- ⬜ Production ready

**Good luck with your deployment! 🚀**

---

*Last updated: November 2024*


# Environment Variables Setup Guide

This guide will help you set up all required environment variables for the Dikla (Pritti) project.

## Required Environment Variables

### 1. Supabase Configuration

#### NEXT_PUBLIC_SUPABASE_URL
- **Description**: Your Supabase project URL
- **Example**: `https://abcdefghijklmnop.supabase.co`
- **Where to find**: Supabase Dashboard → Settings → API → Project URL
- **Scope**: Public (client-side accessible)

#### NEXT_PUBLIC_SUPABASE_ANON_KEY
- **Description**: Supabase anonymous/public key
- **Example**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Where to find**: Supabase Dashboard → Settings → API → Project API keys → `anon` `public`
- **Scope**: Public (client-side accessible)
- **Note**: This key is safe to expose as it's protected by Row Level Security

#### SUPABASE_SERVICE_ROLE_KEY
- **Description**: Supabase service role key (admin access)
- **Example**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Where to find**: Supabase Dashboard → Settings → API → Project API keys → `service_role`
- **Scope**: **SECRET** (server-side only)
- **⚠️ Warning**: Never expose this key in client-side code!

### 2. Stripe Configuration

#### NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
- **Description**: Stripe publishable key
- **Test**: `pk_test_...`
- **Live**: `pk_live_...`
- **Where to find**: Stripe Dashboard → Developers → API keys → Publishable key
- **Scope**: Public (client-side accessible)

#### STRIPE_SECRET_KEY
- **Description**: Stripe secret key
- **Test**: `sk_test_...`
- **Live**: `sk_live_...`
- **Where to find**: Stripe Dashboard → Developers → API keys → Secret key
- **Scope**: **SECRET** (server-side only)
- **⚠️ Warning**: Never expose this key in client-side code!

#### STRIPE_WEBHOOK_SECRET
- **Description**: Webhook signing secret
- **Example**: `whsec_...`
- **Where to find**: Stripe Dashboard → Developers → Webhooks → [Your webhook] → Signing secret
- **Scope**: **SECRET** (server-side only)
- **Note**: You'll get this after creating the webhook endpoint

### 3. Admin Configuration

#### ADMIN_SECRET
- **Description**: Password for admin panel access
- **Example**: `my-super-secure-password-123`
- **Requirements**: Choose a strong, unique password
- **Scope**: **SECRET** (server-side only)
- **Recommendation**: Use a password manager to generate a strong password

### 4. Site Configuration

#### NEXT_PUBLIC_SITE_URL
- **Description**: Your site's public URL
- **Local**: `http://localhost:3000`
- **Production**: `https://your-project.vercel.app` or your custom domain
- **Scope**: Public (client-side accessible)
- **Note**: Used for redirects and webhook URLs

## Setup Instructions

### For Local Development

1. Create a `.env.local` file in the project root:

```bash
touch .env.local
```

2. Copy this template and fill in your values:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Stripe Configuration (use test keys for development)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your-publishable-key
STRIPE_SECRET_KEY=sk_test_your-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret

# Admin Configuration
ADMIN_SECRET=your-secure-admin-password

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

3. Restart your development server:

```bash
npm run dev
```

### For Vercel Deployment

1. Go to your Vercel project dashboard
2. Navigate to **Settings → Environment Variables**
3. Add each variable one by one:
   - Enter the **Key** (variable name)
   - Enter the **Value**
   - Select environments: ✅ Production, ✅ Preview (optional)
   - Click **Save**

4. **Important**: After adding all variables, trigger a new deployment:
   - Go to **Deployments** tab
   - Click the three dots on the latest deployment
   - Select **Redeploy**

## Validation Checklist

### ✅ Supabase Setup
- [ ] Supabase project created
- [ ] Database migrations run successfully
- [ ] Storage bucket `item-images` created
- [ ] All three Supabase keys obtained
- [ ] Keys added to environment variables

### ✅ Stripe Setup
- [ ] Stripe account created
- [ ] API keys obtained (test or live)
- [ ] Webhook endpoint created
- [ ] Webhook secret obtained
- [ ] All three Stripe keys added to environment variables

### ✅ Security
- [ ] `.env.local` file is in `.gitignore`
- [ ] No secrets committed to repository
- [ ] Admin password is strong and unique
- [ ] Service role key only used server-side
- [ ] Using test keys for development
- [ ] Using live keys for production

### ✅ Testing
- [ ] Development server starts without errors
- [ ] Can connect to Supabase (check browser console)
- [ ] Can load items from database
- [ ] Stripe checkout opens (test mode)
- [ ] Webhook receives test events

## Troubleshooting

### "Missing environment variable" error

**Problem**: Application crashes with missing env var error

**Solution**:
1. Check spelling of variable name (case-sensitive)
2. Verify the variable is in `.env.local` (local) or Vercel Dashboard (production)
3. Restart development server (local)
4. Redeploy (production)

### Supabase connection fails

**Problem**: "Invalid API key" or connection timeout

**Solution**:
1. Verify Supabase URL is correct (no trailing slash)
2. Check that anon key matches your project
3. Confirm project is not paused (free tier limitation)
4. Check browser console for detailed error

### Stripe checkout doesn't work

**Problem**: Stripe checkout fails to load or crashes

**Solution**:
1. Verify you're using matching keys (both test or both live)
2. Check publishable key is correct
3. Confirm secret key has proper permissions
4. Look for CORS errors in browser console

### Webhook events not received

**Problem**: Payments succeed but orders not created

**Solution**:
1. Check webhook URL is correct: `https://your-site.com/api/webhook/stripe`
2. Verify webhook secret matches
3. Check Stripe Dashboard → Webhooks → Events for errors
4. Look at Vercel Function logs for errors
5. Ensure `STRIPE_WEBHOOK_SECRET` is set in Vercel

### Admin login fails

**Problem**: Admin panel doesn't accept password

**Solution**:
1. Verify `ADMIN_SECRET` is set correctly
2. Check for extra spaces or newlines in password
3. Clear browser localStorage: `localStorage.clear()`
4. Try incognito/private browsing mode

## Security Best Practices

### ✅ DO:
- Use environment variables for all secrets
- Keep `.env.local` in `.gitignore`
- Use different passwords for different environments
- Rotate keys regularly (every 90 days)
- Use test keys during development
- Use Vercel's encryption for environment variables

### ❌ DON'T:
- Commit `.env` files to repository
- Share keys in chat, email, or tickets
- Use production keys in development
- Reuse passwords across projects
- Store keys in code comments
- Use weak or default passwords

## Getting Help

If you're still having issues:

1. **Check the logs**:
   - Local: Terminal output
   - Vercel: Dashboard → Functions → Logs

2. **Review documentation**:
   - [Supabase Docs](https://supabase.com/docs)
   - [Stripe Docs](https://stripe.com/docs)
   - [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

3. **Common resources**:
   - [SETUP.md](./SETUP.md) - Complete setup guide
   - [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) - Pre-launch checklist
   - [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) - Deployment guide

---

**Remember**: Never commit secrets to your repository! 🔒


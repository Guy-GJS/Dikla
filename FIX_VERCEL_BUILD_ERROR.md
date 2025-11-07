# 🔧 Fix Vercel Build Error: "supabaseUrl is required"

## The Problem

Your Vercel build is failing because **environment variables are not set**.

Error: `supabaseUrl is required`

This happens when deploying without configuring the required environment variables in Vercel.

---

## ✅ Solution: Add Environment Variables

### Step-by-Step Fix

#### 1. Go to Vercel Settings

1. Visit [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click on your **Dikla** project
3. Click **Settings** (top navigation bar)
4. Click **Environment Variables** (left sidebar)

#### 2. Add Each Variable

For each variable below, click **"Add New"** and enter:

**Variable 1: NEXT_PUBLIC_SUPABASE_URL**
- Name: `NEXT_PUBLIC_SUPABASE_URL`
- Value: `https://your-project-id.supabase.co`
- Environment: ✅ Production (and Preview if you want)
- Click **Save**

**Where to find:** 
- Go to [Supabase Dashboard](https://app.supabase.com)
- Select your project
- Settings → API → Project URL

---

**Variable 2: NEXT_PUBLIC_SUPABASE_ANON_KEY**
- Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (long string)
- Environment: ✅ Production
- Click **Save**

**Where to find:**
- Same Supabase page
- Settings → API → Project API keys → `anon` `public`

---

**Variable 3: SUPABASE_SERVICE_ROLE_KEY**
- Name: `SUPABASE_SERVICE_ROLE_KEY`
- Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (different long string)
- Environment: ✅ Production
- Click **Save**

**Where to find:**
- Same Supabase page
- Settings → API → Project API keys → `service_role` (click reveal)
- ⚠️ **Keep this secret!**

---

**Variable 4: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY**
- Name: `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- Value: `pk_test_...` or `pk_live_...`
- Environment: ✅ Production
- Click **Save**

**Where to find:**
- Go to [Stripe Dashboard](https://dashboard.stripe.com)
- Developers → API keys → Publishable key
- Use test key for now: `pk_test_...`

---

**Variable 5: STRIPE_SECRET_KEY**
- Name: `STRIPE_SECRET_KEY`
- Value: `sk_test_...` or `sk_live_...`
- Environment: ✅ Production
- Click **Save**

**Where to find:**
- Same Stripe page
- Developers → API keys → Secret key
- Use test key for now: `sk_test_...`
- ⚠️ **Keep this secret!**

---

**Variable 6: STRIPE_WEBHOOK_SECRET**
- Name: `STRIPE_WEBHOOK_SECRET`
- Value: `whsec_placeholder` (for now, we'll update after first deploy)
- Environment: ✅ Production
- Click **Save**

**Note:** Use `whsec_placeholder` for now. You'll get the real value after configuring the webhook (Step 4 below).

---

**Variable 7: ADMIN_SECRET**
- Name: `ADMIN_SECRET`
- Value: Choose a strong password (e.g., `MySecureAdminPassword123!`)
- Environment: ✅ Production
- Click **Save**

**Note:** This is the password for your admin panel. Choose something secure!

---

**Variable 8: NEXT_PUBLIC_SITE_URL**
- Name: `NEXT_PUBLIC_SITE_URL`
- Value: Your Vercel URL (e.g., `https://dikla-xyz.vercel.app`)
- Environment: ✅ Production
- Click **Save**

**Where to find:**
- Go back to Vercel Dashboard → Deployments
- Copy the deployment URL (even if it failed)
- Or wait until after successful deployment and update this

---

#### 3. Redeploy

After adding all 8 variables:

1. Go to **Deployments** tab
2. Find the latest deployment
3. Click the **three dots (...)** on the right
4. Click **Redeploy**
5. Wait 2-3 minutes

**The build should now succeed! ✅**

---

#### 4. Configure Stripe Webhook (After Successful Deploy)

Once your site is live:

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Developers → Webhooks**
3. Click **"Add endpoint"**
4. Enter webhook URL: `https://your-project.vercel.app/api/webhook/stripe`
5. Select events:
   - ✅ `checkout.session.completed`
   - ✅ `checkout.session.expired`
6. Click **"Add endpoint"**
7. Copy the **Signing secret** (starts with `whsec_`)
8. Go back to Vercel → Settings → Environment Variables
9. Find `STRIPE_WEBHOOK_SECRET` and click **Edit**
10. Replace `whsec_placeholder` with the real secret
11. Click **Save**
12. Redeploy one more time

---

## 🧪 Verify It's Fixed

After redeployment succeeds:

- [ ] Build completes without errors
- [ ] Visit your site URL - homepage loads
- [ ] Visit `/admin` - admin panel accessible
- [ ] No "supabaseUrl is required" errors

---

## ❓ Still Having Issues?

### Build Still Fails

**Check:**
1. All 8 variables are added in Vercel
2. Variable names are **exact** (case-sensitive)
3. No extra spaces in values
4. Values are from correct Supabase project

**Debug:**
- Check Vercel build logs for which variable is missing
- Verify in Vercel Settings → Environment Variables that all show up

### Supabase Connection Issues

**Error:** "Invalid API key" or similar

**Fix:**
1. Double-check you copied the correct keys from Supabase
2. Make sure Supabase URL has `https://` and `.supabase.co`
3. Ensure anon key and service role key are different
4. Verify Supabase project is not paused

### Stripe Issues

**Error:** Stripe initialization fails

**Fix:**
1. Verify both Stripe keys are from same mode (test or live)
2. Check keys don't have extra spaces
3. Webhook secret can be placeholder for initial deploy

---

## 📋 Quick Checklist

Before redeploying, verify:

- [ ] All 8 environment variables added to Vercel
- [ ] Variable names spelled correctly (copy from above)
- [ ] Supabase URL starts with `https://`
- [ ] Stripe keys match mode (both test or both live)
- [ ] ADMIN_SECRET is strong and unique
- [ ] NEXT_PUBLIC_SITE_URL is your Vercel URL

---

## 🎯 Summary

**The issue:** Environment variables not configured in Vercel

**The fix:** Add all 8 required variables in Vercel Settings → Environment Variables

**Time needed:** 5-10 minutes

**After fix:** Build will succeed and site will be live!

---

## 📚 Related Guides

- [env-setup-guide.md](./env-setup-guide.md) - Detailed environment variable guide
- [DEPLOY.md](./DEPLOY.md) - Complete deployment guide
- [QUICK_DEPLOY_REFERENCE.md](./QUICK_DEPLOY_REFERENCE.md) - Quick reference

---

**Need help finding your keys?** See [env-setup-guide.md](./env-setup-guide.md) for screenshots and detailed instructions.

Good luck! 🚀


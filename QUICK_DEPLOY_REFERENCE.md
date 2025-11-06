# ⚡ Quick Deploy Reference Card

Print this or keep it handy during deployment!

---

## 📋 Pre-Deployment Checklist

- [ ] Git repository initialized and code committed
- [ ] Pushed to GitHub/GitLab/Bitbucket
- [ ] Supabase project created + migrations run
- [ ] Stripe account created (test or live keys ready)
- [ ] Vercel account created

---

## 🔑 Required Environment Variables

Copy this list to verify you have all 8 variables:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
ADMIN_SECRET=
NEXT_PUBLIC_SITE_URL=
```

### Where to Get Each Variable

| Variable | Source | Location |
|----------|--------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase | Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase | Settings → API → anon public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase | Settings → API → service_role key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe | Developers → API keys → Publishable |
| `STRIPE_SECRET_KEY` | Stripe | Developers → API keys → Secret |
| `STRIPE_WEBHOOK_SECRET` | Stripe | Developers → Webhooks → Signing secret |
| `ADMIN_SECRET` | You choose | Create a strong password |
| `NEXT_PUBLIC_SITE_URL` | Vercel | Your deployed URL |

---

## 🚀 Deployment Steps

### 1. Connect to Vercel (2 min)
1. Go to vercel.com → Sign in
2. Click "Add New Project"
3. Import your Git repository
4. Vercel auto-detects Next.js ✓

### 2. Add Environment Variables (5 min)
1. In Vercel project → Settings → Environment Variables
2. Add all 8 variables (copy from above)
3. For initial deploy, use `whsec_placeholder` for webhook secret
4. Check ✅ Production (and Preview if desired)

### 3. First Deploy (2 min)
1. Click "Deploy"
2. Wait ~2 minutes
3. Note your deployment URL: `https://[project].vercel.app`

### 4. Configure Stripe Webhook (3 min)
1. Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. URL: `https://[your-project].vercel.app/api/webhook/stripe`
4. Events: Select these two:
   - ✅ `checkout.session.completed`
   - ✅ `checkout.session.expired`
5. Save → Copy "Signing secret"
6. Vercel → Settings → Environment Variables
7. Update `STRIPE_WEBHOOK_SECRET` with real value
8. Deployments → ... → Redeploy

---

## ✅ Verification Checklist

Quick tests to run after deployment:

- [ ] Homepage loads: `https://[your-project].vercel.app`
- [ ] Visit `/sell` - Form accessible
- [ ] Visit `/buy` - Page loads
- [ ] Visit `/admin` - Login with ADMIN_SECRET works
- [ ] Images display correctly
- [ ] Mobile view works (check on phone)
- [ ] Test payment: Use card `4242 4242 4242 4242`
- [ ] Payment completes and redirects to success page
- [ ] Order appears in admin panel

---

## 🧪 Test Card Numbers (Stripe Test Mode)

| Card Number | Purpose |
|-------------|---------|
| `4242 4242 4242 4242` | Successful payment |
| `4000 0000 0000 0002` | Declined card |
| `4000 0000 0000 9995` | Failed payment |

Any future date for expiry, any 3 digits for CVC.

---

## 🆘 Common Issues & Fixes

| Issue | Quick Fix |
|-------|-----------|
| Build fails | Check all env vars are set in Vercel |
| Images don't load | Verify Supabase bucket is public |
| Payment fails | Check Stripe keys match (test/live) |
| Admin won't login | Verify ADMIN_SECRET is correct |
| Webhook fails | Check webhook secret is updated |

---

## 📱 Important URLs to Bookmark

After deployment, save these:

- **Your Site**: `https://[your-project].vercel.app`
- **Admin**: `https://[your-project].vercel.app/admin`
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Supabase Dashboard**: https://app.supabase.com
- **Stripe Dashboard**: https://dashboard.stripe.com

---

## 🔄 Continuous Deployment

After initial setup:

- **Push to main branch** → Auto-deploys to production
- **Push to other branches** → Creates preview deployments
- **Pull requests** → Automatic preview URLs

No manual deployment needed after initial setup!

---

## 💡 Pro Tips

1. **Before first deploy**: Run `npm run check-env` locally
2. **Use test keys initially**: Switch to live later
3. **Enable Vercel Analytics**: Already integrated, just enable in dashboard
4. **Monitor logs**: Vercel Dashboard → Functions → Logs
5. **Check webhooks**: Stripe Dashboard → Webhooks → Events

---

## 📞 Need Help?

Quick links to documentation:

- **Quick Start**: [DEPLOY.md](./DEPLOY.md)
- **Full Guide**: [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)
- **Environment Setup**: [env-setup-guide.md](./env-setup-guide.md)
- **Testing**: [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)

---

## ⏱️ Time Estimates

| Task | Time |
|------|------|
| Connect to Vercel | 2 min |
| Add env variables | 5 min |
| First deployment | 2 min |
| Configure webhook | 3 min |
| Testing | 5 min |
| **Total** | **~15 min** |

---

## 🎯 Success Indicators

You've succeeded when:
- ✅ Site is live and accessible
- ✅ All pages load without errors
- ✅ Admin panel works
- ✅ Can create and approve items
- ✅ Payment flow completes
- ✅ Webhooks receive events

---

**Good luck with your deployment!** 🚀

---

*Keep this reference handy - you might need it for troubleshooting!*


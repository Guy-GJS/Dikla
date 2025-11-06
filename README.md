# 🛍️ Pritti (פריטי) - Second-Hand Marketplace

<div dir="rtl">

**פריטי** - הפלטפורמה המובילה למכירה ורכישה של מוצרי יד שנייה בישראל

</div>

A production-ready MVP marketplace for buying and selling second-hand items, built with modern web technologies and optimized for the Israeli market.

![Next.js](https://img.shields.io/badge/Next.js-14-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green) ![Stripe](https://img.shields.io/badge/Stripe-Payments-purple)

## ✨ Features

### 🏠 For Everyone
- **Hebrew RTL Interface** - Native right-to-left design
- **Mobile-First** - Responsive on all devices
- **Fast & Modern** - Built with Next.js 14 App Router
- **Accessible** - WCAG compliant with keyboard navigation

### 🛒 For Buyers
- **Smart Search** - Filter by keyword, category, and location
- **Transparent Pricing** - See total price including all fees
- **Two Purchase Options**:
  - 🚚 **Delivery** - Secure payment with Stripe
  - 🏪 **Pickup** - Direct WhatsApp coordination with seller
- **Lead Capture** - Request items not currently available

### 💼 For Sellers
- **Easy Listing** - Simple form with image upload (up to 8 images)
- **Quick Approval** - Admin review and approval workflow
- **Direct Contact** - Buyers reach you via WhatsApp for pickups
- **Fair Pricing** - Only 8% commission (minimum ₪5)

### 👨‍💼 For Admins
- **Moderation Panel** - Approve/reject/feature items
- **Lead Management** - Track buyer requests
- **Order Tracking** - Monitor all transactions
- **Simple Authentication** - Secure password-based access

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env
# Fill in your Supabase and Stripe credentials

# 3. Run database migration
# (See SETUP.md for detailed instructions)

# 4. Start development server
npm run dev
```

**→ Full setup guide**: See [QUICKSTART.md](./QUICKSTART.md) for 5-minute setup

## 📚 Documentation

- **[QUICKSTART.md](./QUICKSTART.md)** - Get running in 5 minutes
- **[SETUP.md](./SETUP.md)** - Complete setup instructions
- **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** - Pre-launch checklist
- **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - Technical deep dive

## 🏗️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS (RTL configured) |
| **Database** | Supabase (PostgreSQL) |
| **Storage** | Supabase Storage |
| **Authentication** | Password-based (Auth0 ready) |
| **Payments** | Stripe Checkout + Webhooks |
| **Deployment** | Vercel |
| **Analytics** | Vercel Analytics |

## 📁 Project Structure

```
Dikla/
├── app/                 # Next.js pages & API routes
│   ├── page.tsx        # Home page
│   ├── sell/           # Seller flow
│   ├── buy/            # Buyer search
│   ├── category/       # Category pages
│   ├── item/           # Product details
│   ├── admin/          # Admin panel
│   └── api/            # Stripe integration
├── components/          # Shared UI components
├── lib/                # Utilities & types
├── supabase/           # Database migrations
└── public/             # Static assets
```

## 🎨 Screenshots

### Home Page
<div dir="rtl">
Split hero with buyer/seller CTAs, 8 category tiles, and info sections.
</div>

### Seller Form
Upload images, add details, and submit for approval.

### Product Detail
Image slider, price breakdown, and purchase options.

### Admin Panel
Manage items, view leads, track orders.

## 💰 Pricing Model

```
Pritti Fee = MAX(₪5, item_price × 8%)
Final Price = item_price + pritti_fee
With Delivery = final_price + ₪35 (shipping)
```

## 🔐 Security

- ✅ Row Level Security (RLS) on all database tables
- ✅ Stripe webhook signature verification
- ✅ Admin panel password protection
- ✅ Service role key only server-side
- ✅ HTTPS enforced (Vercel)
- ✅ No API keys exposed to client

## 📊 Database Schema

### Tables
- **profiles** - User profiles
- **categories** - Product categories (8 seeded)
- **items** - Listed products with approval workflow
- **orders** - Purchase transactions
- **wanted_item_leads** - Buyer requests for unavailable items
- **settings** - System configuration

All tables protected with Row Level Security.

## 🧪 Testing

Follow the comprehensive testing checklist in [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)

Key flows to test:
- ✅ Seller posts item with images
- ✅ Admin approves/rejects items
- ✅ Buyer searches and filters
- ✅ Purchase with delivery (Stripe)
- ✅ Purchase with pickup (WhatsApp)
- ✅ Lead capture for unavailable items

## 🚢 Deployment

### Quick Deploy (10 minutes)

This project is **Vercel-ready**! Just follow these steps:

```bash
# 1. Check your environment
npm run check-env

# 2. Push to GitHub
git init
git add .
git commit -m "Initial commit"
git push

# 3. Deploy on Vercel
# Connect GitHub repo → Add env vars → Deploy!
```

### 📖 Deployment Guides

- **[DEPLOY.md](./DEPLOY.md)** - ⚡ Quick start (10 min)
- **[VERCEL_READY.md](./VERCEL_READY.md)** - ✅ What's configured & ready
- **[VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)** - 📚 Complete guide
- **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** - 🧪 Testing checklist
- **[env-setup-guide.md](./env-setup-guide.md)** - 🔧 Environment variables

## 🔄 Roadmap

### ✅ MVP (Current)
- Home, Sell, Buy, Category, Product, Admin pages
- Image upload to Supabase Storage
- Stripe payment integration
- WhatsApp pickup coordination
- Lead capture
- Admin moderation

### 🎯 Phase 2
- User authentication (Auth0/Supabase Auth)
- User dashboards
- Messaging system
- Reviews & ratings
- Email notifications
- Advanced search (Algolia)

### 🚀 Phase 3
- Seller analytics
- Promoted listings
- Mobile app (React Native)
- Multi-language support
- API for third-party integrations

## 🤝 Contributing

This is a production MVP. For contributions:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is proprietary. All rights reserved.

## 💬 Support

For setup issues:
- Check [SETUP.md](./SETUP.md)
- Review [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)
- Search existing issues
- Contact: support@pritti.co.il

## 🙏 Acknowledgments

Built with these excellent tools:
- [Next.js](https://nextjs.org)
- [Supabase](https://supabase.com)
- [Stripe](https://stripe.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Vercel](https://vercel.com)

---

<div dir="rtl" align="center">

**בנוי באהבה לשוק היד השנייה הישראלי 🇮🇱**

</div>

<div align="center">

Made with ❤️ for the Israeli second-hand market

[Get Started](./QUICKSTART.md) · [Documentation](./SETUP.md) · [Deploy](./DEPLOYMENT_CHECKLIST.md)

</div>

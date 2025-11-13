# Pritti (פריטי) - Project Summary

## 🎯 Overview

**Pritti** is a production-ready MVP marketplace for buying and selling second-hand items in Israel. Built with modern web technologies, it provides a complete platform for sellers to list items, buyers to search and purchase, and admins to moderate content.

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS with RTL support
- **Database**: Supabase (PostgreSQL with Row Level Security)
- **Authentication**: Admin panel with password auth (Auth0 ready for future)
- **Storage**: Supabase Storage (public bucket for images)
- **Payments**: Stripe Checkout with webhook integration
- **Analytics**: Vercel Analytics
- **Deployment**: Vercel (optimized for Next.js)

### Key Design Decisions

1. **RTL-First**: Built for Hebrew with proper right-to-left layout
2. **Server Components**: Leveraging Next.js 14 App Router for optimal performance
3. **Row Level Security**: Database-level security with Supabase RLS
4. **Progressive Enhancement**: Core functionality works, enhanced with client features
5. **Mobile-First**: Responsive design that works on all devices

## 📁 Project Structure

```
Dikla/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                 # Home (hero split + categories)
│   ├── sell/page.tsx            # Seller form with image upload
│   ├── buy/page.tsx             # Buyer search with filters
│   ├── category/[slug]/page.tsx # Category listing pages
│   ├── item/[id]/page.tsx       # Product detail page
│   ├── admin/page.tsx           # Admin panel (CRUD)
│   ├── success/page.tsx         # Post-payment success
│   ├── api/
│   │   ├── checkout/route.ts    # Stripe Checkout creation
│   │   └── webhook/stripe/route.ts # Stripe webhook handler
│   ├── layout.tsx               # Root layout (RTL, Hebrew)
│   ├── globals.css              # Global styles + Tailwind
│   └── not-found.tsx            # 404 page
├── components/                   # Shared React components
│   ├── Header.tsx               # Navigation header
│   ├── Footer.tsx               # Site footer with links
│   ├── CategoryCard.tsx         # Category tile
│   ├── ProductCard.tsx          # Item card with pricing
│   ├── ImageSlider.tsx          # Accessible image carousel
│   ├── PriceBreakdown.tsx       # Price calculation display
│   ├── SearchBar.tsx            # Search/filter component
│   ├── EmptyState.tsx           # No results state
│   └── LeadCaptureModal.tsx     # Lead form for wanted items
├── lib/                         # Utilities and helpers
│   ├── supabase.ts             # Supabase client setup
│   ├── pricing.ts              # Pricing calculation logic
│   └── types.ts                # TypeScript interfaces
├── supabase/
│   ├── migrations/
│   │   └── 001_initial_schema.sql # Complete DB schema + RLS
│   └── README.md               # Supabase setup guide
├── public/                      # Static assets
│   └── placeholder.jpg         # Fallback image
├── package.json                # Dependencies
├── tailwind.config.ts          # Tailwind configuration
├── tsconfig.json               # TypeScript config
├── next.config.js              # Next.js config
├── .env.example                # Environment template
├── .gitignore                  # Git ignore rules
├── README.md                   # Project overview
├── SETUP.md                    # Detailed setup guide
├── DEPLOYMENT_CHECKLIST.md     # Pre-launch checklist
└── vercel.json                 # Vercel deployment config
```

## 🗃️ Database Schema

### Tables

1. **profiles** - User profiles (mirrors auth.users)
2. **categories** - Product categories (8 seeded)
3. **items** - Listed items with approval workflow
4. **orders** - Purchase records (delivery/pickup)
5. **wanted_item_leads** - Lead capture for unavailable items
6. **settings** - System configuration (fees, shipping)

### Key Features

- **Row Level Security (RLS)**: All tables protected
- **Cascade Deletes**: Proper foreign key handling
- **Indexes**: Optimized for common queries
- **Default Values**: Sensible defaults throughout
- **Constraints**: Data validation at DB level

## 💰 Business Logic

### Pricing Model

```
Pritti Fee = MAX(₪5, price_ask × 8%)
Final Price (excl. shipping) = price_ask + pritti_fee
Total (with delivery) = final_price + ₪35 (default shipping)
```

### Item Workflow

```
Seller posts → pending_approval → Admin approves → approved → Buyer purchases → sold
                                                   ↓
                                               rejected
```

### Purchase Flows

**Delivery**: Item → Fill details → Stripe Checkout → Webhook updates order → Success page

**Pickup**: Item → Fill details → WhatsApp link to seller → Order created

## 🎨 UI/UX Highlights

### Hebrew RTL Interface

- All text in Hebrew
- Proper right-to-left layout
- `dir="rtl"` on HTML element
- Tailwind configured for RTL

### Component Highlights

1. **Home Page**
   - Split hero with buyer/seller CTAs
   - 8 category tiles
   - "How it works" section
   - About section
   - Social links

2. **Seller Form**
   - Multi-image upload (up to 8)
   - Preview before upload
   - Condition selection
   - City/neighborhood for pickup
   - Contact details

3. **Buyer Search**
   - Rotating empowering texts
   - Keyword, category, city filters
   - Empty state with lead capture
   - Responsive grid layout

4. **Product Detail**
   - Image slider with thumbnails
   - Full price breakdown
   - Two CTA buttons (delivery/pickup)
   - Location info
   - Condition badge

5. **Admin Panel**
   - Simple password auth
   - Tabs: Items, Leads, Orders
   - Quick actions (approve, reject, feature)
   - Real-time status updates

## 🔐 Security

### Implemented

- ✅ Row Level Security on all tables
- ✅ Stripe webhook signature verification
- ✅ Admin password protection
- ✅ Service role key only server-side
- ✅ Public storage for images only
- ✅ HTTPS enforced (Vercel)

### Recommendations for Production

- Implement proper authentication (Auth0/Supabase Auth)
- Add rate limiting
- Implement CSRF protection
- Add request validation middleware
- Set up error tracking (Sentry)
- Regular security audits

## 📊 Analytics & Monitoring

### Built-in

- Vercel Analytics (page views, performance)
- Next.js production optimizations

### Recommended Additions

- Error tracking (Sentry, Rollbar)
- User behavior analytics (Mixpanel, Amplitude)
- Database monitoring (Supabase dashboard)
- Uptime monitoring (UptimeRobot, Pingdom)
- Real-time alerts for critical events

## 🚀 Performance

### Optimizations

- Server-side rendering with App Router
- Image optimization with Next.js Image
- Static generation for category pages
- Revalidation for data freshness
- Database indexes on common queries

### Metrics

- Lighthouse score target: > 80
- First Contentful Paint: < 2s
- Time to Interactive: < 3s
- Core Web Vitals: passing

## 🔄 Future Enhancements

### Phase 2 (Post-MVP)

1. **Authentication**
   - User registration/login
   - OAuth providers (Google, Facebook)
   - Email verification

2. **User Features**
   - Seller dashboard
   - Order history
   - Favorites/watchlist
   - Item reviews/ratings
   - Messaging between buyers/sellers

3. **Admin Features**
   - Analytics dashboard
   - User management
   - Bulk operations
   - Content moderation tools
   - Report handling

4. **Enhanced Functionality**
   - Advanced search (Algolia)
   - Email notifications
   - SMS notifications
   - Multiple images optimization
   - Shipping address collection
   - Multiple payment methods

5. **Business Features**
   - Seller fees configuration per category
   - Promoted listings
   - Featured items (paid)
   - Subscription plans
   - Affiliate program

## 📝 Environment Variables Reference

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=          # Project URL from Supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=     # Anon/public key
SUPABASE_SERVICE_ROLE_KEY=         # Service role (server-only)

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY= # Publishable key
STRIPE_SECRET_KEY=                  # Secret key
STRIPE_WEBHOOK_SECRET=              # Webhook signing secret

# Admin
ADMIN_SECRET=                       # Admin panel password

# Site
NEXT_PUBLIC_SITE_URL=              # Full site URL (for callbacks)
```

## 🧪 Testing Strategy

### Manual Testing

See `DEPLOYMENT_CHECKLIST.md` for comprehensive testing checklist.

### Future: Automated Testing

- Unit tests (Jest, React Testing Library)
- Integration tests (Playwright, Cypress)
- API tests (Supertest)
- E2E tests for critical flows
- Visual regression tests

## 📞 Support & Documentation

- **Setup Guide**: See `SETUP.md`
- **Deployment**: See `DEPLOYMENT_CHECKLIST.md`
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)
- **Stripe Docs**: [stripe.com/docs](https://stripe.com/docs)

## 🎉 Acceptance Criteria Status

✅ All Hebrew renders RTL, mobile-first, accessible
✅ Seller can post item with images → status pending
✅ Buyer search works; empty state captures lead to DB
✅ Category page shows approved items with final price (excl. shipping, incl. fee)
✅ Product page shows slider + price breakdown + CTAs
✅ Delivery → Stripe test; pickup → WhatsApp deep link
✅ Orders persist in database
✅ Admin can approve/reject/feature items; view leads; manage categories
✅ RLS policies enforce proper access control
✅ No secrets leak to client; Storage handled safely

## 🏁 Ready for Launch!

The Pritti MVP is feature-complete and ready for deployment. Follow the setup guide and deployment checklist to launch your second-hand marketplace.

**Good luck! 🚀**



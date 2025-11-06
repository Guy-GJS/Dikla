# Admin Panel Setup Guide

## What Was Fixed

Your admin panel was getting 500 errors because it was trying to query Supabase directly from the browser, which was blocked by Row Level Security (RLS) policies.

**The solution implements a secure, industry-standard architecture:**
- ✅ Protected API routes that validate admin credentials
- ✅ Server-side database access using service role key
- ✅ Client-side token-based authentication
- ✅ Multiple layers of security

## How It Works Now

```
Admin Panel → API Routes (with auth) → Supabase (with service role)
```

All admin operations now go through secure API endpoints:
- `GET /api/admin/items` - Fetch all items
- `GET /api/admin/leads` - Fetch all leads  
- `GET /api/admin/orders` - Fetch all orders
- `PATCH /api/admin/items` - Update item (status, featured, etc.)
- `DELETE /api/admin/items` - Delete item

## Environment Variables Required

Add these to your `.env.local` file:

```env
# Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Admin password (change in production!)
ADMIN_SECRET=admin123
```

**Important:** The `SUPABASE_SERVICE_ROLE_KEY` is critical - it allows the API routes to manage all data regardless of RLS policies.

## How to Use

1. **Login to Admin Panel**
   - Go to `/admin`
   - Enter password: `admin123` (or value from `ADMIN_SECRET`)
   - You'll see the admin dashboard

2. **View Your Uploaded Items**
   - All items (pending, approved, sold, rejected) will be visible
   - The "מוצרים" (Products) tab shows everything you uploaded as a seller

3. **Manage Items**
   - **Approve** pending items
   - **Reject** items that don't meet guidelines
   - **Mark as sold** when purchased
   - **Feature** items on homepage (★ button)
   - **Delete** items permanently

## Security Features

1. **Token-Based Authentication**
   - Admin password validated on login
   - Token stored in sessionStorage
   - Token sent with every API request

2. **Server-Side Validation**
   - Every API route validates the admin token
   - Unauthorized requests return 401
   - Logs unauthorized access attempts

3. **Protected Database Access**
   - Service role key never exposed to browser
   - Only API routes (server-side) use it
   - RLS still protects regular user operations

## Testing the Setup

1. **Start the dev server:**
```bash
npm run dev
```

2. **Login to admin panel:**
   - Navigate to `http://localhost:3000/admin`
   - Enter password: `admin123`

3. **You should see:**
   - מוצרים (Products) tab with all items
   - פניות (Leads) tab with wanted item requests
   - הזמנות (Orders) tab with all orders

4. **Your uploaded product should appear** in the Products tab

## Troubleshooting

### Still getting 500 errors?

1. **Check environment variables:**
```bash
# Make sure SUPABASE_SERVICE_ROLE_KEY is set
echo $SUPABASE_SERVICE_ROLE_KEY
```

2. **Check Supabase credentials:**
   - Log into Supabase dashboard
   - Go to Settings → API
   - Copy service_role key (NOT anon key)

3. **Check database migrations:**
```bash
# Make sure tables exist
# Check Supabase dashboard → SQL Editor
```

### Product not showing up?

Check the product status in the database:
- Products start as `pending_approval` by default
- Admin must approve them to show on the main site
- Admin panel shows ALL products regardless of status

### Cannot login to admin?

- Default password: `admin123`
- Or check your `ADMIN_SECRET` env variable
- Try clearing sessionStorage and refreshing

## Production Recommendations

Before going to production:

1. ✅ Change `ADMIN_SECRET` to a strong password
2. ✅ Never commit `.env.local` to git
3. ✅ Set all env variables in Vercel/hosting platform
4. ✅ Consider implementing JWT authentication
5. ✅ Add rate limiting to prevent brute force
6. ✅ Set up audit logging for admin actions
7. ✅ Use HTTPS only (Vercel does this by default)

## Architecture Details

For a detailed explanation of the security architecture, see:
- `SECURITY_ARCHITECTURE.md` - Comprehensive security documentation


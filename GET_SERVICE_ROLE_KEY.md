# 🚨 CRITICAL: Get Your Supabase Service Role Key

Your `.env.local` file has a placeholder for the service role key. **The admin panel won't work without the real key.**

## How to Get Your Service Role Key

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Login to your account

2. **Select Your Project**
   - Click on your project: `asgkwubsitvokaregnbp`

3. **Navigate to API Settings**
   - Click on ⚙️ **Settings** (bottom left)
   - Click on **API** in the settings menu

4. **Copy Service Role Key**
   - Scroll down to "Project API keys" section
   - Find **`service_role`** key (NOT the `anon` key)
   - Click **👁️ Reveal** to show the key
   - Click **📋 Copy** to copy it

5. **Update .env.local**
   - Open `/Users/guyschneider/code/Dikla/.env.local`
   - Replace this line:
     ```
     SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
     ```
   - With:
     ```
     SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your-actual-key-here
     ```

6. **Restart Dev Server**
   ```bash
   # Stop the server (Ctrl+C)
   # Then restart:
   npm run dev
   ```

## Why This Key is Required

The service role key allows the API routes to:
- ✅ Read ALL items (including pending ones)
- ✅ Update item status (approve/reject)
- ✅ Delete items
- ✅ Manage leads and orders
- ✅ Bypass Row Level Security (RLS) policies

**Without it, you'll get 500 errors** because the API routes can't access the database.

## Security Note

⚠️ **NEVER commit this key to git!**
- The `.env.local` file is already in `.gitignore`
- This key gives full database access
- Keep it secret and secure

## After Adding the Key

Once you've added the real service role key and restarted the server:

1. Go to: http://localhost:3000/admin
2. Login with password: `Dikla0209` (from your `ADMIN_SECRET`)
3. You should see all your products in the "מוצרים" tab!

## Still Having Issues?

If you still get 500 errors after adding the key:

1. **Check the key is correct:**
   ```bash
   cd /Users/guyschneider/code/Dikla
   grep SUPABASE_SERVICE_ROLE_KEY .env.local
   # Should show a long JWT token starting with eyJhbGc...
   ```

2. **Restart the dev server:**
   ```bash
   # Make sure to fully restart, not just refresh browser
   npm run dev
   ```

3. **Check browser console:**
   - Open DevTools (F12)
   - Look for the actual error message
   - Share it if still having issues


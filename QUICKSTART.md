# 🚀 Pritti - Quick Start (5 Minutes)

Get Pritti running locally in just a few minutes!

## Step 1: Install Dependencies (1 min)

```bash
npm install
```

## Step 2: Set Up Supabase (2 min)

1. Create a free account at [supabase.com](https://supabase.com)
2. Click **"New Project"**
3. Choose a name, password, and region
4. Wait 2 minutes for setup to complete
5. Go to **SQL Editor** → Click **"New Query"**
6. Copy ALL of `supabase/migrations/001_initial_schema.sql`
7. Paste and click **"Run"** ✓

### Create Image Storage

1. Go to **Storage** in left sidebar
2. Click **"Create bucket"**
3. Name it `item-images` and make it **Public** ✓
4. Go to **Policies** tab → Click **"New Policy"**
5. Choose **"Custom"** and paste:

```sql
CREATE POLICY "Anyone can upload" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'item-images');

CREATE POLICY "Anyone can view" ON storage.objects 
FOR SELECT USING (bucket_id = 'item-images');
```

## Step 3: Configure Environment (1 min)

Copy the example:
```bash
cp .env.example .env
```

Get your Supabase credentials:
- Go to **Project Settings** → **API**
- Copy **Project URL** → paste in `.env` as `NEXT_PUBLIC_SUPABASE_URL`
- Copy **anon public** key → paste as `NEXT_PUBLIC_SUPABASE_ANON_KEY`

For Stripe (optional for now, use test mode later):
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_yourkeyhere
STRIPE_SECRET_KEY=sk_test_yourkeyhere
```

Set an admin password:
```env
ADMIN_SECRET=your_secure_password
```

Set site URL:
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Step 4: Add Placeholder Images (30 sec)

Run this in Supabase SQL Editor:
```sql
UPDATE categories SET image_url = 'https://via.placeholder.com/400x400.png?text=' || name;
```

## Step 5: Run the App! (10 sec)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

## 🎯 Quick Test

1. **Visit Home**: See categories and hero section
2. **Post an Item**: `/sell` → Upload images → Submit
3. **Admin Panel**: `/admin` → Use your `ADMIN_SECRET` password → Approve the item
4. **View Item**: `/buy` → See your item → Click it
5. **Search**: Try the search bar with filters

## ✨ You're Ready!

Your marketplace is now running locally. 

**Next steps:**
- Add real images for categories
- Set up Stripe for payments (see `SETUP.md`)
- Deploy to Vercel (see `DEPLOYMENT_CHECKLIST.md`)

## 🆘 Issues?

### "npm install" fails
- Make sure Node.js 18+ is installed: `node --version`

### Supabase connection error
- Double-check your `.env` file has correct URL and key
- Make sure no extra spaces

### Images not uploading
- Verify storage bucket is **public**
- Check storage policies are created

### Admin login not working
- Clear browser storage (localStorage)
- Verify ADMIN_SECRET in `.env`

## 📚 Full Documentation

- **Complete Setup**: `SETUP.md`
- **Deployment**: `DEPLOYMENT_CHECKLIST.md`
- **Project Details**: `PROJECT_SUMMARY.md`

---

**Built with ❤️ for the Israeli second-hand market**

Happy coding! 🚀



# Supabase Setup

## Running Migrations

### Option 1: Using Supabase Dashboard (Recommended for MVP)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `migrations/001_initial_schema.sql`
4. Click **Run** to execute the migration

### Option 2: Using Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Push migrations
supabase db push
```

## Storage Setup

### Item Images Bucket

Create a public bucket for item images:

1. Go to **Storage** in Supabase dashboard
2. Create a new bucket named `item-images`
3. Make it **public**
4. Set up the following policies:

**Insert policy:**
```sql
CREATE POLICY "Anyone can upload images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'item-images');
```

**Select policy:**
```sql
CREATE POLICY "Anyone can view images"
ON storage.objects FOR SELECT
USING (bucket_id = 'item-images');
```

**Delete policy:**
```sql
CREATE POLICY "Admins can delete images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'item-images' 
  AND EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);
```

### Category Images Bucket

You can automatically create the category images bucket by running migration `003_category_images_storage.sql`:

1. Go to **SQL Editor** in Supabase dashboard
2. Copy and paste the contents of `migrations/003_category_images_storage.sql`
3. Click **Run** to execute the migration

Alternatively, manually create the bucket:

1. Go to **Storage** in Supabase dashboard
2. Create a new bucket named `category-images`
3. Make it **public**
4. Set max file size to 5MB
5. Allowed MIME types: `image/jpeg, image/jpg, image/png, image/gif, image/webp`

## Creating Your First Admin User

After signing up a user through the app, run this SQL in the SQL Editor:

```sql
-- Replace 'user@example.com' with your email
UPDATE profiles 
SET role = 'admin' 
WHERE id = (
  SELECT id FROM auth.users WHERE email = 'user@example.com'
);
```


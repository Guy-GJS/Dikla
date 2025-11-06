-- Fix infinite recursion in RLS policies
-- The issue: items policy checks profiles, but profiles policy also checks profiles

-- Drop the existing problematic policies
DROP POLICY IF EXISTS "Anyone can view approved items" ON items;
DROP POLICY IF EXISTS "Sellers can update their own pending items" ON items;
DROP POLICY IF EXISTS "Admins can delete items" ON items;

-- Recreate items policies WITHOUT the circular profile check
-- Use a simpler approach: just check status for public access
CREATE POLICY "Anyone can view approved items"
  ON items FOR SELECT
  USING (status = 'approved');

-- Allow sellers to update their own items (simplified)
CREATE POLICY "Sellers can update their own pending items"
  ON items FOR UPDATE
  USING (auth.uid() = seller_id AND status = 'pending_approval');

-- For admin operations, we'll use the service role key (supabaseAdmin)
-- So we don't need an RLS policy that creates recursion

-- Optional: If you want to allow authenticated users to see their own pending items
CREATE POLICY "Sellers can view their own items"
  ON items FOR SELECT
  USING (auth.uid() = seller_id);


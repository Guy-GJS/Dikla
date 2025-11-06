-- Secure orders table RLS policies
-- Now that we create orders via API endpoint using admin client,
-- we should restrict direct client inserts for better security

-- Drop the overly permissive insert policy
DROP POLICY IF EXISTS "Users can insert orders" ON orders;

-- Create a more restrictive insert policy that only allows admin operations
-- Regular users should go through the /api/orders endpoint which uses supabaseAdmin
CREATE POLICY "Only admins can insert orders directly"
  ON orders FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- The SELECT policy remains unchanged - users can view their own orders by email
-- or admins can view all orders


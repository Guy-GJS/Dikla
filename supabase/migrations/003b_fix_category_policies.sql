-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Public read access for category images" ON storage.objects;
DROP POLICY IF EXISTS "Admin upload access for category images" ON storage.objects;
DROP POLICY IF EXISTS "Admin update access for category images" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete access for category images" ON storage.objects;

-- Create new public policies (admin authentication is handled at app level)
CREATE POLICY "Anyone can view category images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'category-images');

CREATE POLICY "Anyone can upload category images"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'category-images');

CREATE POLICY "Anyone can update category images"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'category-images');

CREATE POLICY "Anyone can delete category images"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'category-images');


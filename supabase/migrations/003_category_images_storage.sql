-- Create storage bucket for category images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'category-images',
  'category-images',
  true,
  5242880, -- 5MB in bytes
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for category-images bucket
-- Allow public read access
CREATE POLICY "Anyone can view category images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'category-images');

-- Allow anyone to upload (admin authentication handled at app level)
CREATE POLICY "Anyone can upload category images"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'category-images');

-- Allow anyone to update
CREATE POLICY "Anyone can update category images"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'category-images');

-- Allow anyone to delete
CREATE POLICY "Anyone can delete category images"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'category-images');


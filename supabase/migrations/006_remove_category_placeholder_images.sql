-- Remove placeholder image URLs from categories
-- These will be added by users through the admin panel later
UPDATE categories 
SET image_url = NULL 
WHERE image_url LIKE '/images/categories/%';


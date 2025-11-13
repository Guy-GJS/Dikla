-- Add subcategories field to categories table
-- Subcategories will be stored as a text array

ALTER TABLE categories 
ADD COLUMN subcategories TEXT[] DEFAULT '{}';

-- Add a comment explaining the field
COMMENT ON COLUMN categories.subcategories IS 'Array of subcategory names for this category';

-- Update existing categories to have an empty array (in case of NULL values)
UPDATE categories SET subcategories = '{}' WHERE subcategories IS NULL;

-- Add subcategory field to items table
-- This allows items to be classified into subcategories
ALTER TABLE items
ADD COLUMN subcategory TEXT;

-- Add a comment explaining the field
COMMENT ON COLUMN items.subcategory IS 'Optional subcategory classification for this item';


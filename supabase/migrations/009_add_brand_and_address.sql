-- Add brand and address columns to items table
ALTER TABLE items 
ADD COLUMN brand TEXT,
ADD COLUMN address TEXT;

# Subcategories Feature Guide

This guide explains the new subcategories feature that has been added to all categories.

## What's New

- **Categories now support subcategories**: Each category can have multiple subcategories (e.g., "רהיטים" can have "ספות", "כסאות", "שולחנות")
- **Admin management**: Admins can add, edit, and delete subcategories through the admin panel
- **Frontend filtering**: Category pages now show subcategory filters allowing users to filter items by subcategory
- **Item classification**: Items can now be assigned to a specific subcategory when selling

## Database Migration

A new migration file has been created at `supabase/migrations/005_add_subcategories.sql`.

### To apply the migration:

1. **If using Supabase CLI:**
   ```bash
   supabase db push
   ```

2. **If using Supabase Dashboard:**
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Copy and paste the contents of `supabase/migrations/005_add_subcategories.sql`
   - Run the SQL

## How to Use

### Admin Panel

1. Go to the Admin Panel (usually `/admin`)
2. Navigate to the "קטגוריות" (Categories) tab
3. Click "הוסף קטגוריה" to create a new category or "ערוך" to edit an existing one
4. In the category form, you'll see a "תתי קטגוריות" section
5. Type a subcategory name and click "הוסף" or press Enter
6. Subcategories appear as blue badges that can be removed by clicking the × button
7. Save the category

### Selling Items

1. When creating or editing an item in the sell form
2. After selecting a category, if that category has subcategories, a subcategory dropdown will appear
3. Select a subcategory (optional)
4. Continue with the rest of the form as usual

### Frontend (Category Pages)

1. Visit any category page (e.g., `/category/furniture`)
2. If the category has subcategories, you'll see filter buttons below the category name
3. Click on a subcategory to filter items
4. Click "הכל" to show all items in the category

## Technical Details

### Database Changes

- Added `subcategories` column to `categories` table (TEXT[] type)
- Added `subcategory` column to `items` table (TEXT type)

### API Changes

- `POST /api/admin/categories` - Now accepts `subcategories` array
- `PATCH /api/admin/categories` - Now accepts `subcategories` array in updates

### Type Updates

```typescript
interface Category {
  // ... existing fields
  subcategories?: string[]
}

interface Item {
  // ... existing fields
  subcategory: string | null
}
```

## Examples

### Setting up subcategories for "רהיטים" (Furniture):

In the admin panel, edit the "רהיטים" category and add these subcategories:
- ספות
- כסאות
- שולחנות
- מיטות
- ארונות
- מדפים

### Setting up subcategories for "אלקטרוניקה" (Electronics):

- טלפונים
- מחשבים
- טלוויזיות
- מצלמות
- אוזניות
- אביזרים

## Notes

- Subcategories are optional - categories can work without them
- Items can be created without selecting a subcategory
- Subcategories are free-text and not validated (you can add any text)
- Existing items will have `subcategory = null` until edited

## Troubleshooting

If subcategories don't appear:
1. Make sure the migration has been applied
2. Clear your browser cache
3. Check that the category actually has subcategories defined in the admin panel
4. Verify the admin API is returning subcategories in the category data


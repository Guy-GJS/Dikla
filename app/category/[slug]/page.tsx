import { notFound } from 'next/navigation'
import CategoryPageClient from '@/components/CategoryPageClient'
import { supabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

async function getCategoryBySlug(slug: string) {
  const { data, error } = await supabaseAdmin
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single()
  
  if (error) {
    console.error('Database error fetching category:', slug, error)
    throw new Error('Database error')
  }
  
  return data
}

async function getItemsByCategory(categoryId: string) {
  const { data, error } = await supabaseAdmin
    .from('items')
    .select('*, category:categories(*)')
    .eq('category_id', categoryId)
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Database error fetching items for category:', categoryId, error)
    throw new Error('Database error')
  }
  
  return data || []
}

export default async function CategoryPage({
  params,
}: {
  params: { slug: string }
}) {
  // Input validation: Reject oversized slugs to prevent DoS
  if (params.slug.length > 500) {
    console.warn('Rejected oversized slug:', params.slug.length)
    notFound()
  }
  
  // Decode the slug from URL encoding (e.g., "Baby%20%26%20Kids%20Gear" → "Baby & Kids Gear")
  // Next.js App Router does not automatically decode dynamic route parameters
  let decodedSlug: string
  try {
    decodedSlug = decodeURIComponent(params.slug)
  } catch (e) {
    // Malformed URL encoding - log and treat as 404
    console.error('Failed to decode category slug:', params.slug, e)
    notFound()
  }
  
  // Normalize slug: trim whitespace
  // Note: Not using toLowerCase() to preserve existing database slug formats
  decodedSlug = decodedSlug.trim()
  
  // Security: Reject path traversal attempts
  if (decodedSlug.includes('/') || decodedSlug.includes('..')) {
    console.warn('Rejected path traversal attempt:', decodedSlug)
    notFound()
  }
  
  // Reject empty slugs
  if (!decodedSlug) {
    notFound()
  }
  
  // Fetch category and items with proper error handling
  let category
  let items
  
  try {
    category = await getCategoryBySlug(decodedSlug)
    
    if (!category) {
      notFound()
    }
    
    items = await getItemsByCategory(category.id)
  } catch (e) {
    console.error('Error loading category page:', decodedSlug, e)
    // Re-throw to let Next.js handle as 500 error
    throw e
  }

  return <CategoryPageClient category={category} items={items} />
}

// Generate static params for all categories
export async function generateStaticParams() {
  const { data: categories } = await supabaseAdmin
    .from('categories')
    .select('slug')

  // Return URL-encoded slugs for static generation
  // This ensures Next.js generates paths that match the encoded URLs from CategoryCard
  return (categories || []).map((category) => ({
    slug: encodeURIComponent(category.slug),
  }))
}


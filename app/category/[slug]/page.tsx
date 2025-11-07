import { notFound } from 'next/navigation'
import CategoryPageClient from '@/components/CategoryPageClient'
import { supabase } from '@/lib/supabase'

// Reduce revalidation time to pick up changes faster
export const revalidate = 10

async function getCategoryBySlug(slug: string) {
  const { data } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single()
  
  return data
}

async function getItemsByCategory(categoryId: string) {
  const { data } = await supabase
    .from('items')
    .select('*, category:categories(*)')
    .eq('category_id', categoryId)
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
  
  return data || []
}

export default async function CategoryPage({
  params,
}: {
  params: { slug: string }
}) {
  const category = await getCategoryBySlug(params.slug)
  
  if (!category) {
    notFound()
  }

  const items = await getItemsByCategory(category.id)

  return <CategoryPageClient category={category} items={items} />
}

// Generate static params for all categories
export async function generateStaticParams() {
  const { data: categories } = await supabase
    .from('categories')
    .select('slug')

  return (categories || []).map((category) => ({
    slug: category.slug,
  }))
}


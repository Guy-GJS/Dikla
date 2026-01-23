import { notFound } from 'next/navigation'
import CategoryPageClient from '@/components/CategoryPageClient'
import { supabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

async function getCategoryBySlug(slug: string) {
  const { data } = await supabaseAdmin
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single()
  
  return data
}

async function getItemsByCategory(categoryId: string) {
  const { data } = await supabaseAdmin
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
  const { data: categories } = await supabaseAdmin
    .from('categories')
    .select('slug')

  return (categories || []).map((category) => ({
    slug: category.slug,
  }))
}


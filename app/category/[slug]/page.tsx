import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import EmptyState from '@/components/EmptyState'
import LeadCaptureModal from '@/components/LeadCaptureModal'
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          {/* Category Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{category.name}</h1>
            <p className="text-gray-600">
              {items.length} {items.length === 1 ? 'מוצר' : 'מוצרים'}
            </p>
          </div>

          {/* Items Grid */}
          {items.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item) => (
                <ProductCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="אין עדיין מוצרים בקטגוריה זו"
              message="אין כרגע מוצרים זמינים בקטגוריה זו, אבל נשמח לאתר עבורך מוצר ולעדכן ברגע שנמצא!"
            >
              <LeadCaptureModal categoryId={category.id} />
            </EmptyState>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
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


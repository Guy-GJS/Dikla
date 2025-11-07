import { Suspense } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SearchBar from '@/components/SearchBar'
import ProductCard from '@/components/ProductCard'
import EmptyState from '@/components/EmptyState'
import LeadCaptureModal from '@/components/LeadCaptureModal'
import { supabase } from '@/lib/supabase'

// Reduce revalidation time to pick up changes faster
export const revalidate = 10

// Array of empowering texts
const EMPOWERING_TEXTS = [
  'בחירה ביד שנייה היא בחירה חכמה לכיס וגם לסביבה',
  'לבגדים יש חיים שניים - תנו להם את הסיכוי',
  'יד שנייה עושה הרגשה ראשונה',
]

async function getCategories() {
  const { data } = await supabase
    .from('categories')
    .select('id, name')
    .order('sort_order')
  
  return data || []
}

async function searchItems(searchParams: {
  keyword?: string
  category?: string
  city?: string
}) {
  let query = supabase
    .from('items')
    .select('*, category:categories(*)')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })

  if (searchParams.keyword) {
    query = query.or(`title.ilike.%${searchParams.keyword}%,description.ilike.%${searchParams.keyword}%`)
  }

  if (searchParams.category) {
    query = query.eq('category_id', searchParams.category)
  }

  if (searchParams.city) {
    query = query.ilike('city', `%${searchParams.city}%`)
  }

  const { data } = await query.limit(50)
  return data || []
}

async function BuyPageContent({
  searchParams,
}: {
  searchParams: { keyword?: string; category?: string; city?: string }
}) {
  const [categories, items] = await Promise.all([
    getCategories(),
    searchItems(searchParams),
  ])

  // Get random empowering text
  const randomText = EMPOWERING_TEXTS[Math.floor(Math.random() * EMPOWERING_TEXTS.length)]
  const hasSearchParams = searchParams.keyword || searchParams.category || searchParams.city

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8 sm:py-12">
        <div className="container mx-auto px-4">
          {/* Header with empowering text */}
          <div className="mb-6 sm:mb-8 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 px-4">מחפשים מוצר יד שנייה?</h1>
            <p className="text-base sm:text-lg text-blue-600 font-medium italic px-4">
              {randomText}
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-8 sm:mb-12">
            <SearchBar categories={categories} />
          </div>

          {/* Results */}
          {items.length > 0 ? (
            <div>
              <div className="mb-4 sm:mb-6 text-sm sm:text-base text-gray-600">
                נמצאו {items.length} מוצרים
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {items.map((item) => (
                  <ProductCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          ) : (
            <EmptyState
              title={hasSearchParams ? 'לא נמצאו תוצאות' : 'אין עדיין מוצרים'}
              message={
                hasSearchParams
                  ? 'אין כרגע מה שחיפשת, אבל נשמח לאתר עבורך את המוצר ולעדכן ברגע שנמצא!'
                  : 'בקרוב יתווספו מוצרים חדשים. בינתיים, השאר פרטים ונחזור אליך.'
              }
            >
              <LeadCaptureModal
                queryText={searchParams.keyword}
                categoryId={searchParams.category}
                city={searchParams.city}
              />
            </EmptyState>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function BuyPage({
  searchParams,
}: {
  searchParams: { keyword?: string; category?: string; city?: string }
}) {
  return (
    <Suspense fallback={<div>טוען...</div>}>
      <BuyPageContent searchParams={searchParams} />
    </Suspense>
  )
}


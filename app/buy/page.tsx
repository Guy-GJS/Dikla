import { Suspense } from 'react'
import { supabaseAdmin } from '@/lib/supabase'
import BuyPageClient from '@/components/BuyPageClient'

export const dynamic = 'force-dynamic'

// Array of empowering texts
const EMPOWERING_TEXTS = [
  'בחירה ביד שנייה היא בחירה חכמה לכיס וגם לסביבה',
  'לבגדים יש חיים שניים - תנו להם את הסיכוי',
  'יד שנייה עושה הרגשה ראשונה',
]

async function getCategories() {
  const { data } = await supabaseAdmin
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
  let query = supabaseAdmin
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
  const hasSearchParams = !!(searchParams.keyword || searchParams.category || searchParams.city)

  return (
    <BuyPageClient
      categories={categories}
      items={items}
      randomText={randomText}
      hasSearchParams={hasSearchParams}
      searchParams={searchParams}
    />
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


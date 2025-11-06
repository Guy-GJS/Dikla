import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CategoryCard from '@/components/CategoryCard'
import { supabase } from '@/lib/supabase'

export const revalidate = 60 // Revalidate every 60 seconds

async function getCategories() {
  // First get all categories
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order')
  
  if (!categories) return []

  // Then count approved items for each category
  const categoriesWithCounts = await Promise.all(
    categories.map(async (category) => {
      const { count } = await supabase
        .from('items')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', category.id)
        .eq('status', 'approved')
      
      return {
        ...category,
        item_count: count || 0
      }
    })
  )
  
  return categoriesWithCounts
}

export default async function HomePage() {
  const categories = await getCategories()

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section - Enhanced */}
        <section className="relative min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-400/30 to-indigo-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-purple-400/30 to-pink-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-400/30 to-blue-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
          </div>

          {/* Grid Pattern Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

          <div className="container mx-auto px-4 relative z-10 py-20">
            <div className="max-w-6xl mx-auto">
              {/* Hero Text */}
              <div className="text-center mb-16 space-y-6">
                <div className="inline-block">
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 text-sm font-medium mb-6 border border-blue-200/50">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    פלטפורמה בטוחה ואמינה
                  </span>
                </div>
                <h1 className="text-6xl md:text-8xl font-extrabold leading-tight">
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 mb-2">
                    קונים ומוכרים הכל
                  </span>
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600">
                    ובקלות
                  </span>
                </h1>
                <p className="text-2xl md:text-3xl text-gray-700 font-medium max-w-3xl mx-auto leading-relaxed">
                  מפנים את הארון למשהו טוב
                </p>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto mt-4">
                  הפלטפורמה החברתית למכירה וקנייה של מוצרי יד שנייה בישראל
                </p>
              </div>

              {/* CTA Cards - Glassmorphism Style */}
              <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                {/* Buyer CTA */}
                <Link
                  href="/buy"
                  className="group relative overflow-hidden rounded-3xl p-8 md:p-12 backdrop-blur-xl bg-white/70 border border-white/20 shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1"
                >
                  {/* Animated Gradient Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Shine Effect */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                  
                  <div className="relative z-10">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-xl shadow-blue-500/30">
                      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                      מחפש מוצר יד שנייה
                    </h2>
                    <p className="text-lg text-gray-600 leading-relaxed mb-6">
                      חפש ומצא מוצרים איכותיים במחירים הוגנים
                    </p>
                    <div className="flex items-center justify-center gap-2 text-blue-600 font-semibold group-hover:gap-4 transition-all">
                      <span>התחל לחפש</span>
                      <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Decorative Corner */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-transparent rounded-bl-full"></div>
                </Link>

                {/* Seller CTA */}
                <Link
                  href="/sell"
                  className="group relative overflow-hidden rounded-3xl p-8 md:p-12 backdrop-blur-xl bg-white/70 border border-white/20 shadow-2xl hover:shadow-green-500/20 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1"
                >
                  {/* Animated Gradient Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Shine Effect */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                  
                  <div className="relative z-10">
                    <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-xl shadow-green-500/30">
                      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 group-hover:text-green-600 transition-colors">
                      מוכר / מוסר מוצר שווה
                    </h2>
                    <p className="text-lg text-gray-600 leading-relaxed mb-6">
                      הפוך פריטים ישנים למזומן וצור מקום בבית
                    </p>
                    <div className="flex items-center justify-center gap-2 text-green-600 font-semibold group-hover:gap-4 transition-all">
                      <span>התחל למכור</span>
                      <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Decorative Corner */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/20 to-transparent rounded-bl-full"></div>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section - Enhanced */}
        <section className="py-24 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                קטגוריות פופולריות
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                גלה את המגוון הרחב של מוצרי יד שנייה שלנו
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section - Enhanced */}
        <section id="how-it-works" className="py-24 bg-gradient-to-b from-gray-50 via-white to-gray-50 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                איך זה עובד?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                תהליך פשוט ומהיר למכירה וקנייה
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="group relative text-center p-8 rounded-3xl bg-white/50 backdrop-blur-sm border border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg shadow-blue-500/20">
                    <span className="text-3xl font-bold text-white">1</span>
                  </div>
                  <h3 className="font-bold text-2xl mb-3 text-gray-900">פרסם את המוצר</h3>
                  <p className="text-gray-600 leading-relaxed">
                    העלה תמונות, תאר את המוצר ושים מחיר הוגן
                  </p>
                </div>
              </div>

              <div className="group relative text-center p-8 rounded-3xl bg-white/50 backdrop-blur-sm border border-gray-100 hover:border-purple-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg shadow-purple-500/20">
                    <span className="text-3xl font-bold text-white">2</span>
                  </div>
                  <h3 className="font-bold text-2xl mb-3 text-gray-900">נאשר ונפרסם</h3>
                  <p className="text-gray-600 leading-relaxed">
                    נבדוק את המודעה ונעלה אותה לאתר תוך זמן קצר
                  </p>
                </div>
              </div>

              <div className="group relative text-center p-8 rounded-3xl bg-white/50 backdrop-blur-sm border border-gray-100 hover:border-green-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg shadow-green-500/20">
                    <span className="text-3xl font-bold text-white">3</span>
                  </div>
                  <h3 className="font-bold text-2xl mb-3 text-gray-900">מכור והרווח</h3>
                  <p className="text-gray-600 leading-relaxed">
                    קבל פניות מקונים מעוניינים ובצע את העסקה
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section - Enhanced */}
        <section id="about" className="py-24 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  אודות פריטי
                </h2>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-10 md:p-16 border border-gray-100 shadow-xl">
                <p className="text-xl text-gray-700 mb-6 leading-relaxed">
                  פריטי היא הפלטפורמה המובילה למכירת ורכישת מוצרי יד שנייה בישראל.
                  אנחנו מאמינים שכל פריט יכול למצוא בית חדש, ושקנייה חכמה היא גם קנייה ירוקה.
                </p>
                <p className="text-xl text-gray-700 leading-relaxed">
                  המטרה שלנו היא ליצור שוק פשוט, בטוח ונוח שמחבר בין מוכרים לקונים,
                  ועוזר לכם למצוא בדיוק את מה שאתם צריכים במחיר הוגן.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Social Links - Enhanced */}
        <section className="py-16 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2 text-gray-900">עקבו אחרינו ברשתות החברתיות</h3>
              <p className="text-gray-600 mb-8">הישארו מעודכנים על מוצרים חדשים והצעות מיוחדות</p>
              <div className="flex justify-center gap-4">
                <a 
                  href="#" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group w-14 h-14 bg-white rounded-2xl flex items-center justify-center hover:bg-gradient-to-br hover:from-pink-500 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110 border border-gray-100"
                  aria-label="Instagram"
                >
                  <svg className="w-6 h-6 text-gray-700 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a 
                  href="#" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group w-14 h-14 bg-white rounded-2xl flex items-center justify-center hover:bg-gradient-to-br hover:from-blue-500 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110 border border-gray-100"
                  aria-label="Facebook"
                >
                  <svg className="w-6 h-6 text-gray-700 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}


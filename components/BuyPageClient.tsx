'use client'

import { useState } from 'react'
import Header from './Header'
import Footer from './Footer'
import SearchBar from './SearchBar'
import ProductCard from './ProductCard'
import EmptyState from './EmptyState'
import LeadCaptureModal from './LeadCaptureModal'

export default function BuyPageClient({
  categories,
  items,
  randomText,
  hasSearchParams,
  searchParams,
}: {
  categories: Array<{ id: string; name: string }>
  items: any[]
  randomText: string
  hasSearchParams: boolean
  searchParams: { keyword?: string; category?: string; city?: string }
}) {
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false)

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

              {/* CTA Button to open lead modal */}
              <div className="mt-12 text-center">
                <div className="border border-gray-200 bg-gray-50 rounded-lg p-6 sm:p-8 max-w-2xl mx-auto">
                  <h3 className="text-xl sm:text-2xl font-bold mb-3 text-gray-900">לא מצאת בדיוק את מה שחיפשת?</h3>
                  <p className="text-sm sm:text-base text-gray-700 mb-6">נשמח לעזור לך למצוא את המוצר המושלם</p>
                  <button
                    onClick={() => setIsLeadModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-md transition-colors text-base sm:text-lg"
                  >
                    אני מחפש משהו אחר
                  </button>
                </div>
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
              <button
                onClick={() => setIsLeadModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-md transition-colors text-base sm:text-lg"
              >
                אני מחפש משהו אחר
              </button>
            </EmptyState>
          )}
        </div>
      </main>

      {/* Lead Capture Modal */}
      <LeadCaptureModal
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
        queryText={searchParams.keyword}
        categoryId={searchParams.category}
        city={searchParams.city}
      />

      <Footer />
    </div>
  )
}


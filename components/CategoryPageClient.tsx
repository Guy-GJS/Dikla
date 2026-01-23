'use client'

import { useState, useMemo } from 'react'
import Header from './Header'
import Footer from './Footer'
import ProductCard from './ProductCard'
import EmptyState from './EmptyState'
import LeadCaptureModal from './LeadCaptureModal'

export default function CategoryPageClient({
  category,
  items,
}: {
  category: any
  items: any[]
}) {
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false)
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null)

  // Filter items by selected subcategory
  const filteredItems = useMemo(() => {
    if (!selectedSubcategory) return items
    return items.filter(item => item.subcategory === selectedSubcategory)
  }, [items, selectedSubcategory])

  // Check if category has subcategories
  const hasSubcategories = category.subcategories && category.subcategories.length > 0

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          {/* Category Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{category.name}</h1>
            <p className="text-gray-600">
              {filteredItems.length} {filteredItems.length === 1 ? 'מוצר' : 'מוצרים'}
            </p>
          </div>

          {/* Subcategory Filter */}
          {hasSubcategories && (
            <div className="mb-8">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedSubcategory(null)}
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    selectedSubcategory === null
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-400'
                  }`}
                >
                  הכל
                </button>
                {category.subcategories.map((subcat: string) => (
                  <button
                    key={subcat}
                    onClick={() => setSelectedSubcategory(subcat)}
                    className={`px-4 py-2 rounded-md font-medium transition-colors ${
                      selectedSubcategory === subcat
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-400'
                    }`}
                  >
                    {subcat}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Items Grid */}
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <ProductCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <EmptyState
              title={selectedSubcategory ? `אין מוצרים ב${selectedSubcategory}` : "אין עדיין מוצרים בקטגוריה זו"}
              message={selectedSubcategory ? "נסה לבחור תת-קטגוריה אחרת או צור קשר ואנחנו נחפש עבורך" : "אין כרגע מוצרים זמינים בקטגוריה זו, אבל נשמח לאתר עבורך מוצר ולעדכן ברגע שנמצא!"}
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
        categoryId={category.id}
      />

      <Footer />
    </div>
  )
}


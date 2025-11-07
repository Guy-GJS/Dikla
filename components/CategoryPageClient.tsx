'use client'

import { useState } from 'react'
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
              <button
                onClick={() => setIsLeadModalOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 active:from-blue-800 active:to-purple-800 text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl text-base sm:text-lg"
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


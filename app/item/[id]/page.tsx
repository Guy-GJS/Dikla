'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ImageSlider from '@/components/ImageSlider'
import PriceBreakdown from '@/components/PriceBreakdown'
import { supabase } from '@/lib/supabase'
import { Item } from '@/lib/types'
import { calculatePricing } from '@/lib/pricing'
import { useCommissionSettings } from '@/lib/useCommissionSettings'

export default function ItemPage() {
  const params = useParams()
  const router = useRouter()
  const { commissionSettings, defaultShipping, loading: settingsLoading } = useCommissionSettings()
  const [item, setItem] = useState<Item | null>(null)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('delivery')
  const [buyerData, setBuyerData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  })

  useEffect(() => {
    async function fetchItem() {
      const { data } = await supabase
        .from('items')
        .select('*, category:categories(*)')
        .eq('id', params.id as string)
        .eq('status', 'approved')
        .single()

      setItem(data)
      setLoading(false)
    }

    fetchItem()
  }, [params.id])

  const handleBuyClick = (type: 'delivery' | 'pickup') => {
    setOrderType(type)
    setShowModal(true)
  }

  const handleProceed = async () => {
    if (!item) return

    const pricing = calculatePricing(item.price_ask, orderType === 'delivery', defaultShipping, commissionSettings)

    // Create order via API endpoint
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        item_id: item.id,
        buyer_first_name: buyerData.firstName,
        buyer_last_name: buyerData.lastName,
        buyer_email: buyerData.email,
        buyer_phone: buyerData.phone,
        type: orderType,
        subtotal: item.price_ask,
        pritti_fee: pricing.prittiFee,
        shipping_fee: pricing.shippingFee,
        total: pricing.total,
      }),
    })

    if (!response.ok) {
      alert('אירעה שגיאה, נסה שוב')
      console.error('Order creation failed:', await response.text())
      return
    }

    const { order } = await response.json()

    if (orderType === 'delivery') {
      // Redirect to Stripe Checkout
      router.push(`/api/checkout?orderId=${order.id}`)
    } else {
      // Generate WhatsApp link to seller
      const message = encodeURIComponent(
        `שלום, אני מעוניין/ת לרכוש את "${item.title}" באיסוף עצמי. הזמנתי דרך פריטי.`
      )
      const whatsappUrl = `https://wa.me/972${item.seller_phone?.replace(/^0/, '')}?text=${message}`
      window.open(whatsappUrl, '_blank')
      
      // Show success message
      alert('פנייה נשלחה למוכר דרך WhatsApp! נא להמתין לאישור.')
      router.push('/')
    }
  }

  if (loading || settingsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>טוען...</p>
        </div>
      </div>
    )
  }

  if (!item) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">המוצר לא נמצא</h2>
            <button
              onClick={() => router.push('/buy')}
              className="text-blue-600 hover:underline"
            >
              חזרה לחיפוש
            </button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const pricing = calculatePricing(item.price_ask, true, defaultShipping, commissionSettings)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8 sm:py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
            {/* Image Slider */}
            <div>
              <ImageSlider images={item.image_urls} alt={item.title} />
            </div>

            {/* Product Details */}
            <div>
              <div className="mb-6">
                {item.category && (
                  <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded text-xs sm:text-sm font-medium mb-3">
                    {item.category.name}
                  </span>
                )}
                
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                  {item.title}
                </h1>

                {item.condition && (
                  <div className="mb-4">
                    <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded text-xs sm:text-sm">
                      מצב: {item.condition}
                    </span>
                  </div>
                )}

                {item.description && (
                  <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
                    {item.description}
                  </p>
                )}

                {/* Location */}
                {(item.city || item.neighborhood) && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-700">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>
                        איסוף מ{item.city ? `עיר ${item.city}` : ''}
                        {item.city && item.neighborhood ? ', ' : ''}
                        {item.neighborhood ? `שכונת ${item.neighborhood}` : ''}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <PriceBreakdown
                priceAsk={item.price_ask}
                prittiFee={pricing.prittiFee}
                shippingFee={pricing.shippingFee}
                showShipping={true}
              />

              {/* CTA Buttons */}
              <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4">
                <button
                  onClick={() => handleBuyClick('delivery')}
                  className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-3 sm:py-4 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-base sm:text-lg"
                >
                  לרכישה עד הבית
                </button>

                <button
                  onClick={() => handleBuyClick('pickup')}
                  className="w-full bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-semibold py-3 sm:py-4 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 text-base sm:text-lg"
                >
                  לרכישה באיסוף עצמי
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Buyer Info Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
          <div className="bg-white rounded-t-2xl sm:rounded-lg max-w-md w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">
              לתיאום אנחנו צריכים כמה פרטים שלך
            </h3>

            <form onSubmit={(e) => { e.preventDefault(); handleProceed(); }} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">שם פרטי</label>
                  <input
                    type="text"
                    required
                    value={buyerData.firstName}
                    onChange={(e) => setBuyerData({ ...buyerData, firstName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">שם משפחה</label>
                  <input
                    type="text"
                    required
                    value={buyerData.lastName}
                    onChange={(e) => setBuyerData({ ...buyerData, lastName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">אימייל</label>
                <input
                  type="email"
                  required
                  value={buyerData.email}
                  onChange={(e) => setBuyerData({ ...buyerData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">טלפון</label>
                <input
                  type="tel"
                  required
                  value={buyerData.phone}
                  onChange={(e) => setBuyerData({ ...buyerData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="05X-XXXXXXX"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 active:bg-gray-400 text-gray-800 font-semibold py-3 px-4 rounded-md transition-colors order-2 sm:order-1"
                >
                  ביטול
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-3 px-4 rounded-md transition-colors order-1 sm:order-2"
                >
                  המשך
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}


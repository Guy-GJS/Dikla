'use client'

import { useCommissionSettings } from '@/lib/useCommissionSettings'
import { calculatePricing, formatPrice } from '@/lib/pricing'
import { useEffect, useState } from 'react'

export default function TestCommissionPage() {
  const { commissionSettings, defaultShipping, loading } = useCommissionSettings()
  const [rawSettings, setRawSettings] = useState<any>(null)

  useEffect(() => {
    // Fetch settings directly to see what's in the database
    async function fetchDirectly() {
      const response = await fetch('/api/settings?t=' + Date.now())
      const data = await response.json()
      setRawSettings(data)
    }
    fetchDirectly()
  }, [])

  const testPrices = [50, 100, 500]

  if (loading) {
    return <div className="container mx-auto p-8">Loading...</div>
  }

  return (
    <div className="container mx-auto p-8 max-w-4xl" dir="rtl">
      <h1 className="text-3xl font-bold mb-8">בדיקת הגדרות עמלה</h1>

      {/* Current Settings Display */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">הגדרות נוכחיות</h2>
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-medium">מצב עמלה:</span>
              <span className="ml-2 bg-blue-100 px-3 py-1 rounded">
                {commissionSettings.mode === 'fixed' ? 'סכום קבוע' : 'אחוז'}
              </span>
            </div>
            <div>
              <span className="font-medium">אחוז:</span>
              <span className="ml-2 text-xl font-bold text-blue-600">
                {commissionSettings.percentage}%
              </span>
            </div>
            <div>
              <span className="font-medium">סכום קבוע:</span>
              <span className="ml-2">₪{commissionSettings.fixed_amount}</span>
            </div>
            <div>
              <span className="font-medium">מינימום:</span>
              <span className="ml-2 text-xl font-bold text-green-600">
                ₪{commissionSettings.min_amount}
              </span>
            </div>
            <div>
              <span className="font-medium">משלוח ברירת מחדל:</span>
              <span className="ml-2">₪{defaultShipping}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Raw API Response */}
      <div className="bg-gray-100 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">תגובה ישירה מה-API</h2>
        <pre className="text-xs overflow-auto bg-white p-4 rounded" dir="ltr">
          {JSON.stringify(rawSettings, null, 2)}
        </pre>
      </div>

      {/* Test Calculations */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">חישובי בדיקה</h2>
        <div className="space-y-4">
          {testPrices.map(price => {
            const pricing = calculatePricing(price, false, undefined, commissionSettings)
            return (
              <div key={price} className="border rounded-lg p-4 bg-gray-50">
                <h3 className="font-bold text-lg mb-2">מוצר במחיר ₪{price}</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>מחיר מבוקש:</div>
                  <div className="font-medium">{formatPrice(pricing.priceAsk)}</div>
                  
                  <div>עמלת פריטי:</div>
                  <div className="font-bold text-blue-600">{formatPrice(pricing.prittiFee)}</div>
                  
                  <div>סה"כ:</div>
                  <div className="font-bold text-green-600">{formatPrice(pricing.finalPriceExclShipping)}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Calculation Explanation */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mt-6">
        <h3 className="font-bold text-lg mb-2">הסבר חישוב:</h3>
        <div className="space-y-2 text-sm">
          {commissionSettings.mode === 'percentage' ? (
            <>
              <p>• מצב: <strong>אחוז</strong></p>
              <p>• עמלה = מקסימום(מינימום, מחיר × אחוז)</p>
              <p>• עמלה = מקסימום(₪{commissionSettings.min_amount}, מחיר × {commissionSettings.percentage}%)</p>
              <p className="mt-4 bg-yellow-100 p-3 rounded border border-yellow-300">
                <strong>שים לב:</strong> אם העמלה המחושבת נמוכה מהמינימום (₪{commissionSettings.min_amount}), 
                העמלה תהיה המינימום.
              </p>
            </>
          ) : (
            <>
              <p>• מצב: <strong>סכום קבוע</strong></p>
              <p>• עמלה = ₪{commissionSettings.fixed_amount}</p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}


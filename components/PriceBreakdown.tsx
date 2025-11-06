'use client'

import { formatPrice } from '@/lib/pricing'
import { useCommissionSettings } from '@/lib/useCommissionSettings'

interface PriceBreakdownProps {
  priceAsk: number
  prittiFee: number
  shippingFee?: number
  showShipping?: boolean
}

export default function PriceBreakdown({
  priceAsk,
  prittiFee,
  shippingFee = 35,
  showShipping = false,
}: PriceBreakdownProps) {
  const { commissionSettings } = useCommissionSettings()
  const finalPriceExclShipping = priceAsk + prittiFee
  const total = finalPriceExclShipping + (showShipping ? shippingFee : 0)

  // Generate commission explanation text
  const getCommissionExplanation = () => {
    const { mode, fixed_amount, percentage, min_amount } = commissionSettings
    
    switch (mode) {
      case 'fixed':
        return `* עמלת פריטי: סכום קבוע של ₪${fixed_amount.toFixed(2)} לכל מוצר`
      
      case 'percentage':
        return `* עמלת פריטי מחושבת ב-${percentage}% מהמחיר המבוקש (מינימום ₪${min_amount.toFixed(2)})`
      
      default:
        return `* עמלת פריטי מחושבת לפי מחיר המוצר`
    }
  }

  return (
    <div className="bg-gray-50 rounded-lg p-6 space-y-3">
      <h3 className="font-semibold text-lg mb-4">פירוט מחיר</h3>
      
      <div className="flex justify-between text-gray-700">
        <span>מחיר מבוקש:</span>
        <span className="font-medium">{formatPrice(priceAsk)}</span>
      </div>
      
      <div className="flex justify-between text-gray-700">
        <span>עמלת פריטי:</span>
        <span className="font-medium">{formatPrice(prittiFee)}</span>
      </div>
      
      <div className="border-t border-gray-300 pt-3 flex justify-between font-semibold">
        <span>מחיר כולל עמלה:</span>
        <span className="text-blue-600">{formatPrice(finalPriceExclShipping)}</span>
      </div>
      
      {showShipping && (
        <>
          <div className="flex justify-between text-gray-700 pt-2">
            <span>משלוח (אופציונלי):</span>
            <span className="font-medium">{formatPrice(shippingFee)}</span>
          </div>
          
          <div className="border-t border-gray-300 pt-3 flex justify-between font-bold text-lg">
            <span>סה"כ כולל משלוח:</span>
            <span className="text-blue-600">{formatPrice(total)}</span>
          </div>
        </>
      )}
      
      <div className="pt-3 text-xs text-gray-500">
        <p>{getCommissionExplanation()}</p>
      </div>
    </div>
  )
}


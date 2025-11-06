// Pricing utility functions
import { CommissionSettings } from './types'

export interface PriceBreakdown {
  priceAsk: number
  prittiFee: number
  shippingFee: number
  finalPriceExclShipping: number
  total: number
}

export function calculateCommission(
  priceAsk: number,
  commissionSettings: CommissionSettings
): number {
  const { mode, fixed_amount, percentage, min_amount } = commissionSettings

  switch (mode) {
    case 'fixed':
      return fixed_amount
    
    case 'percentage':
      return Math.max(min_amount, priceAsk * (percentage / 100))
    
    default:
      return Math.max(min_amount, priceAsk * (percentage / 100))
  }
}

export function calculatePricing(
  priceAsk: number,
  includeShipping: boolean = false,
  customShippingFee?: number,
  commissionSettings?: CommissionSettings
): PriceBreakdown {
  // Default commission settings (fallback to old behavior)
  const defaultCommissionSettings: CommissionSettings = {
    mode: 'percentage',
    fixed_amount: 5,
    percentage: 8,
    min_amount: 5
  }

  const settings = commissionSettings || defaultCommissionSettings
  const defaultShipping = customShippingFee ?? 35 // ₪35

  const prittiFee = calculateCommission(priceAsk, settings)
  const finalPriceExclShipping = priceAsk + prittiFee
  const shippingFee = includeShipping ? defaultShipping : 0
  const total = finalPriceExclShipping + shippingFee

  return {
    priceAsk,
    prittiFee,
    shippingFee,
    finalPriceExclShipping,
    total,
  }
}

export function formatPrice(amount: number): string {
  return `₪${amount.toFixed(2)}`
}


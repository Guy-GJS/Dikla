'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Item } from '@/lib/types'
import { calculatePricing, formatPrice } from '@/lib/pricing'
import { useCommissionSettings } from '@/lib/useCommissionSettings'

interface ProductCardProps {
  item: Item
}

export default function ProductCard({ item }: ProductCardProps) {
  const { commissionSettings } = useCommissionSettings()
  const pricing = calculatePricing(item.price_ask, false, undefined, commissionSettings)
  const mainImage = item.image_urls?.[0] || '/placeholder.jpg'

  return (
    <Link
      href={`/item/${item.id}`}
      className="group block bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300"
    >
      <div className="aspect-square relative bg-gray-50">
        <Image
          src={mainImage}
          alt={item.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          unoptimized={mainImage === '/placeholder.jpg'}
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = '/placeholder.jpg'
          }}
        />

        {/* Badges */}
        <div className="absolute top-2 right-2 flex flex-col gap-1.5">
          {item.featured && (
            <span className="bg-amber-500 text-white px-2 py-1 rounded-md text-xs font-medium shadow-sm">
              מומלץ
            </span>
          )}
          {item.condition === 'חדש' && (
            <span className="bg-emerald-500 text-white px-2 py-1 rounded-md text-xs font-medium shadow-sm">
              חדש
            </span>
          )}
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 leading-snug">
          {item.title}
        </h3>

        {item.description && (
          <p className="text-sm text-gray-500 mb-3 line-clamp-1">
            {item.description}
          </p>
        )}

        <div className="flex items-end justify-between gap-2">
          <div>
            <p className="text-lg font-bold text-gray-900">
              {formatPrice(pricing.finalPriceExclShipping)}
            </p>
          </div>

          {item.city && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              {item.city}
            </div>
          )}
        </div>

        {item.condition && item.condition !== 'חדש' && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <span className="text-xs text-gray-500">
              מצב: {item.condition}
            </span>
          </div>
        )}
      </div>
    </Link>
  )
}

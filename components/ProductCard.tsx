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
      className="group block bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl active:shadow-lg transition-all duration-300 border border-gray-100 hover:border-transparent transform hover:-translate-y-1 active:scale-[0.98]"
    >
      <div className="aspect-[4/3] relative bg-gradient-to-br from-gray-50 to-gray-100">
        <Image
          src={mainImage}
          alt={item.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
          unoptimized={mainImage === '/placeholder.jpg'}
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = '/placeholder.jpg'
          }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {item.featured && (
            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm">
              ⭐ מומלץ
            </div>
          )}
          {item.condition === 'חדש' && (
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm">
              חדש
            </div>
          )}
        </div>
        
        {/* Quick View Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
            <span className="text-sm font-medium text-gray-800">צפה במוצר</span>
          </div>
        </div>
      </div>
      
      <div className="p-4 sm:p-5">
        <h3 className="font-bold text-base sm:text-lg mb-2 line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
          {item.title}
        </h3>
        
        {item.description && (
          <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 line-clamp-2 group-hover:text-gray-700 transition-colors">
            {item.description}
          </p>
        )}
        
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <div>
            <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1">מחיר כולל עמלה</p>
            <p className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
              {formatPrice(pricing.finalPriceExclShipping)}
            </p>
          </div>
          
          {item.city && (
            <div className="text-left">
              <div className="flex items-center gap-1 text-gray-600">
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-xs sm:text-sm font-medium">{item.city}</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Bottom Section with Condition */}
        <div className="pt-2 sm:pt-3 border-t border-gray-100">
          {item.condition && (
            <span className={`
              inline-block px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium
              ${item.condition === 'חדש' 
                ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700' 
                : item.condition === 'כמו חדש'
                ? 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700'
                : 'bg-gray-100 text-gray-700'
              }
            `}>
              {item.condition}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
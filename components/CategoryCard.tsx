'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Category } from '@/lib/types'

interface CategoryCardProps {
  category: Category
}

const categoryIcons: Record<string, JSX.Element> = {
  electronics: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  ),
  fashion: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    </svg>
  ),
  home: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  toys: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
    </svg>
  ),
  sports: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  default: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  )
}

const categoryColors: Record<string, string> = {
  electronics: 'from-blue-500 to-indigo-600',
  fashion: 'from-pink-500 to-purple-600',
  home: 'from-green-500 to-emerald-600',
  toys: 'from-yellow-500 to-orange-600',
  sports: 'from-red-500 to-pink-600',
  default: 'from-gray-500 to-gray-600'
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const icon = categoryIcons[category.slug] || categoryIcons.default
  const colorGradient = categoryColors[category.slug] || categoryColors.default

  return (
    <Link
      href={`/category/${category.slug}`}
      className="group relative block bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-transparent transform hover:-translate-y-2"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600"></div>
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <pattern id={`pattern-${category.slug}`} x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="2" fill="currentColor" opacity="0.5" />
          </pattern>
          <rect width="100%" height="100%" fill={`url(#pattern-${category.slug})`} />
        </svg>
      </div>

      <div className="aspect-square relative">
        {category.image_url ? (
          <>
            <Image
              src={category.image_url}
              alt={category.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
          </>
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${colorGradient} opacity-10`} />
        )}

        {/* Icon and Name Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10">
          {!category.image_url && (
            <div className={`
              w-20 h-20 rounded-2xl flex items-center justify-center mb-4
              bg-gradient-to-br ${colorGradient}
              shadow-2xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300
            `}>
              {icon}
            </div>
          )}
          <h3 className="font-bold text-2xl text-center px-4 drop-shadow-lg">
            {category.name}
          </h3>
        </div>

        {/* Hover Effect */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/20 backdrop-blur-sm">
          <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-xl transform scale-90 group-hover:scale-100 transition-transform duration-300">
            <span className="text-sm font-bold text-gray-800 flex items-center gap-2">
              עיין בקטגוריה
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </div>
      
      {/* Item Count Badge */}
      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-md">
        <span className="text-xs font-bold text-gray-700">
          {category.item_count || 0} פריטים
        </span>
      </div>
    </Link>
  )
}
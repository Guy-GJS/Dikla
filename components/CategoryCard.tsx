'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Category } from '@/lib/types'

interface CategoryCardProps {
  category: Category
}

const categoryIcons: Record<string, JSX.Element> = {
  electronics: (
    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  ),
  fashion: (
    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    </svg>
  ),
  home: (
    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  toys: (
    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
    </svg>
  ),
  sports: (
    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  default: (
    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  ),
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const [imageError, setImageError] = useState(false)
  const icon = categoryIcons[category.slug] || categoryIcons.default
  const hasValidImage = category.image_url && !imageError
  const categoryHref = `/category/${encodeURIComponent(category.slug)}`

  return (
    <Link
      href={categoryHref}
      className="group block bg-slate-100 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
    >
      <div className="aspect-square relative">
        {hasValidImage ? (
          <>
            <Image
              src={category.image_url || '/placeholder.jpg'}
              alt={category.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              onError={() => setImageError(true)}
            />
            {/* Overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-slate-400 group-hover:text-slate-500 transition-colors">
            {icon}
          </div>
        )}

        {/* Category Info - Overlay on image */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p className="text-xs text-slate-300 mb-1">
            {category.item_count || 0} פריטים
          </p>
          <h3 className="text-lg sm:text-xl font-bold text-white">
            {category.name}
          </h3>
        </div>

        {/* Fallback info for no-image cards */}
        {!hasValidImage && (
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-sm">
            <p className="text-xs text-slate-500 mb-0.5">
              {category.item_count || 0} פריטים
            </p>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              {category.name}
            </h3>
          </div>
        )}
      </div>
    </Link>
  )
}

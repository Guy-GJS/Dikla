'use client'

import Link from 'next/link'
import { Category } from '@/lib/types'

interface CategoryListProps {
  categories: Category[]
}

export default function CategoryList({ categories }: CategoryListProps) {
  return (
    <div className="space-y-2">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/category/${encodeURIComponent(category.slug)}`}
          className="block bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-sm transition-all"
        >
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">
              {category.name || 'ללא שם'}
            </h3>
            <span className="text-sm text-gray-500">
              {category.item_count || 0} פריטים
            </span>
          </div>
        </Link>
      ))}
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import CategoryCard from './CategoryCard'
import CategoryList from './CategoryList'
import ViewToggle from './ViewToggle'
import { Category } from '@/lib/types'

type ViewMode = 'cards' | 'list'

interface CategoriesClientProps {
  categories: Category[]
}

export default function CategoriesClient({ categories }: CategoriesClientProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('cards')
  const [isClient, setIsClient] = useState(false)

  // Load view preference from localStorage on mount
  useEffect(() => {
    setIsClient(true)
    try {
      const savedView = localStorage.getItem('categoryViewMode') as ViewMode | null
      if (savedView === 'cards' || savedView === 'list') {
        setViewMode(savedView)
      }
    } catch (error) {
      console.error('[CategoriesClient] Failed to load view preference:', error)
      // Falls back to default 'cards' view
    }
  }, [])

  // Save view preference to localStorage when it changes
  const handleViewChange = (view: ViewMode) => {
    setViewMode(view)
    try {
      localStorage.setItem('categoryViewMode', view)
    } catch (error) {
      console.error('[CategoriesClient] Failed to save view preference:', error)
      // View mode still changes in state, just won't persist
    }
  }

  // Prevent hydration mismatch by using default view until client-side
  const activeView = isClient ? viewMode : 'cards'

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <ViewToggle currentView={activeView} onViewChange={handleViewChange} />
        
        <Link 
          href="/buy" 
          className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
        >
          לכל המוצרים
          <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
      
      <div className="animate-fade-in">
        {activeView === 'cards' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        ) : (
          <CategoryList categories={categories} />
        )}
      </div>
    </>
  )
}

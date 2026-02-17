'use client'

type ViewMode = 'cards' | 'list'

interface ViewToggleProps {
  currentView: ViewMode
  onViewChange: (view: ViewMode) => void
}

export default function ViewToggle({ currentView, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex gap-1 border border-gray-200 rounded-lg p-1 bg-white">
      <button
        onClick={() => onViewChange('cards')}
        className={`p-2 rounded transition-colors ${
          currentView === 'cards'
            ? 'bg-blue-100 text-blue-600'
            : 'text-gray-500 hover:text-gray-700'
        }`}
        aria-label="תצוגת כרטיסים"
      >
        {/* Grid icon */}
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      </button>
      
      <button
        onClick={() => onViewChange('list')}
        className={`p-2 rounded transition-colors ${
          currentView === 'list'
            ? 'bg-blue-100 text-blue-600'
            : 'text-gray-500 hover:text-gray-700'
        }`}
        aria-label="תצוגת רשימה"
      >
        {/* List icon */}
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>
  )
}

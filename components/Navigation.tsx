'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavigationProps {
  className?: string
  linkClassName?: string
  orientation?: 'horizontal' | 'vertical'
}

export default function Navigation({ 
  className = '', 
  linkClassName = 'text-gray-700 hover:text-blue-600 transition-colors',
  orientation = 'horizontal'
}: NavigationProps) {
  const pathname = usePathname()
  
  const menuItems = [
    { 
      href: '/buy', 
      label: 'קנייה',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    { 
      href: '/sell', 
      label: 'מכירה',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ]

  const containerClass = orientation === 'horizontal' 
    ? `flex items-center gap-6 ${className}`
    : `space-y-2 ${className}`

  return (
    <nav className={containerClass}>
      {menuItems.map((item) => {
        const isActive = pathname === item.href
        
        return (
          <Link 
            key={item.href}
            href={item.href} 
            className={`
              ${linkClassName}
              ${orientation === 'horizontal' 
                ? 'flex items-center gap-2 group' 
                : 'flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-50'
              }
              ${isActive ? 'text-blue-600 font-semibold' : ''}
            `}
          >
            <span className={`
              transition-transform duration-200
              ${orientation === 'horizontal' ? 'group-hover:scale-110' : ''}
            `}>
              {item.icon}
            </span>
            <span>{item.label}</span>
            {isActive && orientation === 'horizontal' && (
              <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600"></span>
            )}
          </Link>
        )
      })}
    </nav>
  )
}
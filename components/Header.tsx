'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navigation from './Navigation'
import { usePathname } from 'next/navigation'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      // Add background when scrolled
      if (currentScrollY > 20) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {/* Spacer to prevent content jump */}
      <div className="h-20" />
      
      {/* Sticky Header - Always Visible */}
      <header 
        className={`
          fixed top-0 left-0 right-0 z-50
          transition-all duration-300 ease-in-out
          ${isScrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100' 
            : 'bg-white/80 backdrop-blur-sm'
          }
        `}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Navigation - Desktop (Now on Left) */}
            <div className="hidden md:flex items-center gap-8">
              {/* CTA Buttons */}
              <div className="flex items-center gap-4">
                <Link
                  href="/buy"
                  className="
                    relative px-6 py-2.5 font-medium
                    border-2 border-blue-500 text-blue-600
                    rounded-full overflow-hidden group
                    transition-all duration-300 hover:text-white
                  "
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 
                    translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                  <span className="relative z-10">חפש מוצרים</span>
                </Link>
                
                <Link
                  href="/sell"
                  className="
                    relative px-6 py-2.5 font-medium
                    bg-gradient-to-r from-green-500 to-emerald-600
                    text-white rounded-full
                    transition-all duration-300
                    hover:shadow-lg hover:scale-105
                    hover:from-green-600 hover:to-emerald-700
                  "
                >
                  <span className="relative z-10">מכור עכשיו</span>
                </Link>
              </div>
              
              <Navigation 
                orientation="horizontal" 
                className="flex items-center gap-8"
                linkClassName={`
                  relative font-medium transition-all duration-300
                  ${isScrolled 
                    ? 'text-gray-600 hover:text-blue-600' 
                    : pathname === '/' 
                      ? 'text-gray-700 hover:text-blue-600' 
                      : 'text-gray-600 hover:text-blue-600'
                  }
                  after:absolute after:bottom-0 after:left-0 after:h-0.5 
                  after:w-0 after:bg-gradient-to-r after:from-blue-500 after:to-purple-600
                  after:transition-all after:duration-300 hover:after:w-full
                `}
              />
            </div>

            {/* Mobile Menu Button (for mobile, stays on left) */}
            <button
              className="md:hidden relative w-10 h-10 flex items-center justify-center"
              onClick={() => {/* Add mobile menu toggle */}}
            >
              <div className="space-y-1.5">
                <span className={`block h-0.5 w-6 transition-colors ${
                  isScrolled ? 'bg-gray-800' : 'bg-gray-700'
                }`}></span>
                <span className={`block h-0.5 w-6 transition-colors ${
                  isScrolled ? 'bg-gray-800' : 'bg-gray-700'
                }`}></span>
                <span className={`block h-0.5 w-6 transition-colors ${
                  isScrolled ? 'bg-gray-800' : 'bg-gray-700'
                }`}></span>
              </div>
            </button>

            {/* Logo Section (Now on Right) */}
            <Link 
              href="/" 
              className="group flex items-center gap-3 transition-transform hover:scale-105"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600 rounded-xl blur-lg opacity-70 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-xl px-3 py-2 rounded-xl">
                  P
                </div>
              </div>
              <span className={`
                font-bold text-2xl transition-colors
                ${isScrolled 
                  ? 'text-gray-800' 
                  : pathname === '/' ? 'text-gray-800' : 'text-gray-800'
                }
              `}>
                Pritti
              </span>
            </Link>
          </div>
        </div>

        {/* Progress Bar */}
        <div className={`
          absolute bottom-0 left-0 right-0 h-0.5
          bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500
          transition-opacity duration-300
          ${isScrolled ? 'opacity-100' : 'opacity-0'}
        `} />
      </header>
    </>
  )
}
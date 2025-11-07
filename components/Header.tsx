'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navigation from './Navigation'
import { usePathname } from 'next/navigation'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
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

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

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
              className="md:hidden relative w-10 h-10 flex items-center justify-center z-50"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="תפריט"
            >
              <div className="space-y-1.5">
                <span className={`block h-0.5 w-6 transition-all duration-300 ${
                  isMobileMenuOpen 
                    ? 'rotate-45 translate-y-2 bg-white' 
                    : isScrolled ? 'bg-gray-800' : 'bg-gray-700'
                }`}></span>
                <span className={`block h-0.5 w-6 transition-all duration-300 ${
                  isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
                } ${isScrolled ? 'bg-gray-800' : 'bg-gray-700'}`}></span>
                <span className={`block h-0.5 w-6 transition-all duration-300 ${
                  isMobileMenuOpen 
                    ? '-rotate-45 -translate-y-2 bg-white' 
                    : isScrolled ? 'bg-gray-800' : 'bg-gray-700'
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

      {/* Mobile Menu Overlay */}
      <div
        className={`
          fixed inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 z-40
          md:hidden transition-all duration-300 ease-in-out
          ${isMobileMenuOpen 
            ? 'opacity-100 visible' 
            : 'opacity-0 invisible'
          }
        `}
      >
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/10 rounded-full filter blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/10 rounded-full filter blur-3xl"></div>
        </div>

        {/* Menu Content */}
        <div className={`
          relative h-full flex flex-col items-center justify-center p-8 pt-28
          transition-all duration-500 delay-100
          ${isMobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}
        `}>
          {/* Navigation Links */}
          <nav className="flex flex-col items-center gap-6 mb-12">
            <Link
              href="/buy"
              className="text-white text-3xl font-bold hover:scale-110 transition-transform duration-300 hover:text-blue-200"
            >
              קנייה
            </Link>
            <Link
              href="/sell"
              className="text-white text-3xl font-bold hover:scale-110 transition-transform duration-300 hover:text-green-200"
            >
              מכירה
            </Link>
            <Link
              href="/#how-it-works"
              className="text-white text-2xl font-medium hover:scale-110 transition-transform duration-300 hover:text-purple-200"
            >
              איך זה עובד
            </Link>
            <Link
              href="/#about"
              className="text-white text-2xl font-medium hover:scale-110 transition-transform duration-300 hover:text-pink-200"
            >
              אודות
            </Link>
          </nav>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-4 w-full max-w-sm">
            <Link
              href="/buy"
              className="
                w-full text-center px-8 py-4 font-bold text-lg
                bg-white text-blue-600 rounded-full
                hover:bg-blue-50 transition-all duration-300
                transform hover:scale-105 shadow-xl
              "
            >
              חפש מוצרים
            </Link>
            
            <Link
              href="/sell"
              className="
                w-full text-center px-8 py-4 font-bold text-lg
                bg-gradient-to-r from-green-500 to-emerald-600
                text-white rounded-full
                hover:from-green-600 hover:to-emerald-700
                transition-all duration-300
                transform hover:scale-105 shadow-xl
              "
            >
              מכור עכשיו
            </Link>
          </div>

          {/* Social Links */}
          <div className="mt-12 flex gap-4">
            <a
              href="#"
              className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 hover:scale-110"
              aria-label="Instagram"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a
              href="#"
              className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 hover:scale-110"
              aria-label="Facebook"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a
              href="#"
              className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 hover:scale-110"
              aria-label="WhatsApp"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.123-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
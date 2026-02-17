'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'

const NAV_LINKS = [
  { href: '/buy', label: 'קניה' },
  { href: '/#how-it-works', label: 'איך זה עובד' },
  { href: '/#about', label: 'אודות' },
]

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [keyword, setKeyword] = useState('')
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loading } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    setKeyword(searchParams.get('keyword') || '')
  }, [searchParams])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (keyword.trim()) params.set('keyword', keyword.trim())
    const query = params.toString()
    router.push(query ? `/buy?${query}` : '/buy')
  }

  const getLinkClass = (href: string) => {
    const isActive = pathname === href
    return `text-sm font-medium transition-colors ${
      isActive ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
    }`
  }

  return (
    <>
      <div className="h-16" />
      <header
        className={`fixed top-0 left-0 right-0 z-50 bg-white transition-shadow ${
          isScrolled ? 'shadow-md' : 'border-b border-gray-100'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Left Side - Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {NAV_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className={getLinkClass(link.href)}>
                  {link.label}
                </Link>
              ))}
              {!loading && (
                <Link
                  href="/account"
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {user ? 'האזור שלי' : 'כניסה למוכרים'}
                </Link>
              )}
            </nav>

            {/* Center - Search Bar */}
            <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 justify-center max-w-xl mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="חיפוש פריט"
                  className="w-full pr-5 pl-12 py-3.5 text-base bg-teal-50/80 border-2 border-teal-400 rounded-xl shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all duration-200 placeholder:text-teal-600/60"
                />
                <button
                  type="submit"
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 text-teal-600 hover:text-teal-700 hover:scale-110 transition-all duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </form>

            {/* Right Side - Logo */}
            <Link href="/" className="hidden md:flex items-center shrink-0">
              <Image
                src="/logo.jpg"
                alt="Pritti Logo"
                width={100}
                height={36}
                className="object-contain h-9 w-auto"
                priority
                unoptimized
              />
            </Link>

            {/* Mobile - Menu Button and Logo */}
            <div className="md:hidden flex items-center justify-between w-full">
              <button
                className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="תפריט"
              >
                <div className="space-y-1.5">
                  <span className={`block h-0.5 w-5 transition-all duration-200 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''} bg-gray-700`} />
                  <span className={`block h-0.5 w-5 transition-all duration-200 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'} bg-gray-700`} />
                  <span className={`block h-0.5 w-5 transition-all duration-200 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''} bg-gray-700`} />
                </div>
              </button>
              
              <Link href="/" className="flex items-center">
                <Image
                  src="/logo.jpg"
                  alt="Pritti Logo"
                  width={100}
                  height={36}
                  className="object-contain h-9 w-auto"
                  priority
                  unoptimized
                />
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white shadow-lg">
            <div className="container mx-auto px-4 py-4 space-y-4">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="חיפוש פריט"
                  className="w-full pr-5 pl-12 py-3.5 text-base bg-teal-50/80 border-2 border-teal-400 rounded-xl shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all duration-200 placeholder:text-teal-600/60"
                />
                <button
                  type="submit"
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 text-teal-600 hover:text-teal-700 hover:scale-110 transition-all duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </form>

              {/* Mobile Nav Links */}
              <div className="flex flex-wrap gap-2">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm font-medium text-gray-600 bg-gray-50 rounded-full px-4 py-2 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* Mobile Account Link */}
              {!loading && (
                <Link
                  href="/account"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {user ? 'האזור שלי' : 'כניסה למוכרים'}
                </Link>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  )
}

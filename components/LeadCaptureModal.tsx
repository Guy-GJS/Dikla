'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface LeadCaptureModalProps {
  queryText?: string
  categoryId?: string
  city?: string
  isOpen: boolean
  onClose: () => void
}

export default function LeadCaptureModal({
  queryText,
  categoryId,
  city,
  isOpen,
  onClose,
}: LeadCaptureModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    searchQuery: queryText || '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSuccess(false)
      setError('')
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error: submitError } = await supabase
        .from('wanted_item_leads')
        .insert({
          query_text: formData.searchQuery || null,
          category_id: categoryId || null,
          city: city || null,
          name: formData.name,
          email: formData.email || null,
          phone: formData.phone || null,
        })

      if (submitError) throw submitError

      setSuccess(true)
      setTimeout(() => {
        onClose()
      }, 2000)
    } catch (err) {
      setError('אירעה שגיאה. אנא נסה שוב.')
      console.error('Lead capture error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
      <div className="bg-white rounded-t-2xl sm:rounded-lg max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 sm:top-6 sm:left-6 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full p-1 transition-colors"
          aria-label="סגור"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {success ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-green-900 mb-2">תודה רבה!</h3>
            <p className="text-base sm:text-lg text-green-700">נחזור אליך ברגע שנמצא את המוצר שאתה מחפש</p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h3 className="text-xl sm:text-2xl font-bold mb-2">לא מצאת את מה שחיפשת?</h3>
              <p className="text-sm sm:text-base text-gray-700">
                השאר לנו פרטים ונחזור אליך ברגע שנמצא את המוצר שאתה מחפש
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="searchQuery" className="block text-sm font-medium mb-1">
                  מה את/ה מחפש/ת? <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="searchQuery"
                  required
                  rows={3}
                  value={formData.searchQuery}
                  onChange={(e) => setFormData({ ...formData, searchQuery: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none text-base"
                  placeholder="לדוגמה: שמלת ערב שחורה מידה M, ספה תלת מושבית בצבע אפור, אופניים לילדים..."
                />
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  שם מלא <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-base"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  אימייל
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-base"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-1">
                  טלפון
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-base"
                  placeholder="05X-XXXXXXX"
                />
              </div>

              {error && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-gray-400 text-white font-semibold py-3 sm:py-4 px-6 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-base sm:text-lg"
              >
                {loading ? 'שולח...' : 'שלח'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}


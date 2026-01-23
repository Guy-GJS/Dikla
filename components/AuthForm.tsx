'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

interface AuthFormProps {
  title?: string
  subtitle?: string
  onAuthSuccess?: () => void
}

export default function AuthForm({
  title = 'התחברות למוכרים',
  subtitle = 'כדי לפרסם מוצרים ולנהל חנות צריך להתחבר',
  onAuthSuccess,
}: AuthFormProps) {
  const [mode, setMode] = useState<'signIn' | 'signUp'>('signIn')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    setMessage('')

    if (mode === 'signUp' && password !== confirmPassword) {
      setError('הסיסמאות לא תואמות')
      return
    }

    setLoading(true)

    try {
      if (mode === 'signIn') {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (signInError) throw signInError
        if (data.session) {
          setMessage('התחברת בהצלחה')
          onAuthSuccess?.()
        }
      } else {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName || null,
              phone: phone || null,
            },
          },
        })

        if (signUpError) throw signUpError

        if (data.session) {
          setMessage('נרשמת בהצלחה')
          onAuthSuccess?.()
        } else {
          setMessage('נשלח מייל לאימות החשבון, בדוק את תיבת הדואר')
        }
      }
    } catch (err: any) {
      setError(err?.message || 'אירעה שגיאה, נסה שוב')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 sm:p-8">
      <div className="text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{title}</h1>
        <p className="text-gray-600 mt-2">{subtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'signUp' && (
          <>
            <div>
              <label htmlFor="fullName" className="block font-medium mb-2">
                שם מלא
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="לדוגמה: דנה כהן"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block font-medium mb-2">
                טלפון
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="05X-XXXXXXX"
              />
            </div>
          </>
        )}

        <div>
          <label htmlFor="email" className="block font-medium mb-2">
            אימייל <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="name@example.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block font-medium mb-2">
            סיסמה <span className="text-red-500">*</span>
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="לפחות 6 תווים"
          />
        </div>

        {mode === 'signUp' && (
          <div>
            <label htmlFor="confirmPassword" className="block font-medium mb-2">
              אימות סיסמה <span className="text-red-500">*</span>
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              minLength={6}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="הקלד שוב את הסיסמה"
            />
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-md transition-colors"
        >
          {loading ? 'מעבד...' : mode === 'signIn' ? 'כניסה' : 'הרשמה'}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-600">
        {mode === 'signIn' ? 'אין לך חשבון?' : 'כבר יש לך חשבון?'}{' '}
        <button
          type="button"
          onClick={() => setMode(mode === 'signIn' ? 'signUp' : 'signIn')}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          {mode === 'signIn' ? 'הרשמה' : 'כניסה'}
        </button>
      </div>
    </div>
  )
}

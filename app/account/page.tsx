'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AuthForm from '@/components/AuthForm'
import EditItemModal from '@/components/EditItemModal'
import SellItemModal from '@/components/SellItemModal'
import { useAuth } from '@/components/AuthProvider'
import { supabase } from '@/lib/supabase'
import { Item } from '@/lib/types'
import { formatPrice } from '@/lib/pricing'

const STATUS_LABELS: Record<string, string> = {
  pending_approval: 'ממתין לאישור',
  approved: 'מאושר',
  sold: 'נמכר',
  rejected: 'נדחה',
}

const STATUS_STYLES: Record<string, string> = {
  pending_approval: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  sold: 'bg-gray-200 text-gray-700',
  rejected: 'bg-red-100 text-red-700',
}

export default function AccountPage() {
  const { user, loading: authLoading, signOut } = useAuth()
  const [profileForm, setProfileForm] = useState({ full_name: '', phone: '' })
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileError, setProfileError] = useState('')
  const [profileMessage, setProfileMessage] = useState('')
  const [showProfileForm, setShowProfileForm] = useState(false)

  const [items, setItems] = useState<Item[]>([])
  const [itemsLoading, setItemsLoading] = useState(false)
  const [itemsError, setItemsError] = useState('')
  const [editingItem, setEditingItem] = useState<Item | null>(null)
  const [showSellModal, setShowSellModal] = useState(false)

  useEffect(() => {
    if (!user) {
      setProfileForm({ full_name: '', phone: '' })
      setItems([])
      return
    }

    const loadProfile = async () => {
      setProfileLoading(true)
      setProfileError('')
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle()

        if (error) throw error
        setProfileForm({
          full_name: data?.full_name || '',
          phone: data?.phone || '',
        })
      } catch (err) {
        console.error('Error loading profile:', err)
        setProfileError('לא הצלחנו לטעון את פרטי החשבון')
      } finally {
        setProfileLoading(false)
      }
    }

    const loadItems = async () => {
      setItemsLoading(true)
      setItemsError('')
      try {
        const { data, error } = await supabase
          .from('items')
          .select('*, category:categories(id, name)')
          .eq('seller_id', user.id)
          .order('created_at', { ascending: false })

        if (error) throw error
        setItems(data || [])
      } catch (err) {
        console.error('Error loading items:', err)
        setItemsError('לא הצלחנו לטעון את המוצרים שלך')
      } finally {
        setItemsLoading(false)
      }
    }

    loadProfile()
    loadItems()
  }, [user])

  const handleProfileSave = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!user) return

    setProfileSaving(true)
    setProfileError('')
    setProfileMessage('')

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: profileForm.full_name || null,
          phone: profileForm.phone || null,
        }, { onConflict: 'id' })

      if (error) throw error
      setProfileMessage('הפרטים עודכנו בהצלחה')
    } catch (err) {
      console.error('Error saving profile:', err)
      setProfileError('לא הצלחנו לעדכן את הפרטים')
    } finally {
      setProfileSaving(false)
    }
  }

  const refreshItems = async () => {
    if (!user) return
    setItemsLoading(true)
    setItemsError('')
    try {
      const { data, error } = await supabase
        .from('items')
        .select('*, category:categories(id, name)')
        .eq('seller_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setItems(data || [])
    } catch (err) {
      console.error('Error refreshing items:', err)
      setItemsError('לא הצלחנו לרענן את המוצרים שלך')
    } finally {
      setItemsLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-gray-600">טוען...</div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-8 sm:py-12">
          <div className="container mx-auto px-4 max-w-xl">
            <AuthForm
              title="כניסה לאזור האישי"
              subtitle="כאן ניתן לראות פרטים אישיים ולנהל את החנות שלך"
            />
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8 sm:py-12">
        <div className="container mx-auto px-4 max-w-5xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">החשבון שלי</h1>
              <p className="text-gray-600 mt-1">ניהול החנות שלך</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setShowProfileForm((prev) => !prev)}
                className="px-4 py-2 border border-gray-300 rounded-full text-gray-700 hover:border-blue-400 hover:text-blue-600 transition-colors"
              >
                {showProfileForm ? 'סגירת עריכת פרטים' : 'עריכת פרטים'}
              </button>
              <button
                onClick={() => signOut()}
                className="px-4 py-2 border border-gray-300 rounded-full text-gray-700 hover:border-red-400 hover:text-red-600 transition-colors"
              >
                התנתקות
              </button>
            </div>
          </div>

          <section className="bg-white rounded-lg shadow-md p-4 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">החנות שלי</h2>
                <p className="text-gray-600 text-sm mt-1">
                  אפשר לערוך מוצרים שנמצאים בהמתנה לאישור
                </p>
              </div>
              <button
                onClick={() => setShowSellModal(true)}
                className="px-4 py-2 rounded-full bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors"
              >
                פרסם מוצר חדש
              </button>
            </div>

            {itemsError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {itemsError}
              </div>
            )}

            {itemsLoading ? (
              <div className="text-gray-600">טוען מוצרים...</div>
            ) : items.length === 0 ? (
              <div className="text-gray-600">
                עדיין לא פרסמת מוצרים. אפשר להתחיל מכאן.
              </div>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {items.map((item) => {
                  const statusLabel = STATUS_LABELS[item.status] || item.status
                  const statusStyle = STATUS_STYLES[item.status] || 'bg-gray-100 text-gray-700'
                  const mainImage = item.image_urls?.[0] || '/placeholder.jpg'

                  return (
                    <div key={item.id} className="border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row gap-4">
                      <div className="relative w-full sm:w-40 aspect-[4/3] rounded-lg overflow-hidden bg-gray-100">
                        <Image
                          src={mainImage}
                          alt={item.title}
                          fill
                          sizes="(max-width: 640px) 100vw, 160px"
                          className="object-cover"
                          unoptimized={mainImage === '/placeholder.jpg'}
                        />
                      </div>

                      <div className="flex-1 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusStyle}`}>
                            {statusLabel}
                          </span>
                        </div>

                        {item.category?.name && (
                          <p className="text-sm text-gray-600">קטגוריה: {item.category.name}</p>
                        )}

                        <p className="text-sm text-gray-600">מחיר מבוקש: {formatPrice(item.price_ask)}</p>
                        <p className="text-xs text-gray-500">
                          פורסם ב-{new Date(item.created_at).toLocaleDateString('he-IL')}
                        </p>
                      </div>

                      <div className="flex flex-col gap-2 sm:items-end">
                        {item.status === 'pending_approval' ? (
                          <button
                            onClick={() => setEditingItem(item)}
                            className="px-4 py-2 rounded-md border border-blue-200 text-blue-700 hover:bg-blue-50 transition-colors"
                          >
                            עריכה
                          </button>
                        ) : (
                          <span className="text-xs text-gray-500">
                            ניתן לערוך רק מוצרים בהמתנה
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </section>

          {showProfileForm && (
            <section className="bg-white rounded-lg shadow-md p-4 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">עריכת פרטי משתמש</h2>
                {profileLoading && <span className="text-sm text-gray-500">טוען...</span>}
              </div>

              <form onSubmit={handleProfileSave} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="accountEmail" className="block font-medium mb-2">
                      אימייל
                    </label>
                    <input
                      id="accountEmail"
                      type="email"
                      value={user.email || ''}
                      disabled
                      className="w-full px-4 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-600"
                    />
                  </div>

                  <div>
                    <label htmlFor="accountName" className="block font-medium mb-2">
                      שם מלא
                    </label>
                    <input
                      id="accountName"
                      type="text"
                      value={profileForm.full_name}
                      onChange={(event) => setProfileForm((prev) => ({ ...prev, full_name: event.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="accountPhone" className="block font-medium mb-2">
                      טלפון
                    </label>
                    <input
                      id="accountPhone"
                      type="tel"
                      value={profileForm.phone}
                      onChange={(event) => setProfileForm((prev) => ({ ...prev, phone: event.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="05X-XXXXXXX"
                    />
                  </div>
                </div>

                {profileError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {profileError}
                  </div>
                )}

                {profileMessage && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                    {profileMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={profileSaving}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2.5 px-6 rounded-md transition-colors"
                >
                  {profileSaving ? 'שומר...' : 'שמירת פרטים'}
                </button>
              </form>
            </section>
          )}
        </div>
      </main>

      <Footer />

      {editingItem && (
        <EditItemModal
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onSuccess={async () => {
            setEditingItem(null)
            await refreshItems()
          }}
        />
      )}

      {showSellModal && (
        <SellItemModal
          onClose={() => setShowSellModal(false)}
          onSuccess={async () => {
            setShowSellModal(false)
            await refreshItems()
          }}
        />
      )}
    </div>
  )
}

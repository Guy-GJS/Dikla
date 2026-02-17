'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { supabase } from '@/lib/supabase'
import { ItemCondition, Category, Profile } from '@/lib/types'

interface SellItemModalProps {
  onClose: () => void
  onSuccess: () => void
}

const CONDITIONS: ItemCondition[] = ['חדש', 'כמו חדש', 'מצב טוב', 'סביר']

export default function SellItemModal({ onClose, onSuccess }: SellItemModalProps) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [mainImageIndex, setMainImageIndex] = useState(0)
  const [categories, setCategories] = useState<Category[]>([])
  const [profile, setProfile] = useState<Profile | null>(null)
  const [profileLoading, setProfileLoading] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    brand: '',
    categoryId: '',
    subcategory: '',
    condition: '' as ItemCondition | '',
    address: '',
    city: '',
    neighborhood: '',
    priceAsk: '',
    sellerName: '',
    sellerEmail: '',
    sellerPhone: '',
    optIn: false,
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    if (!user) {
      setProfile(null)
      return
    }

    const fetchProfile = async () => {
      setProfileLoading(true)
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle()

        if (error) throw error
        setProfile(data || null)
      } catch (err) {
        console.error('Error fetching profile:', err)
      } finally {
        setProfileLoading(false)
      }
    }

    fetchProfile()
  }, [user])

  useEffect(() => {
    if (!user?.email) return
    setFormData((prev) => ({
      ...prev,
      sellerEmail: prev.sellerEmail || user.email || '',
    }))
  }, [user?.email])

  useEffect(() => {
    if (!profile) return
    setFormData((prev) => ({
      ...prev,
      sellerName: prev.sellerName || profile.full_name || '',
      sellerPhone: prev.sellerPhone || profile.phone || '',
    }))
  }, [profile])

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true })

      if (error) throw error
      setCategories(data || [])
    } catch (err) {
      console.error('Error fetching categories:', err)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const maxImages = 8

    if (files.length + imageFiles.length > maxImages) {
      setError(`ניתן להעלות עד ${maxImages} תמונות`)
      return
    }

    setImageFiles([...imageFiles, ...files])

    // Create previews
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    setImageFiles(imageFiles.filter((_, i) => i !== index))
    setImagePreviews(imagePreviews.filter((_, i) => i !== index))

    // Adjust main image index
    if (index === mainImageIndex) {
      setMainImageIndex(0) // Reset to first image
    } else if (index < mainImageIndex) {
      setMainImageIndex(mainImageIndex - 1) // Shift down if removed image was before main
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (!user) {
        setError('צריך להתחבר כדי לפרסם מוצר')
        setLoading(false)
        return
      }

      // Reorder images so main image is first
      const orderedFiles = [...imageFiles]
      if (mainImageIndex > 0 && mainImageIndex < orderedFiles.length) {
        const mainFile = orderedFiles[mainImageIndex]
        orderedFiles.splice(mainImageIndex, 1)
        orderedFiles.unshift(mainFile)
      }

      // Upload images to Supabase Storage
      const imageUrls: string[] = []

      for (const file of orderedFiles) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
        const filePath = `${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('item-images')
          .upload(filePath, file)

        if (uploadError) throw uploadError

        // Get public URL
        const {
          data: { publicUrl },
        } = supabase.storage.from('item-images').getPublicUrl(filePath)

        imageUrls.push(publicUrl)
      }

      // Keep profile up to date for the seller dashboard
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert(
          {
            id: user.id,
            full_name: formData.sellerName || null,
            phone: formData.sellerPhone || null,
          },
          { onConflict: 'id' }
        )

      if (profileError) {
        console.error('Profile update error:', profileError)
      }

      // Create item
      const { error: insertError } = await supabase.from('items').insert({
        title: formData.title,
        description: formData.description || null,
        brand: formData.brand || null,
        category_id: formData.categoryId, // Required field
        subcategory: formData.subcategory || null,
        condition: formData.condition || null,
        address: formData.address || null,
        city: formData.city || null,
        neighborhood: formData.neighborhood || null,
        price_ask: parseFloat(formData.priceAsk),
        image_urls: imageUrls,
        status: 'pending_approval',
        seller_name: formData.sellerName,
        seller_email: formData.sellerEmail || user.email,
        seller_phone: formData.sellerPhone,
        seller_id: user.id,
      })

      if (insertError) throw insertError

      onSuccess()
      onClose()
    } catch (err: any) {
      console.error('Error:', err)
      setError('אירעה שגיאה בפרסום המוצר. אנא נסה שוב.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">פרסום מוצר חדש</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              כותרת <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="למשל: ספה תלת-מושבית בצבע אפור"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">
              תיאור
            </label>
            <textarea
              id="description"
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
              placeholder="תיאור המוצר, מותג, דגם, מידות מדויקות, חומר, מצב המוצר, תקינות, פגמים אם ישנם."
            />
          </div>

          {/* Brand */}
          <div>
            <label htmlFor="brand" className="block text-sm font-medium mb-1">
              מותג
            </label>
            <input
              type="text"
              id="brand"
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="למשל: איקאה, זארה, אפל"
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="categoryId" className="block text-sm font-medium mb-1">
              קטגוריה <span className="text-red-500">*</span>
            </label>
            <select
              id="categoryId"
              required
              value={formData.categoryId}
              onChange={(e) =>
                setFormData({ ...formData, categoryId: e.target.value, subcategory: '' })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
            >
              <option value="">בחר קטגוריה</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Subcategory - only show if category has subcategories */}
          {formData.categoryId &&
            categories.find((c) => c.id === formData.categoryId)?.subcategories &&
            categories.find((c) => c.id === formData.categoryId)!.subcategories!.length > 0 && (
              <div>
                <label htmlFor="subcategory" className="block text-sm font-medium mb-1">
                  תת קטגוריה
                </label>
                <select
                  id="subcategory"
                  value={formData.subcategory}
                  onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                >
                  <option value="">בחר תת קטגוריה (אופציונלי)</option>
                  {categories
                    .find((c) => c.id === formData.categoryId)!
                    .subcategories!.map((subcat) => (
                      <option key={subcat} value={subcat}>
                        {subcat}
                      </option>
                    ))}
                </select>
              </div>
            )}

          {/* Condition & Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="condition" className="block text-sm font-medium mb-1">
                מצב <span className="text-red-500">*</span>
              </label>
              <select
                id="condition"
                required
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value as ItemCondition })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
              >
                <option value="">בחר מצב</option>
                {CONDITIONS.map((cond) => (
                  <option key={cond} value={cond}>
                    {cond}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="priceAsk" className="block text-sm font-medium mb-1">
                מחיר מבוקש (₪) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="priceAsk"
                required
                min="0"
                step="0.01"
                value={formData.priceAsk}
                onChange={(e) => setFormData({ ...formData, priceAsk: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Location */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium mb-1">
                עיר
              </label>
              <input
                type="text"
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="תל אביב"
              />
            </div>

            <div>
              <label htmlFor="neighborhood" className="block text-sm font-medium mb-1">
                שכונה
              </label>
              <input
                type="text"
                id="neighborhood"
                value={formData.neighborhood}
                onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="פלורנטין"
              />
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium mb-2">תמונות (עד 8)</label>
            {imagePreviews.length > 0 && (
              <p className="text-xs text-gray-600 mb-3">
                לחץ על תמונה כדי להגדיר אותה כתמונה ראשית
              </p>
            )}

            <div className="grid grid-cols-4 gap-4 mb-4">
              {imagePreviews.map((preview, index) => (
                <div
                  key={index}
                  className={`relative aspect-square cursor-pointer ${
                    index === mainImageIndex ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                  }`}
                  onClick={() => setMainImageIndex(index)}
                >
                  <img
                    src={preview}
                    alt={`תמונה ${index + 1}`}
                    className="w-full h-full object-cover rounded border border-gray-300"
                  />
                  {index === mainImageIndex && (
                    <div className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                      ראשית
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeImage(index)
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 text-xl leading-none"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {imageFiles.length < 8 && (
              <label className="block w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors">
                <svg
                  className="w-12 h-12 mx-auto text-gray-400 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span className="text-gray-600">לחץ להוספת תמונות</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Contact Info */}
          <div className="border-t border-gray-200 pt-4 mt-4">
            <h3 className="text-lg font-semibold mb-4">פרטי קשר</h3>

            {profileLoading && <p className="text-sm text-gray-500 mb-4">טוען פרטי חשבון...</p>}

            <div className="space-y-4">
              <div>
                <label htmlFor="sellerName" className="block text-sm font-medium mb-1">
                  שם מלא <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="sellerName"
                  required
                  value={formData.sellerName}
                  onChange={(e) => setFormData({ ...formData, sellerName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium mb-1">
                  כתובת <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="address"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="רחוב ומספר בית"
                />
              </div>

              <div>
                <label htmlFor="sellerEmail" className="block text-sm font-medium mb-1">
                  אימייל <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="sellerEmail"
                  required
                  value={formData.sellerEmail}
                  onChange={(e) => setFormData({ ...formData, sellerEmail: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label htmlFor="sellerPhone" className="block text-sm font-medium mb-1">
                  טלפון <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="sellerPhone"
                  required
                  value={formData.sellerPhone}
                  onChange={(e) => setFormData({ ...formData, sellerPhone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="05X-XXXXXXX"
                />
              </div>

              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={formData.optIn}
                  onChange={(e) => setFormData({ ...formData, optIn: e.target.checked })}
                  className="mt-1"
                />
                <span className="text-sm text-gray-700">
                  אני מאשר/ת קבלת עדכונים ופניות לגבי המוצר
                </span>
              </label>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-md transition-colors"
            >
              ביטול
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-md transition-colors"
            >
              {loading ? 'מפרסם...' : 'פרסם מוצר'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

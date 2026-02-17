'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AuthForm from '@/components/AuthForm'
import { useAuth } from '@/components/AuthProvider'
import { supabase } from '@/lib/supabase'
import { ItemCondition, Category, Profile } from '@/lib/types'

const CONDITIONS: ItemCondition[] = ['חדש', 'כמו חדש', 'מצב טוב', 'סביר']

export default function SellPage() {
  const { user, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
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
    files.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string])
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
    setSuccess(false)

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
        const { data: { publicUrl } } = supabase.storage
          .from('item-images')
          .getPublicUrl(filePath)

        imageUrls.push(publicUrl)
      }

      // Keep profile up to date for the seller dashboard
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: formData.sellerName || null,
          phone: formData.sellerPhone || null,
        }, { onConflict: 'id' })

      if (profileError) {
        console.error('Profile update error:', profileError)
      }

      // Create item
      const { error: insertError } = await supabase
        .from('items')
        .insert({
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

      setSuccess(true)
      setImageFiles([])
      setImagePreviews([])
      setMainImageIndex(0)
      setFormData((prev) => ({
        ...prev,
        title: '',
        description: '',
        brand: '',
        categoryId: '',
        subcategory: '',
        condition: '',
        address: '',
        city: '',
        neighborhood: '',
        priceAsk: '',
        optIn: false,
      }))
      setTimeout(() => setSuccess(false), 4000)
      
    } catch (err: any) {
      console.error('Error:', err)
      setError('אירעה שגיאה בפרסום המוצר. אנא נסה שוב.')
    } finally {
      setLoading(false)
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
          <div className="container mx-auto px-4 max-w-xl space-y-4">
            <AuthForm
              title="כניסה למוכרים"
              subtitle="כדי לפרסם מוצר צריך להתחבר לחשבון"
            />
            <p className="text-center text-sm text-gray-500">
              קונים יכולים להמשיך ללא התחברות.
            </p>
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
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Header Text */}
          <div className="mb-6 sm:mb-8 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 px-4">מכירת מוצר</h1>
            <p className="text-base sm:text-lg text-gray-700 px-4">
              איזו החלטה נבונה להעביר הלאה את מה שכבר אין לך צורך בו!
              <br className="hidden sm:block" />
              <span className="block sm:inline mt-1 sm:mt-0">כמה פרטים קטנים ואנחנו נדאג למצוא עבורך קונה</span>
            </p>
          </div>

          {/* Form */}
          <form id="sell-form" onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-4 sm:p-6 space-y-5 sm:space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block font-medium mb-2">
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
              <label htmlFor="description" className="block font-medium mb-2">
                תיאור
              </label>
              <textarea
                id="description"
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="תיאור המוצר, מותג, דגם, מידות מדויקות, חומר, מצב המוצר, תקינות, פגמים אם ישנם."
              />
            </div>

            {/* Brand */}
            <div>
              <label htmlFor="brand" className="block font-medium mb-2">
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
              <label htmlFor="categoryId" className="block font-medium mb-2">
                קטגוריה <span className="text-red-500">*</span>
              </label>
              <select
                id="categoryId"
                required
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value, subcategory: '' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
              >
                <option value="">בחר קטגוריה</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>

            {/* Subcategory - only show if category has subcategories */}
            {formData.categoryId && categories.find(c => c.id === formData.categoryId)?.subcategories && categories.find(c => c.id === formData.categoryId)!.subcategories!.length > 0 && (
              <div>
                <label htmlFor="subcategory" className="block font-medium mb-2">
                  תת קטגוריה
                </label>
                <select
                  id="subcategory"
                  value={formData.subcategory}
                  onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                >
                  <option value="">בחר תת קטגוריה (אופציונלי)</option>
                  {categories.find(c => c.id === formData.categoryId)!.subcategories!.map(subcat => (
                    <option key={subcat} value={subcat}>{subcat}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Condition & Price */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="condition" className="block font-medium mb-2">
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
                  {CONDITIONS.map(cond => (
                    <option key={cond} value={cond}>{cond}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="priceAsk" className="block font-medium mb-2">
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
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="block font-medium mb-2">
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
                <label htmlFor="neighborhood" className="block font-medium mb-2">
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
              <label className="block font-medium mb-2 text-sm sm:text-base">
                תמונות (עד 8)
              </label>
              {imagePreviews.length > 0 && (
                <p className="text-xs sm:text-sm text-gray-600 mb-3">
                  לחץ על תמונה כדי להגדיר אותה כתמונה ראשית
                </p>
              )}
              
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-4 mb-4">
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
                      className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white rounded-full w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center hover:bg-red-600 text-lg sm:text-xl"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              {imageFiles.length < 8 && (
                <label className="block w-full border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center cursor-pointer hover:border-blue-500 active:border-blue-600 transition-colors">
                  <svg className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="text-sm sm:text-base text-gray-600">לחץ להוספת תמונות</span>
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
            <div className="border-t pt-6">
              <h3 className="font-semibold text-lg mb-4">פרטי קשר</h3>

              {profileLoading && (
                <p className="text-sm text-gray-500 mb-4">טוען פרטי חשבון...</p>
              )}
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="sellerName" className="block font-medium mb-2">
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
                  <label htmlFor="address" className="block font-medium mb-2">
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
                  <label htmlFor="sellerEmail" className="block font-medium mb-2">
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
                  <label htmlFor="sellerPhone" className="block font-medium mb-2">
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

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                המוצר נשלח לאישור ויפורסם בקרוב
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-gray-400 text-white font-semibold py-3 sm:py-4 px-6 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-base sm:text-lg"
            >
              {loading ? 'מפרסם...' : 'פרסם מוצר'}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  )
}


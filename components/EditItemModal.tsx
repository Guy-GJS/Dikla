'use client'

import { useState, useEffect } from 'react'
import { Item, ItemCondition, Category } from '@/lib/types'
import { supabase } from '@/lib/supabase'

interface EditItemModalProps {
  item: Item
  adminToken: string
  onClose: () => void
  onSuccess: () => void
}

const CONDITIONS: ItemCondition[] = ['חדש', 'כמו חדש', 'מצב טוב', 'סביר']

export default function EditItemModal({
  item,
  adminToken,
  onClose,
  onSuccess,
}: EditItemModalProps) {
  const [formData, setFormData] = useState({
    title: item.title,
    description: item.description || '',
    price_ask: item.price_ask,
    condition: item.condition || 'מצב טוב',
    category_id: item.category_id || '',
    subcategory: item.subcategory || '',
    city: item.city || '',
    neighborhood: item.neighborhood || '',
    seller_name: item.seller_name || '',
    seller_email: item.seller_email || '',
    seller_phone: item.seller_phone || '',
  })
  const [categories, setCategories] = useState<Category[]>([])
  const [existingImages, setExistingImages] = useState<string[]>(item.image_urls || [])
  const [newImageFiles, setNewImageFiles] = useState<File[]>([])
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [uploadingImages, setUploadingImages] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchCategories()
  }, [])

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
    const totalImages = existingImages.length + newImageFiles.length + files.length
    
    if (totalImages > maxImages) {
      setError(`ניתן להעלות עד ${maxImages} תמונות`)
      return
    }

    setNewImageFiles([...newImageFiles, ...files])
    
    // Create previews
    files.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setNewImagePreviews(prev => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
    setError('')
  }

  const removeExistingImage = (index: number) => {
    setExistingImages(existingImages.filter((_, i) => i !== index))
  }

  const removeNewImage = (index: number) => {
    setNewImageFiles(newImageFiles.filter((_, i) => i !== index))
    setNewImagePreviews(newImagePreviews.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Upload new images to Supabase Storage
      setUploadingImages(true)
      const newImageUrls: string[] = []
      
      for (const file of newImageFiles) {
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

        newImageUrls.push(publicUrl)
      }
      setUploadingImages(false)

      // Combine existing and new image URLs
      const allImageUrls = [...existingImages, ...newImageUrls]

      // Update item
      const response = await fetch('/api/admin/items', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemId: item.id,
          updates: {
            ...formData,
            image_urls: allImageUrls,
          },
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update item')
      }

      onSuccess()
      onClose()
    } catch (err) {
      setError('שגיאה בעדכון המוצר. אנא נסה שוב.')
      console.error('Update error:', err)
    } finally {
      setLoading(false)
      setUploadingImages(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">עריכת מוצר</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
            />
          </div>

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
            />
          </div>

          <div>
            <label htmlFor="category_id" className="block text-sm font-medium mb-1">
              קטגוריה <span className="text-red-500">*</span>
            </label>
            <select
              id="category_id"
              required
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value, subcategory: '' })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
            >
              <option value="">בחר קטגוריה</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>

          {/* Subcategory - only show if category has subcategories */}
          {formData.category_id && categories.find(c => c.id === formData.category_id)?.subcategories && categories.find(c => c.id === formData.category_id)!.subcategories!.length > 0 && (
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
                {categories.find(c => c.id === formData.category_id)!.subcategories!.map(subcat => (
                  <option key={subcat} value={subcat}>{subcat}</option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="price_ask" className="block text-sm font-medium mb-1">
                מחיר <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="price_ask"
                required
                min="0"
                step="0.01"
                value={formData.price_ask}
                onChange={(e) => setFormData({ ...formData, price_ask: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label htmlFor="condition" className="block text-sm font-medium mb-1">
                מצב
              </label>
              <select
                id="condition"
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value as ItemCondition })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                {CONDITIONS.map((condition) => (
                  <option key={condition} value={condition}>
                    {condition}
                  </option>
                ))}
              </select>
            </div>
          </div>

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
              />
            </div>
          </div>

          {/* Images Section */}
          <div className="border-t border-gray-200 pt-4 mt-4">
            <label className="block text-sm font-medium mb-2">
              תמונות (עד 8)
            </label>
            
            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">תמונות קיימות:</p>
                <div className="grid grid-cols-4 gap-4">
                  {existingImages.map((url, index) => (
                    <div key={`existing-${index}`} className="relative aspect-square">
                      <img
                        src={url}
                        alt={`תמונה קיימת ${index + 1}`}
                        className="w-full h-full object-cover rounded border border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 text-xl leading-none"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Images */}
            {newImagePreviews.length > 0 && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">תמונות חדשות:</p>
                <div className="grid grid-cols-4 gap-4">
                  {newImagePreviews.map((preview, index) => (
                    <div key={`new-${index}`} className="relative aspect-square">
                      <img
                        src={preview}
                        alt={`תמונה חדשה ${index + 1}`}
                        className="w-full h-full object-cover rounded border border-green-300"
                      />
                      <button
                        type="button"
                        onClick={() => removeNewImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 text-xl leading-none"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload Button */}
            {(existingImages.length + newImageFiles.length) < 8 && (
              <label className="block w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors">
                <svg className="w-12 h-12 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
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

          <div className="border-t border-gray-200 pt-4 mt-4">
            <h3 className="text-lg font-semibold mb-4">פרטי המוכר</h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="seller_name" className="block text-sm font-medium mb-1">
                  שם המוכר
                </label>
                <input
                  type="text"
                  id="seller_name"
                  value={formData.seller_name}
                  onChange={(e) => setFormData({ ...formData, seller_name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label htmlFor="seller_email" className="block text-sm font-medium mb-1">
                  אימייל המוכר
                </label>
                <input
                  type="email"
                  id="seller_email"
                  value={formData.seller_email}
                  onChange={(e) => setFormData({ ...formData, seller_email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label htmlFor="seller_phone" className="block text-sm font-medium mb-1">
                  טלפון המוכר
                </label>
                <input
                  type="tel"
                  id="seller_phone"
                  value={formData.seller_phone}
                  onChange={(e) => setFormData({ ...formData, seller_phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="05X-XXXXXXX"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded">
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
              {uploadingImages ? 'מעלה תמונות...' : loading ? 'שומר...' : 'שמור שינויים'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}


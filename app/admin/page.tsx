'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import EditItemModal from '@/components/EditItemModal'
import { Item, WantedItemLead, Order, Category, Settings, CommissionSettings } from '@/lib/types'
import { formatPrice } from '@/lib/pricing'
import { supabase } from '@/lib/supabase'

export default function AdminPage() {
  const router = useRouter()
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [password, setPassword] = useState('')
  const [adminToken, setAdminToken] = useState('')
  const [activeTab, setActiveTab] = useState<'items' | 'leads' | 'orders' | 'categories' | 'settings'>('items')
  
  const [items, setItems] = useState<Item[]>([])
  const [leads, setLeads] = useState<WantedItemLead[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [settings, setSettings] = useState<Settings[]>([])
  const [editingItem, setEditingItem] = useState<Item | null>(null)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(null)

  useEffect(() => {
    // Check if already authenticated in session
    const isAuth = sessionStorage.getItem('admin_auth') === 'true'
    const token = sessionStorage.getItem('admin_token') || ''
    if (isAuth && token) {
      setAuthenticated(true)
      setAdminToken(token)
      fetchData(token)
    }
    setLoading(false)
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // SECURITY: Validate password and create token
    const validPassword = process.env.NEXT_PUBLIC_ADMIN_SECRET || 'admin123'
    if (password === validPassword) {
      const token = password // In production, this would be a JWT
      sessionStorage.setItem('admin_auth', 'true')
      sessionStorage.setItem('admin_token', token)
      setAuthenticated(true)
      setAdminToken(token)
      fetchData(token)
    } else {
      alert('סיסמה שגויה')
    }
  }

  const fetchData = async (token: string) => {
    try {
      // SECURITY: All requests go through authenticated API routes
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }

      // Fetch items
      const itemsResponse = await fetch('/api/admin/items', { headers })
      if (itemsResponse.ok) {
        const { data } = await itemsResponse.json()
        setItems(data || [])
      }

      // Fetch leads
      const leadsResponse = await fetch('/api/admin/leads', { headers })
      if (leadsResponse.ok) {
        const { data } = await leadsResponse.json()
        setLeads(data || [])
      }

      // Fetch orders
      const ordersResponse = await fetch('/api/admin/orders', { headers })
      if (ordersResponse.ok) {
        const { data } = await ordersResponse.json()
        setOrders(data || [])
      }

      // Fetch categories
      const categoriesResponse = await fetch('/api/admin/categories', { headers })
      if (categoriesResponse.ok) {
        const { data } = await categoriesResponse.json()
        setCategories(data || [])
      }

      // Fetch settings
      const settingsResponse = await fetch('/api/admin/settings', { headers })
      if (settingsResponse.ok) {
        const { data } = await settingsResponse.json()
        setSettings(data || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      alert('שגיאה בטעינת הנתונים')
    }
  }

  const updateItemStatus = async (itemId: string, status: string) => {
    try {
      const response = await fetch('/api/admin/items', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ itemId, updates: { status } })
      })

      if (!response.ok) {
        throw new Error('Failed to update item')
      }

      fetchData(adminToken)
    } catch (error) {
      console.error('Error updating item:', error)
      alert('שגיאה בעדכון')
    }
  }

  const toggleFeatured = async (itemId: string, currentFeatured: boolean) => {
    try {
      const response = await fetch('/api/admin/items', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ itemId, updates: { featured: !currentFeatured } })
      })

      if (!response.ok) {
        throw new Error('Failed to update item')
      }

      fetchData(adminToken)
    } catch (error) {
      console.error('Error updating item:', error)
      alert('שגיאה בעדכון')
    }
  }

  const deleteItem = async (itemId: string) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק?')) return

    try {
      const response = await fetch(`/api/admin/items?itemId=${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to delete item')
      }

      fetchData(adminToken)
    } catch (error) {
      console.error('Error deleting item:', error)
      alert('שגיאה במחיקה')
    }
  }

  const saveCategory = async (categoryData: Partial<Category>) => {
    try {
      const isEdit = editingCategory !== null
      const url = '/api/admin/categories'
      const method = isEdit ? 'PATCH' : 'POST'
      const body = isEdit 
        ? JSON.stringify({ categoryId: editingCategory.id, updates: categoryData })
        : JSON.stringify(categoryData)

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        },
        body
      })

      if (!response.ok) {
        throw new Error('Failed to save category')
      }

      setShowCategoryModal(false)
      setEditingCategory(null)
      fetchData(adminToken)
    } catch (error) {
      console.error('Error saving category:', error)
      alert('שגיאה בשמירת קטגוריה')
    }
  }

  const deleteCategory = async (categoryId: string) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק קטגוריה זו? מוצרים המשוייכים לקטגוריה יישארו ללא קטגוריה.')) return

    try {
      const response = await fetch(`/api/admin/categories?categoryId=${categoryId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to delete category')
      }

      fetchData(adminToken)
    } catch (error) {
      console.error('Error deleting category:', error)
      alert('שגיאה במחיקת קטגוריה')
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">טוען...</div>
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h1 className="text-2xl font-bold mb-6 text-center">כניסה למערכת ניהול</h1>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block font-medium mb-2">סיסמה</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="הכנס סיסמה"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors"
            >
              כניסה
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-bold">פאנל ניהול</h1>
            <button
              onClick={() => {
                sessionStorage.removeItem('admin_auth')
                sessionStorage.removeItem('admin_token')
                setAuthenticated(false)
                setAdminToken('')
              }}
              className="text-red-600 hover:text-red-700"
            >
              התנתק
            </button>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-8">
            <nav className="flex gap-8">
              <button
                onClick={() => setActiveTab('items')}
                className={`pb-4 border-b-2 font-medium transition-colors ${
                  activeTab === 'items'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                מוצרים ({items.length})
              </button>
              <button
                onClick={() => setActiveTab('leads')}
                className={`pb-4 border-b-2 font-medium transition-colors ${
                  activeTab === 'leads'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                פניות ({leads.length})
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`pb-4 border-b-2 font-medium transition-colors ${
                  activeTab === 'orders'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                הזמנות ({orders.length})
              </button>
              <button
                onClick={() => setActiveTab('categories')}
                className={`pb-4 border-b-2 font-medium transition-colors ${
                  activeTab === 'categories'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                קטגוריות ({categories.length})
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`pb-4 border-b-2 font-medium transition-colors ${
                  activeTab === 'settings'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                עמלות
              </button>
            </nav>
          </div>

          {/* Items Table */}
          {activeTab === 'items' && (
            <div className="bg-white rounded-lg shadow overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-right text-sm font-semibold">כותרת</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold">מחיר</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold">סטטוס</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold">מומלץ</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold">פעולות</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div>
                          <div className="font-medium">{item.title}</div>
                          <div className="text-sm text-gray-500">{item.seller_name}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3">{formatPrice(item.price_ask)}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                            item.status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : item.status === 'pending_approval'
                              ? 'bg-yellow-100 text-yellow-800'
                              : item.status === 'sold'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {item.status === 'approved'
                            ? 'מאושר'
                            : item.status === 'pending_approval'
                            ? 'ממתין לאישור'
                            : item.status === 'sold'
                            ? 'נמכר'
                            : 'נדחה'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleFeatured(item.id, item.featured)}
                          className={`text-2xl ${item.featured ? 'text-yellow-500' : 'text-gray-300'}`}
                        >
                          ★
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingItem(item)}
                            className="text-blue-600 hover:text-blue-700 text-sm"
                          >
                            ערוך
                          </button>
                          {item.status === 'pending_approval' && (
                            <>
                              <button
                                onClick={() => updateItemStatus(item.id, 'approved')}
                                className="text-green-600 hover:text-green-700 text-sm"
                              >
                                אשר
                              </button>
                              <button
                                onClick={() => updateItemStatus(item.id, 'rejected')}
                                className="text-red-600 hover:text-red-700 text-sm"
                              >
                                דחה
                              </button>
                            </>
                          )}
                          {item.status === 'approved' && (
                            <button
                              onClick={() => updateItemStatus(item.id, 'sold')}
                              className="text-blue-600 hover:text-blue-700 text-sm"
                            >
                              סמן כנמכר
                            </button>
                          )}
                          <button
                            onClick={() => deleteItem(item.id)}
                            className="text-red-600 hover:text-red-700 text-sm"
                          >
                            מחק
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Leads Table */}
          {activeTab === 'leads' && (
            <div className="bg-white rounded-lg shadow overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-right text-sm font-semibold">שם</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold">פרטי קשר</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold">חיפוש</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold">תאריך</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr key={lead.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">{lead.name}</td>
                      <td className="px-4 py-3">
                        <div className="text-sm">
                          {lead.email && <div>{lead.email}</div>}
                          {lead.phone && <div>{lead.phone}</div>}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm">
                          {lead.query_text && <div>"{lead.query_text}"</div>}
                          {lead.category && <div className="text-gray-500">{lead.category.name}</div>}
                          {lead.city && <div className="text-gray-500">{lead.city}</div>}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {new Date(lead.created_at).toLocaleDateString('he-IL')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Orders Table */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-lg shadow overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-right text-sm font-semibold">מוצר</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold">קונה</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold">סוג</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold">סכום</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold">סטטוס</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold">תאריך</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">
                        {order.item ? order.item.title : 'מוצר לא זמין'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm">
                          <div>{order.buyer_first_name} {order.buyer_last_name}</div>
                          <div className="text-gray-500">{order.buyer_email}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {order.type === 'delivery' ? 'משלוח' : 'איסוף עצמי'}
                      </td>
                      <td className="px-4 py-3 font-medium">{formatPrice(order.total)}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                            order.status === 'paid'
                              ? 'bg-green-100 text-green-800'
                              : order.status === 'initiated'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {order.status === 'paid' ? 'שולם' : order.status === 'initiated' ? 'בתהליך' : 'נכשל'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleDateString('he-IL')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Categories Table */}
          {activeTab === 'categories' && (
            <div>
              <div className="mb-4 flex justify-end">
                <button
                  onClick={() => {
                    setEditingCategory(null)
                    setShowCategoryModal(true)
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                >
                  הוסף קטגוריה
                </button>
              </div>
              <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-right text-sm font-semibold w-10"></th>
                      <th className="px-4 py-3 text-right text-sm font-semibold">תמונה</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold">שם</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold">Slug</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold">סדר</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold">פעולות</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((category) => (
                      <>
                        <tr key={category.id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3">
                            {category.subcategories && category.subcategories.length > 0 && (
                              <button
                                onClick={() => setExpandedCategoryId(expandedCategoryId === category.id ? null : category.id)}
                                className="text-gray-600 hover:text-gray-900 transition-transform duration-200"
                                style={{ transform: expandedCategoryId === category.id ? 'rotate(90deg)' : 'rotate(0deg)' }}
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </button>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {category.image_url ? (
                              <img 
                                src={category.image_url} 
                                alt={category.name}
                                className="w-16 h-16 object-cover rounded-md"
                              />
                            ) : (
                              <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center text-gray-400 text-xs">
                                אין תמונה
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{category.name}</span>
                              {category.subcategories && category.subcategories.length > 0 && (
                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                  {category.subcategories.length} תתי קטגוריות
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">{category.slug}</td>
                          <td className="px-4 py-3 text-sm">{category.sort_order}</td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setEditingCategory(category)
                                  setShowCategoryModal(true)
                                }}
                                className="text-blue-600 hover:text-blue-700 text-sm"
                              >
                                ערוך
                              </button>
                              <button
                                onClick={() => deleteCategory(category.id)}
                                className="text-red-600 hover:text-red-700 text-sm"
                              >
                                מחק
                              </button>
                            </div>
                          </td>
                        </tr>
                        {/* Expanded row for subcategories */}
                        {expandedCategoryId === category.id && category.subcategories && category.subcategories.length > 0 && (
                          <tr key={`${category.id}-expanded`} className="bg-blue-50 border-b">
                            <td></td>
                            <td colSpan={5} className="px-4 py-3">
                              <div className="flex flex-wrap gap-2">
                                <span className="text-sm font-medium text-gray-700 mr-2">תתי קטגוריות:</span>
                                {category.subcategories.map((subcat, idx) => (
                                  <span key={idx} className="inline-block px-3 py-1 bg-white text-blue-800 border border-blue-200 rounded-full text-sm">
                                    {subcat}
                                  </span>
                                ))}
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Settings Panel */}
          {activeTab === 'settings' && (
            <SettingsPanel 
              settings={settings}
              adminToken={adminToken}
              onUpdate={() => fetchData(adminToken)}
            />
          )}
        </div>
      </main>

      <Footer />

      {/* Edit Item Modal */}
      {editingItem && (
        <EditItemModal
          item={editingItem}
          adminToken={adminToken}
          onClose={() => setEditingItem(null)}
          onSuccess={() => fetchData(adminToken)}
        />
      )}

      {/* Category Modal */}
      {showCategoryModal && (
        <CategoryModal
          category={editingCategory}
          onClose={() => {
            setShowCategoryModal(false)
            setEditingCategory(null)
          }}
          onSave={saveCategory}
        />
      )}
    </div>
  )
}

// Category Modal Component
function CategoryModal({ 
  category, 
  onClose, 
  onSave 
}: { 
  category: Category | null
  onClose: () => void
  onSave: (data: Partial<Category>) => void
}) {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    slug: category?.slug || '',
    image_url: category?.image_url || '',
    is_featured: category?.is_featured || false,
    sort_order: category?.sort_order || 0,
    subcategories: category?.subcategories || [],
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>(category?.image_url || '')
  const [uploadingImage, setUploadingImage] = useState(false)
  const [error, setError] = useState('')
  const [newSubcategory, setNewSubcategory] = useState('')

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('אנא בחר קובץ תמונה')
      return
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('גודל הקובץ חייב להיות עד 5MB')
      return
    }

    setImageFile(file)
    setError('')
    
    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview('')
    setFormData({ ...formData, image_url: '' })
  }

  const addSubcategory = () => {
    if (newSubcategory.trim() && !formData.subcategories.includes(newSubcategory.trim())) {
      setFormData({
        ...formData,
        subcategories: [...formData.subcategories, newSubcategory.trim()]
      })
      setNewSubcategory('')
    }
  }

  const removeSubcategory = (index: number) => {
    setFormData({
      ...formData,
      subcategories: formData.subcategories.filter((_, i) => i !== index)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    try {
      let imageUrl = formData.image_url

      // Upload new image if selected
      if (imageFile) {
        setUploadingImage(true)
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
        const filePath = `${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('category-images')
          .upload(filePath, imageFile)

        if (uploadError) {
          throw new Error('שגיאה בהעלאת התמונה: ' + uploadError.message)
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('category-images')
          .getPublicUrl(filePath)

        imageUrl = publicUrl
        setUploadingImage(false)
      }

      // Save category with updated image URL
      onSave({ ...formData, image_url: imageUrl })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'שגיאה בשמירת הקטגוריה')
      console.error('Save error:', err)
      setUploadingImage(false)
    }
  }

  // Auto-generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-2xl font-bold mb-4">
          {category ? 'ערוך קטגוריה' : 'הוסף קטגוריה'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block font-medium mb-2">
              שם <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={(e) => {
                setFormData({ 
                  ...formData, 
                  name: e.target.value,
                  slug: formData.slug || generateSlug(e.target.value)
                })
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label htmlFor="slug" className="block font-medium mb-2">
              Slug <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="slug"
              required
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="example-category"
            />
            <p className="text-xs text-gray-500 mt-1">URL-friendly identifier (e.g., furniture, electronics)</p>
          </div>

          <div>
            <label htmlFor="image" className="block font-medium mb-2">
              תמונה
            </label>
            
            {/* Image preview */}
            {imagePreview && (
              <div className="mb-3 relative inline-block">
                <img 
                  src={imagePreview} 
                  alt="תצוגה מקדימה" 
                  className="w-32 h-32 object-cover rounded-md border border-gray-300"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            )}
            
            {/* File input */}
            {!imagePreview && (
              <div>
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">גודל מקסימלי: 5MB</p>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="sort_order" className="block font-medium mb-2">
              סדר תצוגה
            </label>
            <input
              type="number"
              id="sort_order"
              value={formData.sort_order}
              onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block font-medium mb-2">
              תתי קטגוריות
            </label>
            <div className="space-y-2">
              {/* Display existing subcategories */}
              {formData.subcategories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.subcategories.map((subcat, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      <span>{subcat}</span>
                      <button
                        type="button"
                        onClick={() => removeSubcategory(index)}
                        className="text-blue-600 hover:text-blue-800 font-bold"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {/* Add new subcategory */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSubcategory}
                  onChange={(e) => setNewSubcategory(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addSubcategory()
                    }
                  }}
                  placeholder="הוסף תת קטגוריה"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                />
                <button
                  type="button"
                  onClick={addSubcategory}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm whitespace-nowrap"
                >
                  הוסף
                </button>
              </div>
              <p className="text-xs text-gray-500">לחץ Enter או על הכפתור כדי להוסיף תת קטגוריה</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_featured"
              checked={formData.is_featured}
              onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
              className="w-4 h-4"
            />
            <label htmlFor="is_featured" className="font-medium">
              מומלץ
            </label>
          </div>

          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-2 justify-end pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={uploadingImage}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ביטול
            </button>
            <button
              type="submit"
              disabled={uploadingImage}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploadingImage ? 'מעלה תמונה...' : 'שמור'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Settings Panel Component
function SettingsPanel({ 
  settings, 
  adminToken, 
  onUpdate 
}: { 
  settings: Settings[]
  adminToken: string
  onUpdate: () => void
}) {
  const getSettingValue = (key: string, defaultValue: any) => {
    const setting = settings.find(s => s.key === key)
    if (!setting) return defaultValue
    // Handle JSON string values
    if (typeof setting.value === 'string') {
      try {
        return JSON.parse(setting.value)
      } catch {
        return setting.value
      }
    }
    return setting.value
  }

  // Get commission settings from database or use defaults
  const commissionConfig = getSettingValue('commission_config', {
    mode: 'percentage',
    fixed_amount: 5,
    percentage: 8,
    min_amount: 5
  })

  const [commissionMode, setCommissionMode] = useState<'fixed' | 'percentage'>(commissionConfig.mode)
  const [fixedAmount, setFixedAmount] = useState<number>(commissionConfig.fixed_amount)
  const [percentage, setPercentage] = useState<number>(commissionConfig.percentage)
  const [minAmount, setMinAmount] = useState<number>(commissionConfig.min_amount)
  const [defaultShipping, setDefaultShipping] = useState<number>(getSettingValue('pritti_default_shipping', 35))
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const saveCommissionSettings = async () => {
    setSaving(true)
    setMessage(null)

    try {
      const commissionSettings: CommissionSettings = {
        mode: commissionMode,
        fixed_amount: fixedAmount,
        percentage: percentage,
        min_amount: minAmount
      }

      const response = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          key: 'commission_config',
          value: commissionSettings
        })
      })

      if (!response.ok) {
        throw new Error('Failed to save settings')
      }

      // Save shipping fee
      const shippingResponse = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          key: 'pritti_default_shipping',
          value: defaultShipping
        })
      })

      if (!shippingResponse.ok) {
        throw new Error('Failed to save shipping settings')
      }

      setMessage({ type: 'success', text: 'ההגדרות נשמרו בהצלחה' })
      onUpdate()
    } catch (error) {
      console.error('Error saving settings:', error)
      setMessage({ type: 'error', text: 'שגיאה בשמירת ההגדרות' })
    } finally {
      setSaving(false)
    }
  }

  // Calculate example commission for different item prices
  const calculateExampleCommission = (priceAsk: number): number => {
    switch (commissionMode) {
      case 'fixed':
        return fixedAmount
      
      case 'percentage':
        return Math.max(minAmount, priceAsk * (percentage / 100))
      
      default:
        return Math.max(minAmount, priceAsk * (percentage / 100))
    }
  }

  return (
    <div className="space-y-6">
      {/* Commission Settings */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-6">הגדרות עמלה</h2>
        
        {message && (
          <div className={`mb-4 p-4 rounded-md ${
            message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {message.text}
          </div>
        )}

        <div className="space-y-6">
          {/* Commission Mode Selection */}
          <div>
            <label className="block font-medium mb-3 text-lg">סוג עמלה</label>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-4 border rounded-md cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="commissionMode"
                  value="fixed"
                  checked={commissionMode === 'fixed'}
                  onChange={(e) => setCommissionMode(e.target.value as any)}
                  className="w-5 h-5"
                />
                <div>
                  <div className="font-medium">סכום קבוע</div>
                  <div className="text-sm text-gray-600">עמלה קבועה לכל מוצר, ללא קשר למחיר</div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-4 border rounded-md cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="commissionMode"
                  value="percentage"
                  checked={commissionMode === 'percentage'}
                  onChange={(e) => setCommissionMode(e.target.value as any)}
                  className="w-5 h-5"
                />
                <div>
                  <div className="font-medium">אחוז</div>
                  <div className="text-sm text-gray-600">עמלה לפי אחוז מהמחיר, עם מינימום</div>
                </div>
              </label>
            </div>
          </div>

          {/* Fixed Amount */}
          {commissionMode === 'fixed' && (
            <div>
              <label htmlFor="fixedAmount" className="block font-medium mb-2">
                סכום קבוע (₪)
              </label>
              <input
                type="number"
                id="fixedAmount"
                value={fixedAmount}
                onChange={(e) => setFixedAmount(Number(e.target.value))}
                min="0"
                step="0.5"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          )}

          {/* Percentage */}
          {commissionMode === 'percentage' && (
            <div>
              <label htmlFor="percentage" className="block font-medium mb-2">
                אחוז עמלה (%)
              </label>
              <input
                type="number"
                id="percentage"
                value={percentage}
                onChange={(e) => setPercentage(Number(e.target.value))}
                min="0"
                max="100"
                step="0.5"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          )}

          {/* Minimum Amount */}
          {commissionMode === 'percentage' && (
            <div>
              <label htmlFor="minAmount" className="block font-medium mb-2">
                עמלה מינימלית (₪)
              </label>
              <input
                type="number"
                id="minAmount"
                value={minAmount}
                onChange={(e) => setMinAmount(Number(e.target.value))}
                min="0"
                step="0.5"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          )}

          {/* Default Shipping Fee */}
          <div>
            <label htmlFor="defaultShipping" className="block font-medium mb-2">
              עלות משלוח ברירת מחדל (₪)
            </label>
            <input
              type="number"
              id="defaultShipping"
              value={defaultShipping}
              onChange={(e) => setDefaultShipping(Number(e.target.value))}
              min="0"
              step="1"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Examples */}
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-medium mb-3">דוגמאות לחישוב עמלה:</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>מוצר במחיר ₪50:</span>
                <span className="font-medium">עמלה: ₪{calculateExampleCommission(50).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>מוצר במחיר ₪100:</span>
                <span className="font-medium">עמלה: ₪{calculateExampleCommission(100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>מוצר במחיר ₪500:</span>
                <span className="font-medium">עמלה: ₪{calculateExampleCommission(500).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4">
            <button
              onClick={saveCommissionSettings}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'שומר...' : 'שמור הגדרות'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}


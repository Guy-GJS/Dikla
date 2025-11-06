// Database types

export interface Profile {
  id: string
  full_name: string | null
  phone: string | null
  role: 'user' | 'admin'
  created_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  image_url: string | null
  is_featured: boolean
  sort_order: number
  created_at?: string
  item_count?: number
}

export type ItemCondition = 'חדש' | 'כמו חדש' | 'מצב טוב' | 'סביר'
export type ItemStatus = 'pending_approval' | 'approved' | 'sold' | 'rejected'

export interface Item {
  id: string
  seller_id: string | null
  title: string
  description: string | null
  category_id: string | null
  condition: ItemCondition | null
  city: string | null
  neighborhood: string | null
  price_ask: number
  image_urls: string[]
  status: ItemStatus
  featured: boolean
  seller_name: string | null
  seller_email: string | null
  seller_phone: string | null
  created_at: string
  category?: Category
}

export type OrderType = 'delivery' | 'pickup'
export type OrderStatus = 'initiated' | 'paid' | 'failed'

export interface Order {
  id: string
  item_id: string
  buyer_first_name: string | null
  buyer_last_name: string | null
  buyer_email: string | null
  buyer_phone: string | null
  type: OrderType
  subtotal: number
  pritti_fee: number
  shipping_fee: number
  total: number
  status: OrderStatus
  stripe_payment_intent_id: string | null
  created_at: string
  item?: Item
}

export interface WantedItemLead {
  id: string
  query_text: string | null
  category_id: string | null
  city: string | null
  name: string | null
  email: string | null
  phone: string | null
  created_at: string
  category?: Category
}

export interface Settings {
  key: string
  value: any
  updated_at?: string
}

export type CommissionMode = 'fixed' | 'percentage'

export interface CommissionSettings {
  mode: CommissionMode
  fixed_amount: number
  percentage: number
  min_amount: number
}


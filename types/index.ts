export interface Restaurant {
  id: string
  user_id: string
  name: string
  logo_url: string | null
  plan: string
  created_at: string
  updated_at: string
}

export interface MenuItem {
  id: string
  restaurant_id: string
  name: string
  price: number
  description: string | null
  image_url: string | null
  category: string
  is_available: boolean
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  restaurant_id: string
  customer_name: string
  customer_phone: string
  items: any[]
  total_amount: number
  order_status: string
  payment_method: string | null
  special_instructions: string | null
  created_at: string
  updated_at: string
}

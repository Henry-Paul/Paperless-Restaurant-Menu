"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Order {
  id: string
  customer_name: string
  customer_phone: string
  total_amount: number
  order_status: string
  created_at: string
}

export default function OrdersList({ restaurantId }: { restaurantId: string }) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    loadOrders()
  }, [restaurantId])

  const loadOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("restaurant_id", restaurantId)
        .order("created_at", { ascending: false })

      if (error) throw error
      setOrders(data || [])
    } catch (error) {
      console.error("Error loading orders:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading orders...</div>
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="pt-12 text-center">
          <p className="text-gray-600">No orders yet</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Card key={order.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{order.customer_name}</CardTitle>
                <CardDescription>{order.customer_phone}</CardDescription>
              </div>
              <Badge
                variant={
                  order.order_status === "pending"
                    ? "outline"
                    : order.order_status === "confirmed"
                      ? "default"
                      : "secondary"
                }
              >
                {order.order_status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">{new Date(order.created_at).toLocaleString()}</span>
              <span className="font-semibold">₹{order.total_amount.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

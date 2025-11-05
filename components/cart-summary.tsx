"use client"

import type React from "react"

import { useState } from "react"
import type { MenuItem } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"

interface CartSummaryProps {
  cart: Map<string, number>
  items: MenuItem[]
  restaurantId: string
}

export default function CartSummary({ cart, items, restaurantId }: CartSummaryProps) {
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [specialInstructions, setSpecialInstructions] = useState("")
  const [loading, setLoading] = useState(false)

  const supabase = createClient()

  const cartItems = Array.from(cart.entries()).map(([itemId, quantity]) => {
    const item = items.find((i) => i.id === itemId)
    return { item, quantity }
  })

  const total = cartItems.reduce((sum, { item, quantity }) => sum + (item?.price || 0) * quantity, 0)

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const orderItems = cartItems.map(({ item, quantity }) => ({
        id: item?.id,
        name: item?.name,
        price: item?.price,
        quantity,
      }))

      const { error } = await supabase.from("orders").insert({
        restaurant_id: restaurantId,
        customer_name: customerName,
        customer_phone: customerPhone,
        items: orderItems,
        total_amount: total,
        special_instructions: specialInstructions || null,
        order_status: "pending",
      })

      if (error) throw error

      // Send to WhatsApp
      const message = `Order from ${customerName}\nPhone: ${customerPhone}\n\nItems:\n${orderItems
        .map((item) => `${item.name} x${item.quantity} - ₹${(item.price! * item.quantity).toFixed(2)}`)
        .join("\n")}\n\nTotal: ₹${total.toFixed(2)}`

      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
      window.open(whatsappUrl, "_blank")

      // Reset form
      setCustomerName("")
      setCustomerPhone("")
      setSpecialInstructions("")
    } catch (error) {
      console.error("Error placing order:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Order</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {cartItems.map(({ item, quantity }) => (
                <div key={item?.id} className="flex justify-between text-sm">
                  <span>
                    {item?.name} x{quantity}
                  </span>
                  <span className="font-semibold">₹{((item?.price || 0) * quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-2 flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>₹{total.toFixed(2)}</span>
            </div>

            <form onSubmit={handleCheckout} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="name" className="text-xs">
                    Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                    size={30}
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-xs">
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    placeholder="9876543210"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    required
                    size={30}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="instructions" className="text-xs">
                  Special Instructions (optional)
                </Label>
                <Input
                  id="instructions"
                  placeholder="No onions, extra spice..."
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  size={30}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Placing order..." : "Place Order on WhatsApp"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

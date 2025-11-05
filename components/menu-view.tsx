"use client"

import { useState } from "react"
import type { MenuItem } from "@/types"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import CartSummary from "./cart-summary"

interface MenuViewProps {
  restaurant: any
  items: MenuItem[]
  isPremium: boolean
}

export default function MenuView({ restaurant, items, isPremium }: MenuViewProps) {
  const [cart, setCart] = useState<Map<string, number>>(new Map())
  const [showCart, setShowCart] = useState(false)

  const addToCart = (itemId: string) => {
    const newCart = new Map(cart)
    newCart.set(itemId, (newCart.get(itemId) || 0) + 1)
    setCart(newCart)
  }

  const removeFromCart = (itemId: string) => {
    const newCart = new Map(cart)
    const count = newCart.get(itemId) || 0
    if (count <= 1) {
      newCart.delete(itemId)
    } else {
      newCart.set(itemId, count - 1)
    }
    setCart(newCart)
  }

  const cartCount = Array.from(cart.values()).reduce((a, b) => a + b, 0)
  const categories = Array.from(new Set(items.map((item) => item.category)))

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pb-32">
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{restaurant.name}</h1>
            {restaurant.logo_url && (
              <img
                src={restaurant.logo_url || "/placeholder.svg"}
                alt={restaurant.name}
                className="w-20 h-20 mt-4 rounded-lg object-cover"
              />
            )}
          </div>
          {isPremium && cartCount > 0 && (
            <Button onClick={() => setShowCart(!showCart)} className="gap-2">
              <ShoppingCart className="w-4 h-4" />
              Cart ({cartCount})
            </Button>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {categories.map((category) => (
          <div key={category} className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{category}</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {items
                .filter((item) => item.category === category)
                .map((item) => (
                  <Card key={item.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="pt-4">
                      {item.image_url && (
                        <img
                          src={item.image_url || "/placeholder.svg"}
                          alt={item.name}
                          className="w-full h-48 object-cover rounded-md mb-3"
                        />
                      )}
                      <h3 className="font-semibold text-lg text-gray-900">{item.name}</h3>
                      {item.description && (
                        <p className="text-sm text-gray-600 line-clamp-2 mt-2">{item.description}</p>
                      )}
                      <div className="flex justify-between items-center mt-4">
                        <span className="text-xl font-bold text-blue-600">₹{item.price.toFixed(2)}</span>
                        {isPremium && (
                          <div className="flex gap-2">
                            {cart.get(item.id) ? (
                              <>
                                <Button size="sm" variant="outline" onClick={() => removeFromCart(item.id)}>
                                  -
                                </Button>
                                <Button size="sm" variant="outline" disabled>
                                  {cart.get(item.id)}
                                </Button>
                                <Button size="sm" onClick={() => addToCart(item.id)}>
                                  +
                                </Button>
                              </>
                            ) : (
                              <Button size="sm" onClick={() => addToCart(item.id)} className="gap-2">
                                <ShoppingCart className="w-4 h-4" />
                                Add
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        ))}
      </div>

      {isPremium && showCart && cart.size > 0 && (
        <CartSummary cart={cart} items={items} restaurantId={restaurant.id} onClose={() => setShowCart(false)} />
      )}
    </div>
  )
}

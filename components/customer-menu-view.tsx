"use client"

import { useState, useEffect } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ShoppingCart, Plus, Minus } from "lucide-react"

export function CustomerMenuView({ restaurantId, isPremium }: { restaurantId: string; isPremium: boolean }) {
  const [restaurant, setRestaurant] = useState<any>(null)
  const [menuItems, setMenuItems] = useState<any[]>([])
  const [cart, setCart] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  useEffect(() => {
    loadMenuData()
  }, [])

  const loadMenuData = async () => {
    try {
      const { data: restaurantData } = await supabase.from("restaurants").select("*").eq("id", restaurantId).single()

      const { data: itemsData } = await supabase
        .from("menu_items")
        .select("*")
        .eq("restaurant_id", restaurantId)
        .order("category, name")

      setRestaurant(restaurantData)
      setMenuItems(itemsData || [])
    } catch (error) {
      console.error("[v0] Error loading menu:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading menu...</div>
  }

  if (!restaurant) {
    return <div className="text-center py-12">Restaurant not found</div>
  }

  const addToCart = (itemId: string) => {
    setCart((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }))
  }

  const removeFromCart = (itemId: string) => {
    setCart((prev) => {
      const newCart = { ...prev }
      if (newCart[itemId] > 1) {
        newCart[itemId]--
      } else {
        delete newCart[itemId]
      }
      return newCart
    })
  }

  const cartTotal = Object.entries(cart).reduce((total, [itemId, quantity]) => {
    const item = menuItems.find((i) => i.id === itemId)
    return total + (item?.price || 0) * quantity
  }, 0)

  const groupedItems = menuItems.reduce(
    (acc, item) => {
      const category = item.category || "Other"
      if (!acc[category]) acc[category] = []
      acc[category].push(item)
      return acc
    },
    {} as Record<string, any[]>,
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-50 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            {restaurant.logo_url && (
              <img
                src={restaurant.logo_url || "/placeholder.svg"}
                alt={restaurant.name}
                className="h-10 object-contain mb-2"
              />
            )}
            <h1 className="text-2xl font-bold text-foreground">{restaurant.name}</h1>
          </div>
          {isPremium && Object.keys(cart).length > 0 && (
            <div className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg">
              <ShoppingCart className="w-5 h-5" />
              <span className="font-semibold">{Object.values(cart).reduce((a, b) => a + b, 0)} items</span>
            </div>
          )}
        </div>
      </div>

      {/* Menu Content */}
      <div className="max-w-4xl mx-auto p-4">
        {Object.entries(groupedItems).map(([category, items]) => (
          <div key={category} className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6 sticky top-16 bg-background py-2">{category}</h2>
            <div className="grid gap-4">
              {items.map((item) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      {item.image_url && (
                        <img
                          src={item.image_url || "/placeholder.svg"}
                          alt={item.name}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-foreground text-lg">{item.name}</h3>
                            {item.description && (
                              <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                            )}
                          </div>
                          <p className="text-lg font-bold text-primary">₹{item.price}</p>
                        </div>
                        {isPremium && (
                          <div className="flex items-center gap-2 mt-4">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => removeFromCart(item.id)}
                              disabled={!cart[item.id]}
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="w-8 text-center font-semibold">{cart[item.id] || 0}</span>
                            <Button
                              size="sm"
                              onClick={() => addToCart(item.id)}
                              className="bg-primary hover:bg-primary/90"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Cart Footer for Premium */}
      {isPremium && Object.keys(cart).length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="text-xl font-bold text-foreground">Total: ₹{cartTotal.toFixed(2)}</div>
              <Button
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={() => {
                  // Implement checkout logic
                  console.log("[v0] Checkout clicked")
                }}
              >
                Proceed to Order
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

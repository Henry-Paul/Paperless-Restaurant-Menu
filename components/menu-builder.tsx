"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AddMenuItemDialog from "./add-menu-item-dialog"
import MenuItemCard from "./menu-item-card"
import QRCodeGenerator from "./qr-code-generator"

interface MenuItem {
  id: string
  name: string
  price: number
  description: string | null
  image_url: string | null
  category: string
  is_available: boolean
}

export default function MenuBuilder({
  restaurantId,
  restaurantPlan,
}: {
  restaurantId: string
  restaurantPlan: string
}) {
  const [items, setItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadMenuItems()
  }, [restaurantId])

  const loadMenuItems = async () => {
    try {
      const { data, error } = await supabase.from("menu_items").select("*").eq("restaurant_id", restaurantId)

      if (error) throw error
      setItems(data || [])
    } catch (error) {
      console.error("Error loading menu items:", error)
    } finally {
      setLoading(false)
    }
  }

  const categories = Array.from(new Set(items.map((item) => item.category)))

  if (loading) {
    return <div className="text-center py-8">Loading menu...</div>
  }

  return (
    <div className="space-y-8">
      <Tabs defaultValue="items" className="space-y-4">
        <TabsList>
          <TabsTrigger value="items">Menu Items</TabsTrigger>
          <TabsTrigger value="qr">QR Code</TabsTrigger>
          {restaurantPlan === "premium" && <TabsTrigger value="settings">Ordering</TabsTrigger>}
        </TabsList>

        <TabsContent value="items" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Menu Items</h2>
            <AddMenuItemDialog
              restaurantId={restaurantId}
              onSuccess={loadMenuItems}
              isPremium={restaurantPlan === "premium"}
            />
          </div>

          {items.length === 0 ? (
            <Card>
              <CardContent className="pt-12 text-center">
                <p className="text-gray-600 mb-4">No menu items yet</p>
                <AddMenuItemDialog
                  restaurantId={restaurantId}
                  onSuccess={loadMenuItems}
                  isPremium={restaurantPlan === "premium"}
                />
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {categories.map((category) => (
                <div key={category}>
                  <h3 className="text-lg font-semibold mb-3 text-gray-700">{category}</h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items
                      .filter((item) => item.category === category)
                      .map((item) => (
                        <MenuItemCard key={item.id} item={item} restaurantId={restaurantId} onUpdate={loadMenuItems} />
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="qr">
          <QRCodeGenerator restaurantId={restaurantId} restaurantPlan={restaurantPlan} />
        </TabsContent>

        {restaurantPlan === "premium" && (
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Premium Ordering Features</CardTitle>
                <CardDescription>Enable direct ordering with shopping cart and WhatsApp integration</CardDescription>
              </CardHeader>
              <CardContent>
                <Button>Enable Direct Ordering</Button>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}

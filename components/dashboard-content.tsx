"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CreateRestaurantDialog from "./create-restaurant-dialog"
import RestaurantCard from "./restaurant-card"
import OrdersList from "./orders-list"
import { AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Restaurant {
  id: string
  name: string
  logo_url: string | null
  plan: string
  created_at: string
}

export default function DashboardContent({ userId }: { userId: string }) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)

  const supabase = createClient()

  useEffect(() => {
    console.log("[v0] DashboardContent mounted, loading restaurants for user:", userId)
    loadRestaurants()
  }, [userId])

  const loadRestaurants = async () => {
    try {
      console.log("[v0] Fetching restaurants...")
      setError(null)
      const { data, error } = await supabase.from("restaurants").select("*").eq("user_id", userId)

      if (error) {
        console.log("[v0] Error fetching restaurants:", error)
        throw error
      }

      console.log("[v0] Restaurants loaded:", data)
      setRestaurants(data || [])
      if (data && data.length > 0) {
        setSelectedRestaurant(data[0])
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to load restaurants"
      console.log("[v0] Dashboard error:", errorMessage)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-blue-600" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-600 mt-2">Manage your digital menus and orders</p>
        </div>
        <CreateRestaurantDialog onSuccess={loadRestaurants} />
      </div>

      {restaurants.length === 0 ? (
        <Card>
          <CardContent className="pt-12 text-center">
            <h3 className="text-xl font-semibold mb-2">No restaurants yet</h3>
            <p className="text-gray-600 mb-6">Create your first restaurant to get started</p>
            <CreateRestaurantDialog onSuccess={loadRestaurants} />
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="restaurants" className="space-y-4">
          <TabsList>
            <TabsTrigger value="restaurants">Restaurants ({restaurants.length})</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="restaurants" className="space-y-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {restaurants.map((restaurant) => (
                <RestaurantCard
                  key={restaurant.id}
                  restaurant={restaurant}
                  isSelected={selectedRestaurant?.id === restaurant.id}
                  onSelect={setSelectedRestaurant}
                  onUpdate={loadRestaurants}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="orders">
            {selectedRestaurant ? (
              <OrdersList restaurantId={selectedRestaurant.id} />
            ) : (
              <p className="text-gray-600">Select a restaurant to view orders</p>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}

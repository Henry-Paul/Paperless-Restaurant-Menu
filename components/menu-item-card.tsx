"use client"

import type { MenuItem } from "@/types"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { Trash2 } from "lucide-react"

interface MenuItemCardProps {
  item: MenuItem
  restaurantId: string
  onUpdate: () => void
}

export default function MenuItemCard({ item, onUpdate }: MenuItemCardProps) {
  const supabase = createClient()

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this item?")) {
      try {
        await supabase.from("menu_items").delete().eq("id", item.id)
        onUpdate()
      } catch (error) {
        console.error("Error deleting item:", error)
      }
    }
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="pt-4">
        {item.image_url && (
          <img
            src={item.image_url || "/placeholder.svg"}
            alt={item.name}
            className="w-full h-48 object-cover rounded-md mb-3"
          />
        )}
        <h3 className="font-semibold text-gray-900">{item.name}</h3>
        {item.description && <p className="text-sm text-gray-600 line-clamp-2 mt-1">{item.description}</p>}
        <div className="flex justify-between items-center mt-4">
          <span className="text-lg font-bold text-blue-600">₹{item.price.toFixed(2)}</span>
          <Button variant="ghost" size="sm" onClick={handleDelete} className="text-red-600 hover:bg-red-50">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

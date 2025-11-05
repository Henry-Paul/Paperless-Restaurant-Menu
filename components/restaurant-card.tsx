"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import type { Restaurant } from "@/types"
import { ChevronRight } from "lucide-react"

interface RestaurantCardProps {
  restaurant: Restaurant
  isSelected: boolean
  onSelect: (restaurant: Restaurant) => void
  onUpdate: () => void
}

export default function RestaurantCard({ restaurant, isSelected, onSelect, onUpdate }: RestaurantCardProps) {
  const planLabel = restaurant.plan === "premium" ? "Plan B: Revenue Accelerator" : "Plan A: Essentials"

  return (
    <Card
      className={`cursor-pointer transition-all ${isSelected ? "ring-2 ring-blue-600" : ""} hover:shadow-lg`}
      onClick={() => onSelect(restaurant)}
    >
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle>{restaurant.name}</CardTitle>
            <CardDescription>{new Date(restaurant.created_at).toLocaleDateString()}</CardDescription>
          </div>
          <Badge variant={restaurant.plan === "premium" ? "default" : "outline"}>{planLabel}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Link href={`/restaurant/${restaurant.id}`}>
          <Button className="w-full gap-2">
            Manage Restaurant
            <ChevronRight className="w-4 h-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}

"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import type { Restaurant } from "@/types"

interface RestaurantCardProps {
  restaurant: Restaurant
  isSelected: boolean
  onSelect: (restaurant: Restaurant) => void
  onUpdate: () => void
}

export default function RestaurantCard({ restaurant, isSelected, onSelect }: RestaurantCardProps) {
  return (
    <Card
      className={`cursor-pointer transition-all ${isSelected ? "ring-2 ring-blue-600" : ""} hover:shadow-lg`}
      onClick={() => onSelect(restaurant)}
    >
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{restaurant.name}</CardTitle>
            <CardDescription>{new Date(restaurant.created_at).toLocaleDateString()}</CardDescription>
          </div>
          <Badge variant={restaurant.plan === "starter" ? "outline" : "default"}>
            {restaurant.plan === "starter" ? "Starter" : "Premium"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Link href={`/restaurant/${restaurant.id}`}>
          <Button className="w-full">Manage Menu</Button>
        </Link>
      </CardContent>
    </Card>
  )
}

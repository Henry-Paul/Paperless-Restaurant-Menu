import { createClient } from "@/lib/supabase/server"
import MenuView from "@/components/menu-view"
import { notFound } from "next/navigation"

export default async function MenuPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const { data: restaurant } = await supabase.from("restaurants").select("*").eq("id", params.id).single()

  if (!restaurant) {
    notFound()
  }

  const { data: items } = await supabase
    .from("menu_items")
    .select("*")
    .eq("restaurant_id", params.id)
    .eq("is_available", true)

  return <MenuView restaurant={restaurant} items={items || []} isPremium={restaurant.plan === "premium"} />
}

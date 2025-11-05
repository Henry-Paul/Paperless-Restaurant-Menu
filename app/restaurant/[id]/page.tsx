import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import MenuBuilder from "@/components/menu-builder"

export default async function RestaurantPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  const { data: restaurant, error } = await supabase
    .from("restaurants")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single()

  if (error || !restaurant) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <nav className="bg-white border-b sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <a href="/dashboard" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            ← Back to Dashboard
          </a>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">{restaurant.name}</h1>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <MenuBuilder restaurantId={restaurant.id} restaurantPlan={restaurant.plan} />
      </div>
    </div>
  )
}

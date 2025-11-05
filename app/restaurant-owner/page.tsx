import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import OwnerProfileSetup from "@/components/owner-profile-setup"
import SubscriptionManager from "@/components/subscription-manager"
import SupportTicketSystem from "@/components/support-ticket-system"

export default async function RestaurantOwnerPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: restaurants } = await supabase.from("restaurants").select("*").eq("user_id", user.id).limit(1)

  const restaurantId = restaurants?.[0]?.id

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Restaurant Owner Portal</h1>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
            <TabsTrigger value="support">Support</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <OwnerProfileSetup userId={user.id} email={user.email || ""} />
          </TabsContent>

          <TabsContent value="subscription" className="space-y-6">
            {restaurantId ? (
              <SubscriptionManager restaurantId={restaurantId} />
            ) : (
              <div className="text-gray-600">No restaurant found. Create one first in your dashboard.</div>
            )}
          </TabsContent>

          <TabsContent value="support" className="space-y-6">
            {restaurantId ? (
              <SupportTicketSystem restaurantId={restaurantId} userId={user.id} />
            ) : (
              <div className="text-gray-600">No restaurant found. Create one first in your dashboard.</div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

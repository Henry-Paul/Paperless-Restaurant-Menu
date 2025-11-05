import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import AdminDashboard from "@/components/admin-dashboard"

export default async function AdminPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Check if user is admin (you can add admin role check in user_profiles)
  const { data: profile } = await supabase.from("user_profiles").select("*").eq("id", user.id).single()

  // For now, allow access - implement proper admin check later
  return <AdminDashboard userId={user.id} />
}

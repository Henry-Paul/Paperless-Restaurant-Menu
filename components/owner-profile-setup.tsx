"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react"

export default function OwnerProfileSetup({ userId, email }: { userId: string; email: string }) {
  const [formData, setFormData] = useState({
    restaurant_name: "",
    phone_number: "",
    city: "",
    state: "",
    country: "",
    business_registration: "",
    gst_number: "",
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const supabase = createClient()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const { error: upsertError } = await supabase.from("user_profiles").upsert(
        {
          id: userId,
          email,
          ...formData,
        },
        { onConflict: "id" },
      )

      if (upsertError) throw upsertError

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save profile"
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Restaurant Owner Profile</CardTitle>
        <CardDescription>Complete your profile to get started</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">Profile saved successfully!</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input type="email" value={email} disabled className="bg-gray-50" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Restaurant Name *</label>
              <Input
                name="restaurant_name"
                value={formData.restaurant_name}
                onChange={handleChange}
                required
                placeholder="Your restaurant name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone Number</label>
              <Input
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">City</label>
              <Input name="city" value={formData.city} onChange={handleChange} placeholder="City" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">State</label>
              <Input name="state" value={formData.state} onChange={handleChange} placeholder="State" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Country</label>
              <Input name="country" value={formData.country} onChange={handleChange} placeholder="Country" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Business Registration</label>
              <Input
                name="business_registration"
                value={formData.business_registration}
                onChange={handleChange}
                placeholder="Business ID / License"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">GST Number (if applicable)</label>
              <Input name="gst_number" value={formData.gst_number} onChange={handleChange} placeholder="GST Number" />
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Profile"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

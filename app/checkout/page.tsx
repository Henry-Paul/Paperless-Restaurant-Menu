"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { loadStripe } from "@stripe/js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"

export default function CheckoutPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const restaurantId = searchParams.get("restaurant")
  const planId = searchParams.get("plan")

  const [plan, setPlan] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    if (planId) {
      loadPlan()
    }
  }, [planId])

  const loadPlan = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from("subscription_plans")
        .select("*")
        .eq("id", planId)
        .single()

      if (fetchError) throw fetchError
      setPlan(data)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load plan"
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const handleCheckout = async () => {
    setProcessing(true)
    setError(null)

    try {
      // Call your backend to create a Stripe checkout session
      const response = await fetch("/api/checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ restaurantId, planId }),
      })

      const { sessionId } = await response.json()
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

      await stripe?.redirectToCheckout({ sessionId })
    } catch (err) {
      const message = err instanceof Error ? err.message : "Checkout failed"
      setError(message)
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-md mx-auto">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {plan && (
          <Card>
            <CardHeader>
              <CardTitle>Upgrade to {plan.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="text-3xl font-bold">${plan.price}</p>
                <p className="text-gray-600">/month</p>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Features:</h3>
                {plan.features?.map((feature: string, idx: number) => (
                  <p key={idx} className="text-sm text-gray-600">
                    • {feature}
                  </p>
                ))}
              </div>

              <Button onClick={handleCheckout} disabled={processing} className="w-full">
                {processing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Proceed to Payment"
                )}
              </Button>

              <Button variant="outline" onClick={() => router.back()} className="w-full">
                Cancel
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

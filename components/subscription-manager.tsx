"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Plan {
  id: string
  name: string
  price: number
  features: string[]
  slug: string
}

interface Subscription {
  id: string
  plan_id: string
  status: string
  current_period_end: string
}

export default function SubscriptionManager({
  restaurantId,
  currentPlanId,
}: {
  restaurantId: string
  currentPlanId?: string
}) {
  const [plans, setPlans] = useState<Plan[]>([])
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    loadPlansAndSubscription()
  }, [])

  const loadPlansAndSubscription = async () => {
    try {
      const { data: plansData, error: plansError } = await supabase.from("subscription_plans").select("*")

      if (plansError) throw plansError

      setPlans(plansData || [])

      // Get current subscription
      const { data: subData } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("restaurant_id", restaurantId)
        .single()

      if (subData) {
        setSubscription(subData)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load plans"
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const handleUpgrade = async (planId: string) => {
    // This would integrate with Stripe
    window.location.href = `/checkout?restaurant=${restaurantId}&plan=${planId}`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isCurrentPlan = subscription?.plan_id === plan.id
          const features = Array.isArray(plan.features) ? plan.features : []

          return (
            <Card key={plan.id} className={isCurrentPlan ? "border-blue-500 border-2" : ""}>
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>
                  <span className="text-2xl font-bold">${plan.price}</span>
                  <span className="text-sm">/month</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {isCurrentPlan ? (
                  <Badge className="w-full justify-center py-2">Current Plan</Badge>
                ) : (
                  <Button onClick={() => handleUpgrade(plan.id)} className="w-full">
                    Upgrade to {plan.name}
                  </Button>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

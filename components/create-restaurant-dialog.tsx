"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function CreateRestaurantDialog({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<"plan" | "details">("plan")
  const [selectedPlan, setSelectedPlan] = useState<"starter" | "premium" | null>(null)
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  const plans = [
    {
      id: "starter",
      name: "Plan A: Digital Menu Essentials",
      description: "Eliminate printing costs instantly",
      price: "Free",
      features: ["Upload your logo", "Add items and pricing", "Professional QR code", "Download QR code"],
    },
    {
      id: "premium",
      name: "Plan B: Revenue Accelerator",
      description: "Turn menu into a revenue stream",
      price: "Premium",
      features: [
        "Full design control",
        "Upload item images",
        "Direct ordering system",
        "WhatsApp integration",
        "OTP verification",
        "Google Review QR code",
      ],
    },
  ]

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      console.log("[v0] Creating restaurant:", name)
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { error: insertError } = await supabase.from("restaurants").insert({
        user_id: user.id,
        name,
        plan: selectedPlan || "starter",
      })

      if (insertError) throw insertError

      console.log("[v0] Restaurant created successfully")
      setName("")
      setStep("plan")
      setSelectedPlan(null)
      setOpen(false)
      onSuccess()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to create restaurant"
      console.log("[v0] Error creating restaurant:", errorMessage)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          New Restaurant
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        {step === "plan" ? (
          <>
            <DialogHeader>
              <DialogTitle>Choose Your Plan</DialogTitle>
              <DialogDescription>Select the plan that best fits your restaurant needs</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              {plans.map((plan) => (
                <Card
                  key={plan.id}
                  className={`cursor-pointer transition-all ${
                    selectedPlan === plan.id ? "ring-2 ring-blue-600" : ""
                  } hover:shadow-lg`}
                  onClick={() => setSelectedPlan(plan.id as "starter" | "premium")}
                >
                  <CardHeader>
                    <CardTitle className="text-base">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <Badge variant={plan.id === "starter" ? "outline" : "default"} className="w-fit mt-2">
                      {plan.price}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="text-sm text-gray-600 flex gap-2">
                          <span className="text-green-600">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Button onClick={() => setStep("details")} disabled={!selectedPlan} className="w-full">
              Continue to Details
            </Button>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Restaurant Details</DialogTitle>
              <DialogDescription>Enter your restaurant name to get started</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Restaurant Name</Label>
                <Input
                  id="name"
                  placeholder="My Awesome Restaurant"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep("plan")}
                  disabled={loading}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Restaurant"
                  )}
                </Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

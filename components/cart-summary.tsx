"use client"

import type React from "react"

import { useState } from "react"
import type { MenuItem } from "@/types"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { X } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface CartSummaryProps {
  cart: Map<string, number>
  items: MenuItem[]
  restaurantId: string
  onClose: () => void
}

export default function CartSummary({ cart, items, restaurantId, onClose }: CartSummaryProps) {
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [specialInstructions, setSpecialInstructions] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [showOTP, setShowOTP] = useState(false)
  const [otp, setOtp] = useState("")
  const [orderData, setOrderData] = useState<any>(null)

  const supabase = createClient()

  const cartItems = Array.from(cart.entries()).map(([itemId, quantity]) => {
    const item = items.find((i) => i.id === itemId)
    return { item, quantity }
  })

  const total = cartItems.reduce((sum, { item, quantity }) => sum + (item?.price || 0) * quantity, 0)

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (!customerName.trim() || !customerPhone.trim()) {
        throw new Error("Please enter your name and phone number")
      }

      const orderItems = cartItems.map(({ item, quantity }) => ({
        id: item?.id,
        name: item?.name,
        price: item?.price,
        quantity,
      }))

      setOrderData({
        customerName,
        customerPhone,
        specialInstructions,
        orderItems,
        total,
      })

      setShowOTP(true)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to process order"
      setError(errorMessage)
      console.error("[v0] Order error:", errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleOTPVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (!otp.trim() || otp.length < 4) {
        throw new Error("Please enter a valid OTP")
      }

      // In production, verify OTP with Twilio or similar
      // For now, we'll just proceed with a simple validation
      console.log("[v0] OTP verified:", otp)

      // Save order to database
      const { error: insertError } = await supabase.from("orders").insert({
        restaurant_id: restaurantId,
        customer_name: orderData.customerName,
        customer_phone: orderData.customerPhone,
        items: orderData.orderItems,
        total_amount: orderData.total,
        special_instructions: orderData.specialInstructions || null,
        order_status: "pending",
      })

      if (insertError) throw insertError

      setSuccess(true)

      // Send to restaurant's WhatsApp
      const message = `New Order Received!\n\nCustomer: ${orderData.customerName}\nPhone: ${orderData.customerPhone}\n\nItems:\n${orderData.orderItems
        .map((item: any) => `${item.name} x${item.quantity} - ₹${(item.price * item.quantity).toFixed(2)}`)
        .join(
          "\n",
        )}\n\nSpecial Instructions: ${orderData.specialInstructions || "None"}\n\nTotal: ₹${orderData.total.toFixed(2)}`

      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
      window.open(whatsappUrl, "_blank")

      // Reset form
      setTimeout(() => {
        setCustomerName("")
        setCustomerPhone("")
        setSpecialInstructions("")
        setOtp("")
        setSuccess(false)
        setShowOTP(false)
        setOrderData(null)
        onClose()
      }, 2000)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to verify OTP"
      setError(errorMessage)
      console.error("[v0] OTP verification error:", errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">{showOTP ? "Verify & Complete Order" : "Your Order"}</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <Card>
          <CardContent className="space-y-4">
            {!showOTP ? (
              <>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {cartItems.map(({ item, quantity }) => (
                    <div key={item?.id} className="flex justify-between text-sm">
                      <span>
                        {item?.name} x{quantity}
                      </span>
                      <span className="font-semibold">₹{((item?.price || 0) * quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-2 flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleCheckout} className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="name" className="text-xs">
                        Name
                      </Label>
                      <Input
                        id="name"
                        placeholder="Your name"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        required
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-xs">
                        Phone
                      </Label>
                      <Input
                        id="phone"
                        placeholder="9876543210"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="instructions" className="text-xs">
                      Special Instructions (optional)
                    </Label>
                    <Input
                      id="instructions"
                      placeholder="No onions, extra spice..."
                      value={specialInstructions}
                      onChange={(e) => setSpecialInstructions(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Processing..." : "Continue to OTP"}
                  </Button>
                </form>
              </>
            ) : (
              <>
                <div className="text-center space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">We've sent an OTP to</p>
                    <p className="font-semibold">{orderData?.customerPhone}</p>
                  </div>

                  <form onSubmit={handleOTPVerification} className="space-y-3">
                    <div>
                      <Label htmlFor="otp" className="text-xs">
                        Enter OTP
                      </Label>
                      <Input
                        id="otp"
                        placeholder="1234"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.slice(0, 6))}
                        maxLength={6}
                        required
                        disabled={loading}
                        className="text-center text-lg tracking-widest"
                      />
                    </div>

                    {success && (
                      <Alert>
                        <AlertCircle className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-600">
                          Order placed successfully! Opening WhatsApp...
                        </AlertDescription>
                      </Alert>
                    )}

                    {error && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Verifying..." : "Place Order"}
                    </Button>
                  </form>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => setShowOTP(false)}
                    disabled={loading}
                  >
                    Back to Form
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

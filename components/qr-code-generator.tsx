"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Copy, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function QRCodeGenerator({
  restaurantId,
  restaurantPlan,
}: {
  restaurantId: string
  restaurantPlan: string
}) {
  const [menuQR, setMenuQR] = useState<string | null>(null)
  const [reviewQR, setReviewQR] = useState<string | null>(null)
  const [googleReviewUrl, setGoogleReviewUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [hasReviewQR, setHasReviewQR] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    generateQRCodes()
    checkReviewQRCode()
  }, [restaurantId])

  const generateQRCodes = async () => {
    setLoading(true)
    try {
      const menuUrl = `${window.location.origin}/menu/${restaurantId}`

      // Generate menu QR code
      const menuQRUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(menuUrl)}`
      setMenuQR(menuQRUrl)
    } catch (error) {
      console.error("Error generating QR codes:", error)
    } finally {
      setLoading(false)
    }
  }

  const checkReviewQRCode = async () => {
    try {
      const { data } = await supabase
        .from("qr_codes")
        .select("*")
        .eq("restaurant_id", restaurantId)
        .eq("qr_code_type", "google_review")
        .single()

      if (data) {
        setHasReviewQR(true)
        setReviewQR(data.qr_code_data)
      }
    } catch (error) {
      console.log("[v0] No review QR code found")
    }
  }

  const generateReviewQR = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!googleReviewUrl.trim()) {
        throw new Error("Please enter your Google Review URL")
      }

      // Generate review QR code
      const reviewQRUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(googleReviewUrl)}`

      // Save to database
      const { error } = await supabase.from("qr_codes").insert({
        restaurant_id: restaurantId,
        qr_code_type: "google_review",
        qr_code_data: reviewQRUrl,
      })

      if (error) throw error

      setReviewQR(reviewQRUrl)
      setHasReviewQR(true)
      setGoogleReviewUrl("")
    } catch (error) {
      console.error("Error generating review QR code:", error)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadQR = (qrUrl: string, filename: string) => {
    const link = document.createElement("a")
    link.href = qrUrl
    link.download = filename
    link.click()
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Menu QR Code</CardTitle>
          <CardDescription>Share this QR code to let customers scan and view your menu</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {menuQR && (
            <div className="flex flex-col items-center gap-4">
              <img
                src={menuQR || "/placeholder.svg"}
                alt="Menu QR Code"
                className="w-64 h-64 p-4 bg-white border rounded"
              />
              <div className="flex gap-2">
                <Button onClick={() => downloadQR(menuQR, "menu-qr-code.png")} className="gap-2">
                  <Download className="w-4 h-4" />
                  Download
                </Button>
                <Button variant="outline" onClick={() => copyToClipboard(menuQR)} className="gap-2">
                  <Copy className="w-4 h-4" />
                  {copied ? "Copied!" : "Copy Link"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {restaurantPlan === "premium" && (
        <Card>
          <CardHeader>
            <CardTitle>Google Review QR Code</CardTitle>
            <CardDescription>Share this QR code to drive customer reviews (Premium Add-on)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!hasReviewQR ? (
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="gap-2 bg-transparent" variant="outline">
                    <Plus className="w-4 h-4" />
                    Generate Review QR Code
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Generate Google Review QR Code</DialogTitle>
                    <DialogDescription>Enter your Google review URL to create a dedicated QR code</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={generateReviewQR} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="review-url">Google Review URL</Label>
                      <Input
                        id="review-url"
                        placeholder="https://g.co/kgs/..."
                        value={googleReviewUrl}
                        onChange={(e) => setGoogleReviewUrl(e.target.value)}
                        required
                        disabled={loading}
                      />
                    </div>
                    <Button type="submit" disabled={loading} className="w-full">
                      {loading ? "Generating..." : "Generate QR Code"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            ) : reviewQR ? (
              <div className="flex flex-col items-center gap-4">
                <img
                  src={reviewQR || "/placeholder.svg"}
                  alt="Review QR Code"
                  className="w-64 h-64 p-4 bg-white border rounded"
                />
                <div className="flex gap-2">
                  <Button onClick={() => downloadQR(reviewQR, "review-qr-code.png")} className="gap-2">
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                  <Button variant="outline" onClick={() => copyToClipboard(reviewQR)} className="gap-2">
                    <Copy className="w-4 h-4" />
                    {copied ? "Copied!" : "Copy Link"}
                  </Button>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

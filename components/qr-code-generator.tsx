"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Copy } from "lucide-react"

export default function QRCodeGenerator({
  restaurantId,
  restaurantPlan,
}: {
  restaurantId: string
  restaurantPlan: string
}) {
  const [menuQR, setMenuQR] = useState<string | null>(null)
  const [reviewQR, setReviewQR] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    generateQRCodes()
  }, [restaurantId])

  const generateQRCodes = async () => {
    setLoading(true)
    try {
      const menuUrl = `${window.location.origin}/menu/${restaurantId}`
      const reviewUrl = `https://google.com/search?q=restaurant+reviews`

      // Generate QR codes using a QR API
      const menuQRUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(menuUrl)}`
      const reviewQRUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(reviewUrl)}`

      setMenuQR(menuQRUrl)
      if (restaurantPlan === "premium") {
        setReviewQR(reviewQRUrl)
      }
    } catch (error) {
      console.error("Error generating QR codes:", error)
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

      {restaurantPlan === "premium" && reviewQR && (
        <Card>
          <CardHeader>
            <CardTitle>Google Review QR Code</CardTitle>
            <CardDescription>Share this QR code to drive customer reviews</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
          </CardContent>
        </Card>
      )}
    </div>
  )
}

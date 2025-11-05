import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, QrCode, ShoppingCart, MessageCircle, Star } from "lucide-react"

export default function LandingPage() {
  const features = [
    {
      title: "Digital Menu Essentials",
      description: "Eliminate printing costs instantly",
      benefits: ["Upload your logo", "Add items and pricing", "Professional QR code"],
      icon: QrCode,
    },
    {
      title: "Revenue Accelerator",
      description: "Turn your menu into a direct ordering engine",
      benefits: ["Full design control with images", "Direct ordering system", "WhatsApp integration"],
      icon: ShoppingCart,
    },
    {
      title: "Reputation Power",
      description: "Generate more 5-star reviews",
      benefits: ["Google Review QR code", "Easy customer reviews", "Built-in ratings"],
      icon: Star,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600">MenuHub</div>
          <div className="flex gap-4">
            <Link href="/auth/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button className="bg-blue-600 hover:bg-blue-700">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 text-balance">
            Stop Printing, Start Selling
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto text-pretty">
            Replace costly paper menus with a powerful digital system. Save money and drive more direct orders.
          </p>
          <Link href="/auth/sign-up">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8">
              Launch Your Digital Menu Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">Choose Your Plan</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon
              return (
                <Card key={idx} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <Icon className="w-8 h-8 text-blue-600 mb-2" />
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {feature.benefits.map((benefit, i) => (
                        <li key={i} className="flex gap-2 items-start">
                          <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-700">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">Why Choose MenuHub?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <ShoppingCart className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Zero Commissions</h3>
                  <p className="text-gray-600">
                    All orders come directly to your WhatsApp - no middleman, no commissions.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <QrCode className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Instant Setup</h3>
                  <p className="text-gray-600">Create your menu and QR code in minutes. No coding required.</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">WhatsApp Orders</h3>
                  <p className="text-gray-600">Customers order on your menu and orders arrive directly in WhatsApp.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Star className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Build Reputation</h3>
                  <p className="text-gray-600">Easy Google Review links to build your 5-star reputation online.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of restaurants already saving money and getting more direct orders.
          </p>
          <Link href="/auth/sign-up">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Start Free Today
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

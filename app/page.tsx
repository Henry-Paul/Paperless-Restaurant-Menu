import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, QrCode, ShoppingCart, MessageCircle, Star, Zap, TrendingUp, Lock } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-border z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">MenuHub</span>
          </div>
          <div className="flex gap-4 items-center">
            <Link href="/auth/login">
              <Button variant="ghost" className="text-foreground">
                Login
              </Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Get Started Free</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-6 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
            <p className="text-sm font-semibold text-primary">Stop Printing, Start Selling</p>
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold text-foreground mb-8 text-balance leading-tight">
            Your Digital Menu is Worth More Than You Think
          </h1>

          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto text-pretty leading-relaxed">
            Transform your paper menu into a revenue-driving asset. Eliminate printing costs, accelerate direct orders,
            and build customer loyalty—all through one simple platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/auth/sign-up">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6">
                Launch Your Digital Menu Free
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-transparent">
              Watch Demo
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-col sm:flex-row gap-8 justify-center text-muted-foreground text-sm font-medium">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-600" />
              No credit card needed
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-600" />
              Live in under 5 minutes
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary" />
              100% data secure
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 border-y border-border">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-foreground">Choose Your Plan</h2>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Plan A */}
            <Card className="relative border-2 border-border hover:border-secondary/50 transition-colors">
              <CardHeader className="pb-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <CardTitle className="text-2xl mb-2">Digital Menu Essentials</CardTitle>
                    <CardDescription className="text-base">Perfect for getting started</CardDescription>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <QrCode className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-foreground">Free</span>
                  <span className="text-muted-foreground ml-2">forever</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-4">
                  <li className="flex gap-3 items-start">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground">Upload Logo</p>
                      <p className="text-sm text-muted-foreground">Professional branding instantly</p>
                    </div>
                  </li>
                  <li className="flex gap-3 items-start">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground">Item Management</p>
                      <p className="text-sm text-muted-foreground">Add names, prices, descriptions</p>
                    </div>
                  </li>
                  <li className="flex gap-3 items-start">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground">QR Code Generator</p>
                      <p className="text-sm text-muted-foreground">Printable, scannable, instant access</p>
                    </div>
                  </li>
                  <li className="flex gap-3 items-start">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground">Beautiful Menu</p>
                      <p className="text-sm text-muted-foreground">Mobile-responsive display</p>
                    </div>
                  </li>
                </ul>
                <Link href="/auth/sign-up" className="block">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Start Free</Button>
                </Link>
              </CardContent>
            </Card>

            {/* Plan B */}
            <Card className="relative border-2 border-primary bg-primary/5 hover:border-primary/70 transition-colors">
              <div className="absolute top-0 right-0 px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-bl-lg">
                MOST POPULAR
              </div>
              <CardHeader className="pb-6 pt-12">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <CardTitle className="text-2xl mb-2">Revenue Accelerator</CardTitle>
                    <CardDescription className="text-base">
                      Full ordering engine for restaurants serious about growth
                    </CardDescription>
                  </div>
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-foreground">$9</span>
                  <span className="text-muted-foreground ml-2">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-4">
                  <li className="flex gap-3 items-start">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground">Everything in Essentials</p>
                      <p className="text-sm text-muted-foreground">Plus premium features</p>
                    </div>
                  </li>
                  <li className="flex gap-3 items-start">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground">Image Upload</p>
                      <p className="text-sm text-muted-foreground">High-quality item photos</p>
                    </div>
                  </li>
                  <li className="flex gap-3 items-start">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground">Add to Cart</p>
                      <p className="text-sm text-muted-foreground">Full e-commerce experience</p>
                    </div>
                  </li>
                  <li className="flex gap-3 items-start">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground">WhatsApp Orders</p>
                      <p className="text-sm text-muted-foreground">Direct orders, zero commission</p>
                    </div>
                  </li>
                  <li className="flex gap-3 items-start">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground">Customer Verification</p>
                      <p className="text-sm text-muted-foreground">OTP confirmation system</p>
                    </div>
                  </li>
                </ul>
                <Link href="/auth/sign-up" className="block">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                    Start 14-Day Trial
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Add-on */}
          <Card className="max-w-2xl mx-auto border-dashed">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-600" />
                Reputation Power Add-On
              </CardTitle>
              <CardDescription>Available with any plan</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Generate a dedicated Google Review QR code that takes customers directly to your review page. Build your
                reputation effortlessly.
              </p>
              <p className="text-lg font-semibold text-foreground">$2/month</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-foreground">Your Journey to Digital Success</h2>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Sign Up",
                description: "Create your account in seconds with just your email",
              },
              {
                step: "2",
                title: "Choose Plan",
                description: "Pick your plan and start building your menu immediately",
              },
              {
                step: "3",
                title: "Add Items",
                description: "Upload logo, add items, set prices, done in 5 minutes",
              },
              {
                step: "4",
                title: "Go Live",
                description: "Generate QR code and share with customers right away",
              },
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-foreground mb-2 text-lg">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 border-y border-border">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-foreground">Why Restaurants Love MenuHub</h2>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              {[
                {
                  icon: ShoppingCart,
                  title: "Zero Commissions",
                  description: "Orders come directly to your WhatsApp. No middleman, no hidden fees.",
                },
                {
                  icon: Zap,
                  title: "Instant Setup",
                  description: "Get your menu live in under 5 minutes. No technical skills needed.",
                },
                {
                  icon: TrendingUp,
                  title: "Increase AOV",
                  description: "Beautiful menu design drives higher order values and customer engagement.",
                },
              ].map((item, idx) => {
                const Icon = item.icon
                return (
                  <div key={idx} className="flex gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                      <p className="text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="space-y-6">
              {[
                {
                  icon: MessageCircle,
                  title: "WhatsApp Orders",
                  description: "Customers order directly through your menu. Orders land in WhatsApp instantly.",
                },
                {
                  icon: QrCode,
                  title: "One Click Sharing",
                  description: "Print your QR code or share the link anywhere. Works everywhere, works for everyone.",
                },
                {
                  icon: Star,
                  title: "Build Reputation",
                  description: "Easy Google Review links help you get 5-star reviews and boost local ranking.",
                },
              ].map((item, idx) => {
                const Icon = item.icon
                return (
                  <div key={idx} className="flex gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                      <p className="text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Restaurant?</h2>
          <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto">
            Join hundreds of restaurant owners who've already saved money, increased orders, and built customer loyalty
            with MenuHub.
          </p>
          <Link href="/auth/sign-up">
            <Button size="lg" className="bg-primary-foreground text-primary hover:bg-slate-100 text-lg px-10 py-6">
              Start Your Free Menu Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center text-muted-foreground text-sm">
          <p>MenuHub © 2025. All rights reserved. | Privacy Policy | Terms of Service</p>
        </div>
      </footer>
    </div>
  )
}

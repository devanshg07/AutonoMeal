"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ChefHat, Brain, Utensils, CheckCircle, Lock, Sparkles, Star, ArrowRight, X } from "lucide-react"
import Dashboard from "@/components/dashboard"

export default function AutonoMealApp() {
  const [mounted, setMounted] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<"login" | "register">("login")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const cursorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [mounted])

  useEffect(() => {
    if (!mounted || !cursorRef.current) return

    cursorRef.current.style.left = `${mousePosition.x}px`
    cursorRef.current.style.top = `${mousePosition.y}px`
  }, [mousePosition, mounted])

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch(`http://localhost:5000/api/${authMode}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (response.ok) {
        setIsAuthenticated(true)
        setShowAuthModal(false)
        setUsername("")
        setPassword("")
        localStorage.setItem("user", JSON.stringify(data.user))
        localStorage.setItem("token", data.token)
      } else {
        setError(data.error || "Authentication failed")
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem("user")
    localStorage.removeItem("token")
  }

  useEffect(() => {
    if (!mounted) return

    const user = localStorage.getItem("user")
    const token = localStorage.getItem("token")
    if (user && token) {
      setIsAuthenticated(true)
    }
  }, [mounted])

  if (isAuthenticated) {
    return <Dashboard onLogout={handleLogout} />
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 relative overflow-hidden">
        <header className="border-b border-white/20 backdrop-blur-sm bg-white/80 relative z-10">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 group hover:scale-105 transition-all duration-300">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <ChefHat className="w-6 h-6 text-white group-hover:rotate-12 transition-transform duration-300" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  autonoMeal
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 hover:scale-105"
                >
                  Sign In
                </Button>
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 py-16 relative z-10">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-6 group hover:scale-110 transition-all duration-500">
              <div className="relative">
                <ChefHat className="w-16 h-16 text-gray-800 group-hover:rotate-12 transition-transform duration-500" />
                <Sparkles className="w-6 h-6 text-blue-500 absolute -top-1 -right-1 animate-pulse group-hover:animate-spin" />
              </div>
              <h1 className="text-6xl font-bold">
                <span className="text-gray-800 group-hover:text-blue-600 transition-colors duration-500">autono</span>
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Meal</span>
              </h1>
            </div>

            <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent mb-6 hover:scale-105 transition-transform duration-300">
              Every meal, a step toward independence
            </h2>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed hover:text-gray-800 transition-colors duration-300">
              AI-powered recipe recommendations that adapt to your skill level, available ingredients, and culinary
              preferences
            </p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-gradient-to-r from-green-300/15 to-blue-300/15 rounded-full blur-3xl animate-bounce-slow"></div>
        <div className="absolute bottom-1/3 left-1/4 w-48 h-48 bg-gradient-to-r from-orange-300/15 to-purple-300/15 rounded-full blur-3xl animate-float"></div>
      </div>

      <div
        ref={cursorRef}
        className="fixed w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full pointer-events-none z-50 transition-all duration-100 ease-out opacity-60 blur-sm"
        style={{ transform: "translate(-50%, -50%)" }}
      />

      <header className="border-b border-white/20 backdrop-blur-sm bg-white/80 relative z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 group hover:scale-105 transition-all duration-300">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                <ChefHat className="w-6 h-6 text-white group-hover:rotate-12 transition-transform duration-300" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                autonoMeal
              </span>
            </div>
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all duration-300 hover:scale-105"
                >
                  Logout
                </Button>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setAuthMode("login")
                      setShowAuthModal(true)
                    }}
                    className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 hover:scale-105"
                  >
                    Sign In
                  </Button>
                  <Button
                    onClick={() => {
                      setAuthMode("register")
                      setShowAuthModal(true)
                    }}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-16 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6 group hover:scale-110 transition-all duration-500">
            <div className="relative">
              <ChefHat className="w-16 h-16 text-gray-800 group-hover:rotate-12 transition-transform duration-500" />
              <Sparkles className="w-6 h-6 text-blue-500 absolute -top-1 -right-1 animate-pulse group-hover:animate-spin" />
            </div>
            <h1 className="text-6xl font-bold">
              <span className="text-gray-800 group-hover:text-blue-600 transition-colors duration-500">autono</span>
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Meal</span>
            </h1>
          </div>

          <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent mb-6 hover:scale-105 transition-transform duration-300">
            Every meal, a step toward independence
          </h2>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed hover:text-gray-800 transition-colors duration-300">
            AI-powered recipe recommendations that adapt to your skill level, available ingredients, and culinary
            preferences
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
          <Card className="border-0 bg-white/80 backdrop-blur-sm p-8 text-center hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-2 group cursor-pointer">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl group-hover:rotate-12 transition-all duration-500">
              <Brain className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-300">
              AI-Powered
            </h3>
          </Card>

          <Card className="border-0 bg-white/80 backdrop-blur-sm p-8 text-center hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-2 group cursor-pointer">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl group-hover:rotate-12 transition-all duration-500">
              <Utensils className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors duration-300">
              Skill-Adaptive
            </h3>
          </Card>

          <Card className="border-0 bg-white/80 backdrop-blur-sm p-8 text-center hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-2 group cursor-pointer">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl group-hover:rotate-12 transition-all duration-500">
              <CheckCircle className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-green-600 transition-colors duration-300">
              Ingredient-Smart
            </h3>
          </Card>
        </div>

        {/* Recipe Form Section */}
        <div className="max-w-4xl mx-auto">
          <Card className="overflow-hidden shadow-2xl border-0 backdrop-blur-xl bg-white/10 hover:bg-white/20 transition-all duration-700 hover:scale-[1.03] hover:-translate-y-8 group relative animate-float-gentle border border-white/20 hover:border-white/40">
            {/* Floating glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-cyan-500/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700 animate-pulse"></div>

            {/* Floating particles around the card */}
            <div className="absolute -top-4 -left-4 w-3 h-3 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-bounce transition-all duration-500 delay-100"></div>
            <div className="absolute -top-6 right-1/4 w-2 h-2 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-all duration-500 delay-200"></div>
            <div className="absolute -bottom-4 -right-4 w-4 h-4 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-all duration-500 delay-300"></div>
            <div className="absolute top-1/2 -left-6 w-2 h-2 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-bounce transition-all duration-500 delay-400"></div>
            <div className="absolute top-1/4 -right-6 w-3 h-3 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-all duration-500 delay-500"></div>

            {/* Enhanced header with floating effect */}
            <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 px-8 py-8 relative overflow-hidden group-hover:from-blue-500 group-hover:via-purple-500 group-hover:to-cyan-500 transition-all duration-700">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/50 to-purple-600/50 animate-pulse group-hover:animate-none"></div>

              {/* Floating decorative elements in header */}
              <div className="absolute top-4 right-8 opacity-30 group-hover:opacity-60 transition-opacity duration-500">
                <Sparkles className="w-6 h-6 text-white animate-spin-slow group-hover:animate-pulse" />
              </div>
              <div className="absolute bottom-4 left-8 opacity-20 group-hover:opacity-50 transition-opacity duration-500">
                <Star className="w-4 h-4 text-yellow-300 animate-pulse group-hover:animate-bounce" />
              </div>

              {/* Enhanced title with floating animation */}
              <div className="relative z-10 text-center group-hover:transform group-hover:-translate-y-1 transition-transform duration-500">
                <h1 className="text-4xl font-bold text-white mb-2 group-hover:text-cyan-100 transition-colors duration-500">
                  Get Your Perfect Recipe
                </h1>
                <div className="h-1 w-24 bg-gradient-to-r from-white/50 to-cyan-300/50 rounded-full mx-auto mb-3 group-hover:w-32 group-hover:from-cyan-300 group-hover:to-white transition-all duration-500"></div>
                <p className="text-blue-100 group-hover:text-white transition-colors duration-500">
                  Tell us about your cooking style and we'll create something amazing just for you
                </p>
              </div>
            </div>

            {/* Enhanced form content with floating cards */}
            <CardContent className="p-10 bg-gradient-to-br from-white/5 to-purple-50/10 backdrop-blur-xl relative">
              {/* Floating background elements */}
              <div className="absolute top-10 right-10 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 animate-pulse"></div>
              <div className="absolute bottom-10 left-10 w-24 h-24 bg-gradient-to-br from-cyan-400/10 to-green-400/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 delay-300 animate-pulse"></div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                {/* Left Column - Enhanced floating cards */}
                <div className="space-y-8">
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/30 hover:shadow-2xl hover:bg-white/90 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2 group/card relative overflow-hidden">
                    {/* Card glow effect */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-2xl blur opacity-0 group-hover/card:opacity-100 transition-opacity duration-500"></div>

                    {/* Floating icon */}
                    <div className="flex items-center gap-4 mb-4 relative z-10">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover/card:shadow-xl group-hover/card:scale-110 group-hover/card:rotate-3 transition-all duration-500">
                        <ChefHat className="w-6 h-6 text-white group-hover/card:animate-bounce" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 group-hover/card:text-blue-600 transition-colors duration-300">
                        Cooking Experience
                      </h3>
                    </div>
                    <Textarea
                      placeholder="Tell us about your cooking experience... (e.g., 'I've made pasta, grilled chicken, and basic stir-fries' or 'I just started cooking last week')"
                      className="min-h-[120px] resize-none border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 bg-white/50 backdrop-blur-sm group-hover/card:bg-white/80"
                    />
                    <p className="text-sm text-gray-500 mt-3 group-hover/card:text-gray-700 transition-colors duration-300">
                      Share your cooking background to get personalized recipes
                    </p>
                  </div>

                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/30 hover:shadow-2xl hover:bg-white/90 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2 group/card relative overflow-hidden">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-2xl blur opacity-0 group-hover/card:opacity-100 transition-opacity duration-500"></div>

                    <div className="flex items-center gap-4 mb-4 relative z-10">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover/card:shadow-xl group-hover/card:scale-110 group-hover/card:rotate-3 transition-all duration-500">
                        <Utensils className="w-6 h-6 text-white group-hover/card:animate-bounce" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 group-hover/card:text-purple-600 transition-colors duration-300">
                        Cuisine Preferences
                      </h3>
                    </div>
                    <Input
                      placeholder="e.g., Italian, Asian, Mediterranean, comfort food..."
                      className="border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-300 bg-white/50 backdrop-blur-sm group-hover/card:bg-white/80 py-4"
                    />
                  </div>
                </div>

                {/* Right Column - Enhanced floating cards */}
                <div className="space-y-8">
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/30 hover:shadow-2xl hover:bg-white/90 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2 group/card relative overflow-hidden">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-2xl blur opacity-0 group-hover/card:opacity-100 transition-opacity duration-500"></div>

                    <div className="flex items-center gap-4 mb-4 relative z-10">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover/card:shadow-xl group-hover/card:scale-110 group-hover/card:rotate-3 transition-all duration-500">
                        <CheckCircle className="w-6 h-6 text-white group-hover/card:animate-bounce" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 group-hover/card:text-green-600 transition-colors duration-300">
                        Missing Ingredients
                      </h3>
                    </div>
                    <Textarea
                      placeholder="List ingredients you don't have (e.g., onions, garlic, milk, eggs...)"
                      className="min-h-[120px] resize-none border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all duration-300 bg-white/50 backdrop-blur-sm group-hover/card:bg-white/80"
                    />
                  </div>

                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/30 hover:shadow-2xl hover:bg-white/90 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2 group/card relative overflow-hidden">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-400/20 to-red-400/20 rounded-2xl blur opacity-0 group-hover/card:opacity-100 transition-opacity duration-500"></div>

                    <div className="flex items-center gap-4 mb-4 relative z-10">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg group-hover/card:shadow-xl group-hover/card:scale-110 group-hover/card:rotate-3 transition-all duration-500">
                        <Star className="w-6 h-6 text-white group-hover/card:animate-bounce" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 group-hover/card:text-orange-600 transition-colors duration-300">
                        Dietary Restrictions
                      </h3>
                    </div>
                    <Input
                      placeholder="e.g., vegetarian, gluten-free, dairy-free..."
                      className="border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all duration-300 bg-white/50 backdrop-blur-sm group-hover/card:bg-white/80 py-4"
                    />
                  </div>
                </div>
              </div>

              {/* Updated Submit Button with floating effect */}
              <div className="mt-12 pt-8 border-t border-white/20 relative z-10">
                <Button
                  disabled={!isAuthenticated}
                  className={`w-full py-6 text-xl font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 relative overflow-hidden group/button border border-white/30 ${
                    isAuthenticated
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white cursor-pointer"
                      : "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-500 cursor-not-allowed hover:from-gray-300 hover:to-gray-400"
                  }`}
                  size="lg"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover/button:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/button:translate-x-full transition-transform duration-1000"></div>
                  {isAuthenticated ? (
                    <>
                      <Sparkles className="w-6 h-6 mr-3 group-hover/button:animate-spin" />
                      Generate My Perfect Recipe
                      <ArrowRight className="w-5 h-5 ml-3 group-hover/button:translate-x-1 transition-all duration-300" />
                    </>
                  ) : (
                    <>
                      <Lock className="w-6 h-6 mr-3 group-hover/button:animate-pulse" />
                      Sign In to Generate Recipes
                      <ArrowRight className="w-5 h-5 ml-3 opacity-50 group-hover/button:opacity-100 group-hover/button:translate-x-1 transition-all duration-300" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {showAuthModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-white/95 backdrop-blur-xl border-0 shadow-2xl">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {authMode === "login" ? "Welcome Back" : "Join autonoMeal"}
                </h2>
                <Button variant="ghost" size="sm" onClick={() => setShowAuthModal(false)} className="hover:bg-gray-100">
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <form onSubmit={handleAuth} className="space-y-4">
                <div>
                  <Input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    minLength={4}
                    maxLength={20}
                    className="w-full py-3"
                  />
                </div>
                <div>
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    maxLength={20}
                    className="w-full py-3"
                  />
                </div>

                {error && <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</div>}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3"
                >
                  {loading ? "Please wait..." : authMode === "login" ? "Sign In" : "Create Account"}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode(authMode === "login" ? "register" : "login")
                    setError("")
                  }}
                  className="text-blue-600 hover:text-purple-600 transition-colors duration-300"
                >
                  {authMode === "login" ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
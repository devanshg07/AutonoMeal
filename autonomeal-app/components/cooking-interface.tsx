"use client"
import { useState, useEffect } from "react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  ChefHat,
  Clock,
  CheckCircle,
  ArrowLeft,
  Camera,
  Timer,
  Users,
  Star,
  Award,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
} from "lucide-react"

interface Recipe {
  id: string
  title: string
  description: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  cookTime: string
  rating: number
  image: string
  ingredients: string[]
  steps: string[]
  servings: string
}

interface CookingInterfaceProps {
  recipe: Recipe
  onBack: () => void
  onComplete: (photo?: File) => void
}

export default function CookingInterface({ recipe, onBack, onComplete }: CookingInterfaceProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<boolean[]>(new Array(recipe.steps.length).fill(false))
  const [timer, setTimer] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [showPhotoUpload, setShowPhotoUpload] = useState(false)
  const [uploadedPhoto, setUploadedPhoto] = useState<File | null>(null)

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isTimerRunning])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleStepComplete = (stepIndex: number) => {
    const newCompletedSteps = [...completedSteps]
    newCompletedSteps[stepIndex] = true
    setCompletedSteps(newCompletedSteps)

    if (stepIndex === recipe.steps.length - 1) {
      // Last step completed, show photo upload
      setShowPhotoUpload(true)
      setIsTimerRunning(false)
    } else {
      // Move to next step
      setCurrentStep(stepIndex + 1)
    }
  }

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedPhoto(file)
    }
  }

  const handleFinishCooking = () => {
    onComplete(uploadedPhoto || undefined)
  }

  const progress = (completedSteps.filter(Boolean).length / recipe.steps.length) * 100

  if (showPhotoUpload) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-4">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-white/90 backdrop-blur-sm border border-white/30 shadow-2xl">
            <CardHeader className="text-center pb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Award className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Congratulations!
              </CardTitle>
              <p className="text-gray-600 text-lg">You've completed {recipe.title}!</p>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <span className="font-medium">Cooking Time: {formatTime(timer)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-500 fill-current" />
                      <span className="font-medium">+50 XP Earned</span>
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-bold mb-4">Share your masterpiece!</h3>
                <p className="text-gray-600 mb-6">
                  Upload a photo of your finished dish to complete your cooking journey
                </p>

                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label htmlFor="photo-upload" className="cursor-pointer">
                    <div className="text-center">
                      {uploadedPhoto ? (
                        <div className="space-y-4">
                          <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                          <p className="text-green-600 font-medium">Photo uploaded successfully!</p>
                          <p className="text-sm text-gray-500">{uploadedPhoto.name}</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <Camera className="w-12 h-12 text-gray-400 mx-auto" />
                          <div>
                            <p className="text-lg font-medium text-gray-700">Click to upload photo</p>
                            <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </label>
                </div>
              </div>

              <div className="flex gap-4">
                <Button variant="outline" onClick={() => handleFinishCooking()} className="flex-1">
                  Skip Photo
                </Button>
                <Button
                  onClick={() => handleFinishCooking()}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                  disabled={!uploadedPhoto}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Complete Cooking
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="border-b border-white/20 backdrop-blur-sm bg-white/80 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={onBack} className="hover:bg-blue-50">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </Button>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30">
                <Timer className="w-4 h-4 text-blue-600" />
                <span className="font-mono font-medium">{formatTime(timer)}</span>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="bg-white/60 backdrop-blur-sm"
                >
                  {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setTimer(0)
                    setIsTimerRunning(false)
                  }}
                  className="bg-white/60 backdrop-blur-sm"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Recipe Header */}
        <div className="mb-8">
          <Card className="bg-white/90 backdrop-blur-sm border border-white/30 shadow-xl overflow-hidden">
            <div className="relative">
              <img src={recipe.image || "/placeholder.svg"} alt={recipe.title} className="w-full h-48 object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h1 className="text-3xl font-bold mb-2">{recipe.title}</h1>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {recipe.cookTime}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {recipe.servings || "2-3 servings"}
                  </div>
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    {recipe.difficulty}
                  </Badge>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <Card className="bg-white/90 backdrop-blur-sm border border-white/30">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Cooking Progress</h2>
                <span className="text-sm text-gray-600">
                  Step {currentStep + 1} of {recipe.steps.length}
                </span>
              </div>
              <Progress value={progress} className="h-3 mb-2" />
              <p className="text-sm text-gray-600">{Math.round(progress)}% Complete</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Ingredients List */}
          <div className="lg:col-span-1">
            <Card className="bg-white/90 backdrop-blur-sm border border-white/30 sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ChefHat className="w-5 h-5 text-blue-600" />
                  Ingredients
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span className="text-sm">{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Cooking Steps */}
          <div className="lg:col-span-2 space-y-4">
            {recipe.steps.map((step, index) => (
              <Card
                key={index}
                className={`transition-all duration-500 ${
                  index === currentStep
                    ? "bg-gradient-to-r from-blue-50 to-purple-50 border-blue-300 shadow-lg scale-105"
                    : completedSteps[index]
                      ? "bg-green-50 border-green-300"
                      : "bg-white/90 border-white/30"
                } backdrop-blur-sm`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                        completedSteps[index]
                          ? "bg-green-500 text-white"
                          : index === currentStep
                            ? "bg-blue-500 text-white animate-pulse"
                            : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {completedSteps[index] ? <CheckCircle className="w-6 h-6" /> : index + 1}
                    </div>

                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">Step {index + 1}</h3>
                      <p className="text-gray-700 leading-relaxed mb-4">{step}</p>

                      {index === currentStep && !completedSteps[index] && (
                        <Button
                          onClick={() => handleStepComplete(index)}
                          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Mark as Complete
                        </Button>
                      )}

                      {completedSteps[index] && (
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span className="font-medium">Completed!</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

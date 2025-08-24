"use client"
import { JSX, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CookingInterface from "@/components/cooking-interface"
import {
  ChefHat,
  User,
  Bell,
  Settings,
  Star,
  Clock,
  Users,
  TrendingUp,
  CheckCircle,
  X,
  Plus,
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  Trophy,
  Target,
  Flame,
  Award,
  Heart,
  Calendar,
  LogOut,
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
}

interface UserProfile {
  username: string
  level: number
  experience: number
  recipesCooked: number
  skillBadges: string[]
  preferences: {
    cuisines: string[]
    restrictions: string[]
    missingIngredients: string[]
    cookingExperience: string[]
  }
}

export default function Dashboard({ onLogout }: { onLogout?: () => void }) {
  const [userProfile, setUserProfile] = useState<UserProfile>({
    username: "Chef Explorer",
    level: 3,
    experience: 750,
    recipesCooked: 12,
    skillBadges: ["Pasta Master", "Stir-Fry Pro", "Breakfast Champion"],
    preferences: {
      cuisines: ["Italian", "Asian", "Mediterranean"],
      restrictions: ["Vegetarian"],
      missingIngredients: ["Onions", "Garlic", "Heavy Cream"],
      cookingExperience: ["Pasta", "Stir Fry", "Baking"],
    },
  })

  const [recommendedRecipes, setRecommendedRecipes] = useState<Recipe[]>([
    {
      id: "1",
      title: "Creamy Mushroom Risotto",
      description: "A rich and creamy risotto perfect for vegetarians, made without onions or garlic",
      difficulty: "Intermediate",
      cookTime: "35 min",
      rating: 4.8,
      image: "/creamy-mushroom-risotto.png",
      ingredients: ["Arborio rice", "Mushrooms", "Vegetable broth", "Parmesan", "White wine"],
      steps: ["Sauté mushrooms", "Toast rice", "Add broth gradually", "Stir in cheese", "Serve hot"],
    },
    {
      id: "2",
      title: "Mediterranean Quinoa Bowl",
      description: "Fresh and healthy bowl with Mediterranean flavors, no dairy needed",
      difficulty: "Beginner",
      cookTime: "20 min",
      rating: 4.6,
      image: "/mediterranean-quinoa-bowl.png",
      ingredients: ["Quinoa", "Tomatoes", "Cucumber", "Olives", "Lemon", "Olive oil"],
      steps: ["Cook quinoa", "Chop vegetables", "Make dressing", "Combine all", "Garnish and serve"],
    },
    {
      id: "3",
      title: "Asian Vegetable Stir-Fry",
      description: "Quick and flavorful stir-fry using ginger instead of garlic",
      difficulty: "Beginner",
      cookTime: "15 min",
      rating: 4.7,
      image: "/asian-vegetable-stir-fry.png",
      ingredients: ["Mixed vegetables", "Ginger", "Soy sauce", "Sesame oil", "Rice"],
      steps: ["Heat oil", "Add ginger", "Stir-fry vegetables", "Add sauce", "Serve over rice"],
    },
  ])

  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([])
  const [cookingHistory, setCookingHistory] = useState<{ [key: string]: number }>({
    "2024-01-23": 2,
    "2024-01-22": 1,
    "2024-01-21": 0,
    "2024-01-20": 1,
    "2024-01-19": 3,
    "2024-01-18": 1,
    "2024-01-17": 0,
    "2024-01-16": 1,
    "2024-01-15": 2,
    "2024-01-14": 0,
    "2024-01-13": 1,
    "2024-01-12": 2,
    "2024-01-11": 0,
    "2024-01-10": 1,
    "2024-01-09": 1,
    "2024-01-08": 0,
    "2024-01-07": 2,
    "2024-01-06": 1,
    "2024-01-05": 0,
    "2024-01-04": 1,
    "2024-01-03": 2,
    "2024-01-02": 1,
    "2024-01-01": 3,
    "2023-12-31": 1,
    "2023-12-30": 0,
    "2023-12-29": 2,
    "2023-12-28": 1,
    "2023-12-27": 1,
    "2023-12-26": 2,
    "2023-12-25": 3,
    "2023-12-24": 1,
    "2023-12-23": 0,
    "2023-12-22": 1,
    "2023-12-21": 2,
    "2023-12-20": 0,
    "2023-12-19": 1,
    "2023-12-18": 1,
    "2023-12-17": 0,
    "2023-12-16": 2,
    "2023-12-15": 1,
  })

  const [activeTab, setActiveTab] = useState("recommendations")
  const [newIngredient, setNewIngredient] = useState("")
  const [newRestriction, setNewRestriction] = useState("")
  const [newCookingExperience, setNewCookingExperience] = useState("")
  const [showCookingInterface, setShowCookingInterface] = useState(false)
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)

  const handleAcceptRecipe = (recipeId: string) => {
    const recipe = recommendedRecipes.find((r) => r.id === recipeId)
    if (recipe) {
      setSelectedRecipe(recipe)
      setShowCookingInterface(true)
    }
    console.log(`Accepted recipe: ${recipeId}`)
  }

  const handleRejectRecipe = (recipeId: string) => {
    setRecommendedRecipes((prev) => prev.filter((recipe) => recipe.id !== recipeId))
    console.log(`Rejected recipe: ${recipeId}`)
  }

  const addMissingIngredient = () => {
    if (newIngredient.trim()) {
      setUserProfile((prev) => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          missingIngredients: [...prev.preferences.missingIngredients, newIngredient.trim()],
        },
      }))
      setNewIngredient("")
    }
  }

  const addDietaryRestriction = () => {
    if (newRestriction.trim()) {
      setUserProfile((prev) => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          restrictions: [...prev.preferences.restrictions, newRestriction.trim()],
        },
      }))
      setNewRestriction("")
    }
  }

  const removeMissingIngredient = (ingredient: string) => {
    setUserProfile((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        missingIngredients: prev.preferences.missingIngredients.filter((item) => item !== ingredient),
      },
    }))
  }

  const removeDietaryRestriction = (restriction: string) => {
    setUserProfile((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        restrictions: prev.preferences.restrictions.filter((item) => item !== restriction),
      },
    }))
  }

  const addCookingExperience = () => {
    if (newCookingExperience.trim()) {
      setUserProfile((prev) => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          cookingExperience: [...prev.preferences.cookingExperience, newCookingExperience.trim()],
        },
      }))
      setNewCookingExperience("")
    }
  }

  const removeCookingExperience = (experience: string) => {
    setUserProfile((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        cookingExperience: prev.preferences.cookingExperience.filter((item) => item !== experience),
      },
    }))
  }

  const toggleFavorite = (recipe: Recipe) => {
    setFavoriteRecipes((prev) => {
      const isFavorite = prev.some((fav) => fav.id === recipe.id)
      if (isFavorite) {
        return prev.filter((fav) => fav.id !== recipe.id)
      } else {
        return [...prev, recipe]
      }
    })
  }

  const isFavorite = (recipeId: string) => {
    return favoriteRecipes.some((fav) => fav.id === recipeId)
  }

  const CookingCalendar = () => {
    const today = new Date()
    const startDate = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate())
    const weeks: JSX.Element[] = []
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

    for (let week = 0; week < 52; week++) {
      const weekDays = []
      for (let day = 0; day < 7; day++) {
        const currentDate = new Date(startDate)
        currentDate.setDate(startDate.getDate() + week * 7 + day)

        if (currentDate > today) {
          weekDays.push(
            <div key={`future-${week}-${day}`} className="w-3 h-3 rounded-sm bg-gray-100 border border-gray-200" />,
          )
          continue
        }

        const dateStr = currentDate.toISOString().split("T")[0]
        const cookCount = cookingHistory[dateStr] || 0

        let intensity = "bg-gray-100 border-gray-200"
        if (cookCount === 1) intensity = "bg-green-200 border-green-300"
        else if (cookCount === 2) intensity = "bg-green-400 border-green-500"
        else if (cookCount >= 3) intensity = "bg-green-600 border-green-700"

        weekDays.push(
          <div
            key={dateStr}
            className={`w-3 h-3 rounded-sm ${intensity} border hover:ring-2 hover:ring-blue-300 transition-all cursor-pointer hover:scale-110`}
            title={`${currentDate.toLocaleDateString()}: ${cookCount} recipe${cookCount !== 1 ? "s" : ""} cooked`}
          />,
        )
      }
      weeks.push(
        <div key={week} className="flex gap-1">
          {weekDays}
        </div>,
      )
    }

    const totalCookingDays = Object.values(cookingHistory).filter((count) => count > 0).length
    const totalRecipes = Object.values(cookingHistory).reduce((sum, count) => sum + count, 0)

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Cooking Activity</h3>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Less</span>
            <div className="flex gap-1">
              <div className="w-3 h-3 bg-gray-100 rounded-sm border border-gray-200"></div>
              <div className="w-3 h-3 bg-green-200 rounded-sm border border-green-300"></div>
              <div className="w-3 h-3 bg-green-400 rounded-sm border border-green-500"></div>
              <div className="w-3 h-3 bg-green-600 rounded-sm border border-green-700"></div>
            </div>
            <span>More</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="grid grid-cols-53 gap-1 text-xs text-gray-500 mb-2">
            <div></div>
            {Array.from({ length: 12 }, (_, i) => (
              <div key={i} className="col-span-4 text-center">
                {new Date(2024, i).toLocaleDateString("en", { month: "short" })}
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-1">
            {Array.from({ length: 7 }, (_, dayIndex) => (
              <div key={dayIndex} className="flex gap-1 items-center">
                <div className="w-8 text-xs text-gray-500 text-right">
                  {dayIndex % 2 === 1 ? daysOfWeek[dayIndex].slice(0, 3) : ""}
                </div>
                <div className="flex gap-1">
                  {weeks.map((week, weekIndex) => (
                    <div key={weekIndex}>{week.props.children[dayIndex]}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between text-sm text-gray-600 pt-2 border-t">
          <span>{totalCookingDays} cooking days this year</span>
          <span>{totalRecipes} total recipes cooked</span>
        </div>
      </div>
    )
  }

  const handleBackToDashboard = () => {
    setShowCookingInterface(false)
    setSelectedRecipe(null)
  }

  const handleCookingComplete = (photo?: File) => {
    console.log("Cooking completed!", photo)
    const today = new Date().toISOString().split("T")[0]

    setCookingHistory((prev) => ({
      ...prev,
      [today]: (prev[today] || 0) + 1,
    }))

    setUserProfile((prev) => ({
      ...prev,
      experience: prev.experience + 50,
      recipesCooked: prev.recipesCooked + 1,
    }))
    setShowCookingInterface(false)
    setSelectedRecipe(null)
  }

  const handleLogout = () => {
    if (onLogout) {
      onLogout()
    }
  }

  if (showCookingInterface && selectedRecipe) {
    return (
      <CookingInterface recipe={selectedRecipe} onBack={handleBackToDashboard} onComplete={handleCookingComplete} />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="border-b border-white/20 backdrop-blur-sm bg-white/80 sticky top-0 z-40">
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

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="hover:bg-blue-50">
                <Bell className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="hover:bg-blue-50">
                <Settings className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="hover:bg-red-50 hover:text-red-600 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="font-medium text-gray-800">{userProfile.username}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* User Level & Progress Section */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 border-0 text-white overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/90 to-blue-600/90"></div>
            <CardContent className="p-8 relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                    <Trophy className="w-8 h-8 text-yellow-300" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold mb-1">Level {userProfile.level} Chef</h1>
                    <p className="text-blue-100">Cooking Journey Progress</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{userProfile.experience} XP</div>
                  <div className="text-blue-100">1000 XP to next level</div>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span>Progress to Level {userProfile.level + 1}</span>
                  <span>{userProfile.experience % 1000}%</span>
                </div>
                <Progress value={userProfile.experience % 1000} className="h-3 bg-white/20" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex items-center gap-3 mb-2">
                    <Target className="w-5 h-5 text-green-300" />
                    <span className="font-medium">Recipes Cooked</span>
                  </div>
                  <div className="text-2xl font-bold">{userProfile.recipesCooked}</div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex items-center gap-3 mb-2">
                    <Flame className="w-5 h-5 text-orange-300" />
                    <span className="font-medium">Cooking Streak</span>
                  </div>
                  <div className="text-2xl font-bold">7 days</div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex items-center gap-3 mb-2">
                    <Award className="w-5 h-5 text-yellow-300" />
                    <span className="font-medium">Skill Badges</span>
                  </div>
                  <div className="text-2xl font-bold">{userProfile.skillBadges.length}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/60 backdrop-blur-sm border border-white/30">
            <TabsTrigger value="recommendations" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              AI Recommendations
            </TabsTrigger>
            <TabsTrigger value="favorites" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              Favorites
            </TabsTrigger>
            <TabsTrigger value="preferences" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              My Preferences
            </TabsTrigger>
            <TabsTrigger value="progress" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              Cooking Journey
            </TabsTrigger>
          </TabsList>

          {/* AI Recommendations Tab */}
          <TabsContent value="recommendations" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent mb-4">
                Your Perfect Recipe Matches
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Based on your preferences and cooking level, here are personalized recipes just for you
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedRecipes.map((recipe) => (
                <Card
                  key={recipe.id}
                  className="overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105 group bg-white/80 backdrop-blur-sm border border-white/30"
                >
                  <div className="relative">
                    <img
                      src={recipe.image || "/placeholder.svg"}
                      alt={recipe.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 flex gap-2">
                      <Badge variant="secondary" className="bg-white/90 text-gray-800">
                        {recipe.difficulty}
                      </Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleFavorite(recipe)}
                        className={`w-8 h-8 p-0 rounded-full bg-white/90 hover:bg-white ${
                          isFavorite(recipe.id) ? "text-red-500" : "text-gray-400"
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${isFavorite(recipe.id) ? "fill-current" : ""}`} />
                      </Button>
                    </div>
                    <div className="absolute bottom-4 left-4 flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-white text-sm font-medium">{recipe.rating}</span>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {recipe.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{recipe.description}</p>

                    <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {recipe.cookTime}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        2-3 servings
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleAcceptRecipe(recipe.id)}
                        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                      >
                        <ThumbsUp className="w-4 h-4 mr-2" />
                        Cook This
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleRejectRecipe(recipe.id)}
                        className="border-gray-300 hover:bg-red-50 hover:border-red-300 hover:text-red-600"
                      >
                        <ThumbsDown className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Favorites Tab */}
          <TabsContent value="favorites" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-red-600 bg-clip-text text-transparent mb-4">
                Your Favorite Recipes
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Recipes you've loved and want to cook again</p>
            </div>

            {favoriteRecipes.length === 0 ? (
              <Card className="bg-white/80 backdrop-blur-sm border border-white/30">
                <CardContent className="p-12 text-center">
                  <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No favorites yet</h3>
                  <p className="text-gray-500">Start adding recipes to your favorites by clicking the heart icon!</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteRecipes.map((recipe) => (
                  <Card
                    key={recipe.id}
                    className="overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105 group bg-white/80 backdrop-blur-sm border border-white/30"
                  >
                    <div className="relative">
                      <img
                        src={recipe.image || "/placeholder.svg"}
                        alt={recipe.title}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-4 right-4 flex gap-2">
                        <Badge variant="secondary" className="bg-white/90 text-gray-800">
                          {recipe.difficulty}
                        </Badge>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleFavorite(recipe)}
                          className="w-8 h-8 p-0 rounded-full bg-white/90 hover:bg-white text-red-500"
                        >
                          <Heart className="w-4 h-4 fill-current" />
                        </Button>
                      </div>
                      <div className="absolute bottom-4 left-4 flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-white text-sm font-medium">{recipe.rating}</span>
                      </div>
                    </div>

                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                        {recipe.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">{recipe.description}</p>

                      <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {recipe.cookTime}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          2-3 servings
                        </div>
                      </div>

                      <Button
                        onClick={() => handleAcceptRecipe(recipe.id)}
                        className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white"
                      >
                        <ThumbsUp className="w-4 h-4 mr-2" />
                        Cook Again
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Missing Ingredients */}
              <Card className="bg-white/80 backdrop-blur-sm border border-white/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <X className="w-5 h-5 text-red-500" />
                    Missing Ingredients
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add ingredient you don't have..."
                      value={newIngredient}
                      onChange={(e) => setNewIngredient(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addMissingIngredient()}
                    />
                    <Button onClick={addMissingIngredient} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {userProfile.preferences.missingIngredients.map((ingredient) => (
                      <Badge
                        key={ingredient}
                        variant="destructive"
                        className="cursor-pointer hover:bg-red-600"
                        onClick={() => removeMissingIngredient(ingredient)}
                      >
                        {ingredient} <X className="w-3 h-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Dietary Restrictions */}
              <Card className="bg-white/80 backdrop-blur-sm border border-white/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Dietary Restrictions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add dietary restriction..."
                      value={newRestriction}
                      onChange={(e) => setNewRestriction(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addDietaryRestriction()}
                    />
                    <Button onClick={addDietaryRestriction} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {userProfile.preferences.restrictions.map((restriction) => (
                      <Badge
                        key={restriction}
                        className="cursor-pointer bg-green-100 text-green-800 hover:bg-green-200"
                        onClick={() => removeDietaryRestriction(restriction)}
                      >
                        {restriction} <X className="w-3 h-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Food Preferences */}
              <Card className="bg-white/80 backdrop-blur-sm border border-white/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-500" />
                    Favorite Cuisines
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {userProfile.preferences.cuisines.map((cuisine) => (
                      <Badge key={cuisine} className="bg-purple-100 text-purple-800">
                        {cuisine}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Experience Management */}
              <Card className="bg-white/80 backdrop-blur-sm border border-white/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    Experience Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="What have you cooked before?"
                      value={newCookingExperience}
                      onChange={(e) => setNewCookingExperience(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addCookingExperience()}
                    />
                    <Button onClick={addCookingExperience} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {userProfile.preferences.cookingExperience.map((experience) => (
                      <Badge
                        key={experience}
                        className="bg-yellow-100 text-yellow-800 cursor-pointer hover:bg-yellow-200"
                        onClick={() => removeCookingExperience(experience)}
                      >
                        {experience} <X className="w-3 h-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border border-white/30 mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-green-500" />
                  Cooking Calendar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CookingCalendar />
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Skill Badges */}
              <Card className="bg-white/80 backdrop-blur-sm border border-white/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-yellow-500" />
                    Skill Badges
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {userProfile.skillBadges.map((badge, index) => (
                      <div
                        key={badge}
                        className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200"
                      >
                        <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                          <Star className="w-5 h-5 text-white fill-current" />
                        </div>
                        <span className="font-medium text-gray-800">{badge}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="bg-white/80 backdrop-blur-sm border border-white/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-500" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="font-medium">Completed Pasta Carbonara</p>
                        <p className="text-sm text-gray-500">2 days ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                      <Star className="w-5 h-5 text-yellow-500" />
                      <div>
                        <p className="font-medium">Earned "Stir-Fry Pro" badge</p>
                        <p className="text-sm text-gray-500">5 days ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="font-medium">Reached Level 3</p>
                        <p className="text-sm text-gray-500">1 week ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

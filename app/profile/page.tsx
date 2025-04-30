"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Settings,
  Clock,
  MapPin,
  Sparkles,
  Save,
  Edit,
  ChevronRight,
  Palette,
  Dumbbell,
  BookOpen,
  Camera,
  Music,
  Coffee,
  Utensils,
  Compass,
  Heart,
  Leaf,
  Gamepad2,
  PenTool,
  Bike,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"

import NavigationBar from "@/components/navigation-bar"

// Interest categories with icons
const interestCategories = [
  { id: "arts", name: "Arts & Culture", icon: Palette, selected: false },
  { id: "fitness", name: "Fitness & Sports", icon: Dumbbell, selected: false },
  { id: "reading", name: "Reading & Writing", icon: BookOpen, selected: false },
  { id: "photography", name: "Photography", icon: Camera, selected: false },
  { id: "music", name: "Music & Concerts", icon: Music, selected: false },
  { id: "cafes", name: "Cafes & Tea Houses", icon: Coffee, selected: false },
  { id: "food", name: "Food & Cuisine", icon: Utensils, selected: false },
  { id: "outdoors", name: "Outdoors & Nature", icon: Leaf, selected: false },
  { id: "exploration", name: "Urban Exploration", icon: Compass, selected: false },
  { id: "wellness", name: "Wellness & Mindfulness", icon: Heart, selected: false },
  { id: "gaming", name: "Gaming & Entertainment", icon: Gamepad2, selected: false },
  { id: "crafts", name: "Crafts & DIY", icon: PenTool, selected: false },
  { id: "cycling", name: "Cycling & Biking", icon: Bike, selected: false },
]

// Activity categories from the app
const activityCategories = [
  { id: "micro-escape", name: "Micro-escape", selected: true },
  { id: "body-reboot", name: "Body reboot", selected: true },
  { id: "city-lens", name: "City-lens", selected: true },
  { id: "craft-burst", name: "Craft burst", selected: true },
  { id: "learning-bite", name: "Learning bite", selected: true },
]

export default function ProfilePage() {
  const { toast } = useToast()
  const [name, setName] = useState("Alex Chen")
  const [activeTab, setActiveTab] = useState("preferences")
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Preferences state
  const [maxDistance, setMaxDistance] = useState(5)
  const [energyPreference, setEnergyPreference] = useState(50)
  const [timePreference, setTimePreference] = useState(45)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [locationTrackingEnabled, setLocationTrackingEnabled] = useState(true)
  const [interests, setInterests] = useState(interestCategories)
  const [categories, setCategories] = useState(activityCategories)

  // Stats
  const stats = {
    activitiesCompleted: 12,
    streakDays: 5,
    favoriteCategoryId: "city-lens",
    totalTimeSpent: "8.5 hours",
  }

  // Load user preferences from localStorage on component mount
  useEffect(() => {
    const storedPreferences = localStorage.getItem("sparkUserPreferences")
    if (storedPreferences) {
      try {
        const preferences = JSON.parse(storedPreferences)
        if (preferences.name) setName(preferences.name)
        if (preferences.maxDistance) setMaxDistance(preferences.maxDistance)
        if (preferences.energyPreference) setEnergyPreference(preferences.energyPreference)
        if (preferences.timePreference) setTimePreference(preferences.timePreference)
        if (preferences.notificationsEnabled !== undefined) setNotificationsEnabled(preferences.notificationsEnabled)
        if (preferences.locationTrackingEnabled !== undefined)
          setLocationTrackingEnabled(preferences.locationTrackingEnabled)

        if (preferences.interests) {
          setInterests(
            interests.map((interest) => ({
              ...interest,
              selected: preferences.interests.includes(interest.id),
            })),
          )
        }

        if (preferences.categories) {
          setCategories(
            categories.map((category) => ({
              ...category,
              selected: preferences.categories.includes(category.id),
            })),
          )
        }
      } catch (error) {
        console.error("Error parsing stored preferences:", error)
      }
    }
  }, [])

  const handleSavePreferences = () => {
    setIsSaving(true)

    // Simulate API call delay
    setTimeout(() => {
      // Save to localStorage
      const preferences = {
        name,
        maxDistance,
        energyPreference,
        timePreference,
        notificationsEnabled,
        locationTrackingEnabled,
        interests: interests.filter((i) => i.selected).map((i) => i.id),
        categories: categories.filter((c) => c.selected).map((c) => c.id),
      }

      localStorage.setItem("sparkUserPreferences", JSON.stringify(preferences))

      setIsSaving(false)
      setIsEditing(false)

      toast({
        title: "Preferences saved",
        description: "Your profile has been updated successfully.",
      })
    }, 1000)
  }

  const toggleInterest = (id) => {
    setInterests(
      interests.map((interest) => (interest.id === id ? { ...interest, selected: !interest.selected } : interest)),
    )
  }

  const toggleCategory = (id) => {
    setCategories(
      categories.map((category) => (category.id === id ? { ...category, selected: !category.selected } : category)),
    )
  }

  const getFavoriteCategory = () => {
    const category = categories.find((c) => c.id === stats.favoriteCategoryId)
    return category ? category.name : "None"
  }

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-br from-rose-50 to-indigo-50 pb-20">
      <div className="w-full max-w-md mx-auto p-4">
        <header className="mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-rose-500 to-indigo-500 bg-clip-text text-transparent">
              Profile
            </h1>
            <Button
              variant={isEditing ? "default" : "ghost"}
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              className={isEditing ? "bg-gradient-to-r from-rose-500 to-indigo-500" : ""}
            >
              {isEditing ? "Cancel" : <Edit className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-slate-600">Customize your preferences and interests</p>
        </header>

        <Card className="mb-6 overflow-hidden">
          <div className="relative h-24 bg-gradient-to-r from-rose-500 to-indigo-500">
            <div className="absolute -bottom-12 left-4">
              <Avatar className="h-24 w-24 border-4 border-white">
                <AvatarImage src="/abstract-headscape.png" alt={name} />
                <AvatarFallback className="text-2xl bg-rose-100 text-rose-500">{name.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
          </div>
          <CardContent className="pt-14 pb-4">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold">{name}</h2>
                <p className="text-sm text-slate-500">Shanghai, China</p>
              </div>
              <div className="flex flex-col items-end">
                <div className="flex items-center text-sm text-indigo-600 font-medium">
                  <Sparkles className="h-4 w-4 mr-1" />
                  <span>{stats.streakDays}-day streak</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">{stats.activitiesCompleted} activities completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="stats">Stats</TabsTrigger>
          </TabsList>
        </Tabs>

        {activeTab === "preferences" ? (
          <ScrollArea className="h-[calc(100vh-320px)]">
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <Settings className="h-5 w-5 mr-2 text-rose-500" />
                    Activity Preferences
                  </CardTitle>
                  <CardDescription>Customize how we recommend activities to you</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="max-distance">Maximum Distance</Label>
                      <span className="text-sm text-slate-500">{maxDistance} km</span>
                    </div>
                    <Slider
                      id="max-distance"
                      disabled={!isEditing}
                      value={[maxDistance]}
                      onValueChange={(value) => setMaxDistance(value[0])}
                      max={10}
                      step={0.5}
                      className={isEditing ? "" : "opacity-70"}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="energy-level">Energy Level Preference</Label>
                      <span className="text-sm text-slate-500">
                        {energyPreference < 33 ? "Low" : energyPreference < 66 ? "Medium" : "High"}
                      </span>
                    </div>
                    <Slider
                      id="energy-level"
                      disabled={!isEditing}
                      value={[energyPreference]}
                      onValueChange={(value) => setEnergyPreference(value[0])}
                      max={100}
                      step={1}
                      className={isEditing ? "" : "opacity-70"}
                    />
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Relaxed</span>
                      <span>Energetic</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="time-preference">Preferred Activity Duration</Label>
                      <span className="text-sm text-slate-500">{timePreference} min</span>
                    </div>
                    <Slider
                      id="time-preference"
                      disabled={!isEditing}
                      value={[timePreference]}
                      onValueChange={(value) => setTimePreference(value[0])}
                      min={15}
                      max={120}
                      step={5}
                      className={isEditing ? "" : "opacity-70"}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="notifications">Notifications</Label>
                      <p className="text-xs text-slate-500">Receive activity reminders</p>
                    </div>
                    <Switch
                      id="notifications"
                      disabled={!isEditing}
                      checked={notificationsEnabled}
                      onCheckedChange={setNotificationsEnabled}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="location">Location Tracking</Label>
                      <p className="text-xs text-slate-500">For nearby recommendations</p>
                    </div>
                    <Switch
                      id="location"
                      disabled={!isEditing}
                      checked={locationTrackingEnabled}
                      onCheckedChange={setLocationTrackingEnabled}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <Heart className="h-5 w-5 mr-2 text-rose-500" />
                    Interests & Hobbies
                  </CardTitle>
                  <CardDescription>Select your interests to get personalized activity recommendations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {interests.map((interest) => (
                      <Badge
                        key={interest.id}
                        variant={interest.selected ? "default" : "outline"}
                        className={`cursor-pointer ${
                          interest.selected
                            ? "bg-gradient-to-r from-rose-500 to-indigo-500 hover:from-rose-600 hover:to-indigo-600"
                            : "hover:bg-slate-100"
                        } ${!isEditing && "pointer-events-none opacity-90"}`}
                        onClick={() => isEditing && toggleInterest(interest.id)}
                      >
                        <interest.icon className="h-3 w-3 mr-1" />
                        {interest.name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <Sparkles className="h-5 w-5 mr-2 text-rose-500" />
                    Activity Categories
                  </CardTitle>
                  <CardDescription>Choose which types of activities you want to see</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div key={category.id} className="flex items-center justify-between">
                        <Label htmlFor={`category-${category.id}`} className="cursor-pointer">
                          {category.name}
                        </Label>
                        <Switch
                          id={`category-${category.id}`}
                          disabled={!isEditing}
                          checked={category.selected}
                          onCheckedChange={() => toggleCategory(category.id)}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {isEditing && (
                <Button
                  onClick={handleSavePreferences}
                  disabled={isSaving}
                  className="w-full bg-gradient-to-r from-rose-500 to-indigo-500 hover:from-rose-600 hover:to-indigo-600 mt-4"
                >
                  {isSaving ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        className="mr-2"
                      >
                        <Settings className="h-4 w-4" />
                      </motion.div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Preferences
                    </>
                  )}
                </Button>
              )}
            </div>
          </ScrollArea>
        ) : (
          <ScrollArea className="h-[calc(100vh-320px)]">
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <Sparkles className="h-5 w-5 mr-2 text-rose-500" />
                    Activity Stats
                  </CardTitle>
                  <CardDescription>Your activity history and achievements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-slate-50 rounded-lg p-3 text-center">
                      <p className="text-xs text-slate-500">Activities Completed</p>
                      <p className="text-2xl font-bold text-indigo-600">{stats.activitiesCompleted}</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3 text-center">
                      <p className="text-xs text-slate-500">Current Streak</p>
                      <p className="text-2xl font-bold text-rose-500">{stats.streakDays} days</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-slate-500" />
                        <span className="text-sm">Total Time Spent</span>
                      </div>
                      <span className="text-sm font-medium">{stats.totalTimeSpent}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Heart className="h-4 w-4 mr-2 text-slate-500" />
                        <span className="text-sm">Favorite Category</span>
                      </div>
                      <span className="text-sm font-medium">{getFavoriteCategory()}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-slate-500" />
                        <span className="text-sm">Most Visited Area</span>
                      </div>
                      <span className="text-sm font-medium">Xintiandi</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Recent Activities</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="bg-slate-50 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <p className="font-medium">Art-Deco Architecture Walk</p>
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                        Completed
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Yesterday • City-lens • 30 min</p>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <p className="font-medium">No-Equipment HIIT Workout</p>
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                        Completed
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">2 days ago • Body reboot • 20 min</p>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <p className="font-medium">Visit an Indie Bookstore</p>
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                        Completed
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">3 days ago • Micro-escape • 45 min</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Achievements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 flex items-center justify-center text-white mr-3">
                        <Sparkles className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">Early Explorer</p>
                        <p className="text-xs text-slate-500">Completed 10 activities</p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-slate-400" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-indigo-400 to-indigo-600 flex items-center justify-center text-white mr-3">
                        <Compass className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">City Wanderer</p>
                        <p className="text-xs text-slate-500">Completed 5 City-lens activities</p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-slate-400" />
                  </div>

                  <div className="flex items-center justify-between opacity-50">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-slate-400 to-slate-600 flex items-center justify-center text-white mr-3">
                        <Dumbbell className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">Fitness Enthusiast</p>
                        <p className="text-xs text-slate-500">Complete 10 Body reboot activities</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      2/10
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        )}
      </div>

      <NavigationBar />
    </main>
  )
}

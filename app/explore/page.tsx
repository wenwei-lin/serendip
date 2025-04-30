"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, MapPin, Navigation, Filter, Clock } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import NavigationBar from "@/components/navigation-bar"
import NearbyActivitiesMap from "@/components/nearby-activities-map"
import ActivityDetail from "@/components/activity-detail"
import CategoryBadge from "@/components/category-badge"

// Sample activity data with location information
const activities = [
  {
    id: 1,
    title: "Visit an Indie Bookstore",
    category: "Micro-escape",
    description: "Discover staff-picked books under 300 pages at the nearest indie bookstore still open.",
    image: "/the-bookworm-nook.png",
    location: "Xintiandi Book Haven",
    address: "123 Xintiandi Street",
    coordinates: { lat: 31.2196, lng: 121.4764 },
    distance: 0.8,
    duration: "45 min",
    why: "Reading short fiction can transport you to new worlds in just one sitting, perfect for mental refreshment.",
  },
  {
    id: 2,
    title: "No-Equipment HIIT Workout",
    category: "Body reboot",
    description: "A 20-minute high-intensity workout you can do with just your bodyweight.",
    image: "/indoor-workout-oasis.png",
    location: "Your living room",
    address: "Home",
    coordinates: null, // No specific coordinates since it's at home
    distance: 0,
    duration: "20 min",
    why: "Physical activity releases endorphins that combat mental fatigue and screen-induced lethargy.",
  },
  {
    id: 3,
    title: "Art-Deco Architecture Walk",
    category: "City-lens",
    description: "Walk the lane behind Xintiandi, count art-deco door handles with a 5-min history guide.",
    image: "/shanghai-deco-facade.png",
    location: "Xintiandi District",
    address: "Xintiandi Walking Path",
    coordinates: { lat: 31.2187, lng: 121.4785 },
    distance: 1.2,
    duration: "30 min",
    why: "Noticing architectural details helps you see your familiar environment with fresh eyes.",
  },
  {
    id: 4,
    title: "Linocut Workshop",
    category: "Craft burst",
    description: "One-hour linocut workshop in Huangpu starting at 19:30 – 2 seats left.",
    image: "/linocut-artist-studio.png",
    location: "Huangpu Art Studio",
    address: "456 Huangpu Road",
    coordinates: { lat: 31.2323, lng: 121.4896 },
    distance: 2.5,
    duration: "60 min",
    why: "Creating something with your hands engages different parts of your brain than screen time does.",
  },
  {
    id: 5,
    title: "Read 'Noise' Chapter 2",
    category: "Learning bite",
    description: "Read chapter 2 of 'Noise', then reflect on one key insight.",
    image: "/open-book-coffee.png",
    location: "Your favorite reading spot",
    address: "Home or nearby cafe",
    coordinates: null,
    distance: 0,
    duration: "25 min",
    why: "Focused reading on a single topic helps reset your attention span after fragmented social media use.",
  },
  {
    id: 6,
    title: "Visit Shanghai Museum",
    category: "City-lens",
    description: "Explore the ancient Chinese art collection at Shanghai Museum.",
    image: "/shanghai-museum-traditional-elements.png",
    location: "Shanghai Museum",
    address: "201 Renmin Avenue",
    coordinates: { lat: 31.2277, lng: 121.4757 },
    distance: 1.5,
    duration: "90 min",
    why: "Connecting with cultural heritage provides perspective and a break from digital stimulation.",
  },
  {
    id: 7,
    title: "Riverside Meditation",
    category: "Body reboot",
    description: "Guided 15-minute meditation session by the Huangpu River.",
    image: "/urban-sunset-meditation.png",
    location: "Huangpu Riverside",
    address: "Huangpu River Promenade",
    coordinates: { lat: 31.2323, lng: 121.49 },
    distance: 1.7,
    duration: "20 min",
    why: "Mindfulness practice by water has been shown to reduce stress and improve mental clarity.",
  },
]

const categories = ["Micro-escape", "Body reboot", "City-lens", "Craft burst", "Learning bite"]

export default function Explore() {
  const [viewMode, setViewMode] = useState("list")
  const [searchQuery, setSearchQuery] = useState("")
  const [distanceFilter, setDistanceFilter] = useState("all")
  const [categoryFilters, setCategoryFilters] = useState([])
  const [durationFilter, setDurationFilter] = useState("all")
  const [showDetail, setShowDetail] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState(null)
  const [locationData, setLocationData] = useState(null)

  useEffect(() => {
    // Check if location data exists in localStorage
    const storedLocationData = localStorage.getItem("sparkLocationData")
    if (storedLocationData) {
      try {
        setLocationData(JSON.parse(storedLocationData))
      } catch (error) {
        console.error("Error parsing location data:", error)
      }
    }
  }, [])

  const handleCategoryToggle = (category) => {
    setCategoryFilters((prev) => (prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]))
  }

  const handleCardClick = (activity) => {
    setSelectedActivity(activity)
    setShowDetail(true)
  }

  const handleCloseDetail = () => {
    setShowDetail(false)
    setSelectedActivity(null)
  }

  // Filter activities based on search, distance, category, and duration
  const filteredActivities = activities.filter((activity) => {
    // Search filter
    if (
      searchQuery &&
      !activity.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !activity.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !activity.location.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }

    // Distance filter
    if (distanceFilter === "nearby" && activity.distance > 1) return false
    if (distanceFilter === "walking" && activity.distance > 2) return false
    if (distanceFilter === "transit" && activity.distance > 5) return false

    // Category filter
    if (categoryFilters.length > 0 && !categoryFilters.includes(activity.category)) return false

    // Duration filter
    const durationMinutes = Number.parseInt(activity.duration.split(" ")[0])
    if (durationFilter === "short" && durationMinutes > 30) return false
    if (durationFilter === "medium" && (durationMinutes <= 30 || durationMinutes > 60)) return false
    if (durationFilter === "long" && durationMinutes <= 60) return false

    return true
  })

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-br from-rose-50 to-indigo-50 pb-20">
      <div className="w-full max-w-md mx-auto p-4">
        <header className="mb-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-rose-500 to-indigo-500 bg-clip-text text-transparent">
            Explore
          </h1>
          <p className="text-slate-600">Discover activities near you</p>
        </header>

        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search activities, places..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="p-2">
                <h4 className="font-medium text-sm mb-1">Categories</h4>
                {categories.map((category) => (
                  <DropdownMenuCheckboxItem
                    key={category}
                    checked={categoryFilters.includes(category)}
                    onCheckedChange={() => handleCategoryToggle(category)}
                  >
                    {category}
                  </DropdownMenuCheckboxItem>
                ))}
                <h4 className="font-medium text-sm mt-3 mb-1">Duration</h4>
                <DropdownMenuCheckboxItem
                  checked={durationFilter === "short"}
                  onCheckedChange={() => setDurationFilter(durationFilter === "short" ? "all" : "short")}
                >
                  Short (≤30 min)
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={durationFilter === "medium"}
                  onCheckedChange={() => setDurationFilter(durationFilter === "medium" ? "all" : "medium")}
                >
                  Medium (30-60 min)
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={durationFilter === "long"}
                  onCheckedChange={() => setDurationFilter(durationFilter === "long" ? "all" : "long")}
                >
                  Long (60+ min)
                </DropdownMenuCheckboxItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center justify-between mb-4">
          <Tabs value={viewMode} onValueChange={setViewMode} className="w-auto">
            <TabsList>
              <TabsTrigger value="list">List</TabsTrigger>
              <TabsTrigger value="map">Map</TabsTrigger>
            </TabsList>
          </Tabs>

          <Tabs value={distanceFilter} onValueChange={setDistanceFilter} className="w-auto">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="nearby">≤1km</TabsTrigger>
              <TabsTrigger value="walking">≤2km</TabsTrigger>
              <TabsTrigger value="transit">≤5km</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {viewMode === "list" ? (
          <ScrollArea className="h-[calc(100vh-220px)]">
            {filteredActivities.length > 0 ? (
              <div className="space-y-4">
                {filteredActivities.map((activity) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card
                      className="overflow-hidden bg-white cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => handleCardClick(activity)}
                    >
                      <div className="flex">
                        <div className="relative w-24 h-24">
                          <Image
                            src={activity.image || "/placeholder.svg"}
                            alt={activity.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 p-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <CategoryBadge category={activity.category} className="text-[10px] px-2 py-0.5" />
                                {activity.distance > 0 && (
                                  <Badge
                                    variant="outline"
                                    className="text-[10px] px-2 py-0.5 flex items-center gap-1 bg-indigo-50 text-indigo-700 border-indigo-200"
                                  >
                                    <Navigation className="w-2 h-2" />
                                    {activity.distance} km
                                  </Badge>
                                )}
                              </div>
                              <h3 className="font-medium text-sm line-clamp-1">{activity.title}</h3>
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
                            <div className="flex items-center">
                              <MapPin className="w-3 h-3 mr-1" />
                              <span className="line-clamp-1">{activity.location}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {activity.duration}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <Search className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium mb-2">No activities found</h3>
                <p className="text-slate-600 mb-6 max-w-xs">
                  Try adjusting your filters or search query to find more activities.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("")
                    setCategoryFilters([])
                    setDistanceFilter("all")
                    setDurationFilter("all")
                  }}
                >
                  Clear all filters
                </Button>
              </div>
            )}
          </ScrollArea>
        ) : (
          <div className="h-[calc(100vh-220px)]">
            <NearbyActivitiesMap
              activities={filteredActivities}
              userLocation={locationData?.home?.coordinates || { lat: 31.2304, lng: 121.4737 }}
              onActivitySelect={handleCardClick}
            />
          </div>
        )}
      </div>

      <AnimatePresence>
        {showDetail && selectedActivity && <ActivityDetail activity={selectedActivity} onClose={handleCloseDetail} />}
      </AnimatePresence>

      <NavigationBar />
    </main>
  )
}

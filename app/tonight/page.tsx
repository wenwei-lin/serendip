"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Clock, MoreHorizontal, Plus, MapPin, Navigation, Settings } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

import NavigationBar from "@/components/navigation-bar"
import ActivityFeedback from "@/components/activity-feedback"
import ActivityDetail from "@/components/activity-detail"
import CategoryBadge from "@/components/category-badge"

// Sample activity data with status and location information
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
    status: "planned",
    selectedAt: new Date(2025, 3, 28, 14, 30),
    tasks: [
      { id: 1, text: "Visit the bookstore", completed: false },
      { id: 2, text: "Ask for staff recommendations", completed: false },
      { id: 3, text: "Find a book under 300 pages", completed: false },
    ],
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
    status: "in-progress",
    selectedAt: new Date(2025, 3, 28, 16, 15),
    tasks: [
      { id: 1, text: "Start the walking tour", completed: true },
      { id: 2, text: "Read the history guide", completed: true },
      { id: 3, text: "Find and count 5 art-deco door handles", completed: false },
      { id: 4, text: "Take photos of your favorites", completed: false },
    ],
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
    status: "completed",
    selectedAt: new Date(2025, 3, 28, 12, 0),
    completedAt: new Date(2025, 3, 28, 12, 25),
    tasks: [
      { id: 1, text: "Warm up for 3 minutes", completed: true },
      { id: 2, text: "Complete 4 rounds of exercises", completed: true },
      { id: 3, text: "Cool down and stretch", completed: true },
    ],
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
    status: "planned",
    selectedAt: new Date(2025, 3, 28, 17, 30),
    tasks: [
      { id: 1, text: "Visit the bronze exhibition", completed: false },
      { id: 2, text: "Explore the ceramics gallery", completed: false },
      { id: 3, text: "Check out the calligraphy section", completed: false },
    ],
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
    status: "planned",
    selectedAt: new Date(2025, 3, 28, 18, 0),
    tasks: [
      { id: 1, text: "Find a quiet spot by the river", completed: false },
      { id: 2, text: "Complete the guided meditation", completed: false },
      { id: 3, text: "Reflect on the experience", completed: false },
    ],
  },
]

// Status badge styling
const statusStyles = {
  planned: "bg-indigo-100 text-indigo-700 border-indigo-200",
  "in-progress": "bg-amber-100 text-amber-700 border-amber-200",
  completed: "bg-emerald-100 text-emerald-700 border-emerald-200",
}

export default function Tonight() {
  const [activeTab, setActiveTab] = useState("all")
  const [distanceFilter, setDistanceFilter] = useState("all")
  const [showFeedback, setShowFeedback] = useState(false)
  const [showDetail, setShowDetail] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState(null)
  const [locationData, setLocationData] = useState(null)
  const [hasLocationData, setHasLocationData] = useState(false)

  useEffect(() => {
    // Check if location data exists in localStorage
    const storedLocationData = localStorage.getItem("sparkLocationData")
    if (storedLocationData) {
      try {
        setLocationData(JSON.parse(storedLocationData))
        setHasLocationData(true)
      } catch (error) {
        console.error("Error parsing location data:", error)
      }
    }
  }, [])

  // Filter activities based on status and distance
  const filteredActivities = activities.filter((activity) => {
    // Status filter
    if (activeTab !== "all" && activity.status !== activeTab) return false

    // Distance filter
    if (distanceFilter === "nearby" && activity.distance > 1) return false
    if (distanceFilter === "walking" && activity.distance > 2) return false
    if (distanceFilter === "transit" && activity.distance > 5) return false

    return true
  })

  const handleOpenDetail = (activity) => {
    setSelectedActivity(activity)
    setShowDetail(true)
  }

  const handleOpenFeedback = (e, activity) => {
    e.stopPropagation()
    setSelectedActivity(activity)
    setShowFeedback(true)
  }

  const handleCloseDetail = () => {
    setShowDetail(false)
    setSelectedActivity(null)
  }

  const handleCloseFeedback = () => {
    setShowFeedback(false)
  }

  // Empty state component
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mb-4">
        <Plus className="h-10 w-10 text-rose-500" />
      </div>
      <h3 className="text-lg font-medium mb-2">No activities yet</h3>
      <p className="text-slate-600 mb-6 max-w-xs">
        Discover and add activities that spark joy and break your doom-scrolling habit.
      </p>
      <Link href="/" passHref>
        <Button className="bg-gradient-to-r from-rose-500 to-indigo-500 hover:from-rose-600 hover:to-indigo-600">
          Discover Activities
        </Button>
      </Link>
    </div>
  )

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-br from-rose-50 to-indigo-50 pb-20">
      <div className="w-full max-w-md mx-auto p-4">
        <header className="mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-rose-500 to-indigo-500 bg-clip-text text-transparent">
              Tonight
            </h1>
            <Link href="/location-setup">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Settings className="h-5 w-5 text-slate-600" />
                <span className="sr-only">Location Settings</span>
              </Button>
            </Link>
          </div>
          <p className="text-slate-600">Your selected activities for today</p>
        </header>

        {!hasLocationData && (
          <Alert className="mb-4 bg-amber-50 border-amber-200">
            <MapPin className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-amber-800">Location not set</AlertTitle>
            <AlertDescription className="text-amber-700">
              Set your location to get personalized nearby recommendations.{" "}
              <Link href="/location-setup" className="font-medium underline underline-offset-4">
                Set location
              </Link>
            </AlertDescription>
          </Alert>
        )}

        <div className="flex items-center justify-between mb-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="planned">Planned</TabsTrigger>
              <TabsTrigger value="in-progress">Active</TabsTrigger>
              <TabsTrigger value="completed">Done</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex items-center justify-between mb-4">
          <Tabs value={distanceFilter} onValueChange={setDistanceFilter} className="w-auto">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="nearby">≤1km</TabsTrigger>
              <TabsTrigger value="walking">≤2km</TabsTrigger>
              <TabsTrigger value="transit">≤5km</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

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
                    onClick={() => handleOpenDetail(activity)}
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
                              <Badge
                                variant="outline"
                                className={`text-[10px] px-2 py-0.5 ${statusStyles[activity.status]}`}
                              >
                                {activity.status === "planned" && "Planned"}
                                {activity.status === "in-progress" && "In Progress"}
                                {activity.status === "completed" && "Completed"}
                              </Badge>
                            </div>
                            <h3 className="font-medium text-sm line-clamp-1">{activity.title}</h3>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">More options</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {activity.status !== "completed" && (
                                <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                  Mark as completed
                                </DropdownMenuItem>
                              )}
                              {activity.status === "completed" && (
                                <DropdownMenuItem onClick={(e) => handleOpenFeedback(e, activity)}>
                                  Provide feedback
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={(e) => e.stopPropagation()}>Remove activity</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
                          <div className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {activity.duration}
                          </div>
                          <div>Selected at {format(activity.selectedAt, "h:mm a")}</div>
                        </div>

                        {activity.distance > 0 && (
                          <div className="flex items-center mt-2 text-xs text-indigo-600">
                            <Navigation className="w-3 h-3 mr-1" />
                            <span>{activity.distance} km away</span>
                          </div>
                        )}

                        {activity.status === "in-progress" && (
                          <div className="mt-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-slate-600">Progress</span>
                              <span className="text-indigo-600 font-medium">
                                {activity.tasks.filter((t) => t.completed).length}/{activity.tasks.length}
                              </span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-rose-500 to-indigo-500 rounded-full"
                                style={{
                                  width: `${(activity.tasks.filter((t) => t.completed).length / activity.tasks.length) * 100}%`,
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </ScrollArea>
      </div>

      <AnimatePresence>
        {showDetail && selectedActivity && (
          <ActivityDetail activity={selectedActivity} onClose={handleCloseDetail} showTasks={true} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showFeedback && selectedActivity && (
          <ActivityFeedback activity={selectedActivity} onClose={handleCloseFeedback} />
        )}
      </AnimatePresence>

      <NavigationBar />
    </main>
  )
}

"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion"
import { Clock, MapPin, ThumbsDown, ThumbsUp, Navigation, Settings } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import ActivityDetail from "@/components/activity-detail"
import NavigationBar from "@/components/navigation-bar"
import { useToast } from "@/hooks/use-toast"
import { Activity, ActivityStatus } from "@/types"
import { getActivities, addLikedActivity } from "@/lib/activities"

export default function Home() {
  const { toast } = useToast()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [energyLevel, setEnergyLevel] = useState(50)
  const [showEnergyPrompt, setShowEnergyPrompt] = useState(true)
  const [showDetail, setShowDetail] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
  const [distanceFilter, setDistanceFilter] = useState("all")
  const [locationData, setLocationData] = useState(null)
  const [hasLocationPermission, setHasLocationPermission] = useState(false)
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isCardLeaving, setIsCardLeaving] = useState(false)
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null)

  // Motion values for swipe gesture
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotate = useTransform(x, [-200, 0, 200], [-15, 0, 15])
  const cardOpacity = useTransform(x, [-200, -150, 0, 150, 200], [0.5, 1, 1, 1, 0.5])

  // Like/dislike indicator opacity based on swipe direction
  const likeOpacity = useTransform(x, [0, 50, 100, 150], [0, 0.5, 0.8, 1])
  const dislikeOpacity = useTransform(x, [-150, -100, -50, 0], [1, 0.8, 0.5, 0])

  useEffect(() => {
    // Check if location data exists in localStorage
    const storedLocationData = localStorage.getItem("sparkLocationData")
    if (storedLocationData) {
      try {
        setLocationData(JSON.parse(storedLocationData))
        setHasLocationPermission(true)
      } catch (error) {
        console.error("Error parsing location data:", error)
      }
    }
  }, [])

  const handleShowPicks = async () => {
    setIsLoading(true)
    try {
      const data = await getActivities()
      setActivities(data)
      setShowEnergyPrompt(false)
    } catch (error) {
      console.error("Error fetching activities:", error)
      toast({
        title: "Error",
        description: "Failed to fetch activities. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSwipe = async (dir: number) => {
    setDirection(dir)
    setIsCardLeaving(true)
    setSwipeDirection(dir > 0 ? "right" : "left")

    const currentActivity = filteredActivities[currentIndex]

    if (dir > 0) {
      // Like
      try {
        const newActivity = await addLikedActivity({
          title: currentActivity.title,
          category: currentActivity.category,
          description: currentActivity.description,
          image: currentActivity.image,
          location: currentActivity.location,
          address: currentActivity.address,
          coordinates: currentActivity.coordinates,
          distance: currentActivity.distance,
          duration: currentActivity.duration,
          why: currentActivity.why
        })

        toast({
          title: "Activity added!",
          description: `"${currentActivity.title}" has been added to your activities.`,
        })
      } catch (error) {
        console.error("Error adding activity:", error)
        toast({
          title: "Error",
          description: "Failed to add activity. Please try again.",
          variant: "destructive"
        })
      }
    }

    // Move to next card after a short delay
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % filteredActivities.length)
      setDirection(0)
      setIsCardLeaving(false)
      setSwipeDirection(null)

      // Reset position
      x.set(0)
      y.set(0)
    }, 300)
  }

  const handleCardClick = (activity: Activity) => {
    setSelectedActivity(activity)
    setShowDetail(true)
  }

  const handleCloseDetail = () => {
    setShowDetail(false)
    setSelectedActivity(null)
  }

  const handleDragEnd = (event: any, info: { offset: { x: number } }) => {
    const threshold = 100

    if (Math.abs(info.offset.x) > threshold) {
      // Swipe was strong enough to trigger action
      handleSwipe(info.offset.x > 0 ? 1 : -1)
    } else {
      // Reset position if swipe wasn't strong enough
      x.set(0)
      y.set(0)
    }
  }

  // Filter activities based on distance
  const filteredActivities = activities.filter((activity) => {
    if (distanceFilter === "all") return true
    if (distanceFilter === "nearby") return activity.distance <= 1
    if (distanceFilter === "walking") return activity.distance <= 2
    if (distanceFilter === "transit") return activity.distance <= 5
    return true
  })

  const currentActivity = filteredActivities[currentIndex] || activities[0]

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
      },
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.3,
      },
    }),
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500 mb-4"></div>
          <p className="text-slate-600">Finding activities that match your energy level...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-br from-rose-50 to-indigo-50 pb-20">
      <div className="w-full max-w-md mx-auto">
        <header className="mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-500 to-indigo-500 bg-clip-text text-transparent">
              Spark
            </h1>
            <Link href="/location-setup">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Settings className="h-5 w-5 text-slate-600" />
                <span className="sr-only">Settings</span>
              </Button>
            </Link>
          </div>
          <p className="text-slate-600 mt-1">End the doom-scroll. Get a spark for tonight.</p>
        </header>

        {!hasLocationPermission && !showEnergyPrompt && (
          <Alert className="mb-4 bg-amber-50 border-amber-200">
            <MapPin className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-amber-800">Enable location-based recommendations</AlertTitle>
            <AlertDescription className="text-amber-700">
              Set your locations to get personalized activity suggestions near you.{" "}
              <Link href="/location-setup" className="font-medium underline underline-offset-4">
                Set location
              </Link>
            </AlertDescription>
          </Alert>
        )}

        {showEnergyPrompt ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-xl p-6 shadow-lg"
          >
            <h2 className="text-lg font-medium mb-4">How's your energy right now?</h2>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-slate-500">😴</span>
              <Slider
                value={[energyLevel]}
                onValueChange={(value) => setEnergyLevel(value[0])}
                max={100}
                step={1}
                className="flex-1"
              />
              <span className="text-slate-500">🔥</span>
            </div>
            <Button
              onClick={handleShowPicks}
              className="w-full bg-gradient-to-r from-rose-500 to-indigo-500 hover:from-rose-600 hover:to-indigo-600"
            >
              Show me tonight's picks
            </Button>
          </motion.div>
        ) : (
          <>
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

            <div className="relative h-[500px] w-full">
              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="absolute w-full touch-none"
                  style={{
                    x,
                    y,
                    rotate,
                    opacity: cardOpacity,
                  }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.7}
                  onDragEnd={handleDragEnd}
                >
                  <Card
                    className="overflow-hidden bg-white shadow-xl rounded-xl cursor-pointer relative"
                    onClick={() => handleCardClick(currentActivity)}
                  >
                    {/* Like indicator */}
                    <motion.div
                      className="absolute top-1/2 right-6 transform -translate-y-1/2 z-10 bg-green-500 text-white rounded-full p-3 border-4 border-white"
                      style={{ opacity: likeOpacity }}
                    >
                      <ThumbsUp className="h-8 w-8" />
                    </motion.div>

                    {/* Dislike indicator */}
                    <motion.div
                      className="absolute top-1/2 left-6 transform -translate-y-1/2 z-10 bg-rose-500 text-white rounded-full p-3 border-4 border-white"
                      style={{ opacity: dislikeOpacity }}
                    >
                      <ThumbsDown className="h-8 w-8" />
                    </motion.div>

                    <div className="relative h-64">
                      <Image
                        src={currentActivity.image || "/placeholder.svg"}
                        alt={currentActivity.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-3 left-3 bg-white/90 px-3 py-1 rounded-full text-xs font-medium text-rose-600">
                        {currentActivity.category}
                      </div>
                      {currentActivity.distance > 0 && (
                        <div className="absolute top-3 right-3 bg-white/90 px-3 py-1 rounded-full text-xs font-medium flex items-center">
                          <Navigation className="w-3 h-3 mr-1 text-indigo-600" />
                          <span className="text-indigo-600">{currentActivity.distance} km</span>
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h2 className="text-xl font-bold mb-2">{currentActivity.title}</h2>
                      <p className="text-slate-600 text-sm mb-4">{currentActivity.description}</p>
                      <div className="flex items-center justify-between text-sm text-slate-500">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {currentActivity.location}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {currentActivity.duration}
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </AnimatePresence>

              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                <Button
                  onClick={() => handleSwipe(-1)}
                  size="lg"
                  variant="outline"
                  className="rounded-full h-14 w-14 p-0 border-2 border-rose-200 bg-white hover:bg-rose-50"
                >
                  <ThumbsDown className="h-6 w-6 text-rose-500" />
                  <span className="sr-only">Not interested</span>
                </Button>
                <Button
                  onClick={() => handleSwipe(1)}
                  size="lg"
                  className="rounded-full h-14 w-14 p-0 bg-gradient-to-r from-rose-500 to-indigo-500 hover:from-rose-600 hover:to-indigo-600"
                >
                  <ThumbsUp className="h-6 w-6 text-white" />
                  <span className="sr-only">Interested</span>
                </Button>
              </div>
            </div>

            {/* Swipe instruction hint */}
            <div className="text-center mt-4 text-sm text-slate-500 flex items-center justify-center">
              <motion.div
                animate={{ x: [-10, 10, -10] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                className="mr-2"
              >
                <ThumbsDown className="h-4 w-4 inline text-rose-400" />
              </motion.div>
              <span>Swipe cards to like or dislike</span>
              <motion.div
                animate={{ x: [10, -10, 10] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                className="ml-2"
              >
                <ThumbsUp className="h-4 w-4 inline text-green-400" />
              </motion.div>
            </div>
          </>
        )}

        <AnimatePresence>
          {showDetail && selectedActivity && <ActivityDetail activity={selectedActivity} onClose={handleCloseDetail} />}
        </AnimatePresence>
        <NavigationBar />
      </div>
    </main>
  )
}

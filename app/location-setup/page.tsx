"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Check, Home, MapPin, Navigation, Building, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Map from "@/components/map"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Mock function to simulate geocoding
const geocodeAddress = async (address) => {
  // In a real app, this would call a geocoding API
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Return mock coordinates based on the address
      // In reality, this would come from the API
      if (address.toLowerCase().includes("shanghai")) {
        resolve({ lat: 31.2304, lng: 121.4737 })
      } else if (address.toLowerCase().includes("beijing")) {
        resolve({ lat: 39.9042, lng: 116.4074 })
      } else if (address.toLowerCase().includes("home")) {
        resolve({ lat: 31.2226, lng: 121.4587 })
      } else if (address.toLowerCase().includes("work")) {
        resolve({ lat: 31.2287, lng: 121.4806 })
      } else if (address.toLowerCase() === "") {
        reject(new Error("Please enter an address"))
      } else {
        // Default coordinates (random location in Shanghai)
        resolve({ lat: 31.2304 + (Math.random() * 0.02 - 0.01), lng: 121.4737 + (Math.random() * 0.02 - 0.01) })
      }
    }, 1000)
  })
}

export default function LocationSetup() {
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("home")
  const [homeAddress, setHomeAddress] = useState("")
  const [workAddress, setWorkAddress] = useState("")
  const [homeCoordinates, setHomeCoordinates] = useState(null)
  const [workCoordinates, setWorkCoordinates] = useState(null)
  const [isGeocoding, setIsGeocoding] = useState(false)
  const [useCurrentLocation, setUseCurrentLocation] = useState(false)
  const [error, setError] = useState("")

  // Check for existing location data on component mount
  useEffect(() => {
    const storedLocationData = localStorage.getItem("sparkLocationData")
    if (storedLocationData) {
      try {
        const data = JSON.parse(storedLocationData)
        if (data.home) {
          setHomeAddress(data.home.address || "")
          setHomeCoordinates(data.home.coordinates || null)
        }
        if (data.work) {
          setWorkAddress(data.work.address || "")
          setWorkCoordinates(data.work.coordinates || null)
        }
      } catch (error) {
        console.error("Error parsing stored location data:", error)
      }
    }
  }, [])

  const handleGetCurrentLocation = () => {
    setUseCurrentLocation(true)
    setError("")

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }

          if (activeTab === "home") {
            setHomeCoordinates(coords)
            setHomeAddress("Current Location")
          } else {
            setWorkCoordinates(coords)
            setWorkAddress("Current Location")
          }

          setUseCurrentLocation(false)
          toast({
            title: "Location detected",
            description: "Your current location has been set successfully.",
          })
        },
        (error) => {
          console.error("Error getting location:", error)
          setUseCurrentLocation(false)
          setError("Unable to get your current location. Please enter an address manually.")
          toast({
            title: "Location error",
            description: "Unable to get your current location. Please enter an address.",
            variant: "destructive",
          })
        },
        { timeout: 10000, enableHighAccuracy: true },
      )
    } else {
      setUseCurrentLocation(false)
      setError("Your browser doesn't support geolocation. Please enter an address manually.")
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support geolocation. Please enter an address.",
        variant: "destructive",
      })
    }
  }

  const handleGeocodeAddress = async () => {
    const address = activeTab === "home" ? homeAddress : workAddress
    setError("")

    if (!address) {
      setError("Please enter an address to continue.")
      return
    }

    setIsGeocoding(true)

    try {
      const coordinates = await geocodeAddress(address)

      if (activeTab === "home") {
        setHomeCoordinates(coordinates)
      } else {
        setWorkCoordinates(coordinates)
      }

      toast({
        title: "Address found",
        description: "Your location has been set successfully.",
      })
    } catch (error) {
      console.error("Geocoding error:", error)
      setError(error.message || "Unable to find coordinates for this address. Please try again.")
      toast({
        title: "Geocoding error",
        description: error.message || "Unable to find coordinates for this address. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGeocoding(false)
    }
  }

  const handleSaveLocations = () => {
    // In a real app, you would save these to your backend or local storage
    const locationData = {
      home: {
        address: homeAddress,
        coordinates: homeCoordinates,
      },
      work: {
        address: workAddress,
        coordinates: workCoordinates,
      },
    }

    // Save to localStorage for demo purposes
    localStorage.setItem("sparkLocationData", JSON.stringify(locationData))

    toast({
      title: "Locations saved",
      description: "Your location preferences have been saved.",
    })

    // Navigate back to the home page
    router.push("/tonight")
  }

  const isFormComplete = () => {
    return homeCoordinates || workCoordinates
  }

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-br from-rose-50 to-indigo-50 p-4">
      <div className="w-full max-w-md mx-auto">
        <header className="mb-6">
          <Link href="/" className="inline-flex items-center text-slate-600 mb-4">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Spark
          </Link>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-rose-500 to-indigo-500 bg-clip-text text-transparent">
            Location Setup
          </h1>
          <p className="text-slate-600">Set your locations for personalized activity recommendations</p>
        </header>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card className="overflow-hidden bg-white shadow-lg rounded-xl">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="home" className="flex items-center gap-1">
                <Home className="w-4 h-4" />
                Home
              </TabsTrigger>
              <TabsTrigger value="work" className="flex items-center gap-1">
                <Building className="w-4 h-4" />
                Work
              </TabsTrigger>
            </TabsList>

            <TabsContent value="home" className="p-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="home-address">Home Address</Label>
                <div className="flex gap-2">
                  <Input
                    id="home-address"
                    placeholder="Enter your home address"
                    value={homeAddress}
                    onChange={(e) => setHomeAddress(e.target.value)}
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleGetCurrentLocation}
                    disabled={useCurrentLocation}
                  >
                    {useCurrentLocation ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Navigation className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <Button
                  onClick={handleGeocodeAddress}
                  disabled={!homeAddress || isGeocoding}
                  className="w-full"
                  variant="secondary"
                >
                  {isGeocoding ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Finding location...
                    </>
                  ) : (
                    <>
                      <MapPin className="mr-2 h-4 w-4" />
                      Set Location
                    </>
                  )}
                </Button>
              </div>

              {homeCoordinates && (
                <div className="rounded-lg overflow-hidden border h-48">
                  <Map center={homeCoordinates} zoom={14} markers={[homeCoordinates]} />
                </div>
              )}
            </TabsContent>

            <TabsContent value="work" className="p-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="work-address">Work Address</Label>
                <div className="flex gap-2">
                  <Input
                    id="work-address"
                    placeholder="Enter your work address"
                    value={workAddress}
                    onChange={(e) => setWorkAddress(e.target.value)}
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleGetCurrentLocation}
                    disabled={useCurrentLocation}
                  >
                    {useCurrentLocation ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Navigation className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <Button
                  onClick={handleGeocodeAddress}
                  disabled={!workAddress || isGeocoding}
                  className="w-full"
                  variant="secondary"
                >
                  {isGeocoding ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Finding location...
                    </>
                  ) : (
                    <>
                      <MapPin className="mr-2 h-4 w-4" />
                      Set Location
                    </>
                  )}
                </Button>
              </div>

              {workCoordinates && (
                <div className="rounded-lg overflow-hidden border h-48">
                  <Map center={workCoordinates} zoom={14} markers={[workCoordinates]} />
                </div>
              )}
            </TabsContent>
          </Tabs>

          <div className="p-4 border-t">
            <p className="text-xs text-slate-500 mb-4">
              At least one location is required. Setting both home and work locations will help us provide better
              recommendations based on your daily routine.
            </p>
            <Button
              onClick={handleSaveLocations}
              disabled={!isFormComplete()}
              className="w-full bg-gradient-to-r from-rose-500 to-indigo-500 hover:from-rose-600 hover:to-indigo-600"
            >
              <Check className="mr-2 h-4 w-4" />
              Save Locations
            </Button>
          </div>
        </Card>
      </div>
    </main>
  )
}

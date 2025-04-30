"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import Map from "@/components/map"
import { Badge } from "@/components/ui/badge"
import { Clock, Navigation } from "lucide-react"

export default function NearbyActivitiesMap({ activities, userLocation, onActivitySelect }) {
  const [selectedMarker, setSelectedMarker] = useState(null)
  const [mapCenter, setMapCenter] = useState(userLocation)
  const [mapZoom, setMapZoom] = useState(13)

  // Filter out activities without coordinates
  const mappableActivities = activities.filter((activity) => activity.coordinates)

  // Prepare markers for the map
  const markers = mappableActivities.map((activity) => ({
    ...activity.coordinates,
    id: activity.id,
    title: activity.title,
  }))

  // Add user location marker if available
  const allMarkers = userLocation
    ? [{ ...userLocation, id: "user", title: "Your Location", isUser: true }, ...markers]
    : markers

  useEffect(() => {
    // If a marker is selected, center the map on it
    if (selectedMarker) {
      const activity = mappableActivities.find((a) => a.id === selectedMarker)
      if (activity && activity.coordinates) {
        setMapCenter(activity.coordinates)
        setMapZoom(15)
      }
    } else {
      // Reset to user location if no marker is selected
      setMapCenter(userLocation)
      setMapZoom(13)
    }
  }, [selectedMarker, mappableActivities, userLocation])

  const handleMarkerClick = (markerId) => {
    setSelectedMarker(markerId)
    const activity = activities.find((a) => a.id === markerId)
    if (activity) {
      onActivitySelect(activity)
    }
  }

  return (
    <Card className="overflow-hidden h-full">
      <div className="relative h-full">
        <Map center={mapCenter} zoom={mapZoom} markers={allMarkers} onMarkerClick={handleMarkerClick} />

        <div className="absolute bottom-0 left-0 right-0 p-3 bg-white border-t">
          <h3 className="font-medium text-sm mb-2">Nearby Activities</h3>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {mappableActivities.map((activity) => (
              <div
                key={activity.id}
                className={`flex-shrink-0 p-2 rounded-lg border cursor-pointer ${
                  selectedMarker === activity.id ? "bg-rose-50 border-rose-200" : "bg-white hover:bg-slate-50"
                }`}
                onClick={() => handleMarkerClick(activity.id)}
              >
                <div className="flex items-center gap-2 w-40">
                  <Badge variant="outline" className="bg-white text-[10px] px-1.5 py-0.5 whitespace-nowrap">
                    {activity.category}
                  </Badge>
                  <div className="flex items-center text-xs text-indigo-600">
                    <Navigation className="w-3 h-3 mr-0.5" />
                    {activity.distance}km
                  </div>
                </div>
                <div className="font-medium text-xs mt-1 line-clamp-1">{activity.title}</div>
                <div className="flex items-center text-xs text-slate-500 mt-1">
                  <Clock className="w-3 h-3 mr-0.5" />
                  {activity.duration}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}

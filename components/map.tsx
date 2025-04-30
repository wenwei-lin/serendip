"use client"

import { useEffect, useRef } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"

// In a real app, you would use an environment variable for this
// For this demo, we're using a public token with restricted usage
mapboxgl.accessToken = "pk.eyJ1IjoiZXhhbXBsZXVzZXIiLCJhIjoiY2xvY2FsdG9rZW4ifQ.dGVzc3VzZWRmb3JkZW1v"

export default function Map({
  center,
  zoom = 12,
  markers = [],
  interactive = true,
  style = "mapbox://styles/mapbox/streets-v11",
  onMarkerClick = null,
}) {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const markersRef = useRef([])

  useEffect(() => {
    if (!mapContainer.current) return

    // Initialize map if it doesn't exist
    if (!map.current) {
      try {
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style,
          center: center || [121.4737, 31.2304], // Default to Shanghai
          zoom: zoom,
          interactive,
        })

        // Add navigation controls if interactive
        if (interactive) {
          map.current.addControl(new mapboxgl.NavigationControl(), "top-right")
        }
      } catch (error) {
        console.error("Error initializing map:", error)
        return
      }
    } else {
      // Update map center if it changed
      if (center) {
        map.current.flyTo({
          center,
          zoom,
          essential: true,
        })
      }
    }

    // Clean up existing markers
    markersRef.current.forEach((marker) => marker.remove())
    markersRef.current = []

    // Add markers
    markers.forEach((markerPosition) => {
      try {
        const markerElement = document.createElement("div")
        markerElement.className = markerPosition.isUser
          ? "w-6 h-6 bg-indigo-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center"
          : "w-6 h-6 bg-rose-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center"

        markerElement.innerHTML = markerPosition.isUser
          ? '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="text-white"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>'
          : '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="text-white"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>'

        const marker = new mapboxgl.Marker(markerElement)
          .setLngLat([markerPosition.lng, markerPosition.lat])
          .addTo(map.current)

        // Add popup if title is provided
        if (markerPosition.title) {
          const popup = new mapboxgl.Popup({ offset: 25 }).setText(markerPosition.title)
          marker.setPopup(popup)
        }

        // Add click handler if provided
        if (onMarkerClick && markerPosition.id) {
          markerElement.addEventListener("click", () => {
            onMarkerClick(markerPosition.id)
          })
        }

        markersRef.current.push(marker)
      } catch (error) {
        console.error("Error adding marker:", error)
      }
    })

    return () => {
      // Clean up map on unmount
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [center, zoom, markers, interactive, style, onMarkerClick])

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />
      {!mapboxgl.supported() && (
        <div className="absolute inset-0 bg-slate-100 flex items-center justify-center p-4 text-center">
          <p className="text-slate-600">
            Your browser doesn't support Mapbox GL. Please try using a modern browser like Chrome, Firefox, or Safari.
          </p>
        </div>
      )}
    </div>
  )
}

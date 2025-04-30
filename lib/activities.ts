'use server'
import { Activity, ActivityStatus } from "@/types"

// Mock data
const mockActivities: Activity[] = [
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
  // Add more mock activities as needed
]

export async function getActivities(status?: ActivityStatus) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  
  if (status) {
    return mockActivities.filter(activity => activity.status === status)
  }
  return mockActivities
}

export async function getActivityById(id: number) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  
  return mockActivities.find(activity => activity.id === id) || null
}

export async function updateActivityStatus(id: number, status: ActivityStatus) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  
  const activity = mockActivities.find(a => a.id === id)
  if (activity) {
    activity.status = status
    if (status === "completed") {
      activity.completedAt = new Date()
    }
  }
  return activity
}

export async function addLikedActivity(activity: Omit<Activity, 'id' | 'status' | 'selectedAt' | 'tasks'>) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  
  const newActivity: Activity = {
    ...activity,
    id: Math.max(...mockActivities.map(a => a.id)) + 1,
    status: "planned",
    selectedAt: new Date(),
    tasks: []
  }
  
  mockActivities.push(newActivity)
  return newActivity
} 
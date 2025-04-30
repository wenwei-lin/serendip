export type ActivityStatus = "planned" | "in-progress" | "completed"

export type ActivityCategory = "Micro-escape" | "Body reboot" | "City-lens" | "Craft burst" | "Learning bite"

export interface Coordinates {
  lat: number
  lng: number
}

export interface Task {
  id: number
  text: string
  completed: boolean
}

export interface Activity {
  id: number
  title: string
  category: ActivityCategory
  description: string
  image: string
  location: string
  address: string
  coordinates: Coordinates | null
  distance: number
  duration: string
  why: string
  status?: ActivityStatus
  selectedAt?: Date
  completedAt?: Date
  tasks?: Task[]
} 
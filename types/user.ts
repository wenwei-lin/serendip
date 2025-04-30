export interface UserPreferences {
  maxDistance: number
  energyPreference: number
  timePreference: number
  notificationsEnabled: boolean
  locationTrackingEnabled: boolean
}

export interface UserStats {
  activitiesCompleted: number
  streakDays: number
  favoriteCategoryId: string
  totalTimeSpent: string
}

export interface User {
  name: string
  preferences: UserPreferences
  stats: UserStats
  likedActivities: number[]
  dislikedActivities: number[]
} 
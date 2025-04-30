'use server'

import { User, UserPreferences, UserStats } from "@/types"

// Mock data
const mockUser: User = {
  name: "Alex Chen",
  preferences: {
    maxDistance: 5,
    energyPreference: 50,
    timePreference: 45,
    notificationsEnabled: true,
    locationTrackingEnabled: true,
  },
  stats: {
    activitiesCompleted: 12,
    streakDays: 5,
    favoriteCategoryId: "city-lens",
    totalTimeSpent: "8.5 hours",
  },
  likedActivities: [1, 3],
  dislikedActivities: [4],
}

export async function getUser() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockUser
}

export async function updateUserPreferences(preferences: Partial<UserPreferences>) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  
  mockUser.preferences = {
    ...mockUser.preferences,
    ...preferences,
  }
  return mockUser.preferences
}

export async function updateUserStats(stats: Partial<UserStats>) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  
  mockUser.stats = {
    ...mockUser.stats,
    ...stats,
  }
  return mockUser.stats
}

export async function updateLikedActivities(activityId: number, liked: boolean) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  
  if (liked) {
    if (!mockUser.likedActivities.includes(activityId)) {
      mockUser.likedActivities.push(activityId)
    }
    mockUser.dislikedActivities = mockUser.dislikedActivities.filter(id => id !== activityId)
  } else {
    if (!mockUser.dislikedActivities.includes(activityId)) {
      mockUser.dislikedActivities.push(activityId)
    }
    mockUser.likedActivities = mockUser.likedActivities.filter(id => id !== activityId)
  }
  
  return {
    likedActivities: mockUser.likedActivities,
    dislikedActivities: mockUser.dislikedActivities,
  }
} 
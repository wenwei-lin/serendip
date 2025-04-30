'use server'

import { ActivityFeedback, MorningFeedback, FeedbackType } from "@/types"
import { getActivityById } from "./activities"

// Mock data storage
const mockFeedback: ActivityFeedback[] = []
const mockMorningFeedback: MorningFeedback[] = []

export async function submitActivityFeedback(activityId: number, feedback: FeedbackType, enjoyment: number, reflection: string) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  
  const activity = await getActivityById(activityId)
  if (!activity) {
    throw new Error("Activity not found")
  }
  
  const newFeedback: ActivityFeedback = {
    activity,
    feedback,
    enjoyment,
    reflection,
    submitted: true,
  }
  
  mockFeedback.push(newFeedback)
  return newFeedback
}

export async function submitMorningFeedback(activityId: number, feedback: FeedbackType, reflection: string) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  
  const activity = await getActivityById(activityId)
  if (!activity) {
    throw new Error("Activity not found")
  }
  
  const newFeedback: MorningFeedback = {
    activity,
    feedback,
    reflection,
    submitted: true,
  }
  
  mockMorningFeedback.push(newFeedback)
  return newFeedback
}

export async function getActivityFeedback(activityId: number) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  
  return mockFeedback.find(f => f.activity.id === activityId) || null
}

export async function getMorningFeedback(activityId: number) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  
  return mockMorningFeedback.find(f => f.activity.id === activityId) || null
} 
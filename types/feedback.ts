import { Activity } from "./activity"

export type FeedbackType = "like" | "dislike"

export interface ActivityFeedback {
  activity: Activity
  feedback: FeedbackType | null
  enjoyment: number | null
  reflection: string
  submitted: boolean
}

export interface MorningFeedback {
  activity: Activity
  feedback: FeedbackType | null
  reflection: string
  submitted: boolean
} 
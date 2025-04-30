import {
  Palette,
  Dumbbell,
  BookOpen,
  Camera,
  Music,
  Coffee,
  Utensils,
  Leaf,
  Compass,
  Heart,
  Gamepad2,
  PenTool,
  Bike,
} from "lucide-react"

export interface InterestCategory {
  id: string
  name: string
  icon: typeof Palette
  selected: boolean
}

export interface ActivityCategoryConfig {
  id: string
  name: string
  selected: boolean
}

export const INTEREST_CATEGORIES: InterestCategory[] = [
  { id: "arts", name: "Arts & Culture", icon: Palette, selected: false },
  { id: "fitness", name: "Fitness & Sports", icon: Dumbbell, selected: false },
  { id: "reading", name: "Reading & Writing", icon: BookOpen, selected: false },
  { id: "photography", name: "Photography", icon: Camera, selected: false },
  { id: "music", name: "Music & Concerts", icon: Music, selected: false },
  { id: "cafes", name: "Cafes & Tea Houses", icon: Coffee, selected: false },
  { id: "food", name: "Food & Cuisine", icon: Utensils, selected: false },
  { id: "outdoors", name: "Outdoors & Nature", icon: Leaf, selected: false },
  { id: "exploration", name: "Urban Exploration", icon: Compass, selected: false },
  { id: "wellness", name: "Wellness & Mindfulness", icon: Heart, selected: false },
  { id: "gaming", name: "Gaming & Entertainment", icon: Gamepad2, selected: false },
  { id: "crafts", name: "Crafts & DIY", icon: PenTool, selected: false },
  { id: "cycling", name: "Cycling & Biking", icon: Bike, selected: false },
]

export const ACTIVITY_CATEGORIES: ActivityCategoryConfig[] = [
  { id: "micro-escape", name: "Micro-escape", selected: true },
  { id: "body-reboot", name: "Body reboot", selected: true },
  { id: "city-lens", name: "City-lens", selected: true },
  { id: "craft-burst", name: "Craft burst", selected: true },
  { id: "learning-bite", name: "Learning bite", selected: true },
] 
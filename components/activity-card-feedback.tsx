"use client"

import { motion } from "framer-motion"
import { ThumbsUp, ThumbsDown } from "lucide-react"

export default function ActivityCardFeedback({ type, visible }) {
  const isLike = type === "like"

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: visible ? 1 : 0,
        scale: visible ? 1 : 0.8,
        x: isLike ? 20 : -20,
      }}
      className={`absolute top-1/2 ${isLike ? "right-6" : "left-6"} transform -translate-y-1/2 z-10 ${
        isLike ? "bg-green-500" : "bg-rose-500"
      } text-white rounded-full p-3 border-4 border-white shadow-lg`}
    >
      {isLike ? <ThumbsUp className="h-8 w-8" /> : <ThumbsDown className="h-8 w-8" />}
    </motion.div>
  )
}

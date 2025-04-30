"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ThumbsDown, ThumbsUp } from "lucide-react"

export default function FeedbackPrompt({ activity, onClose }) {
  const [feedback, setFeedback] = useState(null)
  const [submitted, setSubmitted] = useState(false)

  const handleFeedback = (value) => {
    setFeedback(value)
    setTimeout(() => {
      setSubmitted(true)
      setTimeout(onClose, 1500)
    }, 500)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed inset-x-0 bottom-0 p-4 z-50"
    >
      <Card className="mx-auto max-w-md p-6 shadow-lg bg-white">
        {!submitted ? (
          <>
            <h3 className="text-lg font-medium mb-4">How did your {activity.category.toLowerCase()} go?</h3>
            <p className="text-slate-600 mb-6">Your feedback helps us suggest better activities next time.</p>
            <div className="flex justify-center gap-4">
              <Button
                onClick={() => handleFeedback("negative")}
                variant="outline"
                className="flex-1 border-2 border-rose-200 hover:bg-rose-50"
              >
                <ThumbsDown className="h-5 w-5 mr-2 text-rose-500" />
                Not great
              </Button>
              <Button
                onClick={() => handleFeedback("positive")}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
              >
                <ThumbsUp className="h-5 w-5 mr-2" />
                Loved it!
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-2">
            <p className="text-lg font-medium text-emerald-600">Thanks for your feedback!</p>
          </div>
        )}
      </Card>
    </motion.div>
  )
}

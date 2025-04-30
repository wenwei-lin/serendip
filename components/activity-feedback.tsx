"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ThumbsDown, ThumbsUp, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

export default function ActivityFeedback({ activity, onClose }) {
  const [feedback, setFeedback] = useState(null)
  const [enjoyment, setEnjoyment] = useState(null)
  const [reflection, setReflection] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    // Here you would typically send the feedback data to your backend
    setSubmitted(true)
    setTimeout(() => {
      onClose()
    }, 1500)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="overflow-hidden bg-white shadow-2xl">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-medium">Activity Feedback</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>

          {!submitted ? (
            <div className="p-4 space-y-6">
              <div>
                <h3 className="font-medium mb-1">{activity.title}</h3>
                <p className="text-sm text-slate-600">{activity.category}</p>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-medium">How did you enjoy this activity?</h4>
                <div className="flex gap-3">
                  <Button
                    onClick={() => setFeedback("negative")}
                    variant={feedback === "negative" ? "default" : "outline"}
                    className={
                      feedback === "negative" ? "flex-1 bg-rose-500 hover:bg-rose-600" : "flex-1 hover:bg-rose-50"
                    }
                  >
                    <ThumbsDown className="h-4 w-4 mr-2" />
                    Not great
                  </Button>
                  <Button
                    onClick={() => setFeedback("positive")}
                    variant={feedback === "positive" ? "default" : "outline"}
                    className={
                      feedback === "positive"
                        ? "flex-1 bg-emerald-500 hover:bg-emerald-600"
                        : "flex-1 hover:bg-emerald-50"
                    }
                  >
                    <ThumbsUp className="h-4 w-4 mr-2" />
                    Loved it!
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-medium">Rate your enjoyment</h4>
                <RadioGroup value={enjoyment} onValueChange={setEnjoyment} className="flex">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <div key={value} className="flex flex-col items-center">
                      <RadioGroupItem value={value.toString()} id={`rating-${value}`} className="peer sr-only" />
                      <Label
                        htmlFor={`rating-${value}`}
                        className="p-2 cursor-pointer rounded-full h-10 w-10 flex items-center justify-center peer-data-[state=checked]:bg-gradient-to-r peer-data-[state=checked]:from-rose-500 peer-data-[state=checked]:to-indigo-500 peer-data-[state=checked]:text-white hover:bg-slate-100"
                      >
                        {value}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">What did you learn or enjoy? (optional)</h4>
                <Textarea
                  placeholder="Share your thoughts about this activity..."
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  className="resize-none"
                  rows={3}
                />
              </div>

              <Button
                onClick={handleSubmit}
                disabled={!feedback || !enjoyment}
                className="w-full bg-gradient-to-r from-rose-500 to-indigo-500 hover:from-rose-600 hover:to-indigo-600"
              >
                Submit Feedback
              </Button>
            </div>
          ) : (
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-rose-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <ThumbsUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-medium mb-2">Thanks for your feedback!</h3>
              <p className="text-slate-600">
                Your input helps us suggest better activities tailored to your preferences.
              </p>
            </div>
          )}
        </Card>
      </motion.div>
    </motion.div>
  )
}

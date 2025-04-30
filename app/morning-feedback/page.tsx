"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, ThumbsDown, ThumbsUp } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import CategoryBadge from "@/components/category-badge"

// Sample activity from yesterday
const yesterdayActivity = {
  id: 3,
  title: "Art-Deco Architecture Walk",
  category: "City-lens",
  description: "Walk the lane behind Xintiandi, count art-deco door handles with a 5-min history guide.",
  image: "/shanghai-deco-facade.png",
  location: "Xintiandi District",
  duration: "30 min",
}

export default function MorningFeedback() {
  const [feedback, setFeedback] = useState(null)
  const [reflection, setReflection] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    setSubmitted(true)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-br from-amber-50 to-rose-50">
      <div className="w-full max-w-md mx-auto">
        <header className="mb-6">
          <Link href="/" className="inline-flex items-center text-slate-600 mb-4">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Spark
          </Link>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-500 to-rose-500 bg-clip-text text-transparent">
            Good Morning!
          </h1>
          <p className="text-slate-600">How did your activity go yesterday?</p>
        </header>

        {!submitted ? (
          <Card className="overflow-hidden bg-white shadow-lg rounded-xl">
            <div className="relative h-40">
              <Image
                src={yesterdayActivity.image || "/placeholder.svg"}
                alt={yesterdayActivity.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                <div className="p-4 text-white">
                  <CategoryBadge category={yesterdayActivity.category} className="mb-2" />
                  <h2 className="text-xl font-bold">{yesterdayActivity.title}</h2>
                </div>
              </div>
            </div>

            <div className="p-5">
              <h3 className="font-medium mb-3">How did it go?</h3>
              <div className="flex gap-3 mb-6">
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

              <div className="mb-6">
                <label htmlFor="reflection" className="block font-medium mb-2">
                  Any reflections? (optional)
                </label>
                <Textarea
                  id="reflection"
                  placeholder="What did you enjoy or learn? What would make it better next time?"
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  className="resize-none"
                  rows={4}
                />
              </div>

              <Button
                onClick={handleSubmit}
                disabled={!feedback}
                className="w-full bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600"
              >
                Submit Feedback
              </Button>
            </div>
          </Card>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 shadow-lg text-center"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <ThumbsUp className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-xl font-bold mb-2">Thanks for your feedback!</h2>
            <p className="text-slate-600 mb-6">
              We'll use this to improve your recommendations. Check back this evening for new sparks!
            </p>
            <Link href="/" passHref>
              <Button className="bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600">
                Back to Spark
              </Button>
            </Link>
          </motion.div>
        )}
      </div>
    </main>
  )
}

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  MapPin,
  Navigation,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import CategoryBadge from "@/components/category-badge";
import Map from "@/components/map";

export default function ActivityDetail({
  activity,
  onClose,
  showTasks = false,
}) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (activity && activity.tasks) {
      setTasks(activity.tasks);
    } else {
      setTasks([]);
    }
  }, [activity]);

  if (!activity) return null;

  const handleTaskToggle = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const hasLocation =
    activity.coordinates &&
    activity.coordinates.lat &&
    activity.coordinates.lng;

  // Function to open directions in the user's map app
  const openDirections = () => {
    if (!hasLocation) return;

    // Create a URL that will open in the user's default map app
    const url = `https://www.google.com/maps/dir/?api=1&destination=${activity.coordinates.lat},${activity.coordinates.lng}&travelmode=walking`;
    window.open(url, "_blank");
  };

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
        className="w-full max-w-md h-[75vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="h-full flex flex-col bg-white shadow-2xl rounded-xl">
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-3 left-3 z-10 rounded-full bg-white/80 hover:bg-white"
              onClick={onClose}
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back</span>
            </Button>
            <div className="relative h-48">
              <Image
                src={activity.image || "/placeholder.svg"}
                alt={activity.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                <div className="p-4 text-white">
                  <CategoryBadge
                    category={activity.category}
                    className="mb-2"
                  />
                  <h2 className="text-xl font-bold">{activity.title}</h2>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 overflow-y-auto flex-1">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center text-slate-600">
                <MapPin className="w-4 h-4 mr-2 text-rose-500" />
                <span className="text-sm">{activity.location}</span>
              </div>
              <div className="flex items-center text-slate-600">
                <Clock className="w-4 h-4 mr-2 text-rose-500" />
                <span className="text-sm">{activity.duration}</span>
              </div>
            </div>

            {activity.distance > 0 && (
              <div className="flex items-center mb-4 text-indigo-600 text-sm">
                <Navigation className="w-4 h-4 mr-2" />
                <span>{activity.distance} km away</span>
                {activity.address && (
                  <span className="ml-1 text-slate-500">
                    • {activity.address}
                  </span>
                )}
              </div>
            )}

            <p className="text-slate-600 mb-4">{activity.description}</p>

            {/* {hasLocation && (
              <div className="mb-4 rounded-lg overflow-hidden border h-32">
                <Map center={activity.coordinates} zoom={15} markers={[activity.coordinates]} interactive={false} />
                <div className="p-2 bg-slate-50 border-t flex justify-between items-center">
                  <span className="text-xs text-slate-600">{activity.address}</span>
                  <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={openDirections}>
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Open in Maps
                  </Button>
                </div>
              </div>
            )} */}

            <div className="bg-indigo-50 rounded-lg p-3 mb-4">
              <h3 className="font-medium text-indigo-800 text-sm mb-1">
                Why this might spark joy
              </h3>
              <p className="text-indigo-700 text-xs">{activity.why}</p>
            </div>

            {showTasks && tasks && tasks.length > 0 && (
              <>
                <Separator className="my-4" />

                <div className="space-y-2">
                  <h3 className="font-medium text-sm">Micro-journey tasks</h3>

                  {tasks.map((task) => (
                    <div key={task.id} className="flex items-start space-x-2">
                      <Checkbox
                        id={`task-${task.id}`}
                        checked={task.completed}
                        onCheckedChange={() => handleTaskToggle(task.id)}
                        className="mt-0.5"
                      />
                      <Label
                        htmlFor={`task-${task.id}`}
                        className={`text-sm ${
                          task.completed
                            ? "line-through text-slate-400"
                            : "text-slate-700"
                        }`}
                      >
                        {task.text}
                      </Label>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="p-4 border-t">
            {activity.status === "planned" && hasLocation && (
              <Button
                className="w-full bg-gradient-to-r from-rose-500 to-indigo-500 hover:from-rose-600 hover:to-indigo-600"
                onClick={openDirections}
              >
                <Navigation className="mr-2 h-4 w-4" />
                Get Directions
              </Button>
            )}
            {activity.status === "planned" && !hasLocation && (
              <Button className="w-full bg-gradient-to-r from-rose-500 to-indigo-500 hover:from-rose-600 hover:to-indigo-600">
                Start Activity
              </Button>
            )}
            {activity.status === "in-progress" && (
              <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                Continue Activity
              </Button>
            )}
            {activity.status === "completed" && (
              <Button className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600">
                <CheckCircle className="mr-2 h-4 w-4" />
                Completed
              </Button>
            )}
            {!activity.status && hasLocation && (
              <Button
                className="w-full bg-gradient-to-r from-rose-500 to-indigo-500 hover:from-rose-600 hover:to-indigo-600"
                onClick={openDirections}
              >
                <Navigation className="mr-2 h-4 w-4" />
                Get Directions
              </Button>
            )}
            {!activity.status && !hasLocation && (
              <Button className="w-full bg-gradient-to-r from-rose-500 to-indigo-500 hover:from-rose-600 hover:to-indigo-600">
                Start Activity
              </Button>
            )}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}

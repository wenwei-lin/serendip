"use server";
import { supabase } from "./supabase";
import { Activity, ActivityStatus } from "@/types";

// Get all liked activities with optional status filter
export async function db_getLikedActivities(status?: ActivityStatus) {
  let query = supabase
    .from("activities")
    .select("*, activity_tasks(*)")
    .eq("swipe_status", "liked")
    .order("created_at", { ascending: false });

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching liked activities:", error);
    throw error;
  }

  return data;
}

// Get unswiped activities
export async function db_getUnswipedActivities() {
  const { data, error } = await supabase
    .from("activities")
    .select("*, activity_tasks(*)")
    .eq("swipe_status", "unswiped")
    .order("generated_at", { ascending: true });

  if (error) {
    console.error("Error fetching unswiped activities:", error);
    throw error;
  }

  return data;
}

// Get a single activity by ID
export async function db_getActivityById(id: number) {
  const { data, error } = await supabase
    .from("activities")
    .select("*, activity_tasks(*)")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching activity:", error);
    throw error;
  }

  return data;
}

// Update activity status
export async function db_updateActivityStatus(
  id: number,
  status: ActivityStatus
) {
  const updates: Record<string, any> = {
    status,
    updated_at: new Date().toISOString(),
  };

  if (status === "completed") {
    updates.completed_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from("activities")
    .update(updates)
    .eq("id", id)
    .select("*, activity_tasks(*)")
    .single();

  if (error) {
    console.error("Error updating activity status:", error);
    throw error;
  }

  return data;
}

// Mark an activity as swiped
export async function db_markActivityAsSwiped(id: number, isLiked: boolean) {
  const updates: Record<string, any> = {
    swipe_status: isLiked ? "liked" : "disliked",
    swiped_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (isLiked) {
    updates.status = "planned";
    updates.selected_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from("activities")
    .update(updates)
    .eq("id", id)
    .select("*, activity_tasks(*)")
    .single();

  if (error) {
    console.error("Error marking activity as swiped:", error);
    throw error;
  }

  return data;
}

// Add a new activity
export async function db_addActivity(
  activity: Omit<Activity, "id" | "status" | "selectedAt" | "tasks">
) {
  const { data, error } = await supabase
    .from("activities")
    .insert({
      title: activity.title,
      category: activity.category,
      description: activity.description,
      image: activity.image,
      location: activity.location,
      address: activity.address,
      coordinates: activity.coordinates,
      distance: activity.distance,
      duration: activity.duration,
      why: activity.why,
      is_generated: false,
      selected_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error("Error adding activity:", error);
    throw error;
  }

  return data;
}

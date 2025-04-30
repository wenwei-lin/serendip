"use server";
import { Activity, ActivityStatus } from "@/types";
import { createOpenAI } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";
import {
  db_addActivity,
  db_getLikedActivities,
  db_getActivityById,
  db_markActivityAsSwiped,
  db_updateActivityStatus,
  db_getUnswipedActivities,
} from "./db";

export async function getActivities(status?: ActivityStatus) {
  return await db_getLikedActivities(status);
}

export async function getActivityById(id: number) {
  return await db_getActivityById(id);
}

export async function updateActivityStatus(id: number, status: ActivityStatus) {
  return await db_updateActivityStatus(id, status);
}

export async function swipeActivity(id: number, isLiked: boolean) {
  return await db_markActivityAsSwiped(id, isLiked);
}

const openai = createOpenAI({
  baseURL: "https://models.github.ai/inference",
  apiKey: process.env.NEXT_PUBLIC_GITHUB_API!,
});

const model = openai("openai/gpt-4.1");

export async function generateActivity(energyLevel: number, location?: string) {
  try {
    const prompt = `Generate 5 fun and engaging activity recommendations based on the following criteria:
    - Energy Level: ${energyLevel}/100
    - Location: ${location || "anywhere"}
    `;

    const { object } = await generateObject({
      model,
      schema: z.object({
        activities: z.array(
          z.object({
            title: z.string(),
            category: z.string(),
            description: z.string(),
            location: z.string(),
            address: z.string(),
            coordinates: z.object({
              lat: z.number(),
              lng: z.number(),
            }),
            distance: z.number(),
            duration: z.string(),
            why: z.string(),
            tasks: z.array(z.string()),
          })
        ),
      }),
      prompt,
    });

    console.log(JSON.stringify(object, null, 2));

    const activities = object?.activities ?? [];

    // TODO: 生成图片

    // add to db
    const activityPromises = activities.map((activity) => {
      return db_addActivity(activity);
    });

    const createdActivities = await Promise.all(activityPromises);

    return createdActivities;
  } catch (error) {
    console.error("Error generating activity:", error);
    throw error;
  }
}

export async function getUnswipedActivities(
  energyLevel: number,
  location?: string
) {
  let activities = await db_getUnswipedActivities();
  if (activities.length === 0) {
    activities = await generateActivity(energyLevel, location);
  }
  return activities;
}

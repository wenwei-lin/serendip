# Serendip 下班后干什么

Turning Post-Work Fatigue into Micro-Adventures

2025 Microsoft AI Agent Hackathon Project

[![Watch the demo](https://img.youtube.com/vi/Ft420phljrI/hqdefault.jpg)](https://youtu.be/Ft420phljrI)

### Description

## 1. Problem & Scenario

After a long workday many people fall into a “doom-scroll → Netflix → sleep” loop. They want to re-energise, explore their city, or learn something new, but the cognitive load of deciding what to do is too high—so they default to inertia.

## 2. What **Serendip** Does _Today_

| Flow               | Experience                                                                                                                                                                    |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Generate ideas** | One tap calls **GPT-4-o** (via Vercel AI + a Next.js **Server Action**) to create 3–5 evening activities (e.g. _“Casual Painting Session”_, _“City-Lens Architecture Walk”_). |
| **Swipe / Click**  | Users **like** or **skip** each suggestion with Tinder-style swipes or buttons.                                                                                               |
| **Tonight list**   | Accepted cards move to the **Tonight** tab where a simple _Planned ↔ Done_ toggle tracks completion.                                                                          |

> **Scope note**
>
> - No sign-in, no image generation, no geolocation (kept lean for the hack).
> - Focus is the core agent loop: **prompt → ideas → lightweight in-memory feedback**.

---

## 3. Tech Stack (MVP)

| Layer           | Implementation                                 |
| --------------- | ---------------------------------------------- |
| **UI**          | Next.js 14 (App Router) + Tailwind + shadcn/ui |
| **Agent logic** | Next.js Server Actions (no separate API layer) |
| **LLM**         | GPT-4.1(from GitHub Models) via Vercel AI SDK  |
| **State**       | Supabase Databse                               |
| **Hosting**     | Vercel free tier                               |

## 4. Why It’s an AI Agent

- Autonomous planning → With minimal context (current time + past likes), the LLM crafts a nightly micro-plan.
- Iterative memory → User feedback loops back into subsequent prompts, reducing repeats and increasing novelty.

## 5. Hackathon Outcomes

- ⏱ ≈ 3 s to generate fresh ideas
- 📲 Mobile-first swipe interaction (works on desktop too)
- 📋 “Tonight” list updates live as tasks move from Planned to Done

6. Road-Map (post-hack, budget permitting)
   1. Dynamic cover art using Stable Difussion or DALL·E
   2. Auth & long-term memory via Vercel Auth + Edge KV
   3. Location filter with browser geolocation → AMap API
   4. Morning reflection agent to reinforce habits
   5. Group mode merging friends’ preference vectors

### Language & Framework

- [ ] Python
- [ ] C#
- [ ] Java
- [x] JavaScript/TypeScript
- [ ] Microsoft Copilot Studio
- [ ] Microsoft 365 Agents SDK
- [ ] Azure AI Agent Service

### Project Video

https://youtube.com/shorts/Ft420phljrI

### Team Members

Wenwei Lin (@wenwei-lin)

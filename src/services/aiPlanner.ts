// aiPlanner.ts
// This is a stubbed AI planner. Replace with real AI call (OpenAI, Azure, etc.).

import type { Itinerary, DayPlan, TravelPreferences, TravelMode } from "../types/itinerary";
import { generateGeminiItinerary } from "./gemini";

/**
 * FINAL CORRECT FUNCTION SIGNATURE
 */
export async function generateItinerary(
  from: string,
  to: string,
  mode: TravelMode,
  days: number,
  preferences: {
    budget: string;
    foodPreferences: string;
    mustVisit: string[];
    comfort: "high" | "low" | "medium";
  },
  interests: string[],
  apiKey?: string
): Promise<Itinerary> {
  
  // If API Key exists → use Gemini AI
  if (apiKey) {
    try {
      const interestTags = [
        ...(preferences.foodPreferences ? [`Food: ${preferences.foodPreferences}`] : []),
        ...(preferences.mustVisit || []),
        ...(preferences.comfort ? [`Comfort Level: ${preferences.comfort}`] : []),
        ...interests,
      ];

      const itinerary = await generateGeminiItinerary(
        apiKey,
        from,
        to,
        mode,
        days,
        preferences.budget,
        interestTags
      );

      return {
        ...itinerary,
        from,
        to,
        travelMode: mode,
        days,
        preferences
      };
    } catch (err) {
      console.error("❌ AI GENERATION FAILED:", err);
      console.log("⚠️ Falling back to mock itinerary...");
    }
  }

  // --- FALLBACK MOCK ITINERARY ---
  await new Promise((r) => setTimeout(r, 600));

  const dayPlans: DayPlan[] = [];
  const hotel = (d: number) => `${to} Comfort Stay (Night ${d})`;

  for (let i = 1; i <= days; i++) {
    dayPlans.push({
      day: i,
      stay: hotel(i),
      travels: i === 1 ? [`Travel from ${from} → ${to} by ${mode}`] : [`Explore ${to}`],
      activities: [
        `Explore main attraction ${i}`,
        `Hidden gem discovery`,
        ...(preferences.mustVisit?.length
          ? [preferences.mustVisit[(i - 1) % preferences.mustVisit.length]]
          : []),
      ],
      food: [
        `Breakfast at Café ${i}`,
        `Local cuisine dinner`
      ],
      approximateCost: 100 + i * 40,
      biome: "city"
    });
  }

  return {
    from,
    to,
    travelMode: mode,
    days,
    preferences,
    dayPlans,
    totalEstimatedCost: dayPlans.reduce(
      (sum, d) => sum + (d.approximateCost ?? 0), // ✅ FIX HERE
      0
    )
  };
}

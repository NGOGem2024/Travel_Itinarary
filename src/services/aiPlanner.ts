// This is a stubbed AI planner. Replace with real AI call (OpenAI, Azure, etc.).
// This is a stubbed AI planner. Replace with real AI call (OpenAI, Azure, etc.).
import type { Itinerary, DayPlan, TravelPreferences, TravelMode } from '../types/itinerary'

import { generateGeminiItinerary } from './gemini';

export async function generateItinerary(
  from: string,
  to: string,
  mode: TravelMode,
  days: number,
  preferences?: TravelPreferences,
  apiKey?: string
): Promise<Itinerary> {
  // If API Key is provided, use Real AI
  if (apiKey) {
    try {
      const interests = [
        ...(preferences?.foodPreferences ? [`Food: ${preferences.foodPreferences}`] : []),
        ...(preferences?.mustVisit || []),
        ...(preferences?.comfort ? [`Comfort Level: ${preferences.comfort}`] : [])
      ];

      const itinerary = await generateGeminiItinerary(
        apiKey,
        from,
        to,
        mode,
        days,
        preferences?.budget || 'Moderate',
        interests
      );

      // Merge with local data if needed (e.g. ensure travelMode is set)
      return {
        ...itinerary,
        from,
        to,
        travelMode: mode,
        days,
        preferences
      };
    } catch (error) {
      console.error("❌ AI GENERATION FAILED:", error);
      console.error("Falling back to mock data...");
      // Fallback to mock generation below
    }
  }

  // Simulate latency
  await new Promise((r) => setTimeout(r, 800))

  // Sample algorithmic generation — use real AI in production
  const dayPlans: DayPlan[] = []
  const baseHotel = (d: number) => `${to} Cozy Stay (night ${d})`

  for (let i = 1; i <= days; i++) {
    // Simple deterministic biome based on day index
    const biomes: ('city' | 'countryside' | 'beach' | 'mountain' | 'forest')[] = ['city', 'forest', 'mountain', 'beach', 'countryside'];
    const biome = biomes[(i - 1) % biomes.length];

    dayPlans.push({
      day: i,
      stay: baseHotel(i),
      travels: i === 1 ? [`Depart ${from} -> ${to} by ${mode}`] : [`Local travel in ${to}`],
      activities: [
        `Visit main attraction ${i}`,
        `Short hidden-gem walk ${i}`,
        ...(preferences?.mustVisit?.slice((i - 1) % preferences.mustVisit.length, (i - 1) % preferences.mustVisit.length + 1) || [])
      ],
      food: [
        `Breakfast at popular café ${i}`,
        `Dinner with local flavour ${i}`
      ],
      approximateCost: 50 + i * 20,
      biome,
    })
  }

  const totalEstimatedCost = dayPlans.reduce((s, d) => s + (d.approximateCost || 0), 0)

  return {
    from,
    to,
    travelMode: mode,
    days,
    preferences,
    dayPlans,
    totalEstimatedCost
  }
}

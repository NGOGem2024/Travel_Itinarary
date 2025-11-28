// This is a stubbed AI planner. Replace with real AI call (OpenAI, Azure, etc.).
// This is a stubbed AI planner. Replace with real AI call (OpenAI, Azure, etc.).
import type { Itinerary, DayPlan, TravelPreferences, TravelMode } from '../types/itinerary'

export async function generateItinerary(
  from: string,
  to: string,
  mode: TravelMode,
  days: number,
  preferences?: TravelPreferences
): Promise<Itinerary> {
  // Simulate latency
  await new Promise((r) => setTimeout(r, 800))

  // Sample algorithmic generation — use real AI in production
  const dayPlans: DayPlan[] = []
  const baseHotel = (d: number) => `${to} Cozy Stay (night ${d})`

  for (let i = 1; i <= days; i++) {
    dayPlans.push({
      day: i,
      stay: baseHotel(i),
      travels: i === 1 ? [`Depart ${from} -> ${to} by ${mode}`] : [`Local travel in ${to}`],
      activities: [
        `Visit main attraction ${i}`,
        `Short hidden-gem walk ${i}`,
        ...(preferences?.mustVisit?.slice((i-1)%preferences.mustVisit.length, (i-1)%preferences.mustVisit.length + 1) || [])
      ],
      food: [
        `Breakfast at popular café ${i}`,
        `Dinner with local flavour ${i}`
      ],
      approximateCost: 50 + i * 20,
    })
  }

  const totalEstimatedCost = dayPlans.reduce((s,d) => s + (d.approximateCost||0), 0)

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

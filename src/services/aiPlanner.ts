import type { ItineraryInput, Itinerary, DayPlan } from '../types/itinerary.d'

// Dummy AI planner that returns a sample itinerary based on input
export async function generateItinerary(input: ItineraryInput): Promise<Itinerary> {
  // Simulate async latency
  await new Promise((r) => setTimeout(r, 600))

  const days: DayPlan[] = []
  for (let i = 1; i <= input.days; i++) {
    const day: DayPlan = {
      day: i,
      date: undefined,
      stay: {
        name: `${input.to} Comfort Hotel - Day ${i}`,
        address: `${i} Traveler St, ${input.to}`,
        cost: 60 + (i % 3) * 20,
      },
      travel:
        i === 1
          ? {
              from: input.from,
              to: input.to,
              mode: input.mode,
              duration: input.mode === 'flight' ? '2h' : input.mode === 'train' ? '6h' : '8h',
              cost: input.mode === 'flight' ? 120 : input.mode === 'train' ? 45 : 30,
            }
          : undefined,
      sightseeing: [
        `Top museum of ${input.to}`,
        `City park and scenic lookout - ${input.to}`,
        `Famous market in ${input.to}`,
      ],
      food: [`Local breakfast spot`, `Popular lunch street`, `Comfort dinner place`],
      dailyBudget: 100 + (i % 2) * 30,
      notes: `Suggested pace: moderate. Preferences: ${JSON.stringify(input.preferences || {})}`,
    }
    days.push(day)
  }

  const totalBudget = days.reduce((s, d) => s + (d.stay.cost || 0) + d.dailyBudget + (d.travel?.cost || 0), 0)

  return {
    input,
    days,
    totalBudget,
  }
}

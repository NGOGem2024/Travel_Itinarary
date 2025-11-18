export type TravelMode = 'bus' | 'train' | 'flight' | 'car'

export interface ItineraryInput {
  from: string
  to: string
  mode: TravelMode
  days: number
  preferences?: Record<string, string>
}

export interface StayInfo {
  name: string
  address?: string
  cost?: number
}

export interface TravelSegment {
  from: string
  to: string
  mode: TravelMode
  duration?: string
  cost?: number
}

export interface DayPlan {
  day: number
  date?: string
  stay: StayInfo
  travel?: TravelSegment
  sightseeing: string[]
  food: string[]
  dailyBudget: number
  notes?: string
}

export interface Itinerary {
  input: ItineraryInput
  days: DayPlan[]
  totalBudget: number
}

export type TravelMode = 'bus' | 'train' | 'flight' | 'car' | 'other'

export interface TravelPreferences {
  budget?: string
  foodPreferences?: string
  mustVisit?: string[]
  comfort?: 'low' | 'medium' | 'high'
}

export interface DayPlan {
  day: number
  date?: string
  stay: string
  travels: string[]
  activities: string[]
  food: string[]
  approximateCost?: number
}

export interface Itinerary {
  from: string
  to: string
  travelMode: TravelMode
  days: number
  preferences?: TravelPreferences
  dayPlans: DayPlan[]
  totalEstimatedCost?: number
}
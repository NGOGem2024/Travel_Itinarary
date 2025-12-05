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
  location?: string
  stay: string
  travels: string[]
  activities: string[]
  food?: string[]
  approximateCost?: number
  biome?: 'city' | 'countryside' | 'beach' | 'mountain' | 'forest'
  coordinates?: { lat: number; lng: number }
  weather?: string
  pois?: {
    tourism?: string[];
    history?: string[];
    food?: string[];
    cafes?: string[];
    nature?: string[];
  };
}

export interface Itinerary {
  id?: string
  title?: string
  from: string
  to: string
  destination?: string
  coordinates?: {
    start: { lat: number; lng: number }
    end: { lat: number; lng: number }
  }
  travelMode: TravelMode
  days: number
  startDate?: string
  endDate?: string
  preferences?: TravelPreferences
  dayPlans: DayPlan[]
  totalEstimatedCost?: number
}
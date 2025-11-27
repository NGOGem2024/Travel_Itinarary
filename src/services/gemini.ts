import type { Itinerary } from "../types/itinerary";

const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export const generateGeminiItinerary = async (
  apiKey: string,
  origin: string,
  destination: string,
  travelMode: string,
  days: number,
  budget: string,
  interests: string[]
): Promise<Itinerary> => {
  const prompt = `
You are an expert travel planner. Generate a REALISTIC and VARIED ${days}-day travel itinerary from ${origin} to ${destination} via ${travelMode}.

CRITICAL REQUIREMENTS:
1. **Day 1 - Travel Day**: 
   - If ${travelMode} is "flight": Day 1 should be "Depart ${origin}, arrive at airport near ${destination}, transfer to hotel"
   - If ${travelMode} is "bus/train/car": Day 1 should show the journey or a stopover city en route
   - NEVER show immediate activities at ${destination} on Day 1 for long-distance travel

2. **Varied Locations**: 
   - For trips over 5 days, include AT LEAST 2-3 different cities/towns
   - Each location should have DIFFERENT hotels/stays
   - NEVER repeat the same hotel name for multiple days unless it's a deliberate multi-day stay

3. **Realistic Progression**:
   - Days should show logical movement (e.g., Mumbai → NYC → Boston → Washington DC)
   - Include travel between cities in the "travels" array
   - Each day should have 3-5 unique activities

4. **Rich Data**:
   - "activities": Array of 3-5 specific activities (e.g., "Visit Statue of Liberty", "Walk through Central Park")
   - "travels": Specific transport (e.g., "Flight AI-191 Mumbai to JFK", "Taxi to hotel", "Subway to Manhattan")
   - "pois": Include specific names:
     * "tourism": Famous landmarks, museums, monuments
     * "food": Specific restaurants or local dishes
     * "cafes": Named cafes or coffee shops
     * "nature": Parks, beaches, hiking trails
   - "weather": Realistic for location and season (sunny, cloudy, rainy, partly cloudy)
   - "biome": Accurate (city, beach, mountain, forest, countryside)

Budget: ${budget}
Interests: ${interests.join(", ")}

Return ONLY valid JSON (no markdown):
{
  "id": "trip-${Date.now()}",
  "title": "${days}-Day ${origin} to ${destination} Adventure",
  "destination": "${destination}",
  "startDate": "2024-06-01",
  "endDate": "2024-06-${String(days).padStart(2, '0')}",
  "dayPlans": [
    {
      "day": 1,
      "date": "2024-06-01",
      "location": "Mumbai Airport / In Transit",
      "stay": "Flight to New York",
      "activities": ["Check-in at Mumbai Airport", "Board flight to JFK", "In-flight entertainment"],
      "travels": ["Taxi to Mumbai Airport", "Flight AI-191 to JFK New York"],
      "approximateCost": 50000,
      "biome": "city",
      "weather": "sunny",
      "pois": {
        "tourism": [],
        "food": ["In-flight meal"],
        "cafes": [],
        "nature": []
      }
    },
    {
      "day": 2,
      "date": "2024-06-02",
      "location": "New York City, USA",
      "stay": "The Jane Hotel, Manhattan",
      "activities": ["Arrive at JFK", "Check-in to hotel", "Evening walk in Times Square", "Dinner at local diner"],
      "travels": ["Land at JFK Airport", "Taxi to Manhattan hotel"],
      "approximateCost": 15000,
      "biome": "city",
      "weather": "partly cloudy",
      "pois": {
        "tourism": ["Times Square", "Empire State Building"],
        "food": ["Ellen's Stardust Diner", "Joe's Pizza"],
        "cafes": ["Starbucks Reserve", "Blue Bottle Coffee"],
        "nature": ["Central Park"]
      }
    }
  ]
}

IMPORTANT: 
- Generate ${days} UNIQUE days with DIFFERENT locations and hotels
- Make it feel like a real journey, not a template
- Use actual place names and realistic costs in INR
  `;

  try {
    const response = await fetch(`${API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Gemini API Error Body:", errorBody);
      throw new Error(`Gemini API Error: ${response.status} ${response.statusText} - ${errorBody}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) throw new Error("No content generated");

    // Clean markdown code blocks if present
    const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(jsonStr);

  } catch (error) {
    console.error("Gemini Generation Failed:", error);
    throw error;
  }
};

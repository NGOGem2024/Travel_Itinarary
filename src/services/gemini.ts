import type { Itinerary } from "../types/itinerary";

const API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent";


const fetchWithRetry = async (url: string, options: RequestInit, retries = 3, backoff = 2000): Promise<Response> => {
  // console.log(import.meta.env.VITE_GEMINI_API_KEY), "...this is your key";

  try {
    const response = await fetch(url, options);

    if (response.ok) return response;

    // Retry on 429 (Too Many Requests) or 503 (Service Unavailable)
    if (retries > 0 && (response.status === 429 || response.status === 503)) {
      console.warn(`Gemini API rate limit hit (${response.status}). Retrying in ${backoff}ms...`);
      await new Promise(resolve => setTimeout(resolve, backoff));
      return fetchWithRetry(url, options, retries - 1, backoff * 2);
    }

    return response;
  } catch (error) {
    if (retries > 0) {
      console.warn(`Gemini API network error. Retrying in ${backoff}ms...`, error);
      await new Promise(resolve => setTimeout(resolve, backoff));
      return fetchWithRetry(url, options, retries - 1, backoff * 2);
    }
    throw error;
  }
};

export const generateGeminiItinerary = async (
  apiKey: string,
  origin: string,
  destination: string,
  travelMode: string,
  days: number,
  budget: string,
  interests: string[],
  stops: string[]
): Promise<Itinerary> => {
  const stopsText = stops && stops.length > 0 ? ` with stopovers at: ${stops.join(", ")}` : "";
  const prompt = `
You are an expert travel planner. Generate a REALISTIC and VARIED ${days}-day travel itinerary from ${origin} to ${destination} via ${travelMode}${stopsText}.

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
   - **IMPORTANT**: The itinerary MUST follow the order: ${origin} -> ${stops.length > 0 ? stops.join(" -> ") + " -> " : ""}${destination}.
   - You MUST create a distinct, sequential \`dayPlan\` entry for **each** Stop listed in (${stops.join(', ')}).
   - Even if multiple locations are visited on the same day, break them into separate \`dayPlan\` nodes to show the full path.
   - For example: Day 1 (Part 1): ${origin} -> Stop 1. Day 1 (Part 2): Stop 1 -> Stop 2. Day 1 (Part 3): Stop 2 -> ${destination}.

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
   - "coordinates": { "lat": number, "lng": number } (Approximate coordinates for the location)
   - "hotelOptions": Array of 3 hotel options for that day's location. Each option MUST include:
     * "name": Real hotel name
     * "address": Real address
     * "rating": Number (out of 5)
     * "price": Approximate cost per night (e.g., "₹15,000")
     * "description": Brief 1-sentence description
     * "coordinates": { "lat": number, "lng": number }
     * "imageUrl": "URL to a high-quality publicly available image of the hotel or a similar luxury hotel (e.g. from Unsplash/Wikimedia)"

5. **Budget**: ${budget}
6. **Interests**: ${interests.join(", ")}

Return ONLY valid JSON (no markdown):
{
  "id": "trip-${Date.now()}",
  "title": "${days}-Day ${origin} to ${destination} Adventure",
  "destination": "${destination}",
  "coordinates": {
    "start": { "lat": 19.0760, "lng": 72.8777 },
    "end": { "lat": 40.7128, "lng": -74.0060 }
  },
  "startDate": "2024-06-01",
  "endDate": "2024-06-${String(days).padStart(2, '0')}",
  "dayPlans": [
    {
      "day": 1,
      "date": "2024-06-01",
      "location": "Mumbai Airport / In Transit",
      "coordinates": { "lat": 19.099, "lng": 72.875 },
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
      "coordinates": { "lat": 40.7128, "lng": -74.0060 },
      "stay": "The Jane Hotel, Manhattan",
      "hotelOptions": [
        {
          "name": "The Jane Hotel",
          "address": "113 Jane St, New York, NY 10014",
          "rating": 4.2,
          "price": "₹15,000/night",
          "description": "Historic, riverside hotel with quirky, ship-cabin-style rooms.",
          "coordinates": { "lat": 40.7383, "lng": -74.0094 },
          "imageUrl": "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000&auto=format&fit=crop"
        },
        {
          "name": "The Standard, High Line",
          "address": "848 Washington St, New York, NY 10014",
          "rating": 4.4,
          "price": "₹25,000/night",
          "description": "Hip, high-rise hotel offering sleek rooms with city/river views.",
          "coordinates": { "lat": 40.7408, "lng": -74.0076 },
          "imageUrl": "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1000&auto=format&fit=crop"
        },
        {
          "name": "Chelsea International Hostel",
          "address": "251 W 20th St, New York, NY 10011",
          "rating": 3.8,
          "price": "₹5,000/night",
          "description": "Simple dorms & private rooms in basic hostel with free WiFi.",
          "coordinates": { "lat": 40.7433, "lng": -74.0024 },
          "imageUrl": "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=1000&auto=format&fit=crop"
        }
      ],
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
    const response = await fetchWithRetry(`${API_URL}?key=${apiKey}`, {
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

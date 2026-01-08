
import { GoogleGenerativeAI } from "@google/generative-ai";

export interface ExtractedTravelDetails {
    from?: string;
    to?: string;
    days?: number;
    travelMode?: "flight" | "train" | "bus" | "car";
    budget?: "Budget" | "Moderate" | "Luxury";
    interests?: string[];
    mustVisit?: string;
    stops?: string[];

}

export const extractTravelDetails = async (
    text: string,
    apiKey: string
): Promise<ExtractedTravelDetails> => {
    if (!apiKey) {
        throw new Error("API Key is required");
    }
    console.log("🤖 Debug: extractTravelDetails() called");
    console.log("📝 Debug: Transcript Received =", text);
    console.log("🔑 Debug: API Key Provided?", !!apiKey);
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
    Extract travel details from the following text: "${text}"
    
    Return a JSON object with these keys (only if present):
    - from: Origin city
    - to: Destination city
    - days: Number of days (integer)
    - travelMode: One of "flight", "train", "bus", "car"
    - budget: One of "Budget", "Moderate", "Luxury" (infer from context like "cheap", "expensive", "lavish")
    - interests: Array of strings (e.g., ["History", "Food"])
    - mustVisit: Specific landmarks mentioned
    - stops: Array of cities/places to stop at en route

    Example JSON:
    {
      "from": "London",
      "to": "Paris",
      "days": 5,
      "travelMode": "train",
      "budget": "Luxury"
    }
    
    Return ONLY raw JSON, no markdown formatting.
  `;
    // console.log("📤 Debug: Prompt Sent To Gemini:", prompt);
    try {

        const result = await model.generateContent(prompt);
        console.log("📥 Debug: Raw Gemini Response Object:", result);
        const response = await result.response;
        const text = response.text();
        console.log("📥 Debug: Gemini Raw Text Output:", text);
        // Clean potential markdown code blocks
        const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();
        console.log("🧽 Debug: Cleaned JSON String =", jsonStr);

        try {
            const json = JSON.parse(jsonStr);
            console.log("✅ Debug: Final Parsed JSON =", json);
            return json;
        } catch (parseError) {
            console.error("❌ Debug: JSON Parse Failure. Raw text was:", text);
            throw new Error("Failed to parse travel details from AI response.");
        }
    } catch (error) {
        console.error("Failed to extract travel details:", error);
        throw error;
    }
};
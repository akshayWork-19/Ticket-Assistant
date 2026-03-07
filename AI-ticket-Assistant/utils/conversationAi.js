import { GoogleGenerativeAI } from "@google/generative-ai";

const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const analyzeTicket = async (ticket) => {
    try {
        const model = genAi.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `You are an expert AI assistant that processes technical support tickets. 
      Analyze the following ticket:
      Title: ${ticket.title}
      Description: ${ticket.description}
      Your job is to:
      1. Summarize the issue.
      2. Estimate its priority (low, medium, high).
      3. Provide helpful notes for human moderators.
      4. List relevant technical skills required for this ticket as an array of strings.
      IMPORTANT: Respond with ONLY a valid JSON object in this format:
      {
        "priority": "string",
        "helpfulNotes": "string",
        "relatedSkills": ["skill1", "skill2"]
      }`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        const jsonString = text.replace(/```json|```/g, "").trim();

        return JSON.parse(jsonString);


    } catch (error) {
        console.error("AI Analysis Error:", error.message);
        return null;
    }
}


export default analyzeTicket;
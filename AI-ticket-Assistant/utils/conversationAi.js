import Groq from "groq-sdk";

// console.log(process.env.GROQ_API_KEY);
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const analyzeTicket = async (ticket) => {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an expert AI assistant that processes technical support tickets. 
          Analyze the ticket and provide a summary, priority (low, medium, high), helpful notes for moderators, and relevant technical skills.
          IMPORTANT: You MUST respond with ONLY a valid JSON object.`
        },
        {
          role: "user",
          content: `Title: ${ticket.title}\nDescription: ${ticket.description}`
        }
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
    });

    const text = completion.choices[0].message.content;

    // Robust JSON extraction
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in AI response");
    }

    return JSON.parse(jsonMatch[0]);

  } catch (error) {
    console.error("Groq Analysis Error:", error.message);
    throw error;
  }
}

export const generateDraftReply = async (ticketDescription, aiNotes) => {

  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: "You are an expert customer support engineer. Write a professional, empathetic, and concise reply to the user ticket using the provided AI notes. DO NOT write subject lines."
      },
      {
        role: "user",
        content: `User Issue: ${ticketDescription}\nTriage Context: ${aiNotes}`
      }
    ],
    model: "mixtral-8x7b-32768",
  });

  return completion.choices[0].message.content;
}

export default analyzeTicket;

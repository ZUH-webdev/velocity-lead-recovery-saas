const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generates a response based on the lead's message and the conversation history.
 */
exports.generateAIResponse = async (chatHistory, businessContext) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // Or gpt-4
      messages: [
        { 
          role: "system", 
          content: getSystemPrompt(businessContext) 
        },
        ...chatHistory // Array of previous messages for context
      ],
      temperature: 0.7,
      max_tokens: 150,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI Service Error:", error);
    throw new Error("Failed to generate AI response");
  }
};

// This pulls in the prompt engineering logic below
const getSystemPrompt = (business) => {
  return `You are a professional, friendly assistant for ${business.name}. 
  Your primary goal is to book an appointment for ${business.service}.
  Tone: Helpful, concise, and empathetic. 
  Rules: 
  1. Don't give medical advice. 
  2. If they ask for pricing, tell them a specialist will provide a custom quote during the visit.
  3. Keep responses under 2 sentences.
  4. Always end with a question to keep the lead engaged.`;
};
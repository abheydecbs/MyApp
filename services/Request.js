// Her bliver der kontaktet OpenAI's API.
import OpenAI from "openai/index.mjs";

// Create a new instance of the OpenAI class
const openai = new OpenAI({apiKey: "YOUR-API-KEY"});

// Create a function that sends a message to the OpenAI API
export default async function SendMessage(messageArray) {
    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: messageArray,
    });

    // Extract the AI's reply from the response
    const result = response.choices[0]?.message?.content || "";
    // Return the AI's reply
    return { role: "assistant", content: result };
}

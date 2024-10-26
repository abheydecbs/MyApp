import OpenAI from "openai/index.mjs";

// Create a new instance of the OpenAI class
const openai = new OpenAI({apiKey: "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"});

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

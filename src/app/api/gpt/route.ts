import { NextResponse } from "next/server";
import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function fetchAI(
  messages: ChatCompletionMessageParam[],
  maxTokens: number
) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
      max_tokens: maxTokens,
      temperature: 0.7,
    });

    return response;
  } catch (error) {
    console.error("Error in fetchAI:", error);
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API key is not configured");
    }

    const { prompt, type } = await request.json();

    if (!prompt || !type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (type === "analyze") {
      const response = await fetchAI(
        [
          {
            role: "system",
            content:
              "You are a legal document specialist. Return only valid JSON arrays containing waiver section templates.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        1000
      );

      return NextResponse.json({
        content: [{ text: response.choices[0].message.content }],
      });
    } else if (type === "generate") {
      const response = await fetchAI(
        [
          {
            role: "system",
            content: `You are a legal document specialist. Generate formal, legally-sound waiver content.
                   Return content in HTML format with appropriate semantic tags.`,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        2000
      );

      return NextResponse.json({
        content: [{ text: response.choices[0].message.content }],
      });
    }

    throw new Error("Invalid request type");
  } catch (error) {
    console.error("OpenAI API error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to process request", details: errorMessage },
      { status: 500 }
    );
  }
}

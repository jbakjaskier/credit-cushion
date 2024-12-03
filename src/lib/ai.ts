import { WaiverSectionTemplate } from "./types/waiver";

export async function analyzePDF(
  prompt: string
): Promise<WaiverSectionTemplate[]> {
  try {
    const response = await fetch("/api/gpt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        type: "analyze",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to analyze PDF (${response.status}): ${errorText}`
      );
    }

    const data = await response.json();

    if (!data?.content?.[0]?.text) {
      throw new Error("Invalid response format from Claude API");
    }

    try {
      const content = data.content[0].text;
      const parsedContent = JSON.parse(content);
      return Array.isArray(parsedContent) ? parsedContent : [];
    } catch (parseError) {
      console.error("Error parsing Claude response:", parseError);
      throw new Error("Failed to parse waiver sections: Invalid JSON format");
    }
  } catch (error) {
    console.error("Error analyzing PDF:", error);
    throw error instanceof Error
      ? error
      : new Error("Failed to analyze experience details");
  }
}

export async function generateWaiver(prompt: string): Promise<string> {
  try {
    const response = await fetch("/api/gpt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        type: "generate",
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate waiver");
    }

    const data = await response.json();
    return data.content[0].text;
  } catch (error) {
    console.error("Error generating waiver:", error);
    throw new Error("Failed to generate waiver content");
  }
}

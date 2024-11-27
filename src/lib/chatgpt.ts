import { OpenAIStream, StreamingTextResponse } from "ai";
import { Configuration, OpenAIApi } from "openai-edge";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

export async function analyzePDF(pdfText: string) {
  const response = await openai.createChatCompletion({
    model: "gpt-4",
    stream: true,
    messages: [
      {
        role: "system",
        content: `You are an AI assistant specialized in analyzing legal documents, particularly waivers and contracts for adventure activities. Analyze the given text from a PDF and provide a detailed report covering:

        1. Activity-specific risks identified
        2. Legal compliance assessment
        3. Adherence to industry best practices
        4. Regional regulation compliance
        5. Areas of sufficient coverage
        6. Potential gaps in liability protection
        7. Suggested improvements
        8. Compliance recommendations

        Provide your analysis in a structured JSON format.`,
      },
      {
        role: "user",
        content: pdfText,
      },
    ],
  });

  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}

export async function generateWaiver(activityDetails: string) {
  const response = await openai.createChatCompletion({
    model: "gpt-4",
    stream: true,
    messages: [
      {
        role: "system",
        content: `You are an AI assistant specialized in creating legal documents, particularly waivers and contracts for adventure activities. Generate a comprehensive waiver based on the given activity details, ensuring it covers:

        1. Activity-specific risks
        2. Legal compliance requirements
        3. Industry best practices
        4. Regional regulations
        5. Sufficient liability protection

        Provide the waiver text in a structured format suitable for creating a PDF.`,
      },
      {
        role: "user",
        content: activityDetails,
      },
    ],
  });

  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}

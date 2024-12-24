import { NextRequest } from "next/server";
import { getLoanFromDbAsync } from "@/lib/db/dbFetcher";
import { ObjectId } from "mongodb";
import genAiInstance from "@/lib/ai/gemini";
import { Part } from "@google/generative-ai";
import {
  getEnvelopeFromDocuSign,
  getEnvelopeDocuments,
} from "@/lib/fetcher/envelope";

export async function POST(request: NextRequest) {
  try {
    const { message, loanId } = await request.json();

    if (!message || !loanId) {
      return Response.json(
        { error: "Message and loan ID are required" },
        { status: 400 }
      );
    }

    // Convert string ID to ObjectId
    if (!ObjectId.isValid(loanId)) {
      return Response.json(
        { error: "Invalid loan ID format" },
        { status: 400 }
      );
    }

    // Get loan details from DB
    const loan = await getLoanFromDbAsync(new ObjectId(loanId));
    if ("errorMessage" in loan) {
      return Response.json({ error: loan.errorMessage }, { status: 400 });
    }

    // Get main loan envelope details and documents
    const envelopeDetails = await getEnvelopeFromDocuSign(loan.envelopeId);
    if ("errorMessage" in envelopeDetails) {
      return Response.json(
        { error: envelopeDetails.errorMessage },
        { status: 400 }
      );
    }

    // Get the main loan documents
    const documents = await getEnvelopeDocuments(loan.envelopeId);
    if ("errorMessage" in documents) {
      return Response.json({ error: documents.errorMessage }, { status: 400 });
    }

    // Get hardship documents if they exist
    let hardshipDocuments = null;
    let hardshipEnvelopeDetails = null;
    if (loan.hardship?.envelopeDetails?.envelopeId) {
      hardshipEnvelopeDetails = await getEnvelopeFromDocuSign(
        loan.hardship.envelopeDetails.envelopeId
      );
      if (!("errorMessage" in hardshipEnvelopeDetails)) {
        hardshipDocuments = await getEnvelopeDocuments(
          loan.hardship.envelopeDetails.envelopeId
        );
      }
    }

    // Prepare context for AI
    const context = {
      loanDetails: loan.loanDetails,
      customer: loan.customer,
      envelopeDetails: envelopeDetails,
      status: loan.status,
      hardship: loan.hardship
        ? {
            circumstanceReason: loan.hardship.circumstanceReason,
            circumstanceExplanation: loan.hardship.circumstanceExplanation,
            idealArrangement: loan.hardship.idealArrangement,
            loanVariationStatus: loan.hardship.loanVariationStatus,
            envelopeDetails: hardshipEnvelopeDetails,
          }
        : null,
    };

    // Prepare documents array for Gemini
    const documentInputs: Part[] = [
      {
        inlineData: {
          mimeType: "application/pdf",
          data: documents.toString("base64"),
        },
      },
    ];

    // Add hardship document if it exists
    if (hardshipDocuments && !("errorMessage" in hardshipDocuments)) {
      documentInputs.push({
        inlineData: {
          mimeType: "application/pdf",
          data: hardshipDocuments.toString("base64"),
        },
      });
    }

    // Add the text prompt
    documentInputs.push({
      text: `
        You are a helpful AI assistant for a loan provider. You have access to the following:
        
        1. The signed loan document (provided as PDF)
        ${
          hardshipDocuments && !("errorMessage" in hardshipDocuments)
            ? "2. The signed hardship variation document (provided as second PDF)"
            : ""
        }
        3. The loan information: ${JSON.stringify(context, null, 2)}

        Please answer the following question about this loan: "${message}"
        
        Use all available information to give the most accurate answer.
        If referencing the loan document or hardship document, please specify which document you're referring to.
        If you don't have enough information to answer the question, please say so.
        Keep your responses concise and professional.
        
        When discussing hardship details:
        - Mention if there's an active hardship application
        - Reference any approved variations
        - Include relevant dates and amounts from the variation document if available
      `,
    });

    // Use Gemini to process the query with all available documents and context
    const model = genAiInstance.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent(documentInputs);
    const response = result.response.text();

    return Response.json({ response });
  } catch (error: unknown) {
    console.error("Error processing chat request:", error);
    return Response.json(
      { error: "Failed to process chat request" },
      { status: 500 }
    );
  }
}

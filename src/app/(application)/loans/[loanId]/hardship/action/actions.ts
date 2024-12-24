"use server";

import { ObjectId } from "mongodb";
import { redirect } from "next/navigation";
import clientPromise, { dbName } from "@/lib/db/mongodb";
import { loanCollectionName } from "@/lib/db/models/loans";

export async function rejectHardship(formData: FormData) {
  const loanId = formData.get("loanId") as string;
  const rejectionNotes = formData.get("rejectionNotes") as string;

  if (!ObjectId.isValid(loanId)) {
    throw new Error("Invalid loan ID");
  }

  const mongoClient = await clientPromise;
  const loanCollection = mongoClient.db(dbName).collection(loanCollectionName);

  await loanCollection.updateOne(
    {
      _id: new ObjectId(loanId),
    },
    {
      $set: {
        "hardship.loanVariationStatus": "hardshipResolved",
        "hardship.rejectionNotes": rejectionNotes,
        lastUpdated: new Date(),
      },
    }
  );

  redirect(`/loans/${loanId}`);
}

export async function approveHardship(formData: FormData) {
  const loanId = formData.get("loanId") as string;
  const contractContent = formData.get("contractContent") as string;

  if (!ObjectId.isValid(loanId)) {
    throw new Error("Invalid loan ID");
  }

  const mongoClient = await clientPromise;
  const loanCollection = mongoClient.db(dbName).collection(loanCollectionName);

  const variationContent = getHTMLForContractVariation(contractContent);

  await loanCollection.updateOne(
    {
      _id: new ObjectId(loanId),
    },
    {
      $set: {
        "hardship.loanVariationStatus": "variationGenerated",
        "hardship.variatedContractContent": variationContent,
        lastUpdated: new Date(),
      },
    }
  );

  redirect(`/loans/${loanId}/hardship`);
}

function getHTMLForContractVariation(content: string): string {
  return `
        <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Variation of Loan</title>
                <style>
                    @media print {
                        html, body {
                            width: 100%;
                            margin: 0;
                            box-sizing: border-box;
                        }
                    }

                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }

                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        width: 210mm; /* A4 width */
                        max-width: 794px; /* Pixel equivalent of A4 width */
                    }

                    header {
                        width: 100%;
                        background-color: #ffffff;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    }

                    .header-banner {
                        width: 210mm; /* A4 width */
                        max-width: 794px; /* Pixel equivalent of A4 width */
                        height: auto;
                        max-height: 300px;
                        object-fit: cover;
                        display: block;
                    }

                    main {
                        padding: 2rem;
                        max-width: 1200px;
                        margin: 0 auto;
                    }

                    h1 {
                        color: #333;
                        margin-bottom: 1.5rem;
                        text-align: center;
                    }

                    .content {
                        background-color: #f9f9f9;
                        padding: 2rem;
                        border-radius: 8px;
                        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                        margin-bottom: 2rem;
                    }

                    .signature-block {
                        margin-top: 3rem;
                    }

                    .signature-line {
                        border-bottom: 2px solid #000;
                        width: 100%;
                        height: 100px;
                        margin-bottom: 0.5rem;
                    }

                    .date-line {
                        border-bottom: 2px solid #000;
                        width: 50%;
                        height: 30px;
                        margin-top: 1rem;
                    }

                    .label {
                        font-size: 0.9rem;
                        color: #666;
                    }
                </style>
            </head>
            <body>
                <header>
                    alt="Moonriver Lake Bank - Finance made easy" class="header-banner">
                </header>
                <main>
                    <h1>Variation of Loan</h1>
                    <div class="content">
                        <p>${content}</p>
                    </div>
                    <div class="signature-block">
                        <div class="signature-line"></div>
                        <div class="label">Customer Signature</div>
                        <div class="date-line"></div>
                        <div class="label">Date Signed</div>
                    </div>
                </main>
            </body>
            </html>
    `;
}
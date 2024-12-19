"use server";
import { z } from "zod";
import {
  HardshipFormErrorDetail,
  HardshipFormState,
} from "@/components/hardship/HardshipForm";
import clientPromise, { dbName } from "@/lib/db/mongodb";
import { Loan, loanCollectionName } from "@/lib/db/models/loans";

import { put } from "@vercel/blob";
import genAiInstance from "@/lib/ai/gemini";
import { SchemaType } from "@google/generative-ai";

export async function createCustomerHardship(
  prevState: HardshipFormState,
  formData: FormData
): Promise<HardshipFormState> {
  console.info("supportingDocument", formData.get("supporting-documents"));
  const zodValidator = z.object({
    fullLegalName: z
      .string()
      .trim()
      .min(1, { message: "The Full Legal Name should be a valid value" }),
    emailAddress: z
      .string()
      .email({ message: `Please enter a valid email Address` }),
    phoneNumber: z
      .string()
      .trim()
      .min(6, { message: "Please enter a valid mobile phone number" })
      .startsWith("+", {
        message:
          "Please add an international code to your phone number. Example: +61",
      })
      .refine((val) => !/\s/.test(val), {
        message: `Please enter a valid phone number without any spaces and with the international code. Example: +61336597654`,
      }),
    circumstanceReason: z
      .string()
      .trim()
      .min(1, { message: "Please select how your circumstance has changed" }),
    circumstanceExplanation: z
      .string()
      .trim()
      .min(10, { message: "Please explain how your circumstance has changed" }),
    idealArrangement: z.string().trim().min(10, {
      message:
        "Explain in more detail what your ideal arrangement would look like",
    }),
    supportingDocument: z.custom<File>(
      (val) => {
        if (
          val instanceof File &&
          val.type === "application/pdf" &&
          val.size <= 4 * 1024 * 1024
        ) {
          return true;
        }
        return false;
      },
      {
        message: "Please attach supporting documents that support your case",
      }
    ),
  });

  const result = await zodValidator.safeParseAsync({
    fullLegalName: formData.get("fullLegalName"),
    emailAddress: formData.get("customerEmail"),
    phoneNumber: formData.get("phoneNumber"),
    circumstanceReason: formData.get("circumstanceReason"),
    circumstanceExplanation: formData.get("circumstanceExplanation"),
    idealArrangement: formData.get("idealArrangement"),
    supportingDocument: formData.get("supporting-documents"),
  });

  if (!result.success) {
    // eslint-disable-next-line prefer-const
    let errorObject: HardshipFormErrorDetail = {};

    result.error.errors.forEach((res) => {
      const propName = (res.path as string[])[0];
      switch (propName) {
        case "fullLegalName":
          errorObject.fullLegalName = res.message;
          break;
        case "emailAddress":
          errorObject.emailAddress = res.message;
          break;
        case "phoneNumber":
          errorObject.phoneNumber = res.message;
          break;
        case "circumstanceReason":
          errorObject.circumstanceReason = res.message;
          break;
        case "circumstanceExplanation":
          errorObject.circumstanceExplanation = res.message;
          break;
        case "idealArrangement":
          errorObject.idealArrangement = res.message;
          break;
        case "supportingDocument":
          errorObject.supportingDocument = res.message;
          break;
        default:
          console.info(`Skipping error message for ${res.path}`);
      }
    });

    return {
      mode: "error",
      errorDetails: errorObject!,
    };
  }

  try {
    //Validate if there are loans with email and phone number
    const mongoClient = await clientPromise;
    const loanCollection = mongoClient
      .db(dbName)
      .collection<Loan>(loanCollectionName);
    const loanInDb = await loanCollection.findOne({
      "customer.customerEmail": result.data.emailAddress,
      "customer.customerPhoneNumber": result.data.phoneNumber,
    });

    if (loanInDb === null) {
      return {
        mode: "error",
        errorDetails: {
          emailAddress: `There is no loan associated with this email adddress. Please enter the same email address and phone number you used with your loan application`,
          phoneNumber: `There is no loan associated with this phone number. Please enter the same email address and phone number you used with your loan application`,
        },
      };
    }

    if (
      loanInDb.customerDateSigned === undefined ||
      loanInDb.customerDateSigned === null
    ) {
      return {
        mode: "error",
        errorDetails: {
          circumstanceExplanation: `You have not yet signed you loan agreement yet. You can only apply for a hardship after you've signed the loan agreement`,
        },
      };
    }

    if (loanInDb.hardship !== undefined) {
      return {
        mode: "error",
        errorDetails: {
          circumstanceExplanation: `This hardship cannot be processed through this form. You already have lodged a hardship against your loan. In order to process the other one, you have to send a detailed email to one of the loan provider representatives`,
        },
      };
    }

    const responseSchema = {
      description: `Evaluation of hardship form from customer with regards to a loan application`,
      type: SchemaType.OBJECT,
      properties: {
        adequateHardshipInformation: {
          type: SchemaType.BOOLEAN,
          description: `This boolean indicates whether or not the hardship information given by the customer is adequate enough for the loan provider to make a decision on their hardship`,
          nullable: false,
        },
        furtherInformationRequired: {
          type: SchemaType.STRING,
          description: `This field contains any further information or clarification required from the customer, to make an decision on their hardship situation. If there is enough information to make a decision, this field is returned as null`,
          nullable: true,
        },
        canVariateAgreementAutomatically: {
          type: SchemaType.BOOLEAN,
          description: `This boolean indicates whether or not the loan agreement can be variated automatically.`,
          nullable: false,
        },
      },
      required: [
        "adequateHardshipInformation",
        "canVariateAgreementAutomatically",
      ],
    };

    const model = genAiInstance.getGenerativeModel({
      model: "gemini-1.5-pro",
      generationConfig: {
        responseMimeType: `application/json`,
        responseSchema: responseSchema,
      },
    });

    const fileBuffer = await result.data.supportingDocument.arrayBuffer();

    const genAiResult = await model.generateContent([
      {
        inlineData: {
          mimeType: "application/pdf",
          data: Buffer.from(fileBuffer).toString("base64"),
        },
      },
      {
        text: `
        You will be given a customer hardship information, along with the supporting document attached in this prompt. 
        
        Your job is to go through it and evaluate the given information with the following critierias

        
        1. Do you have enough information about their circumstance ? For example, if they have mentioned how they've lost their job, then you DO have enough information on their circumstance. If they are just saying times are tough, then you DON'T have enough information and would need more details about their circumstance to make a decision. You don't need every single detail of their situation, just an outline is adequate. 

        2. Do you have a start date and end date for their proposed variation ? And do you have the date in which they can recommence their regular repayments ?

        3. Do you have enough information on What would their ideal arrangement look like ? You need atleast on of these details  a) How long they would like to defer their next payment, b) How long they would like to pause all payments c) A change in loan repayment amount for a specified time. 

        If it fails any of the criterias above, please respond with what further information you would need from the customer before being able to make a decision on their hardship. Please make the request for further information as succinct and summarised as possible mentioning the key points required. 

        If all of the above critierias are fulfilled and the amount to variate is less than or equal to 10% of the total loan amount then you ARE able to variate the loan agreement automatically. Else, you are NOT able to variate the loan agreement automatically. 
         

        Now here is the customer hardship information along with the loan information, Please evaluate it with the criterias mentioned above and respond

        Total Loan Amount : $ ${
          loanInDb.loanDetails!.loanAmount.value! +
          loanInDb.loanDetails!.loanEstablishmentFees.value!
        }

        Customer Full Legal Name : ${result.data.fullLegalName}

        Customer Phone Number : ${result.data.phoneNumber}

        Customer Email Address : ${result.data.emailAddress}

        Customer Circumstance Change : ${
          result.data.circumstanceReason === "expenseRaised"
            ? "My Expenses Have Raised"
            : "My Income Has Reduced"
        }

        Customer Circumstance Change Reason : ${
          result.data.circumstanceExplanation
        }

        Customer Ideal Arrangement : ${result.data.idealArrangement}
      `,
      },
    ]);

    const genAiJsonResponse = genAiResult.response.text();

    console.info(`Response from Gen AI`, genAiJsonResponse);

    const parsedResponse = JSON.parse(genAiJsonResponse) as {
      adequateHardshipInformation: boolean;
      furtherInformationRequired?: string;
      canVariateAgreementAutomatically: boolean;
    };

    if (!parsedResponse.adequateHardshipInformation) {
      return {
        mode: "error",
        errorDetails: {
          circumstanceExplanation: parsedResponse.furtherInformationRequired,
        },
      };
    }

    //TODO: send an email to representative. cause a hardship already exists

    let variationGenerated: string | undefined = undefined;
    if (parsedResponse.canVariateAgreementAutomatically) {
      // We have to create a newer model instance because the older one only returns a structured JSON
      const newerModel = genAiInstance.getGenerativeModel({
        model: "gemini-1.5-pro",
      });

      const contractVariationResponse = await newerModel.generateContent([
        {
          text: `
            The hardship request from the customer for a loan that they have has been approved. 

            Generate a variation of contract agreement based on the provided customer hardship information. 
            
            Focus only on generating the content of the agreement itself, and leave out generating a header or witness signing or customer signing, or any other signing areas. 

            If you do not have a specific information needed in the variation of contract, please omit it from the contract. DO NOT include any templated fields. ONLY include information that you already have. 

            Also make sure to mention that apart from the variation itself, all the other agreements mentioned in the original loan contract still stands and continues to apply. 

            Now, here is the customer information and the hardship they're going through, generate the content for variation of contract for this customer specifically. 

            Name of the Lender : MoonRiver Lake Bank

            Customer Full Legal Name : ${loanInDb.customer!.customerFullName}

            Customer Email Address : ${result.data.emailAddress}

            Customer Phone Number : ${result.data.phoneNumber}
            
            Customer Circumstance Change : ${
              result.data.circumstanceReason === "expenseRaised"
                ? "My Expenses Have Raised"
                : "My Income Has Reduced"
            }

            Customer Circumstance Change Explanation : ${
              result.data.circumstanceExplanation
            }

            Approved Variation Contract in Loan : ${
              result.data.idealArrangement
            }
          `,
        },
      ]);

      const contractContentFromGenAi =
        contractVariationResponse.response.text();

      console.info(
        "Variation of Contract Generated From GenAI",
        contractContentFromGenAi
      );

      variationGenerated = getHTMLForContractVariation(
        contractContentFromGenAi
      );
    }

    const putResult = await put(
      result.data.supportingDocument.name,
      result.data.supportingDocument,
      { access: "public" }
    );
    //load the hardship in db
    await loanCollection.updateOne(
      {
        _id: loanInDb._id,
      },
      {
        $set: {
          lastUpdated: new Date(),
          hardship: {
            circumstanceReason: result.data.circumstanceReason,
            circumstanceExplanation: result.data.circumstanceExplanation,
            idealArrangement: result.data.idealArrangement,
            supportingDocument: putResult.url,
            loanVariationStatus: parsedResponse.canVariateAgreementAutomatically
              ? "variationGenerated"
              : "needsAttention",
            variatedContractContent: variationGenerated,
          },
        },
      }
    );

    return {
      mode: parsedResponse.canVariateAgreementAutomatically
        ? "contractVariatedSuccessfully"
        : "emailSentToRepresentative",
    };
  } catch (error: unknown) {
    if (typeof error === "string") {
      console.error("Unable to process customer hardship", error);
    } else if (error instanceof Error) {
      console.error("Unable to process customer hardship", error.message);
    }

    return {
      errorDetails: {
        circumstanceExplanation: `Something went wrong while evaluating your hardship. Please try again in a bit`,
      },
      mode: "error",
    };
  }
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
                        width: 100%;
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

/***
 *
 * Circumstance Explanation:
 *
 *
 * My mortgage has increased. My monthly income is $4000. With the recent mortgage increase from $1500 to $1600, I have a shortfall of $100.

My fortnightly repayments with your loan is $100. So pausing the repayments for the next two months would give me some breathing space, to rearrange my other expense so that I can find another extra $100 a month in my monthly budget.

The start date for my variation is 2024-12-24 and the end date for my variation is 2025-02-24. I will begin my regular repayments from the 2025-03-07
 *
 *
 *
 * Ideal Arrangement:
 *
 * I would like to pause my repayments for the next two months.
 
This will give me some breathing space to get back on my feet and find another $100 in my budget.
 *
 */
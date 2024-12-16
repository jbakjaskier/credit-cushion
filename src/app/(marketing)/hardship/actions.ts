"use server";
import { z } from "zod";
import {
  HardshipFormErrorDetail,
  HardshipFormState,
} from "@/components/hardship/HardshipForm";
import clientPromise, { dbName } from "@/lib/db/mongodb";
import { Loan, loanCollectionName } from "@/lib/db/models/loans";

import { put, PutBlobResult } from "@vercel/blob";
import { GoogleAIFileManager } from "@google/generative-ai/server";
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

  const aiFileManager = new GoogleAIFileManager(
    process.env.GOOGLE_GEMINI_API_KEY!
  );

  const responseSchema = {
    description: `Evaluation of hardship form from customer with regards to a loan application`,
    type: SchemaType.OBJECT,
    properties: {
      adequateHardshipInformation : {
        type: SchemaType.BOOLEAN,
        description: `This boolean indicates whether or not the hardship information given by the customer is adequate enough for the loan provider to make a decision on their hardship`,
        nullable: false
      },
      furtherInformationRequired : {
        type: SchemaType.STRING,
        description: `This field contains any further information or clarification required from the customer, to make an decision on their hardship situation. If there is enough information to make a decision, this field is returned as null`,
        nullable: true
      }
    },
    required: ["adequateHardshipInformation"]
  }

  const model = genAiInstance.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig : {
      responseMimeType: `application/json`,
      responseSchema: responseSchema
    }
  });
  
  const buf = await result.data.supportingDocument.arrayBuffer();
  
  
  const genAiResult = await model.generateContent([
    {
      inlineData: {
        mimeType : "application/pdf",
        data: Buffer.from(buf).toString('base64')
      }
    },
    {
      text: `
        You will be given a customer hardship information, along with the supporting document attached in this prompt. Your job is to go through it and evaluate the given information with the follwing critierias

        1. Does the supporting document attached in this prompt have relevant information with regards to the customers hardship, or is it irrelevant?
        2. Do you have enough information about their circumstance ? For example, if they have mentioned how they've lost their job, then you do have enough information on their circumstance. If they are just saying times are tough, then you would need more information about their circumstance to make a decision 
        3. Do you have enough information on What would their ideal arrangement look like ? You need atleast on of these details  a) How long they would like to defer their next payment, b) How long they would like to pause all payments c) A change in loan repayment amount for a specified time. 

        If it fails any of the criterias above, please respond with what further information you would need from the customer before being able to make a decision on their hardship. Please make the request for further information as succinct and summarised as possible mentioning the key points required. 

        Now here is the customer hardship information, Please evaluate it with the criterias mentioned above and respond

        Customer Full Legal Name : ${result.data.fullLegalName}

        Customer Phone Number : ${result.data.phoneNumber}

        Customer Email Address : ${result.data.emailAddress}

        Customer Circumstance Change : ${result.data.circumstanceReason === "expenseRaised" ? "My Expenses Have Raised" : "My Income Has Reduced" }

        Customer Circumstance Change Reason : ${result.data.circumstanceExplanation}

        Customer Ideal Arrangement : ${result.data.idealArrangement}
      `
    },
  ])

  const genAiJsonResponse = genAiResult.response.text()

  console.info(`Response from Gen AI`, genAiJsonResponse)

  const parsedResponse = JSON.parse(genAiJsonResponse) as {
    adequateHardshipInformation: boolean;
    furtherInformationRequired?: string;
  };

  if(!parsedResponse.adequateHardshipInformation) {
    return {
      mode: "error",
      errorDetails: {
        circumstanceExplanation: parsedResponse.furtherInformationRequired
      }
    }
  } 
  
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

  //create a hardship entry
  if (loanInDb.hardship !== undefined) {
    //TODO: send an email to representative. cause a hardship already exists
  } else {
    const putResult = await uploadFile(result.data.supportingDocument);
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
            processingStatus: "toBeProcessed",
          },
        },
      }
    );
  }

  return {
    mode: "success",
  };
}

export async function uploadFile(file: File): Promise<PutBlobResult> {
  const blob = await put(file.name, file, { access: "public" });
  return blob;
}

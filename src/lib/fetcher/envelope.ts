"use server";

import { CustomerDetails } from "@/components/products/CustomerDetailsForm";
import { FetcherError } from "./common";
import { verifySession } from "../auth/session";

type EnvelopeCreatedResult = {
    envelopeId: string;
    uri: string;
    status: string;
}

export type EnvelopeSentResult = { envelopeSent: true };

export async function sendEnvelopeToCustomer(
  accountId: string,
  templateId: string,
  customerDetails: CustomerDetails
): Promise<FetcherError | EnvelopeSentResult> {
  try {
    const session = await verifySession();

    const sendEnvelopeResult = await fetch(
      `${process.env.DOCUSIGN_ESIG_BASE_URL}/v2.1/accounts/${accountId}/envelopes`,
      {
        method: "POST",
        headers: {
            Authorization: `Bearer ${session.sessionPayload.accessTokenResponse.access_token}`,
            'Content-Type': 'application/json',
        },
        
        body: JSON.stringify({
          envelopeDefinition: {
            sender: {
              templateId: templateId,
            },
            templateRoles: [
              {
                email: customerDetails.email,
                emailNotification: {
                  name: customerDetails.legalName,
                },
              },
            ],
          },
        }),
      }
    );

    console.error(`sendEnvelopeResult`, sendEnvelopeResult)


    if (!sendEnvelopeResult.ok) {
      return {
        errorMessage: `We were unable to send the template to the customer. Please try again in a bit`,
      };
    }

    const envelopeCreatedJsonResult = await sendEnvelopeResult.json() as EnvelopeCreatedResult;



    return {
      envelopeSent: true,
    };
  } catch (error: unknown) {
    if (typeof error === "string") {
      return {
        errorMessage: error,
      };
    }

    if (error instanceof Error) {
      return {
        errorMessage: error.message,
      };
    }

    return {
      errorMessage: `We were unable to send the template to the customer. Please try again in a bit`,
    };
  }
}

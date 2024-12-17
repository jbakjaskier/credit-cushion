"use server";

import { CustomerDetails } from "@/components/products/CustomerDetailsForm";
import { FetcherError } from "./common";
import { verifySession } from "../auth/session";

export type EnvelopeCreatedResult = {
  envelopeId: string;
  uri: string;
  status: string;
};

export async function sendEnvelopeToCustomer(
  accountId: string,
  templateId: string,
  customerDetails: CustomerDetails
): Promise<FetcherError | EnvelopeCreatedResult> {
  try {
    const session = await verifySession();
    
    const sendEnvelopeResult = await fetch(
      `${process.env.DOCUSIGN_ESIG_BASE_URL}/v2.1/accounts/${accountId}/envelopes`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.sessionPayload.accessTokenResponse.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          templateId: templateId,
          templateRoles: [
            {
              email: customerDetails.email,
              roleName: "Customer",
              name: customerDetails.legalName,
            },
          ],
          status: "sent",
        }),
      }
    );

    if (!sendEnvelopeResult.ok) {
      return {
        errorMessage: `We were unable to send the template to the customer. Please try again in a bit`,
      };
    }

    const envelopeCreatedJsonResult =
      (await sendEnvelopeResult.json()) as EnvelopeCreatedResult;
      
    return envelopeCreatedJsonResult;
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

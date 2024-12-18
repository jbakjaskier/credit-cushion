"use server";

import { FetcherError, isFetcherError } from "./common";
import { verifySession } from "../auth/session";
import { isDbFetcherError, Loan } from "../db/models/loans";
import getSupportedAccountInfo from "../../../accountConfig";
import { redirect } from "next/navigation";
import { addEnvelopeToHardship, getLoanFromDbAsync } from "../db/dbFetcher";
import { ObjectId } from "mongodb";

export type EnvelopeCreatedResult = {
  envelopeId: string;
  uri: string;
  status: "sent" | "created";
};

//TODO: This specifically is a test method and must be removed later
// Feel free to use the objectId of the loan that you're wanting to test the sending of the VoC
export async function sendEnvelopeVariationToCustomerAndSaveItInDatabase(
  loanId: ObjectId = new ObjectId("675fbcf5646fe311c24b19b9")
) {
  const loanInDb = await getLoanFromDbAsync(loanId);

  if (!isDbFetcherError(loanInDb)) {
    const envelopCreatedCustomer = await sendVariationOfContractToCustomer(
      loanInDb!
    );

    if (!isFetcherError(envelopCreatedCustomer)) {
      await addEnvelopeToHardship(loanId, envelopCreatedCustomer);
    }
  }
}

export async function sendVariationOfContractToCustomer(
  loanWithHardship: Loan
): Promise<FetcherError | EnvelopeCreatedResult> {
  if (loanWithHardship.hardship === undefined) {
    return {
      errorMessage: `You cannot send variation of contract to a customer who does not have hardship`,
    };
  }

  if (loanWithHardship.hardship.variatedContractContent === undefined) {
    return {
      errorMessage: `You cannot send a variation of contract that has not been generated`,
    };
  }

  try {
    const session = await verifySession();

    const selectedAccount = session.sessionPayload.userInfo.accounts.find(
      (ac) => getSupportedAccountInfo(ac.account_id) !== undefined
    );

    if (selectedAccount === undefined) {
      redirect(`/api/auth/logout?logoutUri=unsupportedAccount`);
    }

    const sendEnvelopeResult = await fetch(
      `${process.env.DOCUSIGN_ESIG_BASE_URL}/v2.1/accounts/${selectedAccount.account_id}/envelopes`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.sessionPayload.accessTokenResponse.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          documents: [
            {
              name: "Variation of Contract Document",
              documentId: "1", //This is intentionally a string
              htmlDefinition: {
                source: `'${loanWithHardship.hardship.variatedContractContent}'`,
              },
            },
          ],
          emailSubject:
            "Congratulations 🎉 Your variation of contract has been approved!",
          emailBlurb:
            "Congratulations ✨ Your hardship application has been approved. Please sign the contract attached to this email! Feel free to reach out to us if you have any further questions",
          recipients: {
            signers: [
              {
                email: loanWithHardship.customer!.customerEmail,
                name: loanWithHardship.customer!.customerFullName,
                recipientId: "1",
                roleName: "Signer",
                tabs: {
                  signHereTabs: [
                    {
                      anchorString: "Customer Signature",
                      anchorXOffset: "20",
                      anchorYOffset: "-30",
                      tabLabel: "Sign Here",
                      documentId: "1",
                    },
                  ],
                  dateSignedTabs: [
                    {
                      anchorString: "Date Signed",
                      anchorXOffset: "20",
                      anchorYOffset: "-25",
                      documentId: "1",
                      tabLabel: "Date Signed",
                    },
                  ],
                },
                routingOrder: "1",
              },
            ],
            carbonCopies: [
              {
                email: loanWithHardship.representative.email,
                name: loanWithHardship.representative.name,
                recipientId: "2",
                routingOrder: "1",
              },
            ],
          },
          status: "sent",
        }),
      }
    );

    if (!sendEnvelopeResult.ok) {
      return {
        errorMessage: `We were unable to send the envelope to the customer. Please try again in a bit`,
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

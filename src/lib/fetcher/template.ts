"use server";

import { verifySession } from "../auth/session";
import { FetcherError } from "./common";

export type EnvelopeTemplateResult = {
  resultSetSize: string;
  startPosition: string;
  endPosition: string;
  totalSetSize: string;
  envelopeTemplates?: EnvelopeTemplate[];
};

export type EnvelopeTemplate = {
  templateId: string;
  uri: string;
  name: string;
  description: string;
  emailSubject: string;
  emailBlurb: string;
};

export async function fetchEnvelopeTemplates(
  accountId: string
): Promise<EnvelopeTemplate[] | FetcherError> {
  try {

    const session = verifySession();

    const envelopeTemplatesResult = await fetch(
      `${process.env.DOCUSIGN_ESIG_BASE_URL}/v2.1/accounts/${accountId}/templates`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${
            (
              await session
            ).sessionPayload.accessTokenResponse.access_token
          }`,
        },
      }
    );

    if (!envelopeTemplatesResult.ok) {
      return {
        errorMessage: `We were unable to fetch your template. Please try again in a bit`,
      };
    }

    const envelopeJsonResult =
      (await envelopeTemplatesResult.json()) as EnvelopeTemplateResult;

    console.info(`envelopeJsonResult`, envelopeJsonResult);

    if (
      parseInt(envelopeJsonResult.totalSetSize.trim()) === 0 ||
      envelopeJsonResult.envelopeTemplates === undefined
    ) {
      return {
        errorMessage: `There are no templates loaded in your DocuSign account`,
      };
    }

    return envelopeJsonResult.envelopeTemplates!;
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
      errorMessage: `We were unable to fetch your template. Please try again in a bit`,
    };
  }
}

"use server"

import { verifySession } from "../auth/session";
import { FetcherError } from "./common";

export type SuccessfulConnectResult = { isSuccessful: true }

export async function createConnectConfigurationForAccount(): Promise<
  FetcherError | SuccessfulConnectResult
> {
  try {
    const session = await verifySession();

    const connectConfigurationResult = await fetch(
      `${process.env.DOCUSIGN_ESIG_BASE_URL}/v2.1/accounts/${
        session.sessionPayload.userInfo.accounts.find((x) => x.is_default)!
          .account_id
      }/connect`,

      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.sessionPayload.accessTokenResponse.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          configurationType: "custom",
          urlToPublishTo:
            "https://credit-cushion.vercel.app/api/events/envelopes",
          name: "Credit Cushion Configuration",
          allowEnvelopePublish: "true",
          enableLog: "true",
          requiresAcknowledgement: "true",
          signMessageWithX509Certificate: "false",
          deliveryMode: "SIM",
          events: ["envelope-created", "envelope-sent", "envelope-completed"],
          eventData: {
            version: "restv2.1",
            includeData: ["custom_fields", "recipients", "tabs"],
          },
          allUsers: "true",
        }),
      }
    );

    if (!connectConfigurationResult.ok) {
      return {
        errorMessage: `We were unable to add connect configuration for Credit Cushion to your account. Please try again in a bit`,
      };
    }

    return {
      isSuccessful: true,
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
      errorMessage: `We were unable to add connect configuration for Credit Cushion to your account. Please try again in a bit`,
    };
  }
}

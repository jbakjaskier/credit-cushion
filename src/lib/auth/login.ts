"use server";

import {
  AccessTokenResponse,
  AuthErrorResponse,
  docuSignAuthScopes,
  isAuthErrorResponse,
  SessionPayload,
  UserInfo,
} from "./models";
import { isDevelopmentEnvironment } from "../db/mongodb";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function generateOAuthState(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Buffer.from(array).toString("base64url");
}

export async function createAuthUrl(): Promise<string> {
  const loginUrl = new URL(
    isDevelopmentEnvironment()
      ? `https://account-d.docusign.com/oauth/auth`
      : `https://account.docusign.com/oauth/auth`
  );
  loginUrl.searchParams.append(`response_type`, `code`);
  loginUrl.searchParams.append(`scope`, docuSignAuthScopes.join(" "));
  loginUrl.searchParams.append(
    `client_id`,
    process.env.DOCUSIGN_INTEGRATION_KEY!
  );
  loginUrl.searchParams.append(
    `redirect_uri`,
    process.env.DOCUSIGN_REDIRECT_URI!
  );

  return loginUrl.toString();
}

export async function getAuthenticatedSessionPayload(
  authCode: string
): Promise<SessionPayload | AuthErrorResponse> {
  const accessTokenResponse = await getAccessToken(authCode);

  if (isAuthErrorResponse(accessTokenResponse)) {
    return accessTokenResponse;
  }

  const userInfoResponse = await getUserInfo(accessTokenResponse.access_token);

  if (isAuthErrorResponse(userInfoResponse)) {
    return userInfoResponse;
  }


  return {
    accessTokenResponse: accessTokenResponse,
    userInfo: userInfoResponse,
    createdOn: Date.now(),
  };
}

export async function getAuthenticatedRefreshTokenSessionPayload(
  refreshToken: string,
  userInfo: UserInfo
): Promise<SessionPayload | AuthErrorResponse> {
  const refreshTokenResult = await getAccessTokenWithRefreshToken(refreshToken);

  if (isAuthErrorResponse(refreshTokenResult)) {
    return refreshTokenResult;
  }

  return {
    accessTokenResponse: refreshTokenResult,
    userInfo: userInfo,
    createdOn: Date.now(),
  };
}

async function getUserInfo(
  accessToken: string
): Promise<UserInfo | AuthErrorResponse> {
  try {
    const userInfoResult = await fetch(
      isDevelopmentEnvironment()
        ? `https://account-d.docusign.com/oauth/userinfo`
        : `https://account.docusign.com/oauth/userinfo`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!userInfoResult.ok) {
      return {
        errorMessage: `We weren't able to successfully authenticate you. Please try again in a bit`,
      };
    }

    const userInfoResponse = (await userInfoResult.json()) as UserInfo;

    return userInfoResponse;
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
      errorMessage: `We weren't able to successfully authenticate you. Please try again in a bit`,
    };
  }
}

async function getAccessTokenWithRefreshToken(
  refreshToken: string
): Promise<AccessTokenResponse | AuthErrorResponse> {
  try {
    const refreshTokenFetchResult = await fetch(
      isDevelopmentEnvironment()
        ? `https://account-d.docusign.com/oauth/token`
        : `https://account.docusign.com/oauth/token`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${btoa(
            `${process.env.DOCUSIGN_INTEGRATION_KEY!}:${process.env
              .DOCUSIGN_SECRET_KEY!}`
          )}`,
          "Content-Type": `application/x-www-form-urlencoded`,
        },
        body: new URLSearchParams({
          grant_type: `refresh_token`,
          refresh_token: refreshToken,
        }).toString(),
      }
    );

    if (!refreshTokenFetchResult.ok) {
      return {
        errorMessage: `We were unable to authenticate you successfully. Please try signing in again`,
      };
    }

    const tokenResponse =
      (await refreshTokenFetchResult.json()) as AccessTokenResponse;

    return tokenResponse;
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
      errorMessage: `We were unable to authenticate you successfully. Please try signing in again`,
    };
  }
}

async function getAccessToken(
  authCode: string
): Promise<AccessTokenResponse | AuthErrorResponse> {
  try {
    const authFetchResult = await fetch(
      isDevelopmentEnvironment()
        ? `https://account-d.docusign.com/oauth/token`
        : `https://account.docusign.com/oauth/token`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${btoa(
            `${process.env.DOCUSIGN_INTEGRATION_KEY!}:${process.env
              .DOCUSIGN_SECRET_KEY!}`
          )}`,
          "Content-Type": `application/x-www-form-urlencoded`,
        },
        body: new URLSearchParams({
          grant_type: `authorization_code`,
          code: authCode,
        }).toString(),
      }
    );

    if (!authFetchResult.ok) {
      return {
        errorMessage: `We weren't able to successfully authenticate you. Please try again in a bit`,
      };
    }

    const tokenResponse = (await authFetchResult.json()) as AccessTokenResponse;

    return tokenResponse;
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
      errorMessage: `We weren't able to successfully authenticate you. Please try again in a bit`,
    };
  }
}

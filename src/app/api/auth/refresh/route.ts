"use server";
import { getAuthenticatedRefreshTokenSessionPayload } from "@/lib/auth/login";
import { isAuthErrorResponse } from "@/lib/auth/models";
import { updateSession, verifySession } from "@/lib/auth/session";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  return await handleRoute(request);
}

export async function POST(request: NextRequest) {
  return await handleRoute(request);
}

async function handleRoute(request: NextRequest) {
  const session = await verifySession();

  const searchParams = request.nextUrl.searchParams;

  const pathToRedirect = searchParams.get("redirectPath");
  const searchParamsToRedirect = searchParams.get("redirectPathSearchParams");

  //use refresh token
  const refreshTokenResult = await getAuthenticatedRefreshTokenSessionPayload(
    session.sessionPayload.accessTokenResponse.refresh_token,
    session.sessionPayload.userInfo
  );

  if (isAuthErrorResponse(refreshTokenResult)) {
    return NextResponse.redirect(new URL(`/`, request.url));
    //TODO: In the future please show the error message of the failed auth when redirecting to home page
    //This can be done by passing the errorMessage string in the URL which then be parsed and displayed in the
    //Marketing page
  }

  //Store the access token in cookies
  await updateSession(refreshTokenResult);

  if (pathToRedirect === null) {
    return NextResponse.redirect(new URL(`/`, request.url));
  }

  if (
    searchParamsToRedirect === null ||
    searchParamsToRedirect === undefined ||
    searchParamsToRedirect.trim() === ""
  ) {
    return NextResponse.redirect(new URL(pathToRedirect, request.url));
  }

  return NextResponse.redirect(
    new URL(`${pathToRedirect}${searchParamsToRedirect}`, request.url)
  );
}

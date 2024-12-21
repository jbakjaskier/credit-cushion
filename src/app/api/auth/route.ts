import { getAuthenticatedSessionPayload } from "@/lib/auth/login";
import { isAuthErrorResponse } from "@/lib/auth/models";
import { createSession } from "@/lib/auth/session";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
  ) {

    const searchParams = request.nextUrl.searchParams;

    const authCode = searchParams.get('code');
    
    if(authCode === null) {
        return NextResponse.redirect(new URL(`/`, request.url))
    }

    const authenticatedSessionPayload = await getAuthenticatedSessionPayload(authCode);
    if (isAuthErrorResponse(authenticatedSessionPayload)) {
        return NextResponse.redirect(new URL(`/`, request.url)) 
        //TODO: In the future please show the error message of the failed auth when redirecting to home page
        //This can be done by passing the errorMessage string in the URL which then be parsed and displayed in the 
        //Marketing page 
    } 
    
    //Store the access token in cookies
    await createSession(authenticatedSessionPayload);

    return NextResponse.redirect(new URL(`/loans`, request.url))
  }
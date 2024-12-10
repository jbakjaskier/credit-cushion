"use server"

import { cookies } from "next/headers";


const CookieKeys = {
    AuthState: "oauth_state"
}

export async function setAuthStateCookie(state: string) {
     (await cookies()).set(CookieKeys.AuthState, state, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 3600,
      });
    
}
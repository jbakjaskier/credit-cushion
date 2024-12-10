export type AccessTokenResponse = {
    access_token: string;
    token_type: "Bearer";
    refresh_token: string;
    expires_in: number;
  };
  
  export type AuthErrorResponse = {
    errorMessage: string;
  };


export function isAuthErrorResponse (input: AuthErrorResponse | AccessTokenResponse): input is AuthErrorResponse {
    return "errorMessage" in input
}
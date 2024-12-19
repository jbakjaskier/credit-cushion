export type SessionPayload = {
  accessTokenResponse: AccessTokenResponse;
  userInfo: UserInfo;
  createdOn: number;
};

export type AccessTokenResponse = {
  access_token: string;
  token_type: "Bearer";
  refresh_token: string;
  expires_in: number;
};

export type UserInfo = {
  sub: string;
  name: string;
  email: string;
  accounts: UserAccount[];
};

export type UserAccount = {
  account_id: string;
  is_default: boolean;
  account_name: string;
  base_uri: string;
};

export type AuthErrorResponse = {
  errorMessage: string;
};

export const docuSignAuthScopes = ["signature", "openid", "cors", "extended"];

export function isAuthErrorResponse(
  input: AuthErrorResponse | AccessTokenResponse | UserInfo | SessionPayload
): input is AuthErrorResponse {
  return "errorMessage" in input;
}

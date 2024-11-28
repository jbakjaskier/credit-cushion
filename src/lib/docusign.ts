// DocuSign OAuth configuration
export const DOCUSIGN_CONFIG = {
  authorizationUrl: "https://account-d.docusign.com/oauth/auth",
  tokenUrl: "https://account-d.docusign.com/oauth/token",
  clientId: process.env.DOCUSIGN_CLIENT_ID,
  clientSecret: process.env.DOCUSIGN_CLIENT_SECRET,
  redirectUri: process.env.DOCUSIGN_REDIRECT_URI,
  scope: "signature",
};

export async function initiateDocuSignAuth() {
  const params = new URLSearchParams({
    response_type: "code",
    scope: DOCUSIGN_CONFIG.scope,
    client_id: DOCUSIGN_CONFIG.clientId!,
    redirect_uri: DOCUSIGN_CONFIG.redirectUri!,
  });

  const authUrl = `${DOCUSIGN_CONFIG.authorizationUrl}?${params.toString()}`;
  return authUrl;
}

export async function handleDocuSignCallback(code: string) {
  try {
    const response = await fetch(DOCUSIGN_CONFIG.tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        client_id: DOCUSIGN_CONFIG.clientId!,
        client_secret: DOCUSIGN_CONFIG.clientSecret!,
        redirect_uri: DOCUSIGN_CONFIG.redirectUri!,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to exchange code for token");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error exchanging code for token:", error);
    throw error;
  }
}

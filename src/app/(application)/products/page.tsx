"use server";

import { ProviderSelection } from "@/components/products/ProviderSelection";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { Suspense } from "react";
import { PageLoader } from "@/components/common/PageLoader";
import { getAccessToken } from "@/lib/auth/login";
import { isAuthErrorResponse } from "@/lib/auth/models";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  //see if there is a code / if not check if they are logged in
  const authCode = (await searchParams).code as string | undefined;

  if (authCode !== undefined) {
    const accessTokenResponse = await getAccessToken(authCode);
    if (isAuthErrorResponse(accessTokenResponse)) {
      throw new Error(accessTokenResponse.errorMessage);
    } else {
      //Store the access token in cookies
    }
  } else {
    //Check if this guy is authenticated already from cookies
  }

  return (
    <div className="mx-auto max-w-3xl py-8">
      <ErrorBoundary>
        <Suspense fallback={<PageLoader />}>
          <ProviderSelection />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

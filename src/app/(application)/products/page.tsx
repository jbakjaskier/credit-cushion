"use server";

import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { Suspense } from "react";
import { PageLoader } from "@/components/common/PageLoader";
import { ProviderSelectionClient } from "@/components/products/ProviderSelectionClient";
import { verifySession } from "@/lib/auth/session";
import { UserAccount } from "@/lib/auth/models";

async function getAccounts() : Promise<UserAccount[]> {
  const sessionDetails = await verifySession()
  return sessionDetails.sessionPayload.userInfo.accounts;
}



export default async function ProductsPage() {

  const accounts = await getAccounts();
  
  return (
    <div className="mx-auto max-w-3xl py-8">
      <ErrorBoundary>
        <Suspense fallback={<PageLoader />}>
          <ProviderSelectionClient providers={accounts} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

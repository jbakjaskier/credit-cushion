"use server";

import { ProviderSelection } from "@/components/products/ProviderSelection";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { Suspense } from "react";
import { PageLoader } from "@/components/common/PageLoader";

export default async function ProductsPage() {
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

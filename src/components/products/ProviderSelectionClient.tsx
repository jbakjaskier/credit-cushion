"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProviderList } from "./ProviderList";
import Button from "@/components/common/Button";
import { UserAccount } from "@/lib/auth/models";


interface AccountSelectionClientProps {
  providers: UserAccount[];
}

export function ProviderSelectionClient({
  providers,
}: AccountSelectionClientProps) {
  const [selected, setSelected] = useState<UserAccount | null>(null);
  const router = useRouter();

  const handleNext = () => {
    if (selected) {
      router.push(`/products/templates?accountId=${selected.account_id}`);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900">
          Select Your Provider
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Choose your financial institution to proceed with sending the credit
          contract to the customer
        </p>
      </div>

      <ProviderList
        providers={providers}
        selected={selected}
        onSelect={setSelected}
      />

      <div className="flex justify-end">
        <Button
          onClick={handleNext}
          disabled={!selected}
          className="w-full sm:w-auto"
        >
          Next
        </Button>
      </div>
    </div>
  );
}

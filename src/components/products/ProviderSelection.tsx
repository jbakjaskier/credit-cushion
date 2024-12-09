// Server Component
import { ProviderSelectionClient } from "./ProviderSelectionClient";
import { getProviders } from "@/lib/services/providerService";

export async function ProviderSelection() {
  const providers = await getProviders();

  return <ProviderSelectionClient providers={providers} />;
}

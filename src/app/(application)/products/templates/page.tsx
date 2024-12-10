"use server";


import { redirect } from "next/navigation";
import { fetchEnvelopeTemplates } from "@/lib/fetcher/template";
import { isFetcherError } from "@/lib/fetcher/common";
import TemplateListView from "@/components/products/TemplateListView";

export default async function TemplatesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { accountId } = await searchParams;

  if (accountId === undefined || Array.isArray(accountId)) {
    redirect(`/products`); //Given they have not selected which organisation they belong to
  }

  const templatesResult = await fetchEnvelopeTemplates(accountId);

  if (isFetcherError(templatesResult)) {
    return (
      <div className="text-center">
          <p className="text-base font-semibold text-indigo-600">Error</p>
          <p className="mt-6 text-base leading-7 text-gray-600">{templatesResult.errorMessage}</p>
        </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6">
      <TemplateListView templates={templatesResult} />
    </div>
  );
}

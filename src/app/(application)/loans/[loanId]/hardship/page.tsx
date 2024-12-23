import LoanBreadcrumb from "@/components/loans/LoanBreadcrumb";
import LoanErrorState from "@/components/loans/LoanErrorState";
import { getLoanFromDbAsync } from "@/lib/db/dbFetcher";
import { DbFetcherError, isDbFetcherError, Loan } from "@/lib/db/models/loans";
import { ObjectId } from "mongodb";
import Link from "next/link";
import { readerFriendlyDateString } from "../page";
import { DocumentIcon } from "@heroicons/react/24/outline";
import VariationOfContractEditor from "@/components/loans/VariationOfContractEditor";

export default async function CustomerPage({
  params,
}: {
  params: Promise<{ loanId: string }>;
}) {
  const loanId = (await params).loanId;

  const loanInDb: Loan | DbFetcherError = ObjectId.isValid(loanId)
    ? await getLoanFromDbAsync(new ObjectId(loanId))
    : {
        errorMessage: `This is not a valid loan ID`,
      };

  return (
    <div>
      <LoanBreadcrumb />

      {isDbFetcherError(loanInDb) ? (
        <LoanErrorState errorMessage={loanInDb.errorMessage} />
      ) : loanInDb.hardship === undefined ? (
        <LoanErrorState
          errorMessage={`This loan does not have a hardship associated with it`}
        />
      ) : (
        <div className="mt-8">
          <div className="px-4 sm:px-0">
            <h3 className="text-base font-semibold leading-7 text-gray-900">
              Envelope Details
            </h3>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
              {`Details of the envelope associated in Docusign with regards to this hardship`}
            </p>
          </div>
          <div className="mt-6">
            {loanInDb.hardship.envelopeDetails === undefined ? (
              <p className="text-sm text-gray-700">
                There is no envelope associated with this hardship yet!
              </p>
            ) : (
              <dl className="grid grid-cols-1 sm:grid-cols-2">
                <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    Envelope ID
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                    {loanInDb.hardship.envelopeDetails.envelopeId}
                  </dd>
                </div>
                <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    Envelope Status
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                    {loanInDb.hardship.envelopeDetails.envelopeStatus
                      .charAt(0)
                      .toUpperCase() +
                      loanInDb.hardship.envelopeDetails.envelopeStatus.slice(1)}
                  </dd>
                </div>
                <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    Last Updated
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                    {readerFriendlyDateString(
                      loanInDb.hardship.envelopeDetails.lastUpdated
                    )}
                  </dd>
                </div>
                <div className="border-t border-gray-100 px-4 py-6 sm:col-span-2 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    Envelopes Associated
                  </dt>
                  <dd className="mt-2 text-sm text-gray-900">
                    <ul
                      role="list"
                      className="divide-y divide-gray-100 rounded-md border border-gray-200"
                    >
                      <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                        <div className="flex w-0 flex-1 items-center">
                          <DocumentIcon
                            className="h-5 w-5 flex-shrink-0 text-gray-400"
                            aria-hidden="true"
                          />
                          <div className="ml-4 flex min-w-0 flex-1 gap-2">
                            <span className="truncate font-medium">
                              Envelope
                            </span>
                            <span className="flex-shrink-0 text-gray-400">
                              {loanInDb.hardship.envelopeDetails.envelopeId}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          <Link
                            href="#" /** THis is a TODO to route to the docusign with the envelope URI */
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                          >
                            Open in DocuSign
                          </Link>
                        </div>
                      </li>
                    </ul>
                  </dd>
                </div>
              </dl>
            )}
          </div>

          {loanInDb.hardship.loanVariationStatus === "variationGenerated" &&
            loanInDb.hardship.variatedContractContent !== undefined && (
              <div className="px-4 sm:px-0">
                <h3 className="text-base font-semibold leading-7 text-gray-900">
                  Loan Variation Content
                </h3>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
                  {`The loan variation content generated by AI and to be sent to customer`}
                </p>
              </div>
            )}

          {loanInDb.hardship.loanVariationStatus === "variationGenerated" &&
            loanInDb.hardship.variatedContractContent !== undefined && (
              <div className="mt-6">
                <VariationOfContractEditor
                  loanId={loanId}
                  generatedContent={loanInDb.hardship.variatedContractContent}
                />
              </div>
            )}
        </div>
      )}
    </div>
  );
}

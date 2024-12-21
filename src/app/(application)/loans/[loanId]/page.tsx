import LoanBreadcrumb from "@/components/loans/LoanBreadcrumb";
import LoanErrorState from "@/components/loans/LoanErrorState";
import { getLoanFromDbAsync } from "@/lib/db/dbFetcher";
import { DbFetcherError, isDbFetcherError, Loan } from "@/lib/db/models/loans";
import { ObjectId } from "mongodb";
import { DocumentIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default async function LoanDetailsPage({
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
      ) : (
        <div className="mt-8">
          <div className="px-4 sm:px-0">
            <h3 className="text-base font-semibold leading-7 text-gray-900">
              Loan Details
            </h3>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
              {`Details of the loan granted to customer`}
            </p>
          </div>
          <div className="mt-6">
            <dl className="grid grid-cols-1 sm:grid-cols-2">
              <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Loan Status
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                  {loanInDb.status === "loan-created"
                    ? `Created`
                    : loanInDb.status === "loan-sent-to-customer"
                    ? `Sent To Customer`
                    : `Signed By Customer`}
                </dd>
              </div>
              <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Loan Start Date
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                  {loanInDb.loanDetails === undefined
                    ? `To Be Specified`
                    : loanInDb.loanDetails.loanStartDate}
                </dd>
              </div>
              <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Loan End Date
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                  {loanInDb.loanDetails === undefined
                    ? `To Be Specified`
                    : loanInDb.loanDetails.loanEndDate}
                </dd>
              </div>
              <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Repayment Start Date
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                  {loanInDb.loanDetails === undefined
                    ? `To Be Specified`
                    : loanInDb.loanDetails.repaymentStartDate}
                </dd>
              </div>
              <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Repayment End Date
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                  {loanInDb.loanDetails === undefined
                    ? `To Be Specified`
                    : loanInDb.loanDetails.repaymentEndDate}
                </dd>
              </div>
              <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Loan Establishment Fees
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                  {loanInDb.loanDetails === undefined
                    ? `To Be Specified`
                    : `$${loanInDb.loanDetails.loanEstablishmentFees.value}`}
                </dd>
              </div>
              <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Loan Amount
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                  {loanInDb.loanDetails === undefined
                    ? `To Be Specified`
                    : `$${loanInDb.loanDetails.loanAmount.value}`}
                </dd>
              </div>
              <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Loan Total Repayment Amount
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                  {loanInDb.loanDetails === undefined
                    ? `To Be Specified`
                    : `$${loanInDb.loanDetails.loanTotalRepaymentAmount.value}`}
                </dd>
              </div>
              <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Repayment Installment
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                  {loanInDb.loanDetails === undefined
                    ? `To Be Specified`
                    : `$${loanInDb.loanDetails.repaymentInstalmentAmount.value}`}
                </dd>
              </div>
              <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Final Repayment Installment Amount
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                  {loanInDb.loanDetails === undefined
                    ? `To Be Specified`
                    : `$${loanInDb.loanDetails.finalRepaymentInstalmentAmount.value}`}
                </dd>
              </div>
            </dl>
          </div>

          

          

          <div className="px-4 sm:px-0">
            <h3 className="text-base font-semibold leading-7 text-gray-900">
              Customer Information
            </h3>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
              {`Information on the customer of this loan`}
            </p>
          </div>
          <div className="mt-6">
            <dl className="grid grid-cols-1 sm:grid-cols-2">
              <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Full name
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                  {loanInDb.customer === undefined
                    ? `To be Specified`
                    : loanInDb.customer.customerFullName}
                </dd>
              </div>
              <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Phone Number
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                  {loanInDb.customer === undefined
                    ? `To Be Specified`
                    : loanInDb.customer.customerPhoneNumber}
                </dd>
              </div>
              <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Email
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                  {loanInDb.customer === undefined
                    ? `To Be Specified`
                    : loanInDb.customer.customerEmail}
                </dd>
              </div>
              <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Date of Birth
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                  {loanInDb.customer === undefined
                    ? `To Be Specified`
                    : loanInDb.customer.customerDateOfBirth}
                </dd>
              </div>
              <div className="border-t border-gray-100 px-4 py-6 sm:col-span-2 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Address
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                  {loanInDb.customer === undefined
                    ? `To Be Specified`
                    : loanInDb.customer.customerAddress}
                </dd>
              </div>
            </dl>
          </div>

          <div className="px-4 sm:px-0">
            <h3 className="text-base font-semibold leading-7 text-gray-900">
              Hardship Details
            </h3>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
              {`Details of any hardship from the customer associated with this loan`}
            </p>
          </div>
          <div className="mt-6">
            {loanInDb.hardship === undefined ? (
              <p className="text-sm text-gray-700">
                There are no hardships associated with this loan.
              </p>
            ) : (
              <dl className="grid grid-cols-1 sm:grid-cols-2">
                <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    Loan Variation Status
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                    {loanInDb.hardship?.loanVariationStatus ===
                    "variationGenerated"
                      ? `Variation Generated`
                      : loanInDb.hardship?.loanVariationStatus ===
                        "hardshipResolved"
                      ? "Hardship Resolved"
                      : loanInDb.hardship?.loanVariationStatus ===
                        "needsAttention"
                      ? "Needs Attention"
                      : "Variation Sent to Customer"}
                  </dd>
                </div>
                <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    Circumstance Reason
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                    {loanInDb.hardship.circumstanceReason === "expenseRaised"
                      ? "Customer's Expenses Have Raised"
                      : "Customer's Income Has Reduced"}
                  </dd>
                </div>

                <div className="border-t border-gray-100 px-4 py-6 sm:col-span-2 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    Circumstance Explanation
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                    {loanInDb.hardship.circumstanceExplanation}
                  </dd>
                </div>
                <div className="border-t border-gray-100 px-4 py-6 sm:col-span-2 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    Ideal Arrangement
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                    {loanInDb.hardship.idealArrangement}
                  </dd>
                </div>
                <div className="border-t border-gray-100 px-4 py-6 sm:col-span-2 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    Documents Associated
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
                              Supporting Document
                            </span>
                            <span className="flex-shrink-0 text-gray-400">
                              from Customer
                            </span>
                          </div>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          <Link
                            href={loanInDb.hardship.supportingDocument}
                            target="_blank"
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                          >
                            View
                          </Link>
                        </div>
                      </li>
                      {loanInDb.hardship.loanVariationStatus === 
                        "variationGenerated" && (
                        <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                          <div className="flex w-0 flex-1 items-center">
                            <DocumentIcon
                              className="h-5 w-5 flex-shrink-0 text-gray-400"
                              aria-hidden="true"
                            />
                            <div className="ml-4 flex min-w-0 flex-1 gap-2">
                              <span className="truncate font-medium">
                                Variation Document
                              </span>
                              <span className="flex-shrink-0 text-gray-400">
                                generated with AI
                              </span>
                            </div>
                          </div>
                          <div className="ml-4 flex-shrink-0">
                            <Link
                              href={`/loans/${loanId}/hardship`}
                              className="font-medium text-indigo-600 hover:text-indigo-500"
                            >
                              View
                            </Link>
                          </div>
                        </li>
                      )}

                      {
                        loanInDb.hardship.envelopeDetails !== undefined && <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
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
                              associated with hardship
                            </span>
                          </div>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          <Link
                            href={`/loans/${loanId}/hardship`}
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                          >
                            View
                          </Link>
                        </div>
                      </li>
                      }
                    </ul>
                  </dd>
                </div>
              </dl>
            )}
          </div>



          <div className="px-4 sm:px-0">
            <h3 className="text-base font-semibold leading-7 text-gray-900">
              Envelope Details
            </h3>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
              {`Details of the envelope associated in Docusign with sending the loan to the customer`}
            </p>
          </div>
          <div className="mt-6">
            <dl className="grid grid-cols-1 sm:grid-cols-2">
              <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Envelope Created Date
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                  {readerFriendlyDateString(loanInDb.createdDateTime)}
                </dd>
              </div>
              <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Envelope Sent Date
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                  {loanInDb.sentDateTime === undefined
                    ? `To Be Specified`
                    : readerFriendlyDateString(loanInDb.sentDateTime)}
                </dd>
              </div>
              <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Customer Date Signed
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                  {loanInDb.customerDateSigned === undefined
                    ? `To Be Specified`
                    : readerFriendlyDateString(loanInDb.customerDateSigned)}
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
                          <span className="truncate font-medium">Envelope</span>
                          <span className="flex-shrink-0 text-gray-400">
                            {loanInDb.envelopeId}
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
          </div>


          <div className="px-4 sm:px-0">
            <h3 className="text-base font-semibold leading-7 text-gray-900">
              Representative Details
            </h3>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
              {`Details of the representative who is associated with this loan`}
            </p>
          </div>
          <div className="mt-6">
            <dl className="grid grid-cols-1 sm:grid-cols-2">
              <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Name
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                  {loanInDb.representative.name}
                </dd>
              </div>
              <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Email
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                  {loanInDb.representative.email}
                </dd>
              </div>
            </dl>
          </div>


        </div>
      )}
    </div>
  );
}

export function readerFriendlyDateString(date: Date): string {
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

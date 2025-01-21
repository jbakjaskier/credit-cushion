import { DocumentIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { Loan } from "@/lib/db/models/loans";
import Link from "next/link";
import { readerFriendlyDateString } from "@/app/(application)/loans/[loanId]/page";
import HardshipActions from "./HardshipActions";
import CustomerIncomeInput from "./CustomerIncomeInput";

export default function LoanDetailsAccordions({ loan }: { loan: Loan }) {
  function getHardshipStatusDisplay(status: string) {
    switch (status) {
      case "needsAttention":
        return {
          text: "Needs Attention",
          className: "bg-red-100 text-red-800",
        };
      case "variationGenerated":
        return {
          text: "Variation Generated",
          className: "bg-yellow-100 text-yellow-800",
        };
      case "hardshipResolved":
        return {
          text: "Hardship Resolved",
          className: "bg-green-100 text-green-800",
        };
      case "variationSent":
        return {
          text: "Variation Sent",
          className: "bg-blue-100 text-blue-800",
        };
      default:
        return {
          text: status,
          className: "bg-gray-100 text-gray-800",
        };
    }
  }

  return (
    <div className="mt-4 space-y-2">
      <details open className="group rounded-lg border border-gray-200">
        <summary className="flex w-full justify-between rounded-lg bg-gray-50 px-4 py-2 text-left text-sm font-medium text-gray-900 hover:bg-gray-100 cursor-pointer">
          <div>
            <h3 className="text-sm font-semibold leading-6">Loan Details</h3>
            <p className="text-xs leading-5 text-gray-500">
              Details of the loan granted to customer
            </p>
          </div>
          <ChevronDownIcon className="h-5 w-5 text-gray-500 group-open:rotate-180 transition-transform" />
        </summary>
        <div className="px-4 pb-2">
          <dl className="grid grid-cols-1 sm:grid-cols-2">
            <div className="border-t border-gray-100 px-4 py-3 sm:col-span-1 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-500">
                Loan Status
              </dt>
              <dd className="mt-0.5 text-sm leading-6 text-gray-900">
                {loan.status === "loan-created"
                  ? `Created`
                  : loan.status === "loan-sent-to-customer"
                  ? `Sent To Customer`
                  : `Signed By Customer`}
              </dd>
            </div>
            <div className="border-t border-gray-100 px-4 py-3 sm:col-span-1 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-500">
                Loan Start Date
              </dt>
              <dd className="mt-0.5 text-sm leading-6 text-gray-900">
                {loan.loanDetails === undefined
                  ? `To Be Specified`
                  : loan.loanDetails.loanStartDate}
              </dd>
            </div>
            <div className="border-t border-gray-100 px-4 py-3 sm:col-span-1 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-500">
                Loan End Date
              </dt>
              <dd className="mt-0.5 text-sm leading-6 text-gray-900">
                {loan.loanDetails === undefined
                  ? `To Be Specified`
                  : loan.loanDetails.loanEndDate}
              </dd>
            </div>
            <div className="border-t border-gray-100 px-4 py-3 sm:col-span-1 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-500">
                Repayment Start Date
              </dt>
              <dd className="mt-0.5 text-sm leading-6 text-gray-900">
                {loan.loanDetails === undefined
                  ? `To Be Specified`
                  : loan.loanDetails.repaymentStartDate}
              </dd>
            </div>
            <div className="border-t border-gray-100 px-4 py-3 sm:col-span-1 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-500">
                Repayment End Date
              </dt>
              <dd className="mt-0.5 text-sm leading-6 text-gray-900">
                {loan.loanDetails === undefined
                  ? `To Be Specified`
                  : loan.loanDetails.repaymentEndDate}
              </dd>
            </div>
            <div className="border-t border-gray-100 px-4 py-3 sm:col-span-1 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-500">
                Loan Establishment Fees
              </dt>
              <dd className="mt-0.5 text-sm leading-6 text-gray-900">
                {loan.loanDetails === undefined
                  ? `To Be Specified`
                  : `$${loan.loanDetails.loanEstablishmentFees.value}`}
              </dd>
            </div>
            <div className="border-t border-gray-100 px-4 py-3 sm:col-span-1 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-500">
                Loan Amount
              </dt>
              <dd className="mt-0.5 text-sm leading-6 text-gray-900">
                {loan.loanDetails === undefined
                  ? `To Be Specified`
                  : `$${loan.loanDetails.loanAmount.value}`}
              </dd>
            </div>
            <div className="border-t border-gray-100 px-4 py-3 sm:col-span-1 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-500">
                Loan Total Repayment Amount
              </dt>
              <dd className="mt-0.5 text-sm leading-6 text-gray-900">
                {loan.loanDetails === undefined
                  ? `To Be Specified`
                  : `$${loan.loanDetails.loanTotalRepaymentAmount.value}`}
              </dd>
            </div>
            <div className="border-t border-gray-100 px-4 py-3 sm:col-span-1 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-500">
                Repayment Installment
              </dt>
              <dd className="mt-0.5 text-sm leading-6 text-gray-900">
                {loan.loanDetails === undefined
                  ? `To Be Specified`
                  : `$${loan.loanDetails.repaymentInstalmentAmount.value}`}
              </dd>
            </div>
            <div className="border-t border-gray-100 px-4 py-3 sm:col-span-1 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-500">
                Final Repayment Installment Amount
              </dt>
              <dd className="mt-0.5 text-sm leading-6 text-gray-900">
                {loan.loanDetails === undefined
                  ? `To Be Specified`
                  : `$${loan.loanDetails.finalRepaymentInstalmentAmount.value}`}
              </dd>
            </div>
          </dl>
        </div>
      </details>

      <details open className="group rounded-lg border border-gray-200">
        <summary className="flex w-full justify-between rounded-lg bg-gray-50 px-4 py-2 text-left text-sm font-medium text-gray-900 hover:bg-gray-100 cursor-pointer">
          <div>
            <h3 className="text-sm font-semibold leading-6">
              Customer Information
            </h3>
            <p className="text-xs leading-5 text-gray-500">
              Information on the customer of this loan
            </p>
          </div>
          <ChevronDownIcon className="h-5 w-5 text-gray-500 group-open:rotate-180 transition-transform" />
        </summary>
        <div className="px-4 pb-4">
          <dl className="grid grid-cols-1 sm:grid-cols-2">
            <div className="border-t border-gray-100 px-4 py-3 sm:col-span-1 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-500">
                Full name
              </dt>
              <dd className="mt-0.5 text-sm leading-6 text-gray-900">
                {loan.customer === undefined
                  ? `To be Specified`
                  : loan.customer.customerFullName}
              </dd>
            </div>
            <div className="border-t border-gray-100 px-4 py-3 sm:col-span-1 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-500">
                Phone Number
              </dt>
              <dd className="mt-0.5 text-sm leading-6 text-gray-900">
                {loan.customer === undefined
                  ? `To Be Specified`
                  : loan.customer.customerPhoneNumber}
              </dd>
            </div>
            <div className="border-t border-gray-100 px-4 py-3 sm:col-span-1 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-500">
                Email
              </dt>
              <dd className="mt-0.5 text-sm leading-6 text-gray-900">
                {loan.customer === undefined
                  ? `To Be Specified`
                  : loan.customer.customerEmail}
              </dd>
            </div>
            <div className="border-t border-gray-100 px-4 py-3 sm:col-span-1 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-500">
                Date of Birth
              </dt>
              <dd className="mt-0.5 text-sm leading-6 text-gray-900">
                {loan.customer === undefined
                  ? `To Be Specified`
                  : loan.customer.customerDateOfBirth}
              </dd>
            </div>
            <div className="border-t border-gray-100 px-4 py-3 sm:col-span-2 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-500">
                Address
              </dt>
              <dd className="mt-0.5 text-sm leading-6 text-gray-900">
                {loan.customer === undefined
                  ? `To Be Specified`
                  : loan.customer.customerAddress}
              </dd>
            </div>
          </dl>
        </div>
      </details>

      <details open className="group rounded-lg border border-gray-200">
        <summary className="flex w-full justify-between rounded-lg bg-gray-50 px-4 py-2 text-left text-sm font-medium text-gray-900 hover:bg-gray-100 cursor-pointer">
          <div>
            <h3 className="text-sm font-semibold leading-6">
              Hardship Details
            </h3>
            <p className="text-xs leading-5 text-gray-500">
              Details of any hardship from the customer associated with this
              loan
            </p>
          </div>
          <ChevronDownIcon className="h-5 w-5 text-gray-500 group-open:rotate-180 transition-transform" />
        </summary>
        <div className="px-4 pb-4">
          {loan.hardship === undefined ? (
            <p className="text-sm text-gray-700 py-3">
              There are no hardships associated with this loan.
            </p>
          ) : (
            <dl className="grid grid-cols-1 sm:grid-cols-2">
              <div className="border-t border-gray-100 px-4 py-3 sm:col-span-1 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-500">
                  Loan Variation Status
                </dt>
                <dd className="mt-0.5 text-sm leading-6 text-gray-900">
                  {loan.hardship?.loanVariationStatus && (
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                          getHardshipStatusDisplay(
                            loan.hardship.loanVariationStatus
                          ).className
                        }`}
                      >
                        {
                          getHardshipStatusDisplay(
                            loan.hardship.loanVariationStatus
                          ).text
                        }
                      </span>
                    </div>
                  )}
                </dd>
              </div>

              <div className="border-t border-gray-100 px-4 py-3 sm:col-span-1 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-500">
                  Circumstance Reason
                </dt>
                <dd className="mt-0.5 text-sm leading-6 text-gray-900">
                  {loan.hardship.circumstanceReason === "expenseRaised"
                    ? "Customer's Expenses Have Raised"
                    : "Customer's Income Has Reduced"}
                </dd>
              </div>
              {/* Add new section for rejection notes */}
              {loan.hardship.rejectionNotes && (
                <div className="border-t border-gray-100 px-4 py-3 sm:col-span-2 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-500">
                    Rejection Notes
                  </dt>
                  <dd className="mt-2 text-sm leading-6 text-gray-900">
                    <div className="rounded-md border border-gray-200 px-4 py-3 bg-red-50">
                      {loan.hardship.rejectionNotes}
                    </div>
                  </dd>
                </div>
              )}
              {loan.hardship.loanVariationStatus === "needsAttention" && (
                <div className="border-t border-gray-100 px-4 py-3 sm:col-span-2 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-red-700">
                    Take appropriate action
                  </dt>
                  <dd className="mt-0.5 text-sm leading-6 text-gray-900">
                    <HardshipActions loanId={loan._id.toString()} />
                  </dd>
                </div>
              )}
              <div className="border-t border-gray-100 px-4 py-3 sm:col-span-2 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-500">
                  Circumstance Explanation
                </dt>
                <dd className="mt-0.5 text-sm leading-6 text-gray-900">
                  {loan.hardship.circumstanceExplanation}
                </dd>
              </div>
              <div className="border-t border-gray-100 px-4 py-3 sm:col-span-2 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-500">
                  Ideal Arrangement
                </dt>
                <dd className="mt-0.5 text-sm leading-6 text-gray-900">
                  {loan.hardship.idealArrangement}
                </dd>
              </div>
              <div className="border-t border-gray-100 px-4 py-3 sm:col-span-2 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-500">
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
                          href={loan.hardship.supportingDocument}
                          target="_blank"
                          className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                          View
                        </Link>
                      </div>
                    </li>
                    {loan.hardship.loanVariationStatus ===
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
                            {/* <span className="flex-shrink-0 text-gray-400">
                              generated with AI
                            </span> */}
                          </div>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          <Link
                            href={`/loans/${loan._id}/hardship`}
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                          >
                            View
                          </Link>
                        </div>
                      </li>
                    )}
                    {loan.hardship.envelopeDetails !== undefined && (
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
                              associated with hardship
                            </span>
                          </div>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          <Link
                            href={`/loans/${loan._id}/hardship`}
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                          >
                            View
                          </Link>
                        </div>
                      </li>
                    )}
                  </ul>
                </dd>
              </div>
            </dl>
          )}
        </div>
      </details>

      <details className="group rounded-lg border border-gray-200">
        <summary className="flex w-full justify-between rounded-lg bg-gray-50 px-4 py-2 text-left text-sm font-medium text-gray-900 hover:bg-gray-100 cursor-pointer">
          <div>
            <h3 className="text-sm font-semibold leading-6">
              Envelope Details
            </h3>
            <p className="text-xs leading-5 text-gray-500">
              Details of the envelope associated in Docusign with sending the
              loan to the customer
            </p>
          </div>
          <ChevronDownIcon className="h-5 w-5 text-gray-500 group-open:rotate-180 transition-transform" />
        </summary>
        <div className="px-4 pb-4">
          <dl className="grid grid-cols-1 sm:grid-cols-2">
            <div className="border-t border-gray-100 px-4 py-3 sm:col-span-1 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-500">
                Envelope Created Date
              </dt>
              <dd className="mt-0.5 text-sm leading-6 text-gray-900">
                {readerFriendlyDateString(loan.createdDateTime)}
              </dd>
            </div>
            <div className="border-t border-gray-100 px-4 py-3 sm:col-span-1 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-500">
                Envelope Sent Date
              </dt>
              <dd className="mt-0.5 text-sm leading-6 text-gray-900">
                {loan.sentDateTime === undefined
                  ? `To Be Specified`
                  : readerFriendlyDateString(loan.sentDateTime)}
              </dd>
            </div>
            <div className="border-t border-gray-100 px-4 py-3 sm:col-span-1 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-500">
                Customer Date Signed
              </dt>
              <dd className="mt-0.5 text-sm leading-6 text-gray-900">
                {loan.customerDateSigned === undefined
                  ? `To Be Specified`
                  : readerFriendlyDateString(loan.customerDateSigned)}
              </dd>
            </div>
            <div className="border-t border-gray-100 px-4 py-6 sm:col-span-2 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-500">
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
                          {loan.envelopeId}
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
      </details>

      <details className="group rounded-lg border border-gray-200">
        <summary className="flex w-full justify-between rounded-lg bg-gray-50 px-4 py-2 text-left text-sm font-medium text-gray-900 hover:bg-gray-100 cursor-pointer">
          <div>
            <h3 className="text-sm font-semibold leading-6">Loan Insurance</h3>
            <p className="text-xs leading-5 text-gray-500">
              Details of the insurance attached to this loan
            </p>
          </div>
          <ChevronDownIcon className="h-5 w-5 text-gray-500 group-open:rotate-180 transition-transform" />
        </summary>

        <div className="px-4 pb-4">
          <div className="border-t border-gray-100 px-4 py-3 sm:col-span-1 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-500">
              Annual Customer Income
            </dt>
            <dd className="mt-0.5 text-sm leading-6 text-gray-900">
              {loan.loanInsurance !== undefined &&
              loan.loanInsurance !== null &&
              loan.loanInsurance.annualCustomerIncome !== undefined &&
              loan.loanInsurance.annualCustomerIncome !== null ? (
                `$${loan.loanInsurance.annualCustomerIncome.value}`
              ) : (
                <CustomerIncomeInput loanId={loan._id.toString()} />
              )}
            </dd>
          </div>
        </div>
      </details>

      <details className="group rounded-lg border border-gray-200">
        <summary className="flex w-full justify-between rounded-lg bg-gray-50 px-4 py-2 text-left text-sm font-medium text-gray-900 hover:bg-gray-100 cursor-pointer">
          <div>
            <h3 className="text-sm font-semibold leading-6">
              Representative Information
            </h3>
            <p className="text-xs leading-5 text-gray-500">
              Details of the representative handling this loan
            </p>
          </div>
          <ChevronDownIcon className="h-5 w-5 text-gray-500 group-open:rotate-180 transition-transform" />
        </summary>
        <div className="px-4 pb-2">
          <dl className="grid grid-cols-1 sm:grid-cols-2">
            <div className="border-t border-gray-100 px-4 py-3 sm:col-span-1 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-500">
                Representative Name
              </dt>
              <dd className="mt-0.5 text-sm leading-6 text-gray-900">
                {loan.representative.name}
              </dd>
            </div>
            <div className="border-t border-gray-100 px-4 py-3 sm:col-span-1 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-500">
                Representative Email
              </dt>
              <dd className="mt-0.5 text-sm leading-6 text-gray-900">
                {loan.representative.email}
              </dd>
            </div>
          </dl>
        </div>
      </details>
    </div>
  );
}

"use server";

import { getLoansFromDbAsync } from "@/lib/db/dbFetcher";
import { isDbFetcherError } from "@/lib/db/models/loans";
import Link from "next/link";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

export default async function LoansPage() {
  const loansInDb = await getLoansFromDbAsync();

  if (isDbFetcherError(loansInDb)) {
    return (
      <div className="text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="mx-auto h-12 w-12 text-gray-400"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-semibold text-gray-900">
          {`Oops! An Error`}
        </h3>
        <p className="mt-1 text-sm text-gray-500">{loansInDb.errorMessage}</p>
      </div>
    );
  }

  const sortedLoans = [...loansInDb].sort((a, b) => {
    const aNeeds =
      a.hardship?.loanVariationStatus === "needsAttention"
        ? 1
        : a.hardship?.loanVariationStatus === "variationGenerated"
        ? 0
        : -1;
    const bNeeds =
      b.hardship?.loanVariationStatus === "needsAttention"
        ? 1
        : b.hardship?.loanVariationStatus === "variationGenerated"
        ? 0
        : -1;
    return bNeeds - aNeeds;
  });

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="flow-root">
        <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle">
            <table className="min-w-full border-separate border-spacing-0">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="sticky top-0 z-10 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell"
                  >
                    Loan Amount
                  </th>
                  <th
                    scope="col"
                    className="sticky top-0 z-10 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter lg:table-cell"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-3 pr-4 backdrop-blur backdrop-filter sm:pr-6 lg:pr-8"
                  >
                    <span className="sr-only">Details</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedLoans.map((loan, loanIdx) => (
                  <tr
                    key={loan._id.toString()}
                    className={`${
                      loan.hardship?.loanVariationStatus === "needsAttention"
                        ? "bg-red-50"
                        : loan.hardship?.loanVariationStatus ===
                          "variationGenerated"
                        ? "bg-yellow-50"
                        : ""
                    } hover:bg-gray-50`}
                  >
                    <td
                      className={`${
                        loanIdx !== loansInDb.length - 1
                          ? "border-b border-gray-200"
                          : ""
                      } whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8`}
                    >
                      {loan.customer !== undefined
                        ? loan.customer!.customerFullName
                        : `To Be Specified`}
                    </td>
                    <td
                      className={`${
                        loanIdx !== loansInDb.length - 1
                          ? "border-b border-gray-200"
                          : ""
                      } whitespace-nowrap hidden px-3 py-4 text-sm text-gray-500 sm:table-cell`}
                    >
                      {loan.loanDetails !== undefined
                        ? `$${loan.loanDetails!.loanAmount.value}`
                        : `To Be Specified`}
                    </td>
                    <td
                      className={`${
                        loanIdx !== loansInDb.length - 1
                          ? "border-b border-gray-200"
                          : ""
                      } whitespace-nowrap hidden px-3 py-4 text-sm text-gray-500 lg:table-cell`}
                    >
                      {loan.customer !== undefined
                        ? loan.customer.customerEmail
                        : `To Be Specified`}
                    </td>
                    <td
                      className={`${
                        loanIdx !== loansInDb.length - 1
                          ? "border-b border-gray-200"
                          : ""
                      } whitespace-nowrap px-3 py-4 text-sm text-gray-500`}
                    >
                      <div className="flex items-center gap-2">
                        {loan.status === "loan-created"
                          ? "Created"
                          : loan.status === "loan-signed-by-customer"
                          ? "Signed"
                          : "Sent"}

                        {(loan.hardship?.loanVariationStatus ===
                          "needsAttention" ||
                          loan.hardship?.loanVariationStatus ===
                            "variationGenerated") && (
                          <div className="relative group">
                            <ExclamationTriangleIcon
                              className={`h-5 w-5 ${
                                loan.hardship.loanVariationStatus ===
                                "needsAttention"
                                  ? "text-red-500"
                                  : "text-yellow-500"
                              }`}
                            />
                            <div className="invisible group-hover:visible absolute z-10 w-96 -translate-x-1/2 left-1/2 mt-2">
                              <div className="px-3 py-2 text-sm bg-white shadow-lg ring-1 ring-gray-900/5 rounded-lg">
                                <div className="flex gap-2 items-start">
                                  <ExclamationTriangleIcon
                                    className={`h-5 w-5 flex-shrink-0 ${
                                      loan.hardship.loanVariationStatus ===
                                      "needsAttention"
                                        ? "text-red-500"
                                        : "text-yellow-500"
                                    }`}
                                  />
                                  <div className="flex-1 break-words">
                                    <p className="text-gray-900 leading-5 whitespace-normal">
                                      {loan.hardship.loanVariationStatus ===
                                      "needsAttention"
                                        ? "This hardship request requires immediate attention. Manual review and action needed to process the customer's request."
                                        : "A variation contract has been generated and is ready to be reviewed and sent to the customer. Please review and send it as soon as possible."}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                    <td
                      className={`${
                        loanIdx !== loansInDb.length - 1
                          ? "border-b border-gray-200"
                          : ""
                      } relative whitespace-nowrap py-4 pr-4 pl-3 text-right text-sm font-medium sm:pr-8 lg:pr-8`}
                    >
                      <Link
                        href={`/loans/${loan._id.toString()}`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Details
                        <span className="sr-only">
                          ,{" "}
                          {loan.customer !== undefined
                            ? loan.customer.customerFullName
                            : `To Be Specified`}
                        </span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

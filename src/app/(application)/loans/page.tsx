"use server";

import { classNames } from "@/lib/classUtils";
import { getLoansFromDbAsync } from "@/lib/db/dbFetcher";
import { isDbFetcherError } from "@/lib/db/models/loans";
import Link from "next/link";

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
        <p className="mt-1 text-sm text-gray-500">
            {loansInDb.errorMessage}
        </p>
      </div>
    );
  }

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
                {loansInDb.map((loan, loanIdx) => (
                  <tr key={loan._id.toString()}>
                    <td
                      className={classNames(
                        loanIdx !== loansInDb.length - 1
                          ? "border-b border-gray-200"
                          : "",
                        "whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8"
                      )}
                    >
                      {loan.customer !== undefined ? loan.customer!.customerFullName : `To Be Specified`}
                    </td>
                    <td
                      className={classNames(
                        loanIdx !== loansInDb.length - 1
                          ? "border-b border-gray-200"
                          : "",
                        "whitespace-nowrap hidden px-3 py-4 text-sm text-gray-500 sm:table-cell"
                      )}
                    >
                      {loan.loanDetails !== undefined ? `$${loan.loanDetails!.loanAmount.value}` : `To Be Specified`}
                    </td>
                    <td
                      className={classNames(
                        loanIdx !== loansInDb.length - 1
                          ? "border-b border-gray-200"
                          : "",
                        "whitespace-nowrap hidden px-3 py-4 text-sm text-gray-500 lg:table-cell"
                      )}
                    >
                      {loan.customer !== undefined ? loan.customer.customerEmail :  `To Be Specified`}
                    </td>
                    <td
                      className={classNames(
                        loanIdx !== loansInDb.length - 1
                          ? "border-b border-gray-200"
                          : "",
                        "whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                      )}
                    >
                      {loan.status === "loan-created" ? `Created` : loan.status === "loan-signed-by-customer" ? `Signed` : `Sent` }
                    </td>
                    <td
                      className={classNames(
                        loanIdx !== loansInDb.length - 1
                          ? "border-b border-gray-200"
                          : "",
                        "relative whitespace-nowrap py-4 pr-4 pl-3 text-right text-sm font-medium sm:pr-8 lg:pr-8"
                      )}
                    >
                      <Link
                        href={`/loans/${loan._id.toString()}`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Details<span className="sr-only">, {loan.customer !== undefined ? loan.customer.customerFullName : `To Be Specified`}</span>
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

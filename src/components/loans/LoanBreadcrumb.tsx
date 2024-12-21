"use client";

import { ChevronRightIcon, HomeIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";

type OnlyLoanDetails = {
  type: "only-loan-details";
  loanId: string;
};

type LoanDetailsWithSlug = {
  type: "loan-details-with-slug";
  loanId: string;
  slug: "customer" | "hardship";
};

function parseLoanPath(path: string): OnlyLoanDetails | LoanDetailsWithSlug {
  // Remove leading and trailing slashes and split path
  const cleanPath = path.replace(/^\/+|\/+$/g, "");
  const parts = cleanPath.split("/");

  // If we only have loans/[loanId]
  if (parts.length === 2) {
    return {
      type: "only-loan-details",
      loanId: parts[1],
    };
  }

  // If we have loans/[loanId]/[slug]
  return {
    type: "loan-details-with-slug",
    loanId: parts[1],
    slug: parts[2].startsWith("customer") ? "customer" : "hardship",
  };
}

export default function LoanBreadcrumb() {
  const pathname = usePathname();
  const parsedResult = parseLoanPath(pathname);
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol role="list" className="flex items-center space-x-4">
        <li>
          <div>
            <Link href="/loans" className="text-gray-400 hover:text-gray-500">
              <HomeIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
              <span className="sr-only">Home</span>
            </Link>
          </div>
        </li>

        <li key={parsedResult.loanId}>
          <div className="flex items-center">
            <ChevronRightIcon
              className="h-5 w-5 flex-shrink-0 text-gray-400"
              aria-hidden="true"
            />
            <Link
              href={`/loans/${parsedResult.loanId}`}
              className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
              aria-current={"page"}
            >
              {parsedResult.loanId}
            </Link>
          </div>
        </li>

        {parsedResult.type === "loan-details-with-slug" && (
          <li key={parsedResult.slug}>
            <div className="flex items-center">
              <ChevronRightIcon
                className="h-5 w-5 flex-shrink-0 text-gray-400"
                aria-hidden="true"
              />
              <Link
                href={`/loans/${parsedResult.loanId}/${parsedResult.slug}`}
                className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                aria-current={"page"}
              >
                {parsedResult.slug === "customer" ? `Customer` : `Hardship`}
              </Link>
            </div>
          </li>
        )}
      </ol>
    </nav>
  );
}

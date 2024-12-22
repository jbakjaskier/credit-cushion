import TemplateLoader from "@/components/products/TemplateLoader";
import { classNames } from "@/lib/classUtils";
import { getTemplateForAccount } from "@/lib/db/dbFetcher";
import { isDbFetcherError } from "@/lib/db/models/loans";
import { BanknotesIcon } from "@heroicons/react/24/outline";

export const maxDuration = 300;

export default async function ProductsPage() {
  const templateInDb = await getTemplateForAccount();

  return (
    <div
      key={`Personal Loan Document`}
      className={"group relative bg-white p-6"}
    >
      <div>
        <span
          className={classNames(
            `text-yellow-700`,
            `bg-yellow-50`,
            "inline-flex rounded-lg p-3 ring-4 ring-white"
          )}
        >
          <BanknotesIcon className="h-6 w-6" aria-hidden="true" />
        </span>
      </div>
      <div className="mt-4">
        <h3 className="text-base font-semibold leading-6 text-gray-900">
          {`Personal Loan Template`}
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          {`This is the template for the personal loan document that you can send to your customers, who apply for a personal loan with your company`}
        </p>
      </div>
      {isDbFetcherError(templateInDb) ? (
        <p className="text-sm text-red-500">{templateInDb.errorMessage}</p>
      ) : (
        <TemplateLoader
          isLoadedInDocusign={templateInDb === null ? false : true}
        />
      )}
    </div>
  );
}

import LoanBreadcrumb from "@/components/loans/LoanBreadcrumb";
import LoanErrorState from "@/components/loans/LoanErrorState";
import LoanChatWidget from "@/components/loans/LoanChatWidget";
import { getLoanFromDbAsync } from "@/lib/db/dbFetcher";
import { isDbFetcherError } from "@/lib/db/models/loans";
import { ObjectId } from "mongodb";
import LoanDetailsAccordions from "@/components/loans/LoanDetailsAccordions";

export default async function LoanDetailsPage({
  params,
}: {
  params: Promise<{ loanId: string }>;
}) {
  const loanId = (await params).loanId;

  const loanInDb = ObjectId.isValid(loanId)
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
        <>
          <LoanDetailsAccordions loan={loanInDb} />
          {(loanInDb.status === "loan-sent-to-customer" ||
            loanInDb.status === "loan-signed-by-customer") && (
            <LoanChatWidget loan={loanInDb} />
          )}
        </>
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

import { Loan } from "@/lib/db/models/loans";
import LoanChatWidgetClient from "./LoanChatWidgetClient";

export default function LoanChatWidget({ loan }: { loan: Loan }) {
  return <LoanChatWidgetClient loanId={loan._id.toString()} />;
}

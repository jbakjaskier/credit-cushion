"use client";

import { LoanInsuranceDetail } from "@/lib/db/models/loans";
import Button from "../common/Button";

export default function LoanInsuranceGenerator({
  loanId,
  loanInsuranceContent,
  insuranceStatus,
  envelopeDetails
}: Omit<LoanInsuranceDetail, "annualCustomerIncome"> & { loanId: string }) {
  return <div>

    {loanInsuranceContent === undefined && <Button> Generate Policy Document </Button>}

    {loanInsuranceContent !== undefined && insuranceStatus === "generated" && <p>{`Contract Generated. Here is the editor`}</p>}


    {loanInsuranceContent !== undefined && insuranceStatus === "sentToCustomer" && <p>{`Envelope Details to be Displayed here`}</p>}
    
    

  </div>;
}

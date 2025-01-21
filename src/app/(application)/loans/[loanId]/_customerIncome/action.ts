"use server";
import { z } from "zod";

import { CustomerIncomeInputState } from "@/components/loans/CustomerIncomeInput";
import { addAnnualCustomerIncome } from "@/lib/db/dbFetcher";

const zodValidator = z.object({
  annualIncome: z
    .string()
    .trim()
    .min(1, { message: "The annual income cannot be empty" })
    .refine((val) => Number.isNaN(val) === false, {
      message: "Please make sure the annual income is a number",
    }),
});

export async function saveCustomerIncome(
  prevState: CustomerIncomeInputState,
  formData: FormData
): Promise<CustomerIncomeInputState> {
  const formattedFormData = await zodValidator.safeParseAsync({
    annualIncome: formData.get("annualIncome"),
  });

  if (!formattedFormData.success) {
    return {
      mode: "error",
      errorMessage: formattedFormData.error.message,
      loanId: prevState.loanId,
    };
  }
  //Save in database
  const dbWriteResult = await addAnnualCustomerIncome(
    {
      currency: "aud",
      value: Number(formattedFormData.data.annualIncome),
    },
    prevState.loanId
  );

  if (dbWriteResult.mode === "error") {
    return {
      mode: "error",
      errorMessage: dbWriteResult.errorMessage,
      loanId: prevState.loanId,
    };
  }

  return {
    mode: "success",
    loanId: prevState.loanId,
    annualCustomerIncome: {
        currency: "aud",
        value: Number(formattedFormData.data.annualIncome)
    }
  };
}

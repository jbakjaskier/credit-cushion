import { ObjectId } from "mongodb";

export const loanCollectionName = "loans";

export interface Loan {
    _id: ObjectId;
    sentDateTime?: Date;
    createdDateTime: Date;
    completedDateTime?: Date;
    envelopeId: string;
    envelopeUri: string;
    accountId: string;
    emailDetails : {
        emailBlurb: string;
        emailSubject: string;
    };
    status: "loan-created" | "loan-sent-to-customer" | "loan-signed-by-customer";
    representative : {
        email: string;
        name: string;
    };
    customer?: {
        customerEmail: string;
        customerFullName: string;
        customerPhoneNumber: string;
        customerDateOfBirth: string;
        customerAddress: string;
    };
    loanDetails?: {
        loanStartDate: string;
        loanEndDate: string;
        repaymentStartDate: string;
        repaymentEndDate: string;
        loanEstablishmentFees: Money;
        loanAmount: Money;
        loanTotalRepaymentAmount: Money;
        repaymentInstalmentAmount: Money;
        finalRepaymentInstalmentAmount: Money;
    }
    customerDateSigned?: Date;   
    lastUpdated: Date;
    hardship?: CustomerHardship
}

export type CustomerHardship = {
    circumstanceReason: string;
    circumstanceExplanation: string;
    idealArrangement: string;
    supportingDocument: string;
    loanVariationStatus: 
    "hardshipResolved" |
    "needsAttention" |
     "variationGenerated" | 
     "variationSentToCustomer" 
    variatedContractContent?: string;
    envelopeDetails? : CustomerHardshipEnvelope;
}


export type CustomerHardshipEnvelope = {
    envelopeId: string;
    envelopeUri: string;
    envelopeStatus: string,
    lastUpdated: Date;
}

type Money = {
    value: number;
    currency: "aud"; //Currently we only support AUD financial providers. Must be updated later
}


export type DbWriteOperationSuccessResult = {
    mode: "success"
} 


export type DbWriteOperationErrorResult = {
    mode: "error",
    errorMessage: string;
}

export type DbFetcherError = {
    errorMessage: string;
  };


export function isDbWriteOperationErrorResult(input: DbWriteOperationErrorResult | DbWriteOperationSuccessResult) : input is DbWriteOperationErrorResult {
    return input.mode === "error";
}


  export function isDbFetcherError(input: DbFetcherError | Loan | Loan[] | null) : input is DbFetcherError {

    if(input === null) {
        return false
    }

    return "errorMessage" in input;
  }
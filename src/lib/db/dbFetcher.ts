"use server";

import { ObjectId } from "mongodb";
import {
  DbFetcherError,
  DbWriteOperationErrorResult,
  DbWriteOperationSuccessResult,
  Loan,
  loanCollectionName,
} from "./models/loans";
import clientPromise, { dbName } from "./mongodb";
import { EnvelopeCreatedResult } from "../fetcher/envelope";

export async function updateVariationofContractContent(
  loanId: string,
  updatedVoC: string
): Promise<DbWriteOperationSuccessResult | DbWriteOperationErrorResult> {
  try {
    const loanCollection = (await clientPromise)
      .db(dbName)
      .collection<Loan>(loanCollectionName);

    await loanCollection.updateOne(
      {
        _id: new ObjectId(loanId),
      },
      {
        $set: {
          lastUpdated: new Date(),
          "hardship.variatedContractContent": updatedVoC,
        },
      }
    );

    return {
      mode: "success"
    }
  } catch (error: unknown) {
    if (typeof error === "string") {
      return {
        mode: "error",
        errorMessage: error,
      };
    }

    if (error instanceof Error) {
      return {
        mode: "error",
        errorMessage: error.message,
      };
    }

    return {
      mode: "error",
      errorMessage: `Something went wrong while updating the variation of contract. Please try again in a bit`,
    };
  }
}

export async function getLoanFromDbAsync(
  loanId: ObjectId
): Promise<Loan | DbFetcherError> {
  try {
    const loanCollection = (await clientPromise)
      .db(dbName)
      .collection<Loan>(loanCollectionName);

    const loanInDb = await loanCollection.findOne({
      _id: loanId,
    });

    if (loanInDb === null) {
      return {
        errorMessage: `There is no loan present with that ID`,
      };
    }

    return loanInDb!;
  } catch (error: unknown) {
    if (typeof error === "string") {
      return {
        errorMessage: error,
      };
    }

    if (error instanceof Error) {
      return {
        errorMessage: error.message,
      };
    }

    return {
      errorMessage: `Something went wrong while fetching your loan information. Please try again in a bit`,
    };
  }
}

export async function addEnvelopeToHardship(
  loanId: string,
  envelopeCreatedResult: EnvelopeCreatedResult
): Promise<DbWriteOperationSuccessResult | DbWriteOperationErrorResult> {
  try {
    const loanCollection = (await clientPromise)
      .db(dbName)
      .collection<Loan>(loanCollectionName);

    const currentDateTime = new Date();

    await loanCollection.updateOne(
      {
        _id: new ObjectId(loanId),
      },
      {
        $set: {
          lastUpdated: currentDateTime,
          "hardship.loanVariationStatus": "variationSentToCustomer",
          "hardship.envelopeDetails.envelopeId":
            envelopeCreatedResult.envelopeId,
          "hardship.envelopeDetails.envelopeStatus":
            envelopeCreatedResult.status,
          "hardship.envelopeDetails.envelopeUri": envelopeCreatedResult.uri,
          "hardship.envelopeDetails.lastUpdated": currentDateTime,
        },
      }
    );

    return {
      mode: "success",
    };
  } catch (error: unknown) {
    if (typeof error === "string") {
      return {
        mode: "error",
        errorMessage: error,
      };
    }

    if (error instanceof Error) {
      return {
        mode: "error",
        errorMessage: error.message,
      };
    }

    return {
      mode: "error",
      errorMessage: `Something went wrong while writing your loan information. Please try again in a bit`,
    };
  }
}

export async function getLoansFromDbAsync(): Promise<Loan[] | DbFetcherError> {
  try {
    const loanCollection = (await clientPromise)
      .db(dbName)
      .collection<Loan>(loanCollectionName);

    const loans = await loanCollection.find().toArray();

    if (loans.length === 0) {
      return {
        errorMessage: `There are no loans to display. Please make sure that you send some loan agreements to your customers from DocuSign, before checking them on here with credit cushion`,
      };
    }

    return loans;
  } catch (error: unknown) {
    if (typeof error === "string") {
      return {
        errorMessage: error,
      };
    }

    if (error instanceof Error) {
      return {
        errorMessage: error.message,
      };
    }

    return {
      errorMessage: `Something went wrong while fetching your loans. Please try again in a bit`,
    };
  }
}

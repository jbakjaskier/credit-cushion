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

export async function getLoanFromDbAsync(
  loanId: ObjectId
): Promise<Loan | DbFetcherError | null> {
  try {
    const loanCollection = (await clientPromise)
      .db(dbName)
      .collection<Loan>(loanCollectionName);

    const loanInDb = await loanCollection.findOne({
      _id: loanId,
    });

    return loanInDb;
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
  loanId: ObjectId,
  envelopeCreatedResult: EnvelopeCreatedResult
): Promise<DbWriteOperationSuccessResult | DbWriteOperationErrorResult> {
  try {
    const loanCollection = (await clientPromise)
      .db(dbName)
      .collection<Loan>(loanCollectionName);

    const currentDateTime = new Date();

    await loanCollection.updateOne(
      {
        _id: loanId,
      },
      {
        $set: {
          lastUpdated: currentDateTime,
          "hardship.loanVariationStatus" : "variationSentToCustomer",
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

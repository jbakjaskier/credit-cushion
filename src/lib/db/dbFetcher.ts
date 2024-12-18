"use server";

import { ObjectId } from "mongodb";
import { DbFetcherError, Loan, loanCollectionName } from "./models/loans";
import clientPromise, { dbName } from "./mongodb";



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

export async function getLoansFromDbAsync(): Promise<
  Loan[] | DbFetcherError
> {
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

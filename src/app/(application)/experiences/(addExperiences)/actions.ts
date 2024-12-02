"use server";
import { GetFareHarbourItemsForCompany } from "@/lib/api/fareharbour/fetcher/FareHarbourFetcher";
import { FareHarbourCompany } from "@/lib/api/fareharbour/models/FareHarbourCompany";
import { FareHarbourItemsResult } from "@/lib/api/fareharbour/models/FareHarbourItem";
import { GetRezdySearchResultsFromMarketPlace } from "@/lib/api/rezdy/fetcher/RezdyFetcher";
import { RezdyProductProductSearchResult } from "@/lib/api/rezdy/models/ProductSearchResult";

type UrlValidationResult =
  | {
      mode: "success";
      data:
        | {
            company: FareHarbourCompany;
            items: FareHarbourItemsResult;
          }
        | RezdyProductProductSearchResult;
    }
  | {
      mode: "error";
      input: string | undefined;
      errorMessage: string;
    }
  | {
      mode: "initial";
    };
    
export async function validateExperienceForm(
  prevState: UrlValidationResult,
  formData: FormData
): Promise<UrlValidationResult> {
  const input = formData.get("url");
  const platform = formData.get("platform");

  if (!input?.toString()?.trim()) {
    return {
      mode: "error",
      input: undefined,
      errorMessage: `Please enter a value before submitting`
    };
  }

  
  if (platform?.toString() === "rezdy") {
    const rezdyResult = await GetRezdySearchResultsFromMarketPlace(input.toString());

    if(rezdyResult.isSuccessful) {
      return {
        mode: "success",
        data: rezdyResult.data
      }
    } else {
      return {
        mode: "error",
        input: input.toString(),
        errorMessage: rezdyResult.errorMessage
      }
    }
  } else {
    //This is fareharbour call
    const fareHarbourResult = await GetFareHarbourItemsForCompany(input.toString());

    if(fareHarbourResult.isSuccessful) {
      return {
        mode: "success",
        data: fareHarbourResult.data
      }
    } else {
      return {
        mode: "error",
        input: input.toString(),
        errorMessage: fareHarbourResult.errorMessage
      }
    }
  }
}

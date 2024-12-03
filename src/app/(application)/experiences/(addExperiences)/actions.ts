"use server";

import { GetFareHarbourItemsForCompany } from "@/lib/api/fareharbour/fetcher/FareHarbourFetcher";
import { GetRezdySearchResultsFromMarketPlace } from "@/lib/api/rezdy/fetcher/RezdyFetcher";
import { UrlValidationResult, ExperienceData } from "./types";

const createErrorResult = (
  input: string | undefined,
  message: string
): UrlValidationResult => ({
  mode: "error",
  input,
  errorMessage: message,
});

const createSuccessResult = (data: ExperienceData): UrlValidationResult => ({
  mode: "success",
  data,
});

export async function validateExperienceForm(
  prevState: UrlValidationResult,
  formData: FormData
): Promise<UrlValidationResult> {
  const input = formData.get("url")?.toString().trim();
  const platform = formData.get("platform")?.toString();

  if (!input) {
    return createErrorResult(
      undefined,
      "Please enter a value before submitting"
    );
  }

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  try {
    const result =
      platform === "rezdy"
        ? await GetRezdySearchResultsFromMarketPlace(input)
        : await GetFareHarbourItemsForCompany(input);

    return result.isSuccessful
      ? createSuccessResult(result.data)
      : createErrorResult(input, result.errorMessage);
  } catch (error) {
    console.error("Experience validation error:", error);
    return createErrorResult(
      input,
      "An unexpected error occurred while validating your experience"
    );
  }
}

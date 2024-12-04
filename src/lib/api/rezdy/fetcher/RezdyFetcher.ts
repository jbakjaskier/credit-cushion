import {
  RezdyProductProductSearchResult,
  RezdySelectableExperience,
} from "../models/ProductSearchResult";
import { API_ENDPOINTS } from "@/config/constants";
import { RezdyCompanyResult } from "../models/RezdyCompanyResult";

export const delay = (delayInms: number) => {
  return new Promise((resolve) => setTimeout(resolve, delayInms));
};

const REZDY_API_KEY = process.env.REZDY_API_KEY;

export async function GetRezdySearchResultsFromMarketPlace(
  searchTerm: string
): Promise<
  | {
      isSuccessful: true;
      data: RezdySelectableExperience[];
    }
  | {
      isSuccessful: false;
      errorMessage: string;
    }
> {
  if (!REZDY_API_KEY) {
    return {
      isSuccessful: false,
      errorMessage: "Rezdy API key not configured",
    };
  }

  await delay(2000); //TODO: To simulate loading - Remove when app is completed
  //This currently returns test data
  if (searchTerm === "validRezdy") {
    return {
      isSuccessful: true,
      data: [
        {
          provider: "rezdy",
          experience: {
            productType: "TICKET",
            name: "National Park pass",
            shortDescription: "National park multiday pass",
            description:
              "National park multiday entry pass, which can be used any time within 2 years from the purchase date for a single entry.",
            productCode: "P00TNX",
            supplierId: 13398,
            supplierAlias: "apispecificationdemosupplierdonotedit",
            supplierName: "API specification demo supplier (DO NOT EDIT)",
            timezone: "Australia/Sydney",
            priceOptions: [
              {
                price: 30,
                label: "Adult",
                id: 929162,
                productCode: "P00TNX",
              },
              {
                price: 15,
                label: "Child",
                id: 929161,
                productCode: "P00TNX",
              },
            ],
            currency: "AUD",
            images: [
              {
                id: 22654,
                itemUrl:
                  "https://img.rezdy-staging.com/PRODUCT_IMAGE/13398/IMG_5098__1_.jpg",
                thumbnailUrl:
                  "https://img.rezdy-staging.com/PRODUCT_IMAGE/13398/IMG_5098__1__tb.jpg",
              },
              {
                id: 22655,
                itemUrl:
                  "https://img.rezdy-staging.com/PRODUCT_IMAGE/13398/IMG_5176.jpg",
                thumbnailUrl:
                  "https://img.rezdy-staging.com/PRODUCT_IMAGE/13398/IMG_5176_tb.jpg",
              },
              {
                id: 22656,
                itemUrl:
                  "https://img.rezdy-staging.com/PRODUCT_IMAGE/13398/IMG_5022.jpg",
                thumbnailUrl:
                  "https://img.rezdy-staging.com/PRODUCT_IMAGE/13398/IMG_5022_tb.jpg",
              },
              {
                id: 22658,
                itemUrl:
                  "https://img.rezdy-staging.com/PRODUCT_IMAGE/13398/a6ab4016937d4f82b8bc0d9c3cb82bf6IMG_20190415_172800.jpg",
                thumbnailUrl:
                  "https://img.rezdy-staging.com/PRODUCT_IMAGE/13398/a6ab4016937d4f82b8bc0d9c3cb82bf6IMG_20190415_172800_tb.jpg",
              },
            ],
            locationAddress: {
              addressLine: "Langtang valley",
              postCode: "",
              city: "",
              state: "",
              countryCode: "np",
              latitude: 28.2062873,
              longitude: 85.62292959999999,
            },
            latitude: 28.2062873,
            longitude: 85.62292959999999,
          },
          company: {
            alias: "apispecificationdemosupplierdonotedit",
            companyName: "API specification demo supplier (DO NOT EDIT)",
            firstName: "Dusan",
            lastName: "Zahoransky",
            address: {
              addressLine: "123 CommonwWealth Street",
              postCode: "2000",
              city: "Sydney",
              state: "NSW",
              countryCode: "au",
              latitude: -33.880562,
              longitude: 151.2106793,
            },
            destinationName: "Sydney",
            destinationCountryCode: "au",
            destinationPath: "South Pacific,Australia,New South Wales,Sydney",
            currency: "AUD",
            locale: "en_au",
            timezone: "Australia/Sydney",
            category: "Eco-Tours",
            companyDescription: "Rezdy API demo supplier.",
            phone: "+61484123456",
            mobile: "+61484123456",
          },
        },
      ],
    };
  } else {
    try {
      const searchItemResponse = await fetch(
        `${API_ENDPOINTS.REZDY.BASE}/${API_ENDPOINTS.REZDY.MARKETPLACE}?` +
          new URLSearchParams({
            apiKey: REZDY_API_KEY!,
            search: searchTerm,
          }),
        {
          method: "GET",
        }
      );

      if (!searchItemResponse.ok) {
        return {
          isSuccessful: false,
          errorMessage: `We were unable to get the products from rezdy. Please try again in a bit`,
        };
      }

      const searchItemResponseJson =
        (await searchItemResponse.json()) as RezdyProductProductSearchResult;

      if (!searchItemResponseJson.requestStatus.success) {
        return {
          isSuccessful: false,
          errorMessage: `We were unable to get the products from rezdy. Please try again in a bit`,
        };
      }

      if (searchItemResponseJson.products.length === 0) {
        return {
          isSuccessful: false,
          errorMessage: `You don't seem to have any product to sell on rezdy`,
        };
      }

      const selectableExperiences: RezdySelectableExperience[] =
        await Promise.all(
          searchItemResponseJson.products.map(async (rezdyProduct) => {
            const rezdyCompanyNetworkResult = await fetch(
              `${API_ENDPOINTS.REZDY.BASE}/${API_ENDPOINTS.REZDY.COMPANY}/${rezdyProduct.supplierName}?` +
                new URLSearchParams({
                  apiKey: REZDY_API_KEY!,
                }),
              {
                method: "GET",
              }
            );

            if (!rezdyCompanyNetworkResult.ok) {
              throw new Error(
                `Unable to get the company result for experience`
              );
            }

            const rezdyCompanyResult =
              (await rezdyCompanyNetworkResult.json()) as RezdyCompanyResult;

            return {
              provider: "rezdy",
              experience: rezdyProduct,
              company: rezdyCompanyResult.companies[0],
            };
          })
        );

      return {
        isSuccessful: true,
        data: selectableExperiences,
      };
    } catch (error: unknown) {
      if (typeof error === "string") {
        return {
          isSuccessful: false,
          errorMessage: error,
        };
      } else if (error instanceof Error) {
        return {
          isSuccessful: false,
          errorMessage: error.message,
        };
      }

      return {
        isSuccessful: false,
        errorMessage: `We were unable to get the products from rezdy. Please try again in a bit`,
      };
    }
  }
}

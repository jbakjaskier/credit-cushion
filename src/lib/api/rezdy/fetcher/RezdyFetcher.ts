import { RezdyProductProductSearchResult } from "../models/ProductSearchResult";

export async function GetRezdySearchResultsFromMarketPlace(
  searchTerm: string
): Promise<
  | {
      isSuccessful: true;
      data: RezdyProductProductSearchResult;
    }
  | {
      isSuccessful: false;
      errorMessage: string;
    }
> {
  //This currently returns test data
  if (searchTerm === "validRezdy") {
    return {
      isSuccessful: true,
      data: {
        requestStatus: {
          success: true,
          version: "v1",
        },
        products: [
          {
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
        ],
      },
    };
  } else {
    try {
      const searchItemResponse = await fetch(
        `${process.env.REZDY_BASE_URL}/v1/products/marketplace?` +
          new URLSearchParams({
            apiKey: process.env.REZDY_API_KEY!,
            search: searchTerm,
          }),
        {
          method: "GET",
        }
      );

      if (!searchItemResponse.ok) {
        return {
          isSuccessful: false,
          errorMessage: `We were unable to get the products from FareHarbour. Please try again in a bit`,
        };
      }

      const searchItemResponseJson =
        (await searchItemResponse.json()) as RezdyProductProductSearchResult;

      if (!searchItemResponseJson.requestStatus.success) {
        return {
          isSuccessful: false,
          errorMessage: `We were unable to get the products from FareHarbour. Please try again in a bit`,
        };
      }

      if (searchItemResponseJson.products.length === 0) {
        return {
          isSuccessful: false,
          errorMessage: `You don't seem to have any product to sell on FareHarbour`,
        };
      }

      return {
        isSuccessful: true,
        data: searchItemResponseJson,
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
        errorMessage: `We were unable to get the products from FareHarbour. Please try again in a bit`,
      };
    }
  }
}

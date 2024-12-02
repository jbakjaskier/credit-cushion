import { RezdyProductProductSearchResult } from "../models/ProductSearchResult";




export async function GetRezdySearchResultsFromMarketPlace(searchTerm: string) : Promise<{
    isSuccessful: true,
    data: RezdyProductProductSearchResult
} | {
    isSuccessful: false,
    errorMessage: string
}> {
    try {
        const searchItemResponse = await fetch(`${process.env.REZDY_BASE_URL}/v1/products/marketplace?` + new URLSearchParams({
            apiKey: process.env.REZDY_API_KEY!,
            search: searchTerm
        }), {
            method: "GET",
        });

        if(!searchItemResponse.ok) {
            return {
                isSuccessful: false,
                errorMessage: `We were unable to get the products from FareHarbour. Please try again in a bit`
            }
        }

        const searchItemResponseJson = await searchItemResponse.json() as RezdyProductProductSearchResult;

        if(!searchItemResponseJson.requestStatus.success) {
            return {
                isSuccessful: false,
                errorMessage: `We were unable to get the products from FareHarbour. Please try again in a bit`
            }
        }

        if(searchItemResponseJson.products.length === 0) {
            return {
                isSuccessful: false,
                errorMessage: `You don't seem to have any product to sell on FareHarbour`
            }
        }

        return {
            isSuccessful: true,
            data: searchItemResponseJson
        }
    } catch (error: unknown) {
        if(typeof error === "string") {
            return {
                isSuccessful: false,
                errorMessage: error
            }
        } else if (error instanceof Error) {
            return {
                isSuccessful: false,
                errorMessage: error.message
            }
        }

        return {
            isSuccessful: false,
            errorMessage: `We were unable to get the products from FareHarbour. Please try again in a bit`
        }
    }

}
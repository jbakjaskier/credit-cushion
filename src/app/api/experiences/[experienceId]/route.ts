import { NextRequest, NextResponse } from "next/server";
import { GetFareHarbourItemsForCompany } from "@/lib/api/fareharbour/fetcher/FareHarbourFetcher";
import { GetRezdySearchResultsFromMarketPlace } from "@/lib/api/rezdy/fetcher/RezdyFetcher";
import { mapToExperience } from "@/lib/services/experienceService";

export async function GET(
  request: NextRequest,
) {
  try {
    const experienceId = request.nextUrl.pathname.split('/').pop();

    // Try FareHarbour first
    const fareHarbourResult = await GetFareHarbourItemsForCompany(
      "validFareHarbour"
    );
    if (fareHarbourResult.isSuccessful) {
      const fareHarbourItem = fareHarbourResult.data.items.items.find(
        (item) => item.pk.toString() === experienceId
      );
      if (fareHarbourItem) {
        return NextResponse.json(mapToExperience(fareHarbourItem));
      }
    }

    // If not found in FareHarbour, try Rezdy
    const rezdyResult = await GetRezdySearchResultsFromMarketPlace(
      "validRezdy"
    );
    if (rezdyResult.isSuccessful) {
      const rezdyProduct = rezdyResult.data.products.find(
        (product) => product.productCode === experienceId
      );
      if (rezdyProduct) {
        return NextResponse.json(mapToExperience(rezdyProduct));
      }
    }

    // If not found in either system
    return NextResponse.json(
      { message: "Experience not found" },
      { status: 404 }
    );
  } catch (error) {
    console.error("Error fetching experience:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}


import { NextResponse } from "next/server";
import { GetFareHarbourItemsForCompany } from "@/lib/api/fareharbour/fetcher/FareHarbourFetcher";
import { GetRezdySearchResultsFromMarketPlace } from "@/lib/api/rezdy/fetcher/RezdyFetcher";
import { mapToExperience } from "@/lib/services/experienceService";

// Add CORS headers helper
function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

// Add OPTIONS handler for CORS preflight
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function GET(
  request: Request,
  context: { params: { experienceId: string } }
) {
  try {
    const experienceId = await Promise.resolve(context.params.experienceId);

    // Try FareHarbour first
    const fareHarbourResult = await GetFareHarbourItemsForCompany(
      "validFareHarbour"
    );
    if (fareHarbourResult.isSuccessful) {
      const fareHarbourItem = fareHarbourResult.data.items.items.find(
        (item) => item.pk.toString() === experienceId
      );
      if (fareHarbourItem) {
        const experience = mapToExperience(fareHarbourItem);
        return NextResponse.json(experience, {
          headers: corsHeaders(),
        });
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
        const experience = mapToExperience(rezdyProduct);
        return NextResponse.json(experience, {
          headers: corsHeaders(),
        });
      }
    }

    // If not found in either system
    return NextResponse.json(
      { message: "Experience not found" },
      {
        status: 404,
        headers: corsHeaders(),
      }
    );
  } catch (error) {
    console.error("Error fetching experience:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      {
        status: 500,
        headers: corsHeaders(),
      }
    );
  }
}

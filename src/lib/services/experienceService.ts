import { Experience } from "@/lib/db/models/Experience";
import { RezdyProduct } from "@/lib/api/rezdy/models/ProductSearchResult";
import { FareHarbourItem } from "@/lib/api/fareharbour/models/FareHarbourItem";

export async function getExperienceById(
  experienceId: string
): Promise<Experience> {
  try {
    if (!experienceId) {
      throw new Error("Experience ID is required");
    }

    const encodedExperienceId = encodeURIComponent(experienceId);
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";

    const response = await fetch(
      `${baseUrl}/api/experiences/${encodedExperienceId}`,
      {
        cache: "no-store",
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to fetch experience (${response.status}): ${
          response.statusText || errorText || "Unknown error"
        }`
      );
    }

    const data = await response.json();
    if (!data) {
      throw new Error("No data returned from API");
    }

    return mapToExperience(data);
  } catch (error) {
    console.error("Error in getExperienceById:", error);
    throw error instanceof Error
      ? error
      : new Error("An unexpected error occurred while fetching the experience");
  }
}

export function mapToExperience(
  data: RezdyProduct | FareHarbourItem
): Experience {
  if ("productCode" in data) {
    // Rezdy product
    return {
      experienceId: data.productCode,
      experienceTitle: data.name,
      experienceDescription: data.shortDescription,
      experienceExtendedDescription: data.description,
      prices: data.priceOptions.map((price) => ({
        amount: price.price,
        currency: data.currency,
        label: price.label,
      })),
      experiencesImages: data.images.map((img) => img.thumbnailUrl),
      experienceLocation: {
        addressLine: data.locationAddress.addressLine,
        city: data.locationAddress.city,
        country: data.locationAddress.country,
        postCode: data.locationAddress.postCode,
        latitude: data.latitude,
        longitude: data.longitude,
      },
    };
  } else {
    // FareHarbour item
    return {
      experienceId: data.pk.toString(),
      experienceTitle: data.name,
      experienceDescription: data.headline,
      experienceExtendedDescription: data.description,
      prices: [], // Map FareHarbour prices accordingly
      experiencesImages: data.images.map((img) => img.image_cdn_url),
      experienceLocation: {
        addressLine: data.primary_location?.address?.street || "",
        city: data.primary_location?.address?.city || "",
        country: data.primary_location?.address?.country || "",
        postCode: data.primary_location?.address?.postal_code || "",
        latitude: parseFloat(data.primary_location?.latitude) || 0,
        longitude: parseFloat(data.primary_location?.longitude) || 0,
      },
    };
  }
}

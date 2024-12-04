"use server";

import {
  isFareHarbourItem,
  SelectableExperience,
} from "@/lib/api/rezdy/models/ProductSearchResult";
import clientPromise from "../mongodb";
import { Db } from "mongodb";
import { Experience } from "../models/Experience";

type DbMutationOperationResult =
  | {
      isSuccessful: true;
      _id: string;
    }
  | {
      isSuccessful: false;
      errorMessage: string;
    };

export default async function upsertExperienceInDatabase(
  experience: SelectableExperience
): Promise<DbMutationOperationResult> {
  try {
    const mongoDatabase = await getMongoDatabase();
    const experiencesCollection = mongoDatabase.collection<Experience>("experiences");

    const upsertedDocument = await experiencesCollection.findOneAndUpdate(
      {
        experiencePlatformId: getExperiencePlatformId(experience),
      },
      {
        $set: getExperience(experience),
      },
      {
        upsert: true,
        returnDocument: "after"
      }
    );

    return {
      isSuccessful: true,
      _id: upsertedDocument!._id.toString()
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
      errorMessage: `We were unable to load that experience. Try again in a bit`,
    };
  }
}

function getExperience(
  experience: SelectableExperience
): Omit<Experience, "_id"> {
  return {
    experiencePlatformId: getExperiencePlatformId(experience),
    experienceTitle: isFareHarbourItem(experience)
      ? experience.item.headline
      : experience.name,
    experienceDescription: isFareHarbourItem(experience)
      ? experience.item.description
      : experience.shortDescription,
    experienceExtendedDescription: isFareHarbourItem(experience)
      ? `
        ${experience.item.description_text}
        
        ${
          experience.item.desription_bullets !== undefined &&
          experience.item.desription_bullets !== null
            ? experience.item.desription_bullets!.join(", \n")
            : ``
        }

        ${
          experience.item.cancellation_policy !== undefined &&
          experience.item.cancellation_policy !== null
            ? experience.item.cancellation_policy
            : ``
        }

        ${
          experience.item.health_and_safety_policy !== undefined &&
          experience.item.health_and_safety_policy !== null
            ? experience.item.health_and_safety_policy
            : ``
        }
        
        ${Object.entries(experience.item.structured_description)
          .map(([key, value]) =>
            value !== null &&
            value !== undefined &&
            key !== undefined &&
            key !== null
              ? `${key}: ${value}`
              : ``
          )
          .filter((input) => input !== ``)
          .join(", \n")}
    `
      : experience.description, // This is to provide plenty of context to model to generate valid waivers
    prices: isFareHarbourItem(experience)
      ? experience.item.customer_prototypes.map((pt) => ({
          label: pt.display_name,
          currency: experience.currency,
          amount: pt.total_including_tax,
        }))
      : experience.priceOptions.map((pt) => ({
          label: pt.label,
          currency: experience.currency,
          amount: pt.price,
        })),
    experiencesImages: isFareHarbourItem(experience)
      ? experience.item.images.map((img) => img.image_cdn_url)
      : experience.images.map((img) => img.itemUrl),
    experienceLocation: {
      city: isFareHarbourItem(experience)
        ? experience.item.primary_location.address.city
        : experience.locationAddress.city,
      country: isFareHarbourItem(experience)
        ? experience.item.primary_location.address.country
        : experience.locationAddress.country,
      postCode: isFareHarbourItem(experience)
        ? experience.item.primary_location.address.postal_code
        : experience.locationAddress.postCode,
      addressLine: isFareHarbourItem(experience)
        ? experience.item.primary_location.address.street
        : experience.locationAddress.addressLine,
      latitude: isFareHarbourItem(experience)
        ? Number(experience.item.primary_location.latitude)
        : experience.locationAddress.latitude,
      longitude: isFareHarbourItem(experience)
        ? Number(experience.item.primary_location.longitude)
        : experience.locationAddress.longitude,
    },
    experiencePlatform: isFareHarbourItem(experience) ? "fareharbour" : "rezdy",
  };
}

function getExperiencePlatformId(experience: SelectableExperience): string {
  return (
    isFareHarbourItem(experience) ? experience.item.pk : experience.productCode
  ).toString();
}

async function getMongoDatabase(): Promise<Db> {
  const mongoClient = await clientPromise;
  return await mongoClient.db("rush-ready");
}

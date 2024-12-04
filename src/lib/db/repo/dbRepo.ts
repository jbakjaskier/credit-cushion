"use server";

import {
  isFareHarbourExperience,
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
    experienceTitle: isFareHarbourExperience(experience)
      ? experience.experience.headline
      : experience.experience.name,
    experienceDescription: isFareHarbourExperience(experience)
      ? experience.experience.description
      : experience.experience.shortDescription,
    experienceExtendedDescription: isFareHarbourExperience(experience)
      ? `
        ${experience.experience.description_text}
        
        ${
          experience.experience.desription_bullets !== undefined &&
          experience.experience.desription_bullets !== null
            ? experience.experience.desription_bullets!.join(", \n")
            : ``
        }

        ${
          experience.experience.cancellation_policy !== undefined &&
          experience.experience.cancellation_policy !== null
            ? experience.experience.cancellation_policy
            : ``
        }

        ${
          experience.experience.health_and_safety_policy !== undefined &&
          experience.experience.health_and_safety_policy !== null
            ? experience.experience.health_and_safety_policy
            : ``
        }
        
        ${Object.entries(experience.experience.structured_description)
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
      : experience.experience.description, // This is to provide plenty of context to model to generate valid waivers
    prices: isFareHarbourExperience(experience)
      ? experience.experience.customer_prototypes.map((pt) => ({
          label: pt.display_name,
          currency: experience.company.currency,
          amount: pt.total_including_tax,
        }))
      : experience.experience.priceOptions.map((pt) => ({
          label: pt.label,
          currency: experience.company.currency,
          amount: pt.price,
        })),
    experiencesImages: isFareHarbourExperience(experience)
      ? experience.experience.images.map((img) => img.image_cdn_url)
      : experience.experience.images.map((img) => img.itemUrl),
    experienceLocation: {
      city: isFareHarbourExperience(experience)
        ? experience.experience.primary_location.address.city
        : experience.experience.locationAddress.city,
      country: isFareHarbourExperience(experience)
        ? experience.experience.primary_location.address.country
        : experience.experience.locationAddress.country,
      postCode: isFareHarbourExperience(experience)
        ? experience.experience.primary_location.address.postal_code
        : experience.experience.locationAddress.postCode,
      addressLine: isFareHarbourExperience(experience)
        ? experience.experience.primary_location.address.street
        : experience.experience.locationAddress.addressLine,
      latitude: isFareHarbourExperience(experience)
        ? Number(experience.experience.primary_location.latitude)
        : experience.experience.locationAddress.latitude,
      longitude: isFareHarbourExperience(experience)
        ? Number(experience.experience.primary_location.longitude)
        : experience.experience.locationAddress.longitude,
    },
    experiencePlatform: isFareHarbourExperience(experience) ? "fareharbour" : "rezdy",
  };
}

function getExperiencePlatformId(experience: SelectableExperience): string {
  return (
    isFareHarbourExperience(experience) ? experience.experience.pk : experience.experience.productCode
  ).toString();
}

async function getMongoDatabase(): Promise<Db> {
  const mongoClient = await clientPromise;
  return await mongoClient.db("rush-ready");
}

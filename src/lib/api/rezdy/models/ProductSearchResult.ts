import { FareHarbourCompany } from "../../fareharbour/models/FareHarbourCompany";
import {
  FareHarbourImage,
  FareHarbourItem,
  FareHarbourItemsResult,
} from "../../fareharbour/models/FareHarbourItem";

export function isRezdyProductSearchResult(
  input:
    | RezdyProductProductSearchResult
    | {
        company: FareHarbourCompany;
        items: FareHarbourItemsResult;
      }
): input is RezdyProductProductSearchResult {
  return (input as RezdyProductProductSearchResult).requestStatus !== undefined;
}

export function isRezdyProduct(
  input: RezdyProduct | FareHarbourItem
): input is RezdyProduct {
  return (input as RezdyProduct).productType !== undefined;
}

export function isFareHarbourItem(input: SelectableExperience) : input is {
  item: FareHarbourItem,
  currency: string
} {
  const castedInput = input as {
    item: FareHarbourItem,
    currency: string
  }
  
  return castedInput.item !== undefined && castedInput.currency !== undefined;
}

export type SelectableExperience = RezdyProduct | {
  item: FareHarbourItem,
  currency: string
}

export function isRezdyImage(
  image: RezdyImage | FareHarbourImage
): image is RezdyImage {
  return "thumbnailUrl" in image && !("image_cdn_url" in image);
}

export type RezdyProductProductSearchResult = {
  requestStatus: RequestStatus;
  products: RezdyProduct[];
};

export type RezdyProduct = {
  productType: string;
  name: string;
  shortDescription: string;
  description: string;
  productCode: string;
  supplierId: number;
  supplierAlias: string;
  supplierName: string;
  timezone: string;
  priceOptions: RezdyPrice[];
  currency: string;
  images: RezdyImage[];
  latitude: number;
  longitude: number;
  locationAddress: RezdyLocationAddress;
};

export type RezdyLocationAddress = {
  addressLine: string;
  city: string;
  country?: string;
  postCode: string;
  state: string;
  countryCode: string;
  latitude: number;
  longitude: number;
};

export type RezdyImage = {
  id: number;
  itemUrl: string;
  thumbnailUrl: string;
};

type RezdyPrice = {
  price: number;
  label: string;
  id: number;
  productCode: string;
};

type RequestStatus = {
  success: boolean;
  version: string;
};

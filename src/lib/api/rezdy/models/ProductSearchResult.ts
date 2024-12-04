import { FareHarbourCompany } from "../../fareharbour/models/FareHarbourCompany";
import {
  FareHarbourImage,
  FareHarbourItem,
  FareHarbourItemsResult,
} from "../../fareharbour/models/FareHarbourItem";
import { RezdyCompany } from "./RezdyCompanyResult";

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

export function isFareHarbourExperience(input: SelectableExperience) : input is FareHarbourSelectableExperience {
  return input.provider === "fareharbour";
}


export type FareHarbourSelectableExperience = {
  provider: "fareharbour",
  experience: FareHarbourItem,
  company: FareHarbourCompany,
}

export type RezdySelectableExperience = {
  provider: "rezdy",
  experience: RezdyProduct,
  company: RezdyCompany
}


export type SelectableExperience = 
  FareHarbourSelectableExperience | 
  RezdySelectableExperience;

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

export type RequestStatus = {
  success: boolean;
  version: string;
};

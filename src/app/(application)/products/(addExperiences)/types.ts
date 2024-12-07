import { FareHarbourCompany } from "@/lib/api/fareharbour/models/FareHarbourCompany";
import { FareHarbourItemsResult } from "@/lib/api/fareharbour/models/FareHarbourItem";
import { RezdyProductProductSearchResult } from "@/lib/api/rezdy/models/ProductSearchResult";

export type ExperienceData =
  | {
      company: FareHarbourCompany;
      items: FareHarbourItemsResult;
    }
  | RezdyProductProductSearchResult;

export type UrlValidationResult =
  | {
      mode: "success";
      data: ExperienceData;
    }
  | {
      mode: "error";
      input: string | undefined;
      errorMessage: string;
    }
  | {
      mode: "initial";
    };

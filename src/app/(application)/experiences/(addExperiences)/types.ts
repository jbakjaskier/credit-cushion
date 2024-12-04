import { SelectableExperience } from "@/lib/api/rezdy/models/ProductSearchResult";



export type UrlValidationResult =
  | {
      mode: "success";
      data: SelectableExperience[];
    }
  | {
      mode: "error";
      input?: string;
      errorMessage: string;
    }
  | {
      mode: "initial";
    };

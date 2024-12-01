import { MaybeString } from "@/lib/common";
import { FareHarbourAddress } from "./FareHarbourItem";

export type FareHarbourCompany = {
    about: string;
    about_safe_html: MaybeString;
    address: FareHarbourAddress;
    currency: string;
}

 
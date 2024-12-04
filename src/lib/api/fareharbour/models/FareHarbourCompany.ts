import { FareHarbourAddress } from "./FareHarbourItem";

export type FareHarbourCompany = {
    about: string;
    about_safe_html?: string | null;
    address: FareHarbourAddress;
    currency: string;
    booking_notes?: string;
    faq? : string;
    health_and_safety_policy?: string;
    name: string;
}

 
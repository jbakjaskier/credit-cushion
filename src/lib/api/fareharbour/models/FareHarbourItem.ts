import { MaybeString } from "@/lib/common";

export type FareHarbourItemsResult = {
    items: FareHarbourItem[];
}


type FareHarbourItem = {
    customer_prototypes : CustomerPrototype[];
    description: string;
    desription_bullets: string[] | null | undefined;
    description_safe_html: string;
    description_text: string;
    headline: string;
    images: FareHarbourImage[];
    name: string;
    pk: number;
    primary_location: FareHarbourLocation;
    structured_description: FareHarbourStructuredDescription;
    health_and_safety_policy: MaybeString;
    health_and_safety_policy_safe_html: MaybeString;
}

type FareHarbourStructuredDescription = {
    accessibility: MaybeString;
    cancellation_summary: MaybeString;
    check_in_details: MaybeString;
    description: MaybeString;
    disclaimers : MaybeString;
    duration: MaybeString;
    extras: MaybeString;
    faqs: MaybeString;
    group_size: MaybeString;
    highlights: MaybeString;
    itinerary: MaybeString;
    max_age: number | null | undefined;
    meeting_point: MaybeString;
    min_age: number | null | undefined;
    pricing: MaybeString;
    restrictions: MaybeString;
    special_requirements: MaybeString;
    what_is_included: MaybeString;
    what_is_not_included: MaybeString;
    what_to_bring: MaybeString;
}

export type FareHarbourAddress = {
    city: string;
    country: string;
    postal_code: string;
    province: MaybeString;
    street: string;
}


type FareHarbourLocation = {
    address: FareHarbourAddress;
    google_place_id: string;
    latitude: string;
    longitude: string;
    note: MaybeString;
    pk: number;


}

type FareHarbourImage = {
    pk: number;
    image_cdn_url: string;
}

type CustomerPrototype = {
    display_name: string;
    note: MaybeString;
    pk: number;
    total: number;
    total_including_tax: number;
}







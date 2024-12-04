

export type FareHarbourItemsResult = {
  items: FareHarbourItem[];
};

export type FareHarbourItem = {
  cancellation_policy?: string | null;
  cancellation_policy_safe_html?: string | null;
  customer_prototypes: CustomerPrototype[];
  description: string;
  desription_bullets?: string[] | null;
  description_safe_html: string;
  description_text: string;
  headline: string;
  images: FareHarbourImage[];
  name: string;
  pk: number;
  primary_location: FareHarbourLocation;
  structured_description: FareHarbourStructuredDescription;
  health_and_safety_policy?: string | null;
  health_and_safety_policy_safe_html?: string | null;
};

export type FareHarbourStructuredDescription = {
  accessibility?: string | null;
  cancellation_summary?: string | null;
  check_in_details?: string | null;
  description?: string | null;
  disclaimers?: string | null;
  duration?: string | null;
  extras?: string | null;
  faqs?: string | null;
  group_size?: string | null;
  highlights?: string | null;
  itinerary?: string | null;
  max_age?: number | null;
  meeting_point?: string | null;
  min_age?: number | null;
  pricing?: string | null;
  restrictions?: string | null;
  special_requirements?: string | null;
  what_is_included?: string | null;
  what_is_not_included?: string | null;
  what_to_bring?: string | null;
};

export type FareHarbourAddress = {
  city: string;
  country: string;
  postal_code: string;
  province?: string | null;
  street: string;
};

type FareHarbourLocation = {
  address: FareHarbourAddress;
  google_place_id: string;
  latitude: string;
  longitude: string;
  note?: string | null;
  pk: number;
};

export type FareHarbourImage = {
  image_cdn_url: string;
  pk: number;
};

type CustomerPrototype = {
  display_name: string;
  note?: string | null;
  pk: number;
  total: number;
  total_including_tax: number;
};

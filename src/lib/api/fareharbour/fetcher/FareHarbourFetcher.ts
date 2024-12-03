import { delay } from "../../rezdy/fetcher/RezdyFetcher";
import { FareHarbourCompany } from "../models/FareHarbourCompany";
import { FareHarbourItemsResult } from "../models/FareHarbourItem";
import { API_ENDPOINTS } from "@/config/constants";

export async function GetFareHarbourItemsForCompany(companyShortname: string): Promise<
  | {
      isSuccessful: true;
      data: {
        company: FareHarbourCompany;
        items: FareHarbourItemsResult;
      };
    }
  | {
      isSuccessful: false;
      errorMessage: string;
    }
> {
    
  await delay(2000) //TODO: To simulate loading - Remove when app is completed
  if (companyShortname === "validFareHarbour") {
    return {
      isSuccessful: true,
      data: {
        company: {
          about:
            "Hawaiian Adventures offers several water activities that you are sure to enjoy.",
          about_safe_html:
            "<p>Hawaiian Adventures offers several water activities that you are sure to enjoy.</p>",
          address: {
            city: "Honolulu",
            country: "US",
            postal_code: "96821",
            province: "HI",
            street: "123 Wailupe Cir",
          },
          currency: "usd",
        },
        items: {
          items: [
            {
              cancellation_policy:
                "A full refund will be issued if notice is given at least 24 hours before start time.",
              cancellation_policy_safe_html:
                "<p>A full refund will be issued if notice is given at least 24 hours before start time.</p>",
              customer_prototypes: [],
              description:
                "We are conveniently located just 5 minutes from Waikiki and will arrange for pickup/dropoff at or near your hotel.",

              description_safe_html:
                "<p>We are conveniently located just 5 minutes from Waikiki and will arrange for pickup/dropoff at or near your hotel.</p>",
              description_text:
                "We are conveniently located just 5 minutes from Waikiki and will arrange for pickup/dropoff at or near your hotel.",

              headline: "Epic Jet Ski Tour",
              health_and_safety_policy:
                "Every lifejacket and seat is thoroughly disinfected both before and after each tour.  Hand sanitizer is available to all guests prior to boarding, during the tour, and after debarking the boat.",
              health_and_safety_policy_safe_html:
                "<p>Every lifejacket and seat is thoroughly disinfected both before and after each tour.  Hand sanitizer is available to all guests prior to boarding, during the tour, and after debarking the boat.</p>",
              images: [
                {
                  image_cdn_url:
                    "https://images.unsplash.com/photo-1731902062604-51bb7926e6d5?q=80&w=3840&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                  pk: 687,
                },
              ],
              name: "Jet Ski Tour",
              pk: 1867,
              primary_location: {
                address: {
                  city: "Honolulu",
                  country: "US",
                  postal_code: "96821",
                  province: "HI",
                  street: "123 Wailupe Cir",
                },
                google_place_id: "ChIJYZ4srGUSAHwRT1Da4amp3x",
                latitude: "-157.85",
                longitude: "21.30",
                note: "Next to the blue fence.",
                pk: 234234,
              },
              structured_description: {
                accessibility: "Stroller and wheelchair accessible.",
                cancellation_summary:
                  "A full refund will be issued if notice is given at least 24 hours before start time.",
                check_in_details: "Check in at the desk and scan QR code",
                description:
                  "White water rafting followed by a picnic with included food and drinks.",
                disclaimers:
                  "We cannot be held responsible if you get attacked by a bear.",
                duration: "2 hours",
                extras:
                  "<p>The following can be purchased:</p><ul>\n<li>Hats</li>\n<li>Wetsuit rentals</li>\n</ul>",
                faqs: "Q: Can I bring a friend?\nA: Absolutely, the more the merrier!",
                group_size: "Maximum 20 adults",
                highlights:
                  "Nature hike includes five different lookout spots with panoramoic views that are perfect for capturing memories with a photo.",
                itinerary:
                  "<ol>\n<li>Safety lesson</li>\n<li>White water rafting</li>\n<li>Lunch break</li>\n<li>Nature hike</li>\n</ol>",
                max_age: 65,
                meeting_point:
                  "123 Fake Street, Fakertown CA in front of the statue.",
                min_age: 5,
                pricing:
                  "<p>Adult $20<br>\nChild $10<br>\nChildren under 5 Free</p>",
                restrictions: "Must be at least 48in tall.",
                special_requirements:
                  "Children under the age of 16 must be accompanied by an adult.",
                what_is_included:
                  "<ul>\n<li>Water</li>\n<li>Snacks</li>\n</ul>",
                what_is_not_included:
                  "<ul>\n<li>Towels</li>\n<li>Wetsuit rentals</li>\n</ul>",
                what_to_bring: "<ul>\n<li>Swimsuit</li>\n<li>Towel</li>\n</ul>",
              },
            },
          ],
        },
      },
    };
  }

  //Get company
  try {
    const companyResponse = await fetch(
      `${API_ENDPOINTS.FAREHARBOUR.BASE}${API_ENDPOINTS.FAREHARBOUR.COMPANIES}/${companyShortname}`,
      {
        method: "GET",
        headers: getHeaders(),
      }
    );

    if (!companyResponse.ok) {
      return {
        isSuccessful: false,
        errorMessage: `We were not able to get a company registered with FareHarbour with that short name`,
      };
    }

    const companyJsonResult =
      (await companyResponse.json()) as FareHarbourCompany;

    //Make an item call
    const itemsResponse = await fetch(
      `${API_ENDPOINTS.FAREHARBOUR.BASE}${API_ENDPOINTS.FAREHARBOUR.COMPANIES}/${companyShortname}${API_ENDPOINTS.FAREHARBOUR.ITEMS}`,
      {
        method: "GET",
        headers: getHeaders(),
      }
    );

    if (!itemsResponse.ok) {
      return {
        isSuccessful: false,
        errorMessage: `We were unable to get any items that your company is currently selling on FareHarbour`,
      };
    }

    const itemsJsonResult =
      (await itemsResponse.json()) as FareHarbourItemsResult;

    if (itemsJsonResult.items.length === 0) {
      return {
        isSuccessful: false,
        errorMessage: `There are no items that your company currently sells on FareHarbour`,
      };
    }

    return {
      isSuccessful: true,
      data: {
        company: companyJsonResult,
        items: itemsJsonResult,
      },
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
      errorMessage: `We were unable to get your items from FareHarbour. Try again in a bit`,
    };
  }
}

function getHeaders() {
  return {
    "X-FareHarbor-API-App": process.env.FAREHARBOUR_API_APP!,
    "X-FareHarbor-API-User": process.env.FAREHARBOUR_API_USER!,
  };
}

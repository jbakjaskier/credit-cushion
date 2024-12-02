export const supportedPlatforms = [
  {
    name: "Rezdy",
    description: "An experience hosted and booked on Rezdy",
    imageUrl: "/external_logos/rezdy_logo.webp",
    radioId: "rezdy-radio",
    radioValue: "rezdy",
  },
  {
    name: "FareHarbour",
    description: "Experiences Managed by FareHarbour",
    imageUrl: "/external_logos/fareharbour_logo.png",
    radioId: "fareharbour-radio",
    radioValue: "fareharbour",
  },
] as const;

export type Platform = typeof supportedPlatforms[number]; 
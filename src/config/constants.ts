export const API_ENDPOINTS = {
  FAREHARBOUR: {
    BASE: process.env.FAREHARBOUR_BASE_URL,
    COMPANIES: "/v1/companies",
    ITEMS: "/items",
  },
  DOCUSIGN: {
    AUTH: "https://account-d.docusign.com/oauth/auth",
    TOKEN: "https://account-d.docusign.com/oauth/token",
  },
  REZDY: {
    BASE: process.env.REZDY_BASE_URL,
    MARKETPLACE: "/v1/products/marketplace",
  },
} as const;

// Route Constants
export const ROUTES = {
  HOME: "/",
  PRODUCTS: "/products",
  CREATE_WAIVER: "/experiences/create-waiver",
  REVIEW_WAIVER: "/experiences/review-waiver",
  PUBLISH_WAIVER: "/experiences/publish-waiver",
  INTEGRATIONS: "#",
  PROFILE: "#",
  SETTINGS: "#",
  SIGNOUT: "#",
} as const;

// Route Groups
export const EXPERIENCE_ROUTES = {
  BASE: ROUTES.PRODUCTS,
  CREATE: ROUTES.CREATE_WAIVER,
  REVIEW: ROUTES.REVIEW_WAIVER,
  PUBLISH: ROUTES.PUBLISH_WAIVER,
} as const;

// Navigation Items
export const MARKETING_NAVIGATION = [
  { name: "Home", href: ROUTES.HOME },
  { name: "Try It Out", href: ROUTES.PRODUCTS },
  { name: "FAQ", href: "#" },
] as const;

export const USER_NAVIGATION = [
  { name: "Your Profile", href: ROUTES.PROFILE },
  { name: "Settings", href: ROUTES.SETTINGS },
  { name: "Sign out", href: ROUTES.SIGNOUT },
] as const;

export const APPLICATION_NAVIGATION = [
  { name: "Products", href: ROUTES.PRODUCTS, current: true },
  { name: "Integrations", href: ROUTES.INTEGRATIONS, current: false },
] as const;


// Types
export type Route = (typeof ROUTES)[keyof typeof ROUTES];

// App Constants
export const APP_NAME = "Credit Cushion";
export const APP_DESCRIPTION = "Hardship Made Human";

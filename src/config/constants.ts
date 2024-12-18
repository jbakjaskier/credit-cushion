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
  HARDSHIP: "/hardship",
  CUSTOMERS: "/customers",
  PRODUCTS: "/products",
  PROFILE: "#",
  SETTINGS: "#",
  SIGNOUT: "/api/auth/logout",
} as const;



// Navigation Items
export const MARKETING_NAVIGATION = [
  { name: "Home", href: ROUTES.HOME },
  { name: "Hardship", href: ROUTES.HARDSHIP },
  { name: "FAQ", href: "#" },
] as const;

export const USER_NAVIGATION = [
  { name: "Your Profile", href: ROUTES.PROFILE },
  { name: "Sign out", href: ROUTES.SIGNOUT },
] as const;

export const APPLICATION_NAVIGATION = [
  { name: "Products", href: ROUTES.PRODUCTS, current: true },
  { name: "Customers", href: ROUTES.CUSTOMERS, current: false },
] as const;

// Types
export type Route = (typeof ROUTES)[keyof typeof ROUTES];

// App Constants
export const APP_NAME = "Credit Cushion";
export const APP_DESCRIPTION = "Hardship Made Human";

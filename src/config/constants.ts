// Route Constants
export const ROUTES = {
  HOME: "/",
  HARDSHIP: "/hardship",
  LOANS: "/loans",
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

export const getApplicationNavigation = (pathname: string) =>
  [
    {
      name: "Products",
      href: ROUTES.PRODUCTS,
      current:
        pathname === ROUTES.PRODUCTS || pathname.startsWith("/products/"),
    },
    {
      name: "Loans",
      href: ROUTES.LOANS,
      current: pathname === ROUTES.LOANS || pathname.startsWith("/loans/"),
    },
  ] as const;

// Types
export type Route = (typeof ROUTES)[keyof typeof ROUTES];

// App Constants
export const APP_NAME = "Credit Cushion";
export const APP_DESCRIPTION = "Hardship Made Human";

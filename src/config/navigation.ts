export const ROUTES = {
  HOME: "/",
  EXPERIENCES: "/experiences",
  INTEGRATIONS: "#",
  PROFILE: "#",
  SETTINGS: "#",
  SIGNOUT: "#",
} as const;

export const navigation = [
  { name: "Experiences", href: ROUTES.EXPERIENCES, current: true },
  { name: "Integrations", href: ROUTES.INTEGRATIONS, current: false },
] as const;

export const userNavigation = [
  { name: "Your Profile", href: ROUTES.PROFILE },
  { name: "Settings", href: ROUTES.SETTINGS },
  { name: "Sign out", href: ROUTES.SIGNOUT },
] as const;

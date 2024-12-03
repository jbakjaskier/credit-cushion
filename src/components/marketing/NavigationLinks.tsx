import Link from "next/link";
import { MARKETING_NAVIGATION } from "@/config/constants";

interface NavigationLinksProps {
  mobile?: boolean;
}

export function NavigationLinks({ mobile = false }: NavigationLinksProps) {
  const baseClassName = mobile
    ? "-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
    : "text-sm font-semibold leading-6 text-gray-900";

  return (
    <>
      {MARKETING_NAVIGATION.map((item) => (
        <Link key={item.name} href={item.href} className={baseClassName}>
          {item.name}
        </Link>
      ))}
    </>
  );
}

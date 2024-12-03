import type { Metadata } from "next";
import "../globals.css";
import MarketingHeader from "@/components/MarketingHeader";
import { APP_NAME, APP_DESCRIPTION } from "@/config/constants";
import { getFontClasses } from "@/config/fonts";

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
};

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`${getFontClasses()} bg-white`}>
      <MarketingHeader />
      {children}
    </div>
  );
}

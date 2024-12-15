import type { Metadata } from "next";
import "../globals.css";
import MarketingHeader from "@/components/MarketingHeader";
import { APP_NAME, APP_DESCRIPTION } from "@/config/constants";
import { fonts } from "@/config/fonts";

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
};

export default async function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${fonts.sans.variable} ${fonts.mono.variable}`}>
        <div className={`bg-white flex flex-col min-h-screen`}>
          <MarketingHeader />
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}

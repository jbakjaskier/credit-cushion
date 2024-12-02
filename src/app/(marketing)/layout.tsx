import type { Metadata } from "next";
import "../globals.css";
import MarketingHeader from "@/components/MarketingHeader";
import { APP_NAME, APP_DESCRIPTION } from "@/config/constants";
import { getFontClasses } from "@/config/fonts";

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={getFontClasses()} suppressHydrationWarning>
        <div className="bg-white">
          <MarketingHeader />
          {children}
        </div>
      </body>
    </html>
  );
}

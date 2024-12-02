import type { Metadata } from "next";
import localFont from "next/font/local";
import "../globals.css";
import MarketingHeader from "@/components/MarketingHeader";
import { APP_NAME, APP_DESCRIPTION } from "@/config/constants";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <div className="bg-white">
          <MarketingHeader />
          {children}
        </div>
      </body>
    </html>
  );
}

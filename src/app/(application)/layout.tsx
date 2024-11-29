
import ApplicationHeader from "@/components/ApplicationHeader";

import type { Metadata } from "next";
import localFont from "next/font/local";
import "../globals.css";

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
  title: "Rush Ready",
  description: "Adventure Awaits, Paperwork Doesn't",
};



export default async function ApplicationLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
  return (
    <html className="h-full bg-gray-100" lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}>
          <div className="min-h-full bg-gray-100">
            <ApplicationHeader />
            <main className="-mt-32">
              <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
                <div className="rounded-lg bg-white px-5 py-6 shadow sm:px-6">
                  {children}
                </div>
              </div>
            </main>
          </div>
      </body>
    </html>
  );
}

import ApplicationHeader from "@/components/ApplicationHeader";
import Footer from "@/components/common/Footer";
import type { Metadata } from "next";
import "../globals.css";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { APP_NAME, APP_DESCRIPTION } from "@/config/constants";
import { fontClasses } from "@/config/fonts";

// Metadata configuration
export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
};

// Layout component
export default function ApplicationLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full">
        <ErrorBoundary>
          <div
            className={`${fontClasses} min-h-full bg-gray-100 flex flex-col`}
          >
            <ApplicationHeader />
            <main className="-mt-32 flex-1">
              <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
                <div className="rounded-lg bg-white px-5 py-6 shadow sm:px-6">
                  {children}
                </div>
              </div>
            </main>
            <Footer />
          </div>
        </ErrorBoundary>
      </body>
    </html>
  );
}

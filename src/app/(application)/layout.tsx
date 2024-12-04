import ApplicationHeader from "@/components/ApplicationHeader";
import type { Metadata } from "next";
import "../globals.css";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { APP_NAME, APP_DESCRIPTION } from "@/config/constants";
import { ToastProvider } from "@/components/providers/ToastProvider";
import { getFontClasses } from "@/config/fonts";

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
    <ErrorBoundary>
      <div className={`${getFontClasses()} min-h-full bg-gray-100`}>
        <ApplicationHeader />

        <main className="-mt-32">
          <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
            <div className="rounded-lg bg-white px-5 py-6 shadow sm:px-6">
              {children}
            </div>
          </div>
        </main>
      </div>
      <ToastProvider />
    </ErrorBoundary>
  );
}

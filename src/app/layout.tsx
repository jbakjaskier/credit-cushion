import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "RushReady",
  description: "Adventure Awaits, Paperwork Doesn't",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

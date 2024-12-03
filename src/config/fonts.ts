import localFont from "next/font/local";

// Font loaders must be called and assigned at module scope
const geistSans = localFont({
  src: "../app/fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "../app/fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Export the font instances
export const fonts = {
  sans: geistSans,
  mono: geistMono,
};

export const getFontClasses = () =>
  `${fonts.sans.variable} ${fonts.mono.variable} antialiased`;

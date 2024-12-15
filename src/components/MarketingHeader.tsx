"use client";

import { useState } from "react";
import { Logo } from "./marketing/Logo";
import { MobileMenuButton } from "./marketing/MobileMenuButton";
import { NavigationLinks } from "./marketing/NavigationLinks";
import { MobileMenu } from "./marketing/MobileMenu";

export default function MarketingHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <Logo
          width={80}
          height={80} />
        </div>

        <div className="flex lg:hidden">
          <MobileMenuButton onClick={() => setMobileMenuOpen(true)} />
        </div>

        <div className="hidden lg:flex lg:gap-x-12">
          <NavigationLinks />
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end" />
      </nav>

      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </header>
  );
}

import Link from "next/link";
import { APP_NAME } from "@/config/constants";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="mx-auto max-w-7xl px-4 py-6 md:flex md:items-center md:justify-between sm:px-6 lg:px-8">
        <div className="md:order-1">
          <p className="text-center text-xs leading-5 text-gray-500">
            &copy; {currentYear} {APP_NAME}. All rights reserved.
          </p>
        </div>
        <div className="flex justify-center space-x-6 md:order-2">
          <span className="text-xs text-gray-500">Version 1.0.0</span>
        </div>
      </div>
    </footer>
  );
}

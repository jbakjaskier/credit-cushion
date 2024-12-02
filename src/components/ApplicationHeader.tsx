"use client";

import { classNames } from "@/lib/classUtils";
import { Disclosure } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { navigation, userNavigation } from "@/config/navigation";
import { useUser } from "@/contexts/UserContext";
import { SearchBar } from "./header/SearchBar";
import { ProfileMenu } from "./header/ProfileMenu";
import { MobileMenu } from "./header/MobileMenu"; 

export default function ApplicationHeader() {
  const { user } = useUser();

  if (!user) {
    return null;
  }

  return (
    <div className="bg-indigo-600 pb-32">
      <Disclosure
        as="nav"
        className="border-b border-indigo-300 border-opacity-25 bg-indigo-600 lg:border-none"
      >
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
              <div className="relative flex h-16 items-center justify-between lg:border-b lg:border-indigo-300 lg:border-opacity-25">
                <div className="flex items-center px-2 lg:px-0">
                  <Link href="/" className="flex-shrink-0">
                    <Image
                      priority
                      width={80}
                      height={80}
                      className="block"
                      src="/rush_ready_white_logo.png"
                      alt="Rush Ready"
                    />
                  </Link>
                  <nav className="hidden lg:ml-10 lg:block">
                    <div className="flex space-x-4">
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={classNames(
                            item.current
                              ? "bg-indigo-700 text-white"
                              : "text-white hover:bg-indigo-500 hover:bg-opacity-75",
                            "rounded-md py-2 px-3 text-sm font-medium"
                          )}
                          aria-current={item.current ? "page" : undefined}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </nav>
                </div>

                <SearchBar />

                <div className="flex lg:hidden">
                  <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md bg-indigo-600 p-2 text-indigo-200 hover:bg-indigo-500 hover:bg-opacity-75 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600">
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Toggle menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>

                <div className="hidden lg:ml-4 lg:block">
                  <div className="flex items-center">
                    <button
                      type="button"
                      className="relative rounded-full bg-indigo-600 p-1 text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600"
                    >
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">View notifications</span>
                      <BellIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                    <ProfileMenu user={user} />
                  </div>
                </div>
              </div>
            </div>

            <MobileMenu
              user={user}
              navigation={navigation}
              userNavigation={userNavigation}
            />
          </>
        )}
      </Disclosure>
      <header className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Experiences
          </h1>
        </div>
      </header>
    </div>
  );
}

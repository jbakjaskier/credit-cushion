import { Disclosure } from "@headlessui/react";
import Image from "next/image";
import { classNames } from "@/lib/classUtils";

interface MobileMenuProps {
  user: { name: string; email: string; imageUrl: string };
  navigation: ReadonlyArray<{ name: string; href: string; current: boolean }>;
  userNavigation: ReadonlyArray<{ name: string; href: string }>;
}

export function MobileMenu({
  user,
  navigation,
  userNavigation,
}: MobileMenuProps) {
  return (
    <Disclosure.Panel className="lg:hidden">
      <div className="space-y-1 px-2 pb-3 pt-2">
        {navigation.map((item) => (
          <Disclosure.Button
            key={item.name}
            as="a"
            href={item.href}
            className={classNames(
              item.current
                ? "bg-indigo-700 text-white"
                : "text-white hover:bg-indigo-500 hover:bg-opacity-75",
              "block rounded-md py-2 px-3 text-base font-medium"
            )}
            aria-current={item.current ? "page" : undefined}
          >
            {item.name}
          </Disclosure.Button>
        ))}
      </div>
      <div className="border-t border-indigo-700 pb-3 pt-4">
        <div className="flex items-center px-5">
          <div className="flex-shrink-0">
            <Image
              className="h-10 w-10 rounded-full"
              src={user?.imageUrl ?? "/default-avatar.png"}
              alt=""
              width={40}
              height={40}
            />
          </div>
          <div className="ml-3">
            <div className="text-base font-medium text-white">{user.name}</div>
            <div className="text-sm font-medium text-indigo-300">
              {user.email}
            </div>
          </div>
        </div>
        <div className="mt-3 space-y-1 px-2">
          {userNavigation.map((item) => (
            <Disclosure.Button
              key={item.name}
              as="a"
              href={item.href}
              className="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-indigo-500 hover:bg-opacity-75"
            >
              {item.name}
            </Disclosure.Button>
          ))}
        </div>
      </div>
    </Disclosure.Panel>
  );
}

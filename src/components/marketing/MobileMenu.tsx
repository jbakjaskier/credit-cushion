import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Logo } from "./Logo";
import { NavigationLinks } from "./NavigationLinks";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  return (
    <Dialog as="div" className="lg:hidden" open={isOpen} onClose={onClose}>
      <div className="fixed inset-0 z-50" />
      <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
        <div className="flex items-center justify-between">
          <Logo width={100} height={100} />
          <button
            type="button"
            className="-m-2.5 rounded-md p-2.5 text-gray-700"
            onClick={onClose}
          >
            <span className="sr-only">Close menu</span>
            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="mt-6 flow-root">
          <div className="-my-6 divide-y divide-gray-500/10">
            <div className="space-y-2 py-6">
              <NavigationLinks mobile />
            </div>
            <div className="py-6" />
          </div>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
}

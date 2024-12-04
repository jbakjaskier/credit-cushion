"use client"
import Image from "next/image";
import { supportedPlatforms } from "@/config/platforms";

interface PlatformSelectorProps {
  selectedPlatform: string;
  onPlatformChange: (platform: "rezdy" | "fareharbour") => void;
}

export function PlatformSelector({
  selectedPlatform,
  onPlatformChange,
}: PlatformSelectorProps) {
  return (
    <fieldset>
      <div className="mt-6">
        <ul
          role="list"
          className="mt-4 divide-y divide-gray-200 border-t border-gray-200"
        >
          {supportedPlatforms.map((platform) => (
            <li
              key={platform.radioId}
              className="flex items-center justify-between space-x-3 py-4 last:border-b-0 hover:bg-gray-50 transition-colors"
            >
              <input
                id={platform.radioId}
                name="platform"
                type="radio"
                value={platform.radioValue}
                checked={selectedPlatform === platform.radioValue}
                onChange={(event) => onPlatformChange(event.target.value === "rezdy" ? "rezdy" : "fareharbour")}
                className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
              />
              <div className="flex min-w-0 flex-1 items-center space-x-3">
                <div className="flex-shrink-0">
                  <Image
                    width={80}
                    height={80}
                    src={platform.imageUrl}
                    alt={platform.name}
                    className="object-contain"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {platform.name}
                  </p>
                  <p className="text-sm font-medium text-gray-500 break-words">
                    {platform.description}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </fieldset>
  );
}

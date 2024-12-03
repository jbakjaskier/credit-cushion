"use client";

import Image from "next/image";
import {
  RezdyProduct,
  isRezdyProduct,
  isRezdyImage,
} from "@/lib/api/rezdy/models/ProductSearchResult";
import { FareHarbourItem } from "@/lib/api/fareharbour/models/FareHarbourItem";
import { ChevronRightIcon } from "@heroicons/react/20/solid";

interface ExperienceListItemProps {
  experience: RezdyProduct | FareHarbourItem;
  onClick: () => void;
}

export function ExperienceListItem({
  experience,
  onClick,
}: ExperienceListItemProps) {
  return (
    <li
      className="relative flex justify-between items-center gap-x-6 py-5 cursor-pointer hover:bg-gray-50"
      onClick={onClick}
    >
      <div className="flex min-w-0 gap-x-4">
        <Image
          width={100}
          height={100}
          className="h-12 w-12 flex-none rounded-full bg-gray-50"
          src={
            isRezdyImage(experience.images[0])
              ? experience.images[0].thumbnailUrl
              : experience.images[0].image_cdn_url
          }
          alt="Experience Image"
        />
        <div className="min-w-0 flex-auto">
          <p className="text-sm font-semibold leading-6 text-gray-900">
            {isRezdyProduct(experience) ? experience.name : experience.headline}
          </p>
          <p className="mt-1 text-xs leading-5 text-gray-500 truncate">
            {isRezdyProduct(experience)
              ? experience.shortDescription
              : experience.description}
          </p>
        </div>
      </div>
      <ChevronRightIcon
        className="h-5 w-5 flex-none text-gray-400"
        aria-hidden="true"
      />
    </li>
  );
}

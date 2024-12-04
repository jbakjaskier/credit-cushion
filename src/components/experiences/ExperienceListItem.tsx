"use client";

import Image from "next/image";
import {
  SelectableExperience,
  isFareHarbourItem,
} from "@/lib/api/rezdy/models/ProductSearchResult";
import { ChevronRightIcon } from "@heroicons/react/20/solid";

interface ExperienceListItemProps {
  experience: SelectableExperience;
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
            isFareHarbourItem(experience) ? experience.item.images[0].image_cdn_url : experience.images[0].thumbnailUrl
          }
          alt="Experience Image"
        />
        <div className="min-w-0 flex-auto">
          <p className="text-sm font-semibold leading-6 text-gray-900">
            {isFareHarbourItem(experience) ? experience.item.headline : experience.name}
          </p>
          <p className="mt-1 text-xs leading-5 text-gray-500 truncate">
            {isFareHarbourItem(experience)
              ? experience.item.description
              : experience.shortDescription}
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

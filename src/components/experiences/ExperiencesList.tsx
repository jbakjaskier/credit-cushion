"use client"

import {
  SelectableExperience,
  isFareHarbourExperience,
} from "@/lib/api/rezdy/models/ProductSearchResult";
import { ExperienceListItem } from "@/components/experiences/ExperienceListItem";

interface ExperiencesListProps {
  data: SelectableExperience[],
  onExperienceSelect: (selectedExperience: SelectableExperience) => Promise<void>;
}

export function ExperiencesList({
  data,
  onExperienceSelect,
}: ExperiencesListProps) {
  
  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">
          No experiences found. Try a different search term.
        </p>
      </div>
    );
  }

  return (
    <ul role="list" className="divide-y divide-gray-100 mt-4">
      {data.map((experience) => (
        <ExperienceListItem
          key={
            isFareHarbourExperience(experience) ? experience.experience.pk : experience.experience.productCode
          }
          experience={experience}
          onClick={async () =>
            await onExperienceSelect(experience)
          }
        />
      ))}
    </ul>
  );
}

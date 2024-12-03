import { RezdyProductProductSearchResult, isRezdyProduct, isRezdyProductSearchResult } from "@/lib/api/rezdy/models/ProductSearchResult";
import { FareHarbourCompany } from "@/lib/api/fareharbour/models/FareHarbourCompany";
import { FareHarbourItemsResult } from "@/lib/api/fareharbour/models/FareHarbourItem";
import { ExperienceListItem } from "@/components/experiences/ExperienceListItem";

interface ExperiencesListProps {
  data:
    | RezdyProductProductSearchResult
    | { company: FareHarbourCompany; items: FareHarbourItemsResult };
  onExperienceSelect: (experienceId: string) => void;
}

export function ExperiencesList({
  data,
  onExperienceSelect,
}: ExperiencesListProps) {
  const experiences = isRezdyProductSearchResult(data)
    ? data.products
    : data.items.items;

  if (experiences.length === 0) {
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
      {experiences.map((experience) => (
        <ExperienceListItem
          key={isRezdyProduct(experience) ? experience.name : experience.pk}
          experience={experience}
          onClick={() =>
            onExperienceSelect(
              isRezdyProduct(experience) ? experience.name : experience.pk.toString()
            )
          }
        />
      ))}
    </ul>
  );
}

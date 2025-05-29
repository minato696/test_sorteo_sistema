import { SorteoCard } from "./SorteoCard";
import { SorteoConRelaciones } from "@/types";

interface SorteoGridProps {
  sorteos: SorteoConRelaciones[];
}

export function SorteoGrid({ sorteos }: SorteoGridProps) {
  if (sorteos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">
          No hay sorteos disponibles en este momento.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sorteos.map((sorteo) => (
        <SorteoCard key={sorteo.id} sorteo={sorteo} />
      ))}
    </div>
  );
}

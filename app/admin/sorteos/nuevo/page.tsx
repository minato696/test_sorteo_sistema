import { SorteoForm } from "@/components/admin/SorteoForm";

export default function NuevoSorteoPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Crear Nuevo Sorteo</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <SorteoForm />
      </div>
    </div>
  );
}

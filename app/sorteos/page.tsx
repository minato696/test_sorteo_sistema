import { prisma } from "@/lib/prisma";
import { SorteoGrid } from "@/components/sorteos/SorteoGrid";
import { EstadoSorteo } from "@prisma/client";
import { serializeSorteos } from "@/lib/utils";

export default async function SorteosPage() {
  const sorteosRaw = await prisma.sorteo.findMany({
    orderBy: [
      { estado: "asc" },
      { fechaSorteo: "asc" }
    ]
  });

  const sorteos = serializeSorteos(sorteosRaw);
  
  const sorteosActivos = sorteos.filter(s => s.estado === EstadoSorteo.ACTIVO);
  const sorteosProximos = sorteos.filter(s => s.estado === EstadoSorteo.PROXIMO);
  const sorteosFinalizados = sorteos.filter(s => s.estado === EstadoSorteo.FINALIZADO);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Todos los Sorteos
      </h1>

      {sorteosActivos.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Sorteos Activos</h2>
          <SorteoGrid sorteos={sorteosActivos} />
        </section>
      )}

      {sorteosProximos.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Próximos Sorteos</h2>
          <SorteoGrid sorteos={sorteosProximos} />
        </section>
      )}

      {sorteosFinalizados.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Sorteos Finalizados</h2>
          <SorteoGrid sorteos={sorteosFinalizados} />
        </section>
      )}
    </div>
  );
}

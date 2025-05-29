import { prisma } from "@/lib/prisma";
import { Trophy, Users, Ticket, DollarSign } from "lucide-react";
import Link from "next/link";
import { Decimal } from "@prisma/client/runtime/library";

export default async function AdminDashboard() {
  // Obtener estadísticas
  const [totalSorteos, sorteosActivos, totalParticipantes, totalTickets] = await Promise.all([
    prisma.sorteo.count(),
    prisma.sorteo.count({ where: { estado: "ACTIVO" } }),
    prisma.participante.count(),
    prisma.ticket.count(),
  ]);

  // Calcular total recaudado
  const participantes = await prisma.participante.findMany({
    where: { estadoPago: "PAGADO" },
    select: { montoTotal: true },
  });
  
  const totalRecaudado = participantes.reduce(
    (sum, p) => sum.add(p.montoTotal),
    new Decimal(0)
  );

  // Últimos sorteos
  const ultimosSorteos = await prisma.sorteo.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { participantes: true },
      },
    },
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Sorteos</p>
              <p className="text-2xl font-bold">{totalSorteos}</p>
            </div>
            <Trophy className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Sorteos Activos</p>
              <p className="text-2xl font-bold">{sorteosActivos}</p>
            </div>
            <Trophy className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Participantes</p>
              <p className="text-2xl font-bold">{totalParticipantes}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Recaudado</p>
              <p className="text-2xl font-bold">S/ {totalRecaudado.toString()}</p>
            </div>
            <DollarSign className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Últimos sorteos */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">Últimos Sorteos</h2>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Título</th>
                  <th className="text-left py-2">Estado</th>
                  <th className="text-left py-2">Participantes</th>
                  <th className="text-left py-2">Fecha Sorteo</th>
                  <th className="text-left py-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {ultimosSorteos.map((sorteo) => (
                  <tr key={sorteo.id} className="border-b">
                    <td className="py-2">{sorteo.titulo}</td>
                    <td className="py-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        sorteo.estado === "ACTIVO"
                          ? "bg-green-100 text-green-800"
                          : sorteo.estado === "PROXIMO"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {sorteo.estado}
                      </span>
                    </td>
                    <td className="py-2">{sorteo._count.participantes}</td>
                    <td className="py-2">
                      {new Date(sorteo.fechaSorteo).toLocaleDateString("es-PE")}
                    </td>
                    <td className="py-2">
                      <Link
                        href={`/admin/sorteos/${sorteo.id}`}
                        className="text-purple-600 hover:text-purple-800"
                      >
                        Ver detalles
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

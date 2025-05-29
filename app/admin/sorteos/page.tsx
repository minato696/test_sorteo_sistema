import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Edit, Trash2, Users } from "lucide-react";
import { DeleteSorteoButton } from "@/components/admin/DeleteSorteoButton";

export default async function AdminSorteosPage() {
  const sorteos = await prisma.sorteo.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: {
          participantes: true,
          tickets: true,
        },
      },
    },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Gestión de Sorteos</h1>
        <Link
          href="/admin/sorteos/nuevo"
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nuevo Sorteo
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Título
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Precio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tickets
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Participantes
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha Sorteo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sorteos.map((sorteo) => (
              <tr key={sorteo.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {sorteo.titulo}
                    </div>
                    {sorteo.destacado && (
                      <span className="text-xs text-yellow-600">Destacado</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    sorteo.estado === "ACTIVO"
                      ? "bg-green-100 text-green-800"
                      : sorteo.estado === "PROXIMO"
                      ? "bg-blue-100 text-blue-800"
                      : sorteo.estado === "FINALIZADO"
                      ? "bg-gray-100 text-gray-800"
                      : "bg-red-100 text-red-800"
                  }`}>
                    {sorteo.estado}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  S/ {sorteo.precio.toString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {sorteo.ticketsVendidos} / {sorteo.ticketsTotales}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {sorteo._count.participantes}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(sorteo.fechaSorteo).toLocaleDateString("es-PE")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/sorteos/${sorteo.id}/participantes`}
                      className="text-blue-600 hover:text-blue-900"
                      title="Ver participantes"
                    >
                      <Users className="w-5 h-5" />
                    </Link>
                    <Link
                      href={`/admin/sorteos/${sorteo.id}/editar`}
                      className="text-indigo-600 hover:text-indigo-900"
                      title="Editar"
                    >
                      <Edit className="w-5 h-5" />
                    </Link>
                    <DeleteSorteoButton sorteoId={sorteo.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import { SorteoGrid } from "@/components/sorteos/SorteoGrid";
import { prisma } from "@/lib/prisma";
import { EstadoSorteo } from "@prisma/client";
import { Calendar, Trophy, Ticket } from "lucide-react";
import { serializeSorteos } from "@/lib/utils";

export default async function Home() {
  const sorteosRaw = await prisma.sorteo.findMany({
    where: {
      estado: {
        in: [EstadoSorteo.ACTIVO, EstadoSorteo.PROXIMO]
      }
    },
    orderBy: [
      { destacado: "desc" },
      { fechaSorteo: "asc" }
    ]
  });

  // Serializar sorteos para convertir Decimals a strings
  const sorteos = serializeSorteos(sorteosRaw);

  // Estadísticas
  const totalSorteos = await prisma.sorteo.count();
  const sorteosActivos = await prisma.sorteo.count({
    where: { estado: EstadoSorteo.ACTIVO }
  });
  const totalParticipantes = await prisma.participante.count();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center mb-12 py-8">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Bienvenido a ElAzGanador
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Participa en sorteos increíbles y gana productos asombrosos como iPhones, PlayStation, MacBooks y más
        </p>
        
        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mt-12">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-center mb-2">
              <Trophy className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{totalSorteos}</h3>
            <p className="text-gray-600">Sorteos Totales</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-center mb-2">
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{sorteosActivos}</h3>
            <p className="text-gray-600">Sorteos Activos</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-center mb-2">
              <Ticket className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{totalParticipantes}</h3>
            <p className="text-gray-600">Participantes</p>
          </div>
        </div>
      </section>

      {/* Sorteos Section */}
      <section className="mb-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Sorteos Disponibles</h2>
          <p className="text-gray-600">Elige tu sorteo favorito y participa ahora</p>
        </div>
        
        {sorteos.length > 0 ? (
          <SorteoGrid sorteos={sorteos} />
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-gray-500 text-lg">
              No hay sorteos disponibles en este momento.
            </p>
            <p className="text-gray-400 mt-2">
              Vuelve pronto para nuevas oportunidades de ganar.
            </p>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg shadow-xl p-8 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">¿Cómo funciona?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div>
            <div className="text-4xl mb-4">1</div>
            <h3 className="text-xl font-semibold mb-2">Elige un sorteo</h3>
            <p>Explora nuestros sorteos activos y elige el que más te guste</p>
          </div>
          <div>
            <div className="text-4xl mb-4">2</div>
            <h3 className="text-xl font-semibold mb-2">Compra tus tickets</h3>
            <p>Selecciona la cantidad de tickets y completa tu compra</p>
          </div>
          <div>
            <div className="text-4xl mb-4">3</div>
            <h3 className="text-xl font-semibold mb-2">¡Espera el sorteo!</h3>
            <p>Cruza los dedos y espera a ser el próximo ganador</p>
          </div>
        </div>
      </section>
    </div>
  );
}

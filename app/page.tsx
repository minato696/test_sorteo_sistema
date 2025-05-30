import HeroSection from '@/components/home/HeroSection';
import SorteoGrid from '@/components/sorteos/SorteoGrid';
import SocialBanner from '@/components/home/SocialBanner';
import Link from 'next/link';
import { prisma } from "@/lib/prisma";
import { EstadoSorteo } from "@prisma/client";
import { Calendar, Trophy, Ticket, Sparkles } from "lucide-react";
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
    ],
    take: 6 // Limitar a 6 sorteos en la página principal
  });

  const sorteos = serializeSorteos(sorteosRaw);

  const totalSorteos = await prisma.sorteo.count();
  const sorteosActivos = await prisma.sorteo.count({
    where: { estado: EstadoSorteo.ACTIVO }
  });
  const totalParticipantes = await prisma.participante.count();

  return (
    <>
      {/* Hero Section */}
      <HeroSection />

      <div className="container mx-auto px-4 py-12">
        {/* Sorteos Section */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-purple-600 mr-2" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Sorteos Disponibles</h2>
              <Sparkles className="w-6 h-6 text-blue-600 ml-2" />
            </div>
            <p className="text-gray-600 text-lg">Elige tu sorteo favorito y participa ahora</p>
          </div>
          
          {sorteos.length > 0 ? (
            <>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-8">
                {sorteos.map((sorteo: any) => (
                  <Link 
                    key={sorteo.id} 
                    href={`/sorteos/${sorteo.id}/registro`}
                    className="block transform hover:scale-105 transition-all duration-300"
                  >
                    <SorteoGrid sorteo={sorteo} />
                  </Link>
                ))}
              </div>
              
              {sorteos.length >= 6 && (
                <div className="text-center">
                  <Link 
                    href="/sorteos"
                    className="inline-flex items-center bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 px-8 rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    Ver todos los sorteos
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
              <p className="text-gray-500 text-lg">
                No hay sorteos disponibles en este momento.
              </p>
              <p className="text-gray-400 mt-2">
                Vuelve pronto para nuevas oportunidades de ganar.
              </p>
            </div>
          )}
        </section>

        {/* Banner de Redes Sociales */}
        <section className="mb-16">
          <SocialBanner />
        </section>

        {/* CTA Section - Cómo funciona */}
        <section id="como-funciona" className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl shadow-2xl p-8 md:p-12 text-white text-center overflow-hidden relative">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">¿Cómo funciona ElAzGanador?</h2>
            <p className="text-xl mb-10 text-white/90 max-w-2xl mx-auto">
              Participar es muy fácil. Sigue estos simples pasos y podrías ser nuestro próximo ganador.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 transform hover:scale-105 transition-all">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Elige un sorteo</h3>
                <p className="text-white/90">Explora nuestros sorteos activos y elige el premio que más te guste</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 transform hover:scale-105 transition-all">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Compra tus tickets</h3>
                <p className="text-white/90">Selecciona la cantidad de tickets que deseas y completa tu registro</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 transform hover:scale-105 transition-all">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">¡Espera el sorteo!</h3>
                <p className="text-white/90">Sigue nuestras redes sociales para ver el sorteo en vivo</p>
              </div>
            </div>
            
            <div className="mt-10">
              <Link 
                href="/sorteos"
                className="inline-flex items-center bg-white text-purple-600 font-bold py-4 px-8 rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl"
              >
                Participar ahora
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* Estadísticas */}
        <section className="mt-16 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center transform hover:scale-105 transition-all">
              <div className="flex items-center justify-center mb-4">
                <div className="p-4 bg-purple-100 rounded-full">
                  <Trophy className="w-10 h-10 text-purple-600" />
                </div>
              </div>
              <h3 className="text-4xl font-bold text-gray-800">{totalSorteos}</h3>
              <p className="text-gray-600 mt-2">Sorteos Realizados</p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center transform hover:scale-105 transition-all">
              <div className="flex items-center justify-center mb-4">
                <div className="p-4 bg-blue-100 rounded-full">
                  <Calendar className="w-10 h-10 text-blue-600" />
                </div>
              </div>
              <h3 className="text-4xl font-bold text-gray-800">{sorteosActivos}</h3>
              <p className="text-gray-600 mt-2">Sorteos Activos</p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center transform hover:scale-105 transition-all">
              <div className="flex items-center justify-center mb-4">
                <div className="p-4 bg-green-100 rounded-full">
                  <Ticket className="w-10 h-10 text-green-600" />
                </div>
              </div>
              <h3 className="text-4xl font-bold text-gray-800">{totalParticipantes}</h3>
              <p className="text-gray-600 mt-2">Participantes Felices</p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

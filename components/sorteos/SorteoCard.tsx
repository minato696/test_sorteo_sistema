"use client";

import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar, Ticket, Trophy } from "lucide-react";
import { SorteoConRelaciones } from "@/types";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Badge } from "@/components/ui/Badge";
import { EstadoSorteo } from "@prisma/client";

interface SorteoCardProps {
  sorteo: SorteoConRelaciones;
}

export function SorteoCard({ sorteo }: SorteoCardProps) {
  const porcentajeVendido = (sorteo.ticketsVendidos / sorteo.ticketsTotales) * 100;
  const isProximo = sorteo.estado === EstadoSorteo.PROXIMO;

  return (
    <Link href={`/sorteos/${sorteo.id}`}>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer relative">
        {sorteo.destacado && (
          <div className="absolute top-2 right-2 z-10">
            <Badge variant="destacado">Destacado</Badge>
          </div>
        )}
        
        <div className="relative h-48 bg-gray-200">
          <img
            src={sorteo.imagenUrl}
            alt={sorteo.titulo}
            className="w-full h-full object-cover"
          />
          {isProximo && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white text-2xl font-bold">PRÓXIMAMENTE</span>
            </div>
          )}
        </div>

        <div className="p-6">
          <h3 className="text-xl font-bold mb-2">{sorteo.titulo}</h3>
          <p className="text-gray-600 mb-4 line-clamp-2">{sorteo.descripcion}</p>

          <div className="space-y-3">
            <div className="flex items-center text-sm text-gray-500">
              <Trophy className="w-4 h-4 mr-2" />
              <span>{sorteo.premio}</span>
            </div>

            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="w-4 h-4 mr-2" />
              <span>
                {format(new Date(sorteo.fechaSorteo), "dd ''de'' MMMM, yyyy", {
                  locale: es,
                })}
              </span>
            </div>

            <div className="flex items-center text-sm text-gray-500">
              <Ticket className="w-4 h-4 mr-2" />
              <span>
                {sorteo.ticketsVendidos} / {sorteo.ticketsTotales} vendidos
              </span>
            </div>
          </div>

          <div className="mt-4">
            <ProgressBar value={porcentajeVendido} />
          </div>

          <div className="mt-6 flex justify-between items-center">
            <div>
              <p className="text-2xl font-bold text-purple-600">
                S/ {sorteo.precio}
              </p>
              <p className="text-xs text-gray-500">por ticket</p>
            </div>
            
            <button
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                isProximo
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700"
              }`}
              disabled={isProximo}
            >
              {isProximo ? "Próximamente" : "Participar"}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

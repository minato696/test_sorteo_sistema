"use client";

import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar, Ticket, Trophy, Users } from "lucide-react";
import { SorteoConRelaciones } from "@/types";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Badge } from "@/components/ui/Badge";
import { CompraForm } from "@/components/forms/CompraForm";
import { EstadoSorteo } from "@prisma/client";

interface SorteoDetalleProps {
  sorteo: SorteoConRelaciones;
}

export function SorteoDetalle({ sorteo }: SorteoDetalleProps) {
  const [showCompraForm, setShowCompraForm] = useState(false);
  const porcentajeVendido = (sorteo.ticketsVendidos / sorteo.ticketsTotales) * 100;
  const isActivo = sorteo.estado === EstadoSorteo.ACTIVO;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Imagen y badges */}
        <div className="relative">
          <div className="relative h-96 rounded-lg overflow-hidden bg-gray-200">
            <img
              src={sorteo.imagenUrl}
              alt={sorteo.titulo}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute top-4 left-4 space-y-2">
            {sorteo.destacado && <Badge variant="destacado">Destacado</Badge>}
            {sorteo.estado === EstadoSorteo.PROXIMO && <Badge variant="proximo">Próximamente</Badge>}
          </div>
        </div>

        {/* Información del sorteo */}
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">{sorteo.titulo}</h1>
            <p className="text-gray-600 text-lg">{sorteo.descripcion}</p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Premio:</span>
              <span className="font-semibold">{sorteo.premio}</span>
            </div>
            {sorteo.valorPremio && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Valor del premio:</span>
                <span className="font-semibold">S/ {sorteo.valorPremio}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Fecha del sorteo:</span>
              <span className="font-semibold">
                {format(new Date(sorteo.fechaSorteo), "dd ''de'' MMMM, yyyy", {
                  locale: es,
                })}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Ticket className="w-5 h-5 text-purple-600" />
                <span className="text-gray-600">Tickets vendidos</span>
              </div>
              <span className="font-semibold">
                {sorteo.ticketsVendidos} / {sorteo.ticketsTotales}
              </span>
            </div>
            <ProgressBar value={porcentajeVendido} />
          </div>

          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-3xl font-bold text-purple-600">
                  S/ {sorteo.precio}
                </p>
                <p className="text-sm text-gray-500">por ticket</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Tickets disponibles</p>
                <p className="text-2xl font-bold">{sorteo.ticketsDisponibles}</p>
              </div>
            </div>

            {isActivo ? (
              <button
                onClick={() => setShowCompraForm(true)}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105"
              >
                Comprar Tickets
              </button>
            ) : (
              <button
                disabled
                className="w-full py-4 bg-gray-300 text-gray-500 font-bold rounded-lg cursor-not-allowed"
              >
                {sorteo.estado === EstadoSorteo.PROXIMO ? "Próximamente" : "Sorteo Finalizado"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Formulario de compra */}
      {showCompraForm && (
        <CompraForm
          sorteo={sorteo}
          onClose={() => setShowCompraForm(false)}
        />
      )}
    </div>
  );
}

"use client"

import { Badge } from "@/components/ui/Badge"
import { ProgressBar } from "@/components/ui/ProgressBar"

interface Sorteo {
  id: string
  titulo: string
  descripcion: string
  imagenUrl: string
  precio: string | number
  fechaSorteo: string
  ticketsDisponibles: number
  ticketsVendidos: number
  ticketsTotales: number
  estado: string
  premio: string
  valorPremio?: string | number | null
  destacado: boolean
  proximamente: boolean
}

export default function SorteoDetalle({ sorteo }: { sorteo: Sorteo }) {
  const porcentajeVendido = (sorteo.ticketsVendidos / sorteo.ticketsTotales) * 100

  return (
    <div className="space-y-4">
      <p className="text-gray-600">{sorteo.descripcion}</p>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Fecha del sorteo</p>
          <p className="font-semibold">{new Date(sorteo.fechaSorteo).toLocaleDateString('es-PE', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Premio</p>
          <p className="font-semibold">{sorteo.premio}</p>
        </div>
      </div>

      <div>
        <p className="text-sm text-gray-500 mb-2">Progreso de venta</p>
        <ProgressBar value={porcentajeVendido} />
        <p className="text-sm text-gray-600 mt-1">
          {sorteo.ticketsVendidos} de {sorteo.ticketsTotales} tickets vendidos
        </p>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-lg font-semibold">Precio por ticket: S/ {sorteo.precio}</p>
        <p className="text-sm text-gray-600">
          Tickets disponibles: {sorteo.ticketsDisponibles}
        </p>
        {sorteo.valorPremio && (
          <p className="text-sm text-gray-600 mt-2">
            Valor del premio: S/ {sorteo.valorPremio}
          </p>
        )}
      </div>

      {sorteo.destacado && (
        <Badge variant="warning">Sorteo Destacado</Badge>
      )}
    </div>
  )
}

"use client"

import { Badge } from "@/components/ui/Badge"
import { ProgressBar } from "@/components/ui/ProgressBar"
import { Calendar, Ticket, TrendingUp } from "lucide-react"

interface Sorteo {
  id: string
  titulo: string
  descripcion: string
  precio: string | number
  fechaSorteo: string
  ticketsDisponibles: number
  ticketsVendidos: number
  ticketsTotales: number
  estado: string
  destacado: boolean
  proximamente: boolean
  imagenUrl?: string
}

export default function SorteoGrid({ sorteo }: { sorteo: Sorteo }) {
  const porcentajeVendido = (sorteo.ticketsVendidos / sorteo.ticketsTotales) * 100
  const fechaSorteo = new Date(sorteo.fechaSorteo)
  const diasRestantes = Math.ceil((fechaSorteo.getTime() - Date.now()) / (1000 * 60 * 60 * 24))

  return (
    <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
      {/* Banner de destacado */}
      {sorteo.destacado && (
        <div className="absolute top-4 left-4 z-10">
          <Badge variant="warning" className="px-3 py-1 text-xs font-bold shadow-lg">
             DESTACADO
          </Badge>
        </div>
      )}

      {/* Imagen o placeholder */}
      <div className="relative h-48 bg-gradient-to-br from-purple-400 to-blue-500 overflow-hidden">
        {sorteo.imagenUrl ? (
          <img 
            src={sorteo.imagenUrl} 
            alt={sorteo.titulo}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Ticket className="w-20 h-20 text-white/50" />
          </div>
        )}
        
        {/* Overlay con precio */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-white/90 text-sm font-medium">Precio por ticket</p>
              <p className="text-white text-3xl font-bold">S/ {sorteo.precio}</p>
            </div>
            <Badge 
              variant={sorteo.estado === 'ACTIVO' ? 'success' : sorteo.estado === 'PROXIMO' ? 'warning' : 'secondary'}
              className="mb-1"
            >
              {sorteo.estado}
            </Badge>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">
          {sorteo.titulo}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 h-10">
          {sorteo.descripcion}
        </p>

        {/* Información del sorteo */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2 text-purple-600" />
            <span>{fechaSorteo.toLocaleDateString('es-PE', { 
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })}</span>
            {diasRestantes > 0 && (
              <span className="ml-auto text-purple-600 font-medium">
                {diasRestantes} días
              </span>
            )}
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Progreso de venta</span>
              <span className="font-medium text-gray-800">
                {Math.round(porcentajeVendido)}%
              </span>
            </div>
            <ProgressBar value={porcentajeVendido} className="h-2" />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{sorteo.ticketsVendidos} vendidos</span>
              <span>{sorteo.ticketsDisponibles} disponibles</span>
            </div>
          </div>
        </div>

        {/* Botón de participar */}
        <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2">
          <Ticket className="w-5 h-5" />
          <span>Participar Ahora</span>
        </button>

        {/* Indicador de venta rápida */}
        {porcentajeVendido > 70 && (
          <div className="mt-3 flex items-center justify-center text-xs text-orange-600">
            <TrendingUp className="w-3 h-3 mr-1" />
            <span className="font-medium">¡Se está agotando rápido!</span>
          </div>
        )}
      </div>
    </div>
  )
}

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function serializeSorteos(sorteos: any[]) {
  return sorteos.map(sorteo => ({
    ...sorteo,
    precio: sorteo.precio.toString(),
    valorPremio: sorteo.valorPremio ? sorteo.valorPremio.toString() : null,
    fechaSorteo: sorteo.fechaSorteo.toISOString(),
    createdAt: sorteo.createdAt.toISOString(),
    updatedAt: sorteo.updatedAt.toISOString(),
  }))
}

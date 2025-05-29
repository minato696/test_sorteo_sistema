import { Sorteo } from '@prisma/client';

export function generateTicketCode(sorteoId: string, numeroTicket: number): string {
  // Tomar los últimos 3 caracteres del sorteoId
  const sorteoCode = sorteoId.slice(-3).toUpperCase();
  // Formatear el número con ceros a la izquierda
  const ticketNumber = numeroTicket.toString().padStart(4, "0");
  
  return `TKT-${sorteoCode}-${ticketNumber}`;
}

export function formatCurrency(amount: number | string): string {
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
  }).format(numAmount);
}

// Función para serializar sorteos y convertir Decimals a strings
export function serializeSorteo(sorteo: Sorteo) {
  return {
    ...sorteo,
    precio: sorteo.precio.toString(),
    valorPremio: sorteo.valorPremio ? sorteo.valorPremio.toString() : null,
    fechaSorteo: sorteo.fechaSorteo.toISOString(),
    createdAt: sorteo.createdAt.toISOString(),
    updatedAt: sorteo.updatedAt.toISOString()
  };
}

export function serializeSorteos(sorteos: Sorteo[]) {
  return sorteos.map(serializeSorteo);
}

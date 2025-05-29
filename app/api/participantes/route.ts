import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";
import { EstadoPago, EstadoSorteo } from "@prisma/client";
import { generateTicketCode } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      dni,
      nombres,
      apellidos,
      telefono,
      email,
      departamento,
      cantidad,
      sorteoId,
    } = body;

    // Validaciones básicas
    if (!dni || dni.length !== 8) {
      return NextResponse.json(
        { error: "DNI debe tener 8 dígitos" },
        { status: 400 }
      );
    }

    if (!telefono || telefono.length !== 9 || !telefono.startsWith("9")) {
      return NextResponse.json(
        { error: "Teléfono debe tener 9 dígitos y empezar con 9" },
        { status: 400 }
      );
    }

    if (cantidad < 1 || cantidad > 10) {
      return NextResponse.json(
        { error: "Cantidad debe estar entre 1 y 10" },
        { status: 400 }
      );
    }

    // Verificar disponibilidad del sorteo
    const sorteo = await prisma.sorteo.findUnique({
      where: { id: sorteoId },
    });

    if (!sorteo) {
      return NextResponse.json(
        { error: "Sorteo no encontrado" },
        { status: 404 }
      );
    }

    if (sorteo.estado !== EstadoSorteo.ACTIVO) {
      return NextResponse.json(
        { error: "El sorteo no está activo" },
        { status: 400 }
      );
    }

    if (sorteo.ticketsDisponibles < cantidad) {
      return NextResponse.json(
        { error: "No hay suficientes tickets disponibles" },
        { status: 400 }
      );
    }

    // Calcular el monto total
    const montoTotal = new Decimal(sorteo.precio).mul(cantidad);

    // Crear participante y tickets en una transacción
    const result = await prisma.$transaction(async (tx) => {
      // Crear el participante
      const participante = await tx.participante.create({
        data: {
          dni,
          nombres,
          apellidos,
          telefono,
          email,
          departamento,
          cantidad,
          montoTotal,
          sorteoId,
          estadoPago: EstadoPago.PENDIENTE,
        },
      });

      // Obtener el último número de ticket
      const ultimoTicket = await tx.ticket.findFirst({
        where: { sorteoId },
        orderBy: { numeroTicket: "desc" },
      });

      const siguienteNumero = (ultimoTicket?.numeroTicket || 0) + 1;

      // Crear los tickets
      const tickets = [];
      for (let i = 0; i < cantidad; i++) {
        const ticket = await tx.ticket.create({
          data: {
            codigo: generateTicketCode(sorteoId, siguienteNumero + i),
            numeroTicket: siguienteNumero + i,
            participanteId: participante.id,
            sorteoId,
          },
        });
        tickets.push(ticket);
      }

      // Actualizar el sorteo
      await tx.sorteo.update({
        where: { id: sorteoId },
        data: {
          ticketsVendidos: { increment: cantidad },
          ticketsDisponibles: { decrement: cantidad },
        },
      });

      return { participante, tickets };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error al crear participante:", error);
    return NextResponse.json(
      { error: "Error al procesar la compra" },
      { status: 500 }
    );
  }
}

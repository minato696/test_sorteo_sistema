import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      titulo,
      descripcion,
      imagenUrl,
      precio,
      fechaSorteo,
      ticketsTotales,
      estado,
      premio,
      valorPremio,
      destacado,
      proximamente,
    } = body;

    const sorteo = await prisma.sorteo.create({
      data: {
        titulo,
        descripcion,
        imagenUrl,
        precio: new Decimal(precio),
        fechaSorteo: new Date(fechaSorteo),
        ticketsDisponibles: ticketsTotales,
        ticketsTotales,
        estado,
        premio,
        valorPremio: valorPremio ? new Decimal(valorPremio) : null,
        destacado,
        proximamente,
      },
    });

    return NextResponse.json(sorteo);
  } catch (error) {
    console.error("Error al crear sorteo:", error);
    return NextResponse.json(
      { error: "Error al crear el sorteo" },
      { status: 500 }
    );
  }
}

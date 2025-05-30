import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { Decimal } from "@prisma/client/runtime/library"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sorteoId, dni, nombres, apellidos, telefono, email, departamento, cantidad } = body

    // Obtener información del sorteo
    const sorteo = await prisma.sorteo.findUnique({
      where: { id: sorteoId }
    })

    if (!sorteo) {
      return NextResponse.json(
        { error: "Sorteo no encontrado" },
        { status: 404 }
      )
    }

    if (sorteo.ticketsDisponibles < cantidad) {
      return NextResponse.json(
        { error: "No hay suficientes tickets disponibles" },
        { status: 400 }
      )
    }

    // Calcular monto total
    const montoTotal = new Decimal(sorteo.precio).mul(cantidad)

    // Crear participante con tickets
    const participante = await prisma.participante.create({
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
        tickets: {
          create: Array.from({ length: cantidad }, (_, i) => ({
            codigo: `TKT-${sorteo.id.slice(-4)}-${Date.now()}-${i + 1}`,
            numeroTicket: sorteo.ticketsVendidos + i + 1,
            sorteoId
          }))
        }
      },
      include: {
        tickets: true
      }
    })

    // Actualizar contadores del sorteo
    await prisma.sorteo.update({
      where: { id: sorteoId },
      data: {
        ticketsVendidos: { increment: cantidad },
        ticketsDisponibles: { decrement: cantidad }
      }
    })

    return NextResponse.json({
      success: true,
      participante,
      message: `Se han registrado ${cantidad} tickets exitosamente`
    })

  } catch (error) {
    console.error("Error creating participante:", error)
    return NextResponse.json(
      { error: "Error al procesar la compra" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const participantes = await prisma.participante.findMany({
      include: {
        sorteo: true,
        tickets: true
      },
      orderBy: {
        fechaRegistro: 'desc'
      }
    })

    return NextResponse.json(participantes)
  } catch (error) {
    console.error("Error fetching participantes:", error)
    return NextResponse.json(
      { error: "Error al obtener participantes" },
      { status: 500 }
    )
  }
}

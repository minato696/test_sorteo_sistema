import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const sorteos = await prisma.sorteo.findMany({
      where: {
        estado: {
          in: ["ACTIVO", "PROXIMO"]
        }
      },
      orderBy: {
        fechaSorteo: "asc"
      },
      include: {
        _count: {
          select: { 
            participantes: true,
            tickets: true
          }
        }
      }
    })

    return NextResponse.json(sorteos)
  } catch (error) {
    console.error("Error fetching sorteos:", error)
    return NextResponse.json(
      { error: "Error al obtener sorteos" },
      { status: 500 }
    )
  }
}

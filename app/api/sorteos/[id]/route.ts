import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const sorteo = await prisma.sorteo.findUnique({
      where: {
        id: id,
      },
      include: {
        participantes: true,
        _count: {
          select: { 
            participantes: true,
            tickets: true
          }
        }
      }
    })

    if (!sorteo) {
      return NextResponse.json(
        { error: "Sorteo no encontrado" },
        { status: 404 }
      )
    }

    return NextResponse.json(sorteo)

  } catch (error) {
    console.error("Error fetching sorteo:", error)
    return NextResponse.json(
      { error: "Error al obtener el sorteo" },
      { status: 500 }
    )
  }
}

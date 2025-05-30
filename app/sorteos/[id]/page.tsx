import { notFound } from "next/navigation"
import Link from "next/link"
import SorteoDetalle from "@/components/sorteos/SorteoDetalle"
import { Badge } from "@/components/ui/Badge"

async function getSorteo(id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/api/sorteos/${id}`, {
      cache: 'no-store'
    })
    
    if (!res.ok) return null
    
    return res.json()
  } catch (error) {
    console.error('Error fetching sorteo:', error)
    return null
  }
}

export default async function SorteoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const sorteo = await getSorteo(id)
  
  if (!sorteo) {
    notFound()
  }

  const estaActivo = sorteo.estado === 'ACTIVO'

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold">{sorteo.titulo}</h1>
            <Badge variant={estaActivo ? "success" : "secondary"}>
              {sorteo.estado}
            </Badge>
          </div>
          
          <SorteoDetalle sorteo={sorteo} />
          
          {estaActivo && (
            <div className="mt-8 text-center">
              <Link 
                href={`/sorteos/${id}/registro`}
                className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Participar en el Sorteo
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

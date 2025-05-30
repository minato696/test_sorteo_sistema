import Link from "next/link"
import SorteoGrid from "@/components/sorteos/SorteoGrid"

async function getSorteos() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/api/sorteos`, {
      cache: 'no-store'
    })
    
    if (!res.ok) return []
    
    return res.json()
  } catch (error) {
    console.error('Error fetching sorteos:', error)
    return []
  }
}

export default async function SorteosPage() {
  const sorteos = await getSorteos()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Sorteos Disponibles</h1>
      
      {sorteos.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No hay sorteos disponibles en este momento</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sorteos.map((sorteo: any) => (
            <Link 
              key={sorteo.id} 
              href={`/sorteos/${sorteo.id}/registro`}
              className="block hover:transform hover:scale-105 transition-transform"
            >
              <SorteoGrid sorteo={sorteo} />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

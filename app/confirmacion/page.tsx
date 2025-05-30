"use client"

import { useEffect, useState, useRef } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import html2canvas from "html2canvas"

interface Ticket {
  codigo: string
  numeroTicket: number
}

interface ParticipanteData {
  participante: {
    id: string
    nombres: string
    apellidos: string
    dni: string
    email: string
    telefono: string
    cantidad: number
    tickets: Ticket[]
    sorteo?: {
      titulo: string
      fechaSorteo: string
      precio: string
    }
  }
}

// Componente de ticket para mostrar
const TicketDisplay = ({
  codigo,
  numeroTicket,
  sorteoTitulo,
  nombres,
  apellidos,
  dni,
}: {
  codigo: string
  numeroTicket: number
  sorteoTitulo: string
  nombres: string
  apellidos: string
  dni: string
}) => (
  <div className="ticket-display border-2 border-gray-300 rounded-lg shadow-md bg-white relative overflow-hidden">
    {/* Patrón de borde */}
    <div className="absolute inset-0 border-4 border-dashed border-gray-200 opacity-20"></div>
    
    {/* Cabecera */}
    <header className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 px-3 flex justify-between items-center">
      <span className="font-bold text-sm">ElAzGanador</span>
      <span className="font-mono text-xs">#{numeroTicket}</span>
    </header>

    <div className="p-3">
      {/* Título del sorteo */}
      <h3 className="text-center font-bold text-sm mb-2 text-gray-800">
        {sorteoTitulo}
      </h3>

      {/* Información */}
      <div className="space-y-1 text-xs">
        <div className="bg-gray-50 p-2 rounded">
          <p className="font-semibold text-gray-700">Participante:</p>
          <p className="text-gray-600">{nombres} {apellidos}</p>
          <p className="text-gray-500">DNI: {dni}</p>
        </div>

        <div className="text-center py-2 border-t border-gray-200">
          <p className="font-mono font-bold text-purple-600">{codigo}</p>
          <p className="text-gray-400 text-xs">Código del ticket</p>
        </div>
      </div>
    </div>
  </div>
)

// Componente de ticket para descargar (oculto)
const TicketForDownload = ({
  codigo,
  numeroTicket,
  sorteoTitulo,
  nombres,
  apellidos,
  dni,
  fechaSorteo,
  ticketRef,
}: {
  codigo: string
  numeroTicket: number
  sorteoTitulo: string
  nombres: string
  apellidos: string
  dni: string
  fechaSorteo: string
  ticketRef: React.RefObject<HTMLDivElement>
}) => (
  <div
    ref={ticketRef}
    style={{
      display: "none",
      position: "fixed",
      width: "400px",
      background: "white",
      border: "2px solid #e5e7eb",
      borderRadius: 8,
      fontFamily: "Arial, sans-serif",
      overflow: "hidden"
    }}
  >
    {/* Cabecera */}
    <div
      style={{
        background: "linear-gradient(to right, #7c3aed, #2563eb)",
        color: "white",
        padding: "12px 16px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <span style={{ fontWeight: "bold", fontSize: 16 }}>ElAzGanador</span>
      <span style={{ fontFamily: "monospace", fontSize: 14 }}>#{numeroTicket}</span>
    </div>

    <div style={{ padding: 16 }}>
      {/* Logo/Título */}
      <h2 style={{ 
        textAlign: "center", 
        fontSize: 18, 
        fontWeight: "bold",
        marginBottom: 16,
        color: "#1f2937"
      }}>
        {sorteoTitulo}
      </h2>

      {/* Información del participante */}
      <div style={{ 
        background: "#f9fafb", 
        padding: 12, 
        borderRadius: 6,
        marginBottom: 12
      }}>
        <p style={{ fontWeight: "bold", color: "#374151", marginBottom: 4 }}>
          PARTICIPANTE:
        </p>
        <p style={{ color: "#4b5563", marginBottom: 2 }}>
          {nombres} {apellidos}
        </p>
        <p style={{ color: "#6b7280", fontSize: 14 }}>
          DNI: {dni}
        </p>
      </div>

      {/* Código */}
      <div style={{ 
        textAlign: "center", 
        padding: 12,
        borderTop: "1px dashed #e5e7eb",
        borderBottom: "1px dashed #e5e7eb",
        marginBottom: 12
      }}>
        <p style={{ 
          fontFamily: "monospace", 
          fontSize: 20, 
          fontWeight: "bold",
          color: "#7c3aed",
          marginBottom: 4
        }}>
          {codigo}
        </p>
        <p style={{ color: "#9ca3af", fontSize: 12 }}>
          CÓDIGO DEL TICKET
        </p>
      </div>

      {/* Fecha del sorteo */}
      <div style={{ textAlign: "center", fontSize: 12, color: "#6b7280" }}>
        <p>Fecha del sorteo:</p>
        <p style={{ fontWeight: "bold" }}>{fechaSorteo}</p>
      </div>

      {/* Pie */}
      <div style={{ 
        marginTop: 16,
        paddingTop: 12,
        borderTop: "1px solid #e5e7eb",
        textAlign: "center",
        fontSize: 11,
        color: "#9ca3af"
      }}>
        <p>¡Mucha suerte! </p>
        <p>Guarda este ticket para el día del sorteo</p>
      </div>
    </div>
  </div>
)

export default function ConfirmacionPage() {
  const searchParams = useSearchParams()
  const sorteoId = searchParams.get("sorteoId")
  const [compraData, setCompraData] = useState<ParticipanteData | null>(null)
  const [downloading, setDownloading] = useState(false)
  const ticketRefs = useRef<(HTMLDivElement | null)[]>([])
  const [sorteoInfo, setSorteoInfo] = useState<any>(null)

  useEffect(() => {
    // Cargar datos de la compra
    const data = localStorage.getItem("ultimaCompra")
    if (data) {
      const parsed = JSON.parse(data)
      setCompraData(parsed)
      if (parsed.participante?.tickets) {
        ticketRefs.current = new Array(parsed.participante.tickets.length).fill(null)
      }
    }

    // Cargar información del sorteo
    if (sorteoId) {
      fetch(`/api/sorteos/${sorteoId}`)
        .then(res => res.json())
        .then(data => setSorteoInfo(data))
        .catch(console.error)
    }
  }, [sorteoId])

  const descargarTicket = async (index: number) => {
    const element = ticketRefs.current[index]
    if (!element || !compraData) return

    setDownloading(true)
    element.style.display = "block"
    element.style.position = "fixed"
    element.style.top = "-9999px"
    element.style.left = "-9999px"

    try {
      const canvas = await html2canvas(element, { 
        scale: 2, 
        backgroundColor: "#ffffff",
        logging: false
      })
      
      const link = document.createElement("a")
      link.download = `ticket-${compraData.participante.tickets[index].codigo}.png`
      link.href = canvas.toDataURL("image/png")
      link.click()
    } catch (error) {
      console.error("Error al descargar ticket:", error)
    } finally {
      element.style.display = "none"
      setDownloading(false)
    }
  }

  const descargarTodos = async () => {
    if (!compraData?.participante?.tickets) return
    
    for (let i = 0; i < compraData.participante.tickets.length; i++) {
      await descargarTicket(i)
      await new Promise(resolve => setTimeout(resolve, 500))
    }
  }

  if (!compraData || !compraData.participante) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">No hay información de compra disponible</p>
          <Link href="/" className="text-blue-600 hover:underline mt-4 inline-block">
            Volver al inicio
          </Link>
        </div>
      </div>
    )
  }

  const { participante } = compraData
  const tituloSorteo = sorteoInfo?.titulo || "Sorteo"
  const fechaSorteo = sorteoInfo?.fechaSorteo 
    ? new Date(sorteoInfo.fechaSorteo).toLocaleDateString('es-PE', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    : "Por anunciar"

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Encabezado de éxito */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">¡Compra Exitosa!</h1>
            <p className="text-gray-600">Tu registro ha sido completado exitosamente</p>
          </div>

          {/* Detalles de la compra */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Detalles de tu compra:</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
              <div>
                <p className="font-medium">Participante:</p>
                <p>{participante.nombres} {participante.apellidos}</p>
              </div>
              <div>
                <p className="font-medium">DNI:</p>
                <p>{participante.dni}</p>
              </div>
              <div>
                <p className="font-medium">Email:</p>
                <p>{participante.email}</p>
              </div>
              <div>
                <p className="font-medium">Teléfono:</p>
                <p>{participante.telefono}</p>
              </div>
              <div>
                <p className="font-medium">Cantidad de tickets:</p>
                <p>{participante.cantidad}</p>
              </div>
              <div>
                <p className="font-medium">Sorteo:</p>
                <p>{tituloSorteo}</p>
              </div>
            </div>
          </div>

          {/* Tickets */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Tus Tickets ({participante.tickets?.length || 0})
              </h2>
              {participante.tickets && participante.tickets.length > 1 && (
                <button
                  onClick={descargarTodos}
                  disabled={downloading}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {downloading ? "Descargando..." : "Descargar todos"}
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {participante.tickets?.map((ticket, index) => (
                <div key={ticket.codigo} className="relative group">
                  <TicketDisplay
                    codigo={ticket.codigo}
                    numeroTicket={ticket.numeroTicket}
                    sorteoTitulo={tituloSorteo}
                    nombres={participante.nombres}
                    apellidos={participante.apellidos}
                    dni={participante.dni}
                  />
                  
                  {/* Ticket oculto para descarga */}
                  <TicketForDownload
                    codigo={ticket.codigo}
                    numeroTicket={ticket.numeroTicket}
                    sorteoTitulo={tituloSorteo}
                    nombres={participante.nombres}
                    apellidos={participante.apellidos}
                    dni={participante.dni}
                    fechaSorteo={fechaSorteo}
                    ticketRef={(el) => { ticketRefs.current[index] = el }}
                  />
                  
                  {/* Botón de descarga */}
                  <button
                    onClick={() => descargarTicket(index)}
                    className="absolute top-2 right-2 bg-gray-800 bg-opacity-70 hover:bg-opacity-90 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Descargar este ticket"
                    disabled={downloading}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Nota importante */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <p className="text-blue-800 text-sm">
              <strong>Importante:</strong> Hemos enviado un correo con los detalles de tu compra. 
              Guarda tus tickets para el día del sorteo. ¡Mucha suerte! 
            </p>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href="/"
              className="flex-1 text-center bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-lg transition-colors"
            >
              Volver al inicio
            </Link>
            <Link 
              href="/sorteos"
              className="flex-1 text-center bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 rounded-lg transition-all"
            >
              Ver más sorteos
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"

interface FormData {
  dni: string
  nombres: string
  apellidos: string
  telefono: string
  email: string
  departamento: string
  cantidad: number
}

const initialFormState: FormData = {
  dni: "",
  nombres: "",
  apellidos: "",
  telefono: "",
  email: "",
  departamento: "Lima",
  cantidad: 1,
}

const departamentos = [
  "Amazonas","Áncash","Apurímac","Arequipa","Ayacucho","Cajamarca","Callao",
  "Cusco","Huancavelica","Huánuco","Ica","Junín","La Libertad","Lambayeque",
  "Lima","Loreto","Madre de Dios","Moquegua","Pasco","Piura","Puno","San Martín",
  "Tacna","Tumbes","Ucayali",
]

export default function RegistroPage() {
  const params = useParams()
  const router = useRouter()
  const sorteoId = params.id as string
  
  const [formData, setFormData] = useState<FormData>(initialFormState)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [sorteo, setSorteo] = useState<any>(null)
  const [loadingSorteo, setLoadingSorteo] = useState(true)

  useEffect(() => {
    const fetchSorteo = async () => {
      try {
        const res = await fetch(`/api/sorteos/${sorteoId}`)
        if (!res.ok) throw new Error("Sorteo no encontrado")
        const data = await res.json()
        setSorteo(data)
      } catch (err) {
        setError("Error al cargar el sorteo")
      } finally {
        setLoadingSorteo(false)
      }
    }
    fetchSorteo()
  }, [sorteoId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const incrementarTickets = () => setFormData((p) => ({ ...p, cantidad: Math.min(p.cantidad + 1, 10) }))
  const decrementarTickets = () => setFormData((p) => ({ ...p, cantidad: Math.max(p.cantidad - 1, 1) }))

  const validarDNI = (dni: string) => /^\d{8}$/.test(dni)
  const validarEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const validarTelefono = (tel: string) => /^9\d{8}$/.test(tel)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    if (!formData.dni || !formData.nombres || !formData.apellidos || !formData.telefono || !formData.email) {
      setError("Todos los campos son obligatorios")
      setLoading(false)
      return
    }

    if (!validarDNI(formData.dni)) {
      setError("El DNI debe tener 8 dígitos numéricos")
      setLoading(false)
      return
    }
    if (!validarTelefono(formData.telefono)) {
      setError("El teléfono debe empezar en 9 y tener 9 dígitos")
      setLoading(false)
      return
    }
    if (!validarEmail(formData.email)) {
      setError("El email no es válido")
      setLoading(false)
      return
    }

    try {
      const res = await fetch("/api/participantes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          sorteoId,
          cantidad: Number(formData.cantidad),
        }),
      })

      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Error al registrar")

      setSuccess("¡Registro exitoso! Revisa tu correo para los detalles de tu compra.")
      localStorage.setItem("ultimaCompra", JSON.stringify(json))
      
      setTimeout(() => {
        router.push(`/confirmacion?sorteoId=${sorteoId}`)
      }, 2000)
    } catch (err: any) {
      setError(err.message || "Algo salió mal")
    } finally {
      setLoading(false)
    }
  }

  if (loadingSorteo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando información del sorteo...</p>
        </div>
      </div>
    )
  }

  if (!sorteo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Sorteo no encontrado</p>
          <Link href="/sorteos" className="text-blue-600 hover:underline mt-4 inline-block">
            Volver a sorteos
          </Link>
        </div>
      </div>
    )
  }

  const precioTicket = parseFloat(sorteo.precio)

  return (
    <main className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 flex flex-col lg:flex-row gap-8 max-w-7xl">
        {/* INFO SORTEO - Lado Izquierdo */}
        <div className="w-full lg:w-2/5">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden sticky top-8">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
              <h2 className="text-2xl font-bold">{sorteo.titulo}</h2>
            </div>

            <div className="relative h-64 bg-gray-100">
              {sorteo.imagenUrl ? (
                <Image
                  src={sorteo.imagenUrl}
                  alt={sorteo.titulo}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <svg className="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              <div className="absolute top-4 right-4 bg-green-600 text-white text-lg font-bold py-2 px-4 rounded-lg shadow-lg">
                S/ {precioTicket.toFixed(2)}
              </div>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-gray-700 text-base leading-relaxed">{sorteo.descripcion}</p>
              
              <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">Precio por ticket:</span>
                    <span className="text-lg font-bold text-gray-900">S/ {precioTicket.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">Cantidad:</span>
                    <span className="text-lg font-bold text-gray-900">{formData.cantidad}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-800">Total a pagar:</span>
                      <span className="text-2xl font-bold text-green-600">
                        S/ {(precioTicket * formData.cantidad).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <p className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="font-medium">Fecha del sorteo:</span>
                  <span className="ml-1">{new Date(sorteo.fechaSorteo).toLocaleDateString('es-PE', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </p>
                <p className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                  <span className="font-medium">Tickets disponibles:</span>
                  <span className="ml-1 font-bold text-green-600">{sorteo.ticketsDisponibles}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FORMULARIO - Lado Derecho */}
        <div className="w-full lg:w-3/5">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
              Completa tu Registro
            </h2>

            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg">
                <p className="font-medium">Error</p>
                <p>{error}</p>
              </div>
            )}
            {success && (
              <div className="mb-6 bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-lg">
                <p className="font-medium">¡Éxito!</p>
                <p>{success}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    DNI <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="dni"
                    placeholder="12345678"
                    value={formData.dni}
                    onChange={handleChange}
                    maxLength={8}
                    pattern="\d{8}"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 font-medium placeholder-gray-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Teléfono <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="telefono"
                    placeholder="987654321"
                    value={formData.telefono}
                    onChange={handleChange}
                    maxLength={9}
                    pattern="9\d{8}"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 font-medium placeholder-gray-400"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nombres <span className="text-red-500">*</span>
                </label>
                <input
                  name="nombres"
                  placeholder="Juan Carlos"
                  value={formData.nombres}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 font-medium placeholder-gray-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Apellidos <span className="text-red-500">*</span>
                </label>
                <input
                  name="apellidos"
                  placeholder="Pérez García"
                  value={formData.apellidos}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 font-medium placeholder-gray-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="correo@ejemplo.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 font-medium placeholder-gray-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Departamento <span className="text-red-500">*</span>
                </label>
                <select
                  name="departamento"
                  value={formData.departamento}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 font-medium"
                  required
                >
                  {departamentos.map((d) => (
                    <option key={d} value={d} className="text-gray-900">{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Cantidad de tickets
                </label>
                <div className="flex items-center justify-center">
                  <button
                    type="button"
                    onClick={decrementarTickets}
                    className="px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-l-lg transition-colors text-xl font-bold"
                    disabled={formData.cantidad <= 1}
                  >
                    -
                  </button>
                  <input
                    readOnly
                    value={formData.cantidad}
                    className="w-20 text-center py-3 border-y-2 border-gray-300 text-xl font-bold text-gray-900"
                  />
                  <button
                    type="button"
                    onClick={incrementarTickets}
                    className="px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-r-lg transition-colors text-xl font-bold"
                    disabled={formData.cantidad >= 10}
                  >
                    +
                  </button>
                </div>
                <p className="text-center text-sm text-gray-500 mt-2">Máximo 10 tickets por persona</p>
              </div>

              <div className="flex items-start space-x-3 bg-gray-50 p-4 rounded-lg">
                <input 
                  type="checkbox" 
                  required 
                  className="mt-1 w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  id="terminos"
                />
                <label htmlFor="terminos" className="text-sm text-gray-700">
                  Acepto los{" "}
                  <Link href="/terminos" className="text-purple-600 hover:text-purple-700 font-semibold underline">
                    Términos y Condiciones
                  </Link>
                  {" "}y autorizo el procesamiento de mis datos personales para participar en el sorteo.
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 text-lg rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Procesando...
                  </span>
                ) : (
                  `Comprar Tickets - S/ ${(precioTicket * formData.cantidad).toFixed(2)}`
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}

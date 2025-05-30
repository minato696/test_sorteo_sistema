"use client"

import { useState } from "react"

interface CompraFormProps {
  onSubmit: (data: any) => void
  loading?: boolean
  sorteoId: string
}

export default function CompraForm({ onSubmit, loading, sorteoId }: CompraFormProps) {
  const [formData, setFormData] = useState({
    dni: "",
    nombres: "",
    apellidos: "",
    telefono: "",
    email: "",
    departamento: "Lima",
    cantidad: 1
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">DNI</label>
          <input
            type="text"
            name="dni"
            value={formData.dni}
            onChange={handleChange}
            maxLength={8}
            pattern="[0-9]{8}"
            required
            className="w-full px-3 py-2 border rounded-md"
            placeholder="12345678"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Teléfono</label>
          <input
            type="tel"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            maxLength={9}
            pattern="[0-9]{9}"
            required
            className="w-full px-3 py-2 border rounded-md"
            placeholder="987654321"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nombres</label>
          <input
            type="text"
            name="nombres"
            value={formData.nombres}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Apellidos</label>
          <input
            type="text"
            name="apellidos"
            value={formData.apellidos}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Departamento</label>
          <select
            name="departamento"
            value={formData.departamento}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="Lima">Lima</option>
            <option value="Arequipa">Arequipa</option>
            <option value="Cusco">Cusco</option>
            <option value="Trujillo">Trujillo</option>
            <option value="Piura">Piura</option>
            <option value="Lambayeque">Lambayeque</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Cantidad de Tickets</label>
          <input
            type="number"
            name="cantidad"
            value={formData.cantidad}
            onChange={handleChange}
            min="1"
            max="10"
            required
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Procesando..." : "Comprar Tickets"}
      </button>
    </form>
  )
}

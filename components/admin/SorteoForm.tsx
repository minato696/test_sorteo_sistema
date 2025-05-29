"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SorteoSerializado } from "@/types";
import { EstadoSorteo } from "@prisma/client";

interface SorteoFormProps {
  sorteo?: SorteoSerializado;
}

export function SorteoForm({ sorteo }: SorteoFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    titulo: sorteo?.titulo || "",
    descripcion: sorteo?.descripcion || "",
    imagenUrl: sorteo?.imagenUrl || "",
    precio: sorteo?.precio || "",
    fechaSorteo: sorteo?.fechaSorteo ? new Date(sorteo.fechaSorteo).toISOString().split("T")[0] : "",
    ticketsTotales: sorteo?.ticketsTotales || 100,
    estado: sorteo?.estado || EstadoSorteo.PROXIMO,
    premio: sorteo?.premio || "",
    valorPremio: sorteo?.valorPremio || "",
    destacado: sorteo?.destacado || false,
    proximamente: sorteo?.proximamente || false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let imagenUrl = formData.imagenUrl;

      // Si hay una imagen nueva, subirla primero
      if (imageFile) {
        const formDataImage = new FormData();
        formDataImage.append("file", imageFile);

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formDataImage,
        });

        if (!uploadResponse.ok) {
          throw new Error("Error al subir la imagen");
        }

        const { url } = await uploadResponse.json();
        imagenUrl = url;
      }

      const url = sorteo
        ? `/api/admin/sorteos/${sorteo.id}`
        : "/api/admin/sorteos";
      
      const method = sorteo ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          imagenUrl,
          precio: parseFloat(formData.precio),
          valorPremio: formData.valorPremio ? parseFloat(formData.valorPremio) : null,
          fechaSorteo: new Date(formData.fechaSorteo).toISOString(),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Error al guardar el sorteo");
      }

      router.push("/admin/sorteos");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Título *
          </label>
          <input
            type="text"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Premio *
          </label>
          <input
            type="text"
            name="premio"
            value={formData.premio}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Precio por Ticket (S/) *
          </label>
          <input
            type="number"
            name="precio"
            value={formData.precio}
            onChange={handleChange}
            required
            min="0.01"
            step="0.01"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Valor del Premio (S/)
          </label>
          <input
            type="number"
            name="valorPremio"
            value={formData.valorPremio}
            onChange={handleChange}
            min="0"
            step="0.01"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha del Sorteo *
          </label>
          <input
            type="date"
            name="fechaSorteo"
            value={formData.fechaSorteo}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Total de Tickets *
          </label>
          <input
            type="number"
            name="ticketsTotales"
            value={formData.ticketsTotales}
            onChange={handleChange}
            required
            min="1"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Estado *
          </label>
          <select
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value={EstadoSorteo.PROXIMO}>Próximo</option>
            <option value={EstadoSorteo.ACTIVO}>Activo</option>
            <option value={EstadoSorteo.FINALIZADO}>Finalizado</option>
            <option value={EstadoSorteo.CANCELADO}>Cancelado</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Imagen
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          {formData.imagenUrl && !imageFile && (
            <p className="text-sm text-gray-500 mt-1">
              Imagen actual: {formData.imagenUrl}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Descripción *
        </label>
        <textarea
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          required
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>

      <div className="flex items-center gap-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            name="destacado"
            checked={formData.destacado}
            onChange={handleChange}
            className="mr-2"
          />
          <span className="text-sm font-medium text-gray-700">Destacado</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            name="proximamente"
            checked={formData.proximamente}
            onChange={handleChange}
            className="mr-2"
          />
          <span className="text-sm font-medium text-gray-700">Próximamente</span>
        </label>
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Guardando..." : sorteo ? "Actualizar" : "Crear"} Sorteo
        </button>
      </div>
    </form>
  );
}

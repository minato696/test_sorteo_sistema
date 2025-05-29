"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

interface DeleteSorteoButtonProps {
  sorteoId: string;
}

export function DeleteSorteoButton({ sorteoId }: DeleteSorteoButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de eliminar este sorteo? Esta acción no se puede deshacer.")) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/sorteos/${sorteoId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.refresh();
      } else {
        alert("Error al eliminar el sorteo");
      }
    } catch (error) {
      alert("Error al eliminar el sorteo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-red-600 hover:text-red-900 disabled:opacity-50"
      title="Eliminar"
    >
      <Trash2 className="w-5 h-5" />
    </button>
  );
}

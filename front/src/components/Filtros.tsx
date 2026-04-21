import React from "react";

type FiltrosType = {
  nombre: string;
  modalidad: string;
  nivel: string;
};

interface FiltrosProps {
  filtros: FiltrosType;
  setFiltros: React.Dispatch<React.SetStateAction<FiltrosType>>;
}

export default function Filtros({ filtros, setFiltros }: FiltrosProps) {
  return (
    <div className="mb-6 flex flex-col md:flex-row gap-4">
      
      <input
        placeholder="Buscar por nombre"
        className="border p-2"
        value={filtros.nombre}
        onChange={(e) =>
          setFiltros({ ...filtros, nombre: e.target.value })
        }
      />

      <select
        className="border p-2"
        value={filtros.modalidad}
        onChange={(e) =>
          setFiltros({ ...filtros, modalidad: e.target.value })
        }
      >
        <option value="">Todas</option>
        <option>Presencial</option>
        <option>Virtual</option>
        <option>Híbrido</option>
      </select>

      <select
        className="border p-2"
        value={filtros.nivel}
        onChange={(e) =>
          setFiltros({ ...filtros, nivel: e.target.value })
        }
      >
        <option value="">Todos</option>
        <option>Principiante</option>
        <option>Intermedio</option>
        <option>Avanzado</option>
      </select>

      <button
        className="bg-red-500 text-white px-4 py-2 rounded"
        onClick={() =>
          setFiltros({ nombre: "", modalidad: "", nivel: "" })
        }
      >
        Eliminar filtros
      </button>
    </div>
  );
}
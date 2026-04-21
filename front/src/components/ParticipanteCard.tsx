import { useContext } from "react";
import { type Participante } from "../models/Participante";
import { ParticipantesContext } from "../context/ParticipantesContext";

interface ParticipanteCardProps {
  participante: Participante;
}

export default function ParticipanteCard({ participante }: ParticipanteCardProps) {
  const context = useContext(ParticipantesContext);
  if (!context)
    throw new Error("useContext debe estar dentro de ParticipantesProvider");

  const { eliminar, setParticipanteEnEdicion } = context;

  const handleEdit = () => {
    setParticipanteEnEdicion(participante);
    // Scroll al formulario
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  let backgroundColor = "";

  if (participante.nivel === "Principiante") {
    backgroundColor = "bg-green-300";
  } else if (participante.nivel === "Intermedio") {
    backgroundColor = "bg-yellow-300";
  } else {
    backgroundColor = "bg-red-400";
  }

  return (
    <div
      className={`shadow rounded p-4 hover:shadow-lg transition ${backgroundColor}`}
    >
      <h3 className="font-bold">{participante.nombre}</h3>
      <p>{participante.pais}</p>
      <p>Modalidad: {participante.modalidad}</p>
      <p>Nivel: {participante.nivel}</p>
      <p>Tecnologías: {participante.tecnologias.join(" - ")}</p>

      <div className="flex gap-2 mt-2">
        <button
          onClick={handleEdit}
          className="flex-1 bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
        >
          Editar
        </button>
        <button
          onClick={() => eliminar(participante.id)}
          className="flex-1 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}
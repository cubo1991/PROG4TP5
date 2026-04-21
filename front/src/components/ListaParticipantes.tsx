import { type Participante } from "../models/Participante";
import ParticipanteCard from "./ParticipanteCard";

interface ListaParticipantesProps {
  participantes: Participante[];
  cantidadParticipantes: number;
}

export default function ListaParticipantes({
  participantes,
  cantidadParticipantes,
}: ListaParticipantesProps) {
  return (
    <>
      <p className="text-center text-gray-500 mt-6 font-bold pb-3">
        Mostrando {participantes.length} de {cantidadParticipantes} participantes
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {participantes.map((participante) => (
          <ParticipanteCard key={participante.id} participante={participante} />
        ))}
      </div>
    </>
  );
}

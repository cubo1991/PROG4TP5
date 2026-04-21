import { createContext, useReducer, useState, useEffect, type ReactNode } from "react";
import { type Participante } from "../models/Participante";
import {
  participantesReducer,
  type Action,
} from "../reducers/participantesReducer";

interface ContextType {
  participantes: Participante[];
  dispatch: React.Dispatch<Action>;
  agregar: (p: Participante) => void;
  eliminar: (id: number) => void;
  resetear: () => void;
  editar: (p: Participante) => void;
  participanteEnEdicion: Participante | null;
  setParticipanteEnEdicion: (p: Participante | null) => void;
}

export const ParticipantesContext = createContext<ContextType | undefined>(
  undefined
);

interface ParticipantesProviderProps {
  children: ReactNode;
}

export function ParticipantesProvider({ children }: ParticipantesProviderProps) {
  const [participantes, dispatch] = useReducer(participantesReducer, []);
  const [participanteEnEdicion, setParticipanteEnEdicion] =
    useState<Participante | null>(null);

  useEffect(() => {
    fetch("http://localhost:3000/participantes")
      .then((res) => res.json())
      .then((data) =>
        dispatch({ type: "GET_PARTICIPANTES", payload: data })
      )
      .catch((err) => console.error("Error al cargar participantes:", err));
  }, []);

  const agregar = async (p: Participante) => {
    try {
      const res = await fetch("http://localhost:3000/participantes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(p),
      });
      const nuevoParticipante = await res.json();
      dispatch({ type: "AGREGAR", payload: nuevoParticipante });
    } catch (err) {
      console.error("Error al agregar participante:", err);
    }
  };

  const editar = async (p: Participante) => {
    try {
      const res = await fetch(`http://localhost:3000/participantes/${p.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(p),
      });
      const participanteActualizado = await res.json();
      dispatch({ type: "EDITAR", payload: participanteActualizado });
      setParticipanteEnEdicion(null);
    } catch (err) {
      console.error("Error al editar participante:", err);
    }
  };

  const eliminar = async (id: number) => {
    try {
      await fetch(`http://localhost:3000/participantes/${id}`, {
        method: "DELETE",
      });
      dispatch({ type: "ELIMINAR", payload: id });
    } catch (err) {
      console.error("Error al eliminar participante:", err);
    }
  };

  const resetear = async () => {
    try {
      await fetch("http://localhost:3000/participantes", {
        method: "DELETE",
      });
      dispatch({ type: "RESET", payload: [] });
    } catch (err) {
      console.error("Error al resetear participantes:", err);
    }
  };

  return (
    <ParticipantesContext.Provider
      value={{
        participantes,
        dispatch,
        agregar,
        eliminar,
        resetear,
        editar,
        participanteEnEdicion,
        setParticipanteEnEdicion,
      }}
    >
      {children}
    </ParticipantesContext.Provider>
  );
}

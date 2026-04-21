import { useState, useContext, useEffect } from "react";
import { type Participante } from "../models/Participante";
import { ParticipantesContext } from "../context/ParticipantesContext";

type FormType = {
  nombre: string;
  email: string;
  edad: string;
  pais: string;
  modalidad: string;
  tecnologias: string[];
  nivel: string;
  aceptaTerminos: boolean;
};

export default function Formulario() {
  const context = useContext(ParticipantesContext);
  if (!context)
    throw new Error("useContext debe estar dentro de ParticipantesProvider");

  const { agregar, editar, participanteEnEdicion, setParticipanteEnEdicion } =
    context;
  const [isLoading, setIsLoading] = useState(false);

  const initialForm: FormType = {
    nombre: "",
    email: "",
    edad: "",
    pais: "Argentina",
    modalidad: "Presencial",
    tecnologias: [],
    nivel: "Principiante",
    aceptaTerminos: false,
  };

  const [form, setForm] = useState<FormType>(initialForm);

  // Efecto para cargar los datos cuando hay un participante en edición
  useEffect(() => {
    if (participanteEnEdicion) {
      setForm({
        nombre: participanteEnEdicion.nombre,
        email: participanteEnEdicion.email,
        edad: participanteEnEdicion.edad,
        pais: participanteEnEdicion.pais,
        modalidad: participanteEnEdicion.modalidad,
        tecnologias: participanteEnEdicion.tecnologias,
        nivel: participanteEnEdicion.nivel,
        aceptaTerminos: participanteEnEdicion.aceptaTerminos,
      });
    }
  }, [participanteEnEdicion]);

  const fullfilledForm =
    form.aceptaTerminos &&
    form.nombre &&
    form.email &&
    Number(form.edad) > 0 &&
    form.tecnologias.length > 0;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;

    if (type === "checkbox" && name === "tecnologias") {
      setForm((prev) => ({
        ...prev,
        tecnologias: checked
          ? [...prev.tecnologias, value]
          : prev.tecnologias.filter((t) => t !== value),
      }));
    } else if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (participanteEnEdicion) {
        // Editar participante existente
        const participanteActualizado: Participante = {
          ...form,
          id: participanteEnEdicion.id,
        };
        await editar(participanteActualizado);
      } else {
        // Crear nuevo participante
        const nuevoParticipante: Participante = {
          ...form,
          id: Date.now(),
        };
        await agregar(nuevoParticipante);
      }
      setForm(initialForm);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setForm(initialForm);
    setParticipanteEnEdicion(null);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
    >
      <input
        name="nombre"
        value={form.nombre}
        onChange={handleChange}
        placeholder="Nombre"
        className="border p-2"
        required
      />

      <input
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
        className="border p-2"
        required
      />

      <input
        name="edad"
        type="number"
        value={form.edad}
        onChange={handleChange}
        placeholder="Edad"
        className="border p-2"
        required
      />

      <select
        name="pais"
        value={form.pais}
        onChange={handleChange}
        className="border p-2"
      >
        <option>Argentina</option>
        <option>Chile</option>
        <option>Uruguay</option>
        <option>México</option>
        <option>España</option>
      </select>

      <div className="flex gap-4">
        {["Presencial", "Virtual", "Híbrido"].map((m) => (
          <label key={m}>
            <input
              type="radio"
              name="modalidad"
              value={m}
              checked={form.modalidad === m}
              onChange={handleChange}
            />{" "}
            {m}
          </label>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3">
        {["React", "Angular", "Vue", "Node", "Python", "Java"].map((t) => (
          <label key={t}>
            <input
              type="checkbox"
              name="tecnologias"
              value={t}
              checked={form.tecnologias.includes(t)}
              onChange={handleChange}
            />{" "}
            {t}
          </label>
        ))}
      </div>

      <select
        name="nivel"
        value={form.nivel}
        onChange={handleChange}
        className="border p-2"
      >
        <option>Principiante</option>
        <option>Intermedio</option>
        <option>Avanzado</option>
      </select>

      <label>
        <input
          type="checkbox"
          name="aceptaTerminos"
          checked={form.aceptaTerminos}
          onChange={handleChange}
        />{" "}
        Acepto términos
      </label>

      <button
        type="submit"
        disabled={!fullfilledForm || isLoading}
        className={`px-4 py-2 rounded col-span-1 md:col-span-2 ${
          fullfilledForm && !isLoading
            ? "bg-blue-600 hover:bg-blue-700 text-white"
            : "bg-gray-400 text-white cursor-not-allowed"
        }`}
      >
        {isLoading
          ? "Procesando..."
          : participanteEnEdicion
            ? "Actualizar"
            : "Registrar"}
      </button>

      {participanteEnEdicion && (
        <button
          type="button"
          onClick={handleCancel}
          className="px-4 py-2 rounded col-span-1 md:col-span-2 bg-gray-500 hover:bg-gray-600 text-white"
        >
          Cancelar
        </button>
      )}
    </form>
  );
}
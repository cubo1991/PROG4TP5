import { useState, useContext } from "react";
import Formulario from "./components/Formulario";
import Filtros from "./components/Filtros";
import ListaParticipantes from "./components/ListaParticipantes";
import Modal from "./components/Modal";
import { ParticipantesContext } from "./context/ParticipantesContext";


function App() {
  const context = useContext(ParticipantesContext);
  if (!context) throw new Error("useContext debe estar dentro de ParticipantesProvider");
  
  const { participantes, resetear } = context;
  const [warningDelete, setWarningDelete] = useState(false);
  const [filtros, setFiltros] = useState({
    nombre: "",
    modalidad: "",
    nivel: "",
  });

  const participantesFiltrados = participantes.filter((p) => {
    return (
      p.nombre.toLowerCase().includes(filtros.nombre.toLowerCase()) &&
      (filtros.modalidad === "" || p.modalidad === filtros.modalidad) &&
      (filtros.nivel === "" || p.nivel === filtros.nivel)
    );
  });

  const vaciarTodos = () => {    
    resetear();
    setWarningDelete(false);
  }

  return (
    
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">
        Registro de Participantes
      </h1>
      
      <p className="font-bold text-center mb-6">Contador de participantes: {participantes.length}</p>
      <div className="flex justify-center mb-4">

        {
          participantes.length 
          ?
        <button
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={() => setWarningDelete(true)}
        >
          Eliminar a todos los participantes  
        </button>
        :
          null
        }
      </div>

      <Formulario />

      <Filtros filtros={filtros} setFiltros={setFiltros} />

      <ListaParticipantes participantes={participantesFiltrados} cantidadParticipantes={participantes.length} />
      {
        warningDelete
        ?
        <Modal text="¿Estás seguro que querés eliminar todos los participantes?" onClose={() => setWarningDelete(false)} onConfirm={vaciarTodos}  />
        :
        null
      }

      {participantes.length === 0 && (
        <p className="text-center text-gray-500 mt-6">No hay participantes</p>
      )}
    </div>

    
  );
}

export default App;
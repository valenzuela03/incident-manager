import { useState, useEffect } from "react";
import SelectEquipmentIncidentModal from "../modals/SelectEquipmentIncidentModal";
import Cookies from "js-cookie";
interface CreateIncidentFormProps {
  user: any;
}

const CreateIncidentForm = ({ user }: CreateIncidentFormProps) => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [assignedEquipment, setAssignedEquipment] = useState<any | null>(null);
  const [equipmentList, setEquipmentList] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/task/getAllBuildEquip"
        );
        if (!response.ok) {
          throw new Error("Error al obtener los equipos");
        }
        const data = await response.json();
        setEquipmentList(data);
      } catch (err) {
        console.error(err);
        setError("Error al cargar los equipos");
      }
    };

    fetchEquipment();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const userId = user._id;
    const token = Cookies.get("authToken");

    if (!assignedEquipment) {
        setError("Debes seleccionar un equipo antes de crear la incidencia.");
        return;
    }

    const response = await fetch("http://localhost:8080/task/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        subject,
        message,
        createdBy: userId,
        assignedEquipment: assignedEquipment._id,
        creationDate: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      const { error } = await response.json();
      setError(error);
    } else {
      const { task } = await response.json();
      setSuccess(`Incidencia creada: ${task.subject}`);
      setSubject("");
      setMessage("");
      setAssignedEquipment(null);
      setIsModalOpen(false);
    }
  };

  const handleSelectEquipment = (building: any, equipment: any) => {
    setAssignedEquipment(equipment);
    console.log("Equipo seleccionado:", equipment);
  };

  const getCurrentDate = () => {
    const date = new Date();
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };


  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded shadow-md p-4 md:p-8"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-black">Crear Incidencia</h2>
          <span className="text-gray-600">FECHA: {getCurrentDate()}</span>
        </div>
        {error && <div className="mb-4 text-red-500">{error}</div>}
        {success && <div className="mb-4 text-green-500">{success}</div>}

        <div className="mb-4">
          <label className="block mb-1 text-black">Asunto</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="border border-gray-300 p-2 w-full rounded text-black"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-black">Mensaje</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="border border-gray-300 p-2 w-full rounded text-black"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-black">Equipo asignado</label>
          <div className="flex items-center">
            <input
              type="text"
              value={assignedEquipment ? assignedEquipment.name : ""}
              readOnly
              className="border border-gray-300 p-2 w-full rounded text-black mr-2"
            />
            <button
              type="button"
              onClick={() => {
                  setIsModalOpen(true);
              }}
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Seleccionar Equipo
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Crear Incidencia
        </button>
      </form>

      <SelectEquipmentIncidentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        equipmentList={equipmentList}
        onSelect={handleSelectEquipment}
      />
    </>
  );
};

export default CreateIncidentForm;

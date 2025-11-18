import React, { useState, useEffect, use } from "react";
import { TaskProps, UserProps } from "@/utils/types";
import Cookies from "js-cookie";

interface IncidentManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: TaskProps;
  user?: UserProps[];
  onUpdatedTask: (updatedTask: string) => void;
}

const IncidentManagementModal = ({
  isOpen,
  onClose,
  task,
  user,
  onUpdatedTask,
}: IncidentManagementModalProps) => {
  const [priority, setPriority] = useState("low");
  const [assignedTo, setAssignedTo] = useState("");
  const [type, setType] = useState("Hardware");
  const [filteredUsers, setFilteredUsers] = useState<UserProps[]>([]);

  useEffect(() => {
    setFilteredUsers(user?.filter((u) => u.speciality === type) || [])
  },[]);

  useEffect(() => {
    console.log("Usuarios filtrados:");
    if (filteredUsers.length > 0) {
      setAssignedTo(filteredUsers[0]._id);
    } else {
      setAssignedTo("");
    }
  }, [filteredUsers]);

  if (!isOpen) return null;

  const handleSave = async () => {
    const isConfirmed = window.confirm(
      "¿Estás seguro de que deseas guardar los cambios?"
    );
    const authToken = Cookies.get("authToken");
    if (isConfirmed) {
      const updatedTask = {
        taskId: task._id,
        priority,
        assignedTo,
        type,
      };

      console.log("Guardando cambios:", updatedTask);

      try {
        const response = await fetch("http://localhost:8080/task/authorize", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(updatedTask),
        });

        if (!response.ok) {
          throw new Error("Error al guardar los cambios");
        }

        console.log("Cambios guardados correctamente:", updatedTask);
        onUpdatedTask(task._id);
        onClose();
      } catch (error) {
        console.error("Error al guardar los cambios:", error);
        alert("Hubo un problema al guardar los cambios. Inténtalo nuevamente.");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-2xl p-6 w-[32rem] max-h-[80vh] overflow-auto border border-gray-700">
        <h2 className="text-2xl font-bold mb-4 text-white border-b border-gray-600 pb-2">
          ⚔️ Administrar Incidencia ⚔️
        </h2>

        <p className="text-gray-300 mb-2">
          Asunto: <span className="text-gray-100">{task.subject}</span>
        </p>
        <p className="text-gray-300 mb-2">
          Mensaje: <span className="text-gray-100">{task.message}</span>
        </p>
        <div className="mb-4">
          <label className="text-gray-400">Tipo:</label>
          <select
            className="block w-full mt-1 border border-gray-600 rounded bg-gray-700 text-gray-200 px-4 py-2 transition duration-200 ease-in-out shadow-inner focus:outline-none focus:ring-2 focus:ring-red-600 hover:bg-gray-600"
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              setFilteredUsers(user?.filter((u) => u.speciality === e.target.value) || []);
            }}
          >
            <option value="Hardware">Hardware</option>
            <option value="Software">Software</option>
            <option value="Network">Redes</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="text-gray-400">Prioridad:</label>
          <select
            className="block w-full mt-1 border border-gray-600 rounded bg-gray-700 text-gray-200 px-4 py-2 transition duration-200 ease-in-out shadow-inner focus:outline-none focus:ring-2 focus:ring-yellow-500 hover:bg-gray-600"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="low">Baja</option>
            <option value="medium">Media</option>
            <option value="high">Alta</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="text-gray-400">Asignado a:</label>
          <select
            className="block w-full mt-1 border border-gray-600 rounded bg-gray-700 text-gray-200 px-4 py-2 transition duration-200 ease-in-out shadow-inner focus:outline-none focus:ring-2 focus:ring-purple-500 hover:bg-gray-600"
            value={assignedTo}
            onChange={(e) => {
              setAssignedTo(e.target.value);
              console.log(e.target.value);
            }}
          >
            {filteredUsers.length > 0 ? (
              filteredUsers.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name}
                </option>
              ))
            ) : (
              <option value="">No hay usuarios disponibles</option>
            )}
          </select>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="bg-red-700 hover:bg-red-600 text-white py-2 px-4 rounded transition duration-200 ease-in-out shadow-md"
          >
            Cerrar
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-700 hover:bg-blue-600 text-white py-2 px-4 rounded ml-2 transition duration-200 ease-in-out shadow-md"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncidentManagementModal;

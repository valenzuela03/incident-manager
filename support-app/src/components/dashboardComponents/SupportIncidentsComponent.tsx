import React, { useEffect, useState } from "react";
import { TaskProps } from "@/utils/types";
import Cookies from "js-cookie";
import ChangeModal from "@/components/modals/ChangeGestorModal";
import ConfirmModal from "../modals/ConfirmModal";
import ServiceSelectionModal from "../modals/ServiceSelectionModal";

const SupportIncidentsComponent = () => {
  const [tasks, setTasks] = useState<TaskProps[]>([]);
  const [selectedTask, setSelectedTask] = useState<TaskProps | null>(null);
  const [selectedTask2 , setSelectedTask2] = useState<TaskProps | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [loadingData, setLoadingData] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isServiceSelectionModalOpen, setIsServiceSelectionModalOpen] =
    useState(false);
  const [taskToComplete, setTaskToComplete] = useState<string | null>(null);
  useEffect(() => {
    const token = Cookies.get("authToken");
    const fetchTasks = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/task/getMyAssignedTasks",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        setTasks(data);
        setLoadingData(true);
      } catch (error) {
        console.error("Error al obtener las tareas:", error);
      }
    };

    fetchTasks();
  }, []);

  const handleServiceSelect = async (taskId: string, service: string) => {
    try {
      const response = await fetch(`http://localhost:8080/task/setServiceType/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("authToken")}`, 
        },
        body: JSON.stringify({ serviceType: service }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error updating service type:", errorData.error);
        return;
      }
  
      const { task: updatedTask } = await response.json();
  
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? { ...task, serviceType: updatedTask.serviceType } : task
        )
      );
  
      console.log("Service type updated successfully:", updatedTask);
    } catch (error) {
      console.error("An error occurred while updating service type:", error);
    }
  };
  

  const handleGenerateChange = async (
    taskId: string,
    selectedPart: string,
    message: string,
    price: string
  ) => {
    const changeData = {
      piece: selectedPart,
      message,
      price,
      incident: taskId,
    };

    try {
      const token = Cookies.get("authToken");
      const response = await fetch("http://localhost:8080/change/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(changeData),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Cambio generado con éxito.");
        setSelectedTask(null);
        setSelectedTask2(null);

        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === taskId
              ? { ...task, changes: [...(task.changes || []), data.newChange] }
              : task
          )
        );
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error al generar el cambio:", error);
    }
  };

  const openConfirmModal = (taskId: string) => {
    setTaskToComplete(taskId);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmCompleteTask = async () => {
    if (!taskToComplete) return;
    try {
      const token = Cookies.get("authToken");
      const response = await fetch(
        `http://localhost:8080/task/complete/${taskToComplete}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (response.ok) {
        setTasks((prevTasks) =>
          prevTasks.filter((task) => task._id !== taskToComplete)
        );
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error al completar la tarea:", error);
    } finally {
      setIsConfirmModalOpen(false);
      setTaskToComplete(null);
    }
  };

  const canCompleteTask = (task: TaskProps) => {
    return (
      task.serviceType &&
      task.changes &&
      task.changes.every(
        (change) =>
          change.status === "rejected" || change.status === "completed"
      )
    );
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Mis Tareas Asignadas
      </h2>

      {!loadingData ? (
        <p className="text-black">Cargando...</p>
      ) : (
        <>
          {tasks.length === 0 ? (
            <p className="text-gray-500">
              No tienes tareas asignadas actualmente.
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {tasks.map((task) => (
                <div
                  key={task._id}
                  className="bg-white p-4 shadow-lg rounded-lg border-l-4 border-blue-500 flex flex-col justify-between hover:shadow-xl transition-shadow h-full"
                >
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {task.subject}
                    </h3>
                    <p className="text-gray-500">{task.message}</p>
                    <p
                      className={`mt-2 text-sm font-semibold ${
                        task.priority === "high"
                          ? "text-red-600"
                          : task.priority === "medium"
                          ? "text-orange-600"
                          : "text-yellow-600"
                      }`}
                    >
                      Prioridad:{" "}
                      {task.priority === "high"
                        ? "Alta"
                        : task.priority === "medium"
                        ? "Media"
                        : "Baja"}
                    </p>
                    <p
                      className={`text-sm mt-2 ${
                        task.status === "inProgress"
                          ? "text-blue-600"
                          : task.status === "completed"
                          ? "text-green-600"
                          : "text-gray-600"
                      }`}
                    >
                      Estado:{" "}
                      {task.status === "inProgress"
                        ? "En progreso"
                        : task.status === "completed"
                        ? "Completado"
                        : task.status}
                    </p>
                    <p className="text-gray-700 mt-3 p-3 border-l-4 border-blue-500 bg-gray-50 rounded-lg">
  <span className="font-semibold text-blue-600">Servicio Seleccionado:</span>{" "}
  <br />
  <span className={`text-sm ${task.serviceType ? 'text-green-600' : 'text-red-600'}`}>
    {task.serviceType || "No seleccionado"}
  </span>
</p>

                    <div className="mt-4">
                      <p className="text-xs font-semibold text-gray-800">
                        Cambios solicitados:
                      </p>
                      {task.changes && task.changes.length > 0 ? (
                        <ul className="text-xs text-gray-600 mt-2">
                          {task.changes.map((change) => (
                            <li key={change._id} className="mt-1">
                              {change.piece.type} - {change.piece.model}:
                              <span
                                className={`ml-2 font-semibold ${
                                  change.status === "pending"
                                    ? "text-orange-600"
                                    : change.status === "completed"
                                    ? "text-green-600"
                                    : change.status === "rejected"
                                    ? "text-red-600"
                                    : "text-gray-600"
                                }`}
                              >
                                {change.status === "pending"
                                  ? "Pendiente"
                                  : change.status === "completed"
                                  ? "Completado"
                                  : change.status === "rejected"
                                  ? "Rechazado"
                                  : change.status}
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-xs text-gray-500 mt-2">
                          No se han solicitado cambios
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <button
                      onClick={() => {
                        setSelectedTask2(task);
                        setIsServiceSelectionModalOpen(!isServiceSelectionModalOpen);
                      }}
                      className="w-full px-4 py-2 mt-2 bg-purple-500 text-white rounded hover:bg-purple-600"
                    >
                      Seleccionar servicio
                    </button>
                    <button
                      onClick={() => setSelectedTask(task)}
                      className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mt-2"
                    >
                      Solicitar cambios
                    </button>

                    <button
                      onClick={() =>
                        canCompleteTask(task)
                          ? openConfirmModal(task._id)
                          : null
                      }
                      className={`w-full px-4 py-2 mt-2 text-white rounded ${
                        canCompleteTask(task)
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-red-500 cursor-not-allowed"
                      }`}
                      disabled={!canCompleteTask(task)}
                    >
                      {canCompleteTask(task)
                        ? "Marcar como Completado"
                        : "Esperando actualizaciones"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {selectedTask && (
        <ChangeModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onGenerateChange={handleGenerateChange}
        />
      )}

      {isServiceSelectionModalOpen && (
        <ServiceSelectionModal
          isOpen={isServiceSelectionModalOpen}
          onClose={() => setIsServiceSelectionModalOpen(false)}
          onSelect={(service) => {
            if (selectedTask2) {
              handleServiceSelect(selectedTask2._id, service);
              setSelectedService(service);
            }
            setIsServiceSelectionModalOpen(false);
          }}
        />
      )}

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        message="¿Estás seguro de que deseas completar esta tarea?"
        onConfirm={handleConfirmCompleteTask}
        onCancel={() => setIsConfirmModalOpen(false)}
      />
    </div>
  );
};

export default SupportIncidentsComponent;

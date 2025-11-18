import React, { useState, useEffect } from "react";
import { ChangeProps } from "@/utils/types";
import Cookies from "js-cookie";
import ConfirmModal from "../modals/ConfirmModal";

const AdminChangesGestor = () => {
  const [changes, setChanges] = useState<ChangeProps[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<{ [id: string]: string }>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [changeIdToConfirm, setChangeIdToConfirm] = useState<string | null>(null); 
  const [message, setMessage] = useState("");

  const handleStatusChange = (id: string, status: string) => {
    setSelectedStatus((prev) => ({ ...prev, [id]: status }));
  };

  const fetchChanges = async () => {
    try {
      const res = await fetch("http://localhost:8080/change/getAll", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("authToken")}`,
        },
      });

      if (!res.ok) throw new Error("Error fetching changes");

      const data = await res.json();
      setChanges(data);
    } catch (error) {
      console.error("Error fetching changes:", error);
    }
  };

  useEffect(() => {
    fetchChanges();
  }, []);

  const updateChangeStatus = async (id: string, status: string) => {
    try {
      const authToken = Cookies.get("authToken");
      const res = await fetch(`http://localhost:8080/change/acceptChange/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      const data = await res.json();
      console.log(`Change updated successfully: ${data.message}`);

      setChanges((prev) => prev.filter((change) => change._id !== id));
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleSave = (id: string) => {
    const selected = selectedStatus[id];
    const currentStatus = changes.find((change) => change._id === id)?.status;

    if (selected && selected !== currentStatus) {
      setMessage(`¿Estás seguro de que deseas ${selected === "rejected" ? "rechazar" : "aceptar"} el cambio solicitado?`);
      setChangeIdToConfirm(id);
      setIsModalOpen(true); 
    } else {
      console.warn("Estado seleccionado es inválido o no cambió.");
    }
  };

  const handleConfirm = () => {
    if (changeIdToConfirm) {
      const selected = selectedStatus[changeIdToConfirm];
      updateChangeStatus(changeIdToConfirm, selected);
      setIsModalOpen(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false); 
  };

  return (
    <div className="p-6 text-black">
      <h2 className="text-2xl font-bold mb-6">Gestión de Cambios</h2>
      <div className="grid gap-6">
        {changes.length === 0 ? (
          <p className="text-lg">No hay cambios pendientes.</p>
        ) : (
          changes.map((change) => (
            <div
              key={change._id}
              className="border rounded-xl p-6 shadow-lg bg-white hover:shadow-xl transition-shadow"
            >
              <h3 className="text-2xl font-semibold mb-2">{change.piece.type}</h3>
              <p className="mb-2">
                <strong>Modelo:</strong> {change.piece.model}
              </p>
              <p className="mb-2">
                <strong>Mensaje:</strong> {change.message}
              </p>
              <p className="mb-2">
                <strong>Precio:</strong> ${change.price.toFixed(2)}
              </p>
              <p className="mb-2">
                <strong>Estado actual:</strong>{" "}
                {change.status === "pending"
                  ? "Pendiente"
                  : change.status === "approved"
                  ? "Aprobado"
                  : "Rechazado"}
              </p>
              <div className="mt-4">
                <label
                  htmlFor={`status-${change._id}`}
                  className="block text-sm font-medium mb-1"
                >
                  Cambiar Estado
                </label>
                <select
                  id={`status-${change._id}`}
                  className="border rounded-lg p-2 w-full"
                  value={selectedStatus[change._id] || ""}
                  onChange={(e) =>
                    handleStatusChange(change._id, e.target.value)
                  }
                >
                  <option value="" disabled>
                    Seleccione un estado
                  </option>
                  <option value="completed">Aprobar</option>
                  <option value="rejected">Rechazar</option>
                </select>
              </div>
              <button
                className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                onClick={() => handleSave(change._id)}
              >
                Guardar Cambios
              </button>
            </div>
          ))
        )}
      </div>

      <ConfirmModal
        isOpen={isModalOpen}
        message={message}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default AdminChangesGestor;

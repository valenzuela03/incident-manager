import React, { useState } from "react";

interface AddBuildingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBuilding: (name: string, inCharge: string) => void;
  userId: string;
}

const AddBuildingModal= ({
  isOpen,
  onClose,
  onAddBuilding,
  userId, 
} : AddBuildingModalProps ) => {
  const [newBuildingName, setNewBuildingName] = useState("");

  const handleAdd = () => {
    if (newBuildingName) {
      onAddBuilding(newBuildingName, userId); 
      setNewBuildingName("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-md">
        <h2 className="text-lg font-semibold mb-4 text-black">Agregar Nuevo Edificio</h2>
        
        <input
          type="text"
          value={newBuildingName}
          onChange={(e) => setNewBuildingName(e.target.value)}
          className="border rounded-md p-2 w-full mb-2 text-black"
          placeholder="Nombre del edificio"
        />
        <div className="flex justify-end">
          <button
            onClick={handleAdd}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mr-2"
          >
            Agregar
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddBuildingModal;

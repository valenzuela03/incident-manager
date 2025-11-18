import React from 'react';

interface Equipment {
  id: number;
  name: string;
  type: string;
  status: string;
}

interface EquipmentModalProps {
  isOpen: boolean;
  newEquipment: Equipment;
  setNewEquipment: (equipment: Equipment) => void;
  onClose: () => void;
  onAdd: () => void;
}

const EquipmentModal = ({
  isOpen,
  newEquipment,
  setNewEquipment,
  onClose,
  onAdd,
} : EquipmentModalProps ) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/3">
        <h3 className="text-lg font-semibold mb-4 text-black">Agregar Nuevo Equipamiento</h3>
        <input
          type="text"
          placeholder="Nombre"
          className="border rounded-md p-2 w-full mb-4 text-gray-800"
          value={newEquipment.name}
          onChange={(e) => setNewEquipment({ ...newEquipment, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Tipo"
          className="border rounded-md p-2 w-full mb-4 text-gray-800"
          value={newEquipment.type}
          onChange={(e) => setNewEquipment({ ...newEquipment, type: e.target.value })}
        />
        <select
          className="border rounded-md p-2 w-full mb-4 text-black"
          value={newEquipment.status}
          onChange={(e) => setNewEquipment({ ...newEquipment, status: e.target.value })}
        >
          <option value="Disponible">Disponible</option>
          <option value="En uso">En uso</option>
          <option value="Mantenimiento">Mantenimiento</option>
        </select>
        <div className="flex justify-end">
          <button 
            onClick={onAdd} 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Agregar
          </button>
          <button 
            onClick={onClose} 
            className="ml-2 border bg-red-600 rounded-md px-4 py-2 hover:bg-red-700 text-white"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EquipmentModal;

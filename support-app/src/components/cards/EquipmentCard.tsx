import React from 'react';

interface Equipment {
  id: number;
  name: string;
  type: string;
  status: string;
}

interface EquipmentCardProps {
  equipment: Equipment;
}

const EquipmentCard = ({ equipment }: EquipmentCardProps) => {
  return (
    <div className="border rounded-lg p-4 shadow-md hover:shadow-lg transition">
      <h3 className="text-lg font-semibold text-black">{equipment.name}</h3>
      <p className="text-gray-600">Tipo: {equipment.type}</p>
      <p className="text-gray-600">Estado: {equipment.status}</p>
      <div className="mt-4">
        <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
          Ver Detalles
        </button>
      </div>
    </div>
  );
};

export default EquipmentCard;

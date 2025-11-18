import React from 'react';
import { EquipmentProps, PartProps } from '@/utils/types';

interface EquipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEquipment: EquipmentProps | null;
}

const EquipmenInfotModal = ({
  isOpen,
  onClose,
  selectedEquipment,
} : EquipmentModalProps) => {
  if (!isOpen || !selectedEquipment) return null;

  const { name, type, operatingSystem, available, parts = [] } = selectedEquipment;
  const availabilityClass = available ? 'text-green-500' : 'text-red-500';

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg md:w-full max-h-[80vh] max-w-md w-72 overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-7 text-gray-500 hover:text-gray-800"
        >
          &times;
        </button>

        <h2 className="text-2xl font-semibold text-gray-800">{name}</h2>
        <p className="text-gray-600">Tipo: {type}</p>
        {operatingSystem && <p className="text-gray-600">Sistema Operativo: {operatingSystem}</p>}
        <p className={`text-sm ${availabilityClass}`}>
          {available ? 'Disponible' : 'No Disponible'}
        </p>

        <div className="mt-4">
          <h3 className="font-semibold text-lg text-gray-700">Partes:</h3>
          <ul className="mt-2 space-y-2">
  {parts.length > 0 ? (
    parts.map((part) => (
      <li key={part._id} className="p-2 border rounded-lg">
        <p className="text-gray-700">Tipo: {part.type}</p>
        <p className="text-gray-700">Modelo: {part.model}</p>
        <p className="text-gray-700">Cantidad: {part.quantity}</p>
      </li>
    ))
  ) : (
    <p className="text-gray-700">No hay componentes.</p>
  )}
</ul>

        </div>
      </div>
    </div>
  );
};

export default EquipmenInfotModal;

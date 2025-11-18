import React from 'react';

interface SpecialtyModalProps {
  isOpen: boolean;
  onConfirm: (specialty: string) => void;
  onCancel: () => void;
  message: string;
}

const SpecialtyModal = ({ isOpen, onConfirm, onCancel, message } : SpecialtyModalProps) => {
  const [specialty, setSpecialty] = React.useState<string>('');

  const handleSpecialtyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSpecialty(event.target.value);
  };

  const handleConfirm = () => {
    if (specialty) {
      onConfirm(specialty);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-500 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h3 className="text-lg font-semibold mb-4">{message}</h3>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Selecciona la especialidad:</label>
          <select
            className="p-2 rounded-md border border-gray-300 w-full"
            value={specialty}
            onChange={handleSpecialtyChange}
          >
            <option value="">Seleccione</option>
            <option value="Hardware">Hardware</option>
            <option value="Software">Software</option>
            <option value="Network">Network</option>
          </select>
        </div>
        <div className="flex justify-end">
          <button onClick={onCancel} className="mr-2 p-2 bg-gray-300 rounded-md">
            Cancelar
          </button>
          <button onClick={handleConfirm} className="p-2 bg-blue-500 text-white rounded-md">
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default SpecialtyModal;

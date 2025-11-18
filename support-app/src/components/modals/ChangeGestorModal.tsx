import React, { useState } from 'react';
import { TaskProps } from '@/utils/types';

interface ChangeModalProps {
    task: TaskProps;
    onClose: () => void;
    onGenerateChange: (taskId: string, selectedPart: string, message: string, price: string) => void;
}

const ChangeGestorModal = ({ task, onClose, onGenerateChange } : ChangeModalProps) => {
    const [selectedPart, setSelectedPart] = useState<string | null>(null);
    const [message, setMessage] = useState('');
    const [price, setPrice] = useState('');

    const handleGenerateChange = () => {
        if (selectedPart) {
            onGenerateChange(task._id, selectedPart, message, price);
            onClose();
        } else {
            alert("Por favor, selecciona una pieza.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
                <h3 className="text-xl font-semibold mb-4 text-black">Administrar Cambios para {task.subject}</h3>

                <p className="text-sm font-semibold text-gray-800">Selecciona la pieza:</p>
                <select
                    onChange={(e) => setSelectedPart(e.target.value)}
                    className="w-full mt-2 p-2 border rounded text-black"
                >
                    <option value="">--Selecciona una pieza--</option>
                    {task.assignedEquipment.parts?.map((part) => (
                        <option key={part._id} value={part._id}>
                            {part.type} - {part.model}
                        </option>
                    ))}
                </select>

                <textarea
                    placeholder="Agrega un mensaje adicional..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full mt-2 p-2 border rounded text-black"
                ></textarea>

                <input
                    type="number"
                    placeholder="Precio"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full mt-2 p-2 border rounded text-black"
                />

                <div className="flex justify-end mt-4">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-500 text-white rounded mr-2">
                        Cancelar
                    </button>
                    <button onClick={handleGenerateChange} className="px-4 py-2 bg-green-500 text-white rounded">
                        Crear Cambio
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChangeGestorModal;

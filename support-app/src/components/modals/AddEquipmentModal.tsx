import { useState } from 'react';
import { PartProps, EquipmentProps } from '@/utils/types'; // Import your types here

interface AddEquipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (equipment: EquipmentProps) => void;
}

export default function AddEquipmentModal({ isOpen, onClose, onSave }: AddEquipmentModalProps) {
    const [equipment, setEquipment] = useState<EquipmentProps>({
        _id: '',  // Initialize _id
        name: '',
        type: 'Computer',
        available: true,
        parts: [],
    });

    const [part, setPart] = useState<PartProps>({
        _id: '',  // Initialize _id for parts
        type: 'GPU',
        model: '',
        quantity: 1,
    });

    const handlePartChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setPart({ ...part, [name]: name === 'quantity' ? Number(value) : value });
    };

    const addPart = () => {
        if (!part.model || part.quantity <= 0) {
            alert('Por favor, completa todos los campos de la parte correctamente.');
            return;
        }

        setEquipment((prevEquipment) => ({
            ...prevEquipment,
            parts: [...(prevEquipment.parts || []), { ...part, _id: Date.now().toString() }], // Assign a temporary _id
        }));
        setPart({ _id: '', type: 'GPU', model: '', quantity: 1 });
    };

    const removePart = (index: number) => {
        setEquipment((prevEquipment) => ({
            ...prevEquipment,
            parts: (prevEquipment.parts || []).filter((_, i) => i !== index),
        }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEquipment({ ...equipment, [name]: value });
    };

    const handleSubmit = async () => {
        if (!equipment.name || !equipment.type) {
            alert('Por favor, completa todos los campos obligatorios.');
            return;
        }

        onSave({ ...equipment, _id: Date.now().toString() }); // Assign a temporary _id to equipment
        onClose();          
        handleCleanValues(); 
    };
    
    const handleCleanValues = () => {
        setEquipment({
            _id: '', // Reset _id
            name: '',
            type: 'Computer',
            available: true,
            parts: [],
        });
        setPart({
            _id: '', // Reset part _id
            type: 'GPU',
            model: '',
            quantity: 1,
        });
    };
    

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 max-w-md w-72 md:w-full max-h-[80vh] overflow-y-auto relative">
                <button
                    onClick={() => {
                        onClose();
                        handleCleanValues();
                    }}
                    className="absolute top-4 right-7 text-gray-600 hover:text-gray-800"
                >
                    ✕
                </button>

                <h2 className="text-lg font-bold mb-4">Añadir Equipo</h2>
                
                <input
                    type="text"
                    name="name"
                    value={equipment.name}
                    onChange={handleChange}
                    placeholder="Nombre"
                    className="border rounded p-2 w-full mb-4"
                />
                
                <select
                    name="type"
                    value={equipment.type}
                    onChange={handleChange}
                    className="border rounded p-2 w-full mb-4"
                >
                    <option value="Computer">Computer</option>
                    <option value="Server">Server</option>
                    <option value="Printer">Printer</option>
                    <option value="Projector">Projector</option>
                </select>

                <input
                    type="text"
                    name="operatingSystem"
                    value={equipment.operatingSystem || ''}
                    onChange={handleChange}
                    placeholder="Sistema Operativo"
                    className="border rounded p-2 w-full mb-4"
                />

                <h3 className="text-md font-bold mb-2">Agregar Parte</h3>
                <select
                    name="type"
                    value={part.type}
                    onChange={handlePartChange}
                    className="border rounded p-2 w-full mb-4"
                >
                    <option value="GPU">GPU</option>
                    <option value="CPU">CPU</option>
                    <option value="RAM">RAM</option>
                    <option value="SSD">SSD</option>
                    <option value="HDD">HDD</option>
                    <option value="Motherboard">Motherboard</option>
                    <option value="Power Supply">Power Supply</option>
                    <option value="Cooling">Cooling</option>
                    <option value="Other">Other</option>
                </select>

                <input
                    type="text"
                    name="model"
                    value={part.model}
                    onChange={handlePartChange}
                    placeholder="Model"
                    className="border rounded p-2 w-full mb-4"
                />

                <input
                    type="number"
                    name="quantity"
                    value={part.quantity}
                    onChange={handlePartChange}
                    placeholder="Quantity"
                    className="border rounded p-2 w-full mb-4"
                />

                <button onClick={addPart} className="bg-blue-500 text-white rounded px-4 py-2 w-full mb-4">
                    Añadir Parte
                </button>

                <h3 className="text-md font-bold mb-2">Partes Añadidas</h3>
                <ul className="mb-4">
                    {(equipment.parts || []).map((p, index) => (
                        <li key={index} className="flex justify-between items-center mb-2">
                            <span>{p.type} - {p.model} (x{p.quantity})</span>
                            <button
                                onClick={() => removePart(index)}
                                className="text-red-500 text-sm"
                            >
                                Quitar
                            </button>
                        </li>
                    ))}
                </ul>

                <button
                    onClick={handleSubmit}
                    className="bg-blue-500 text-white rounded px-4 py-2 w-full"
                >
                    Guardar Equipo
                </button>
            </div>
        </div>
    );
}

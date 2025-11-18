import React from 'react';

interface SelectEquipmentIncidentModalProps {
    isOpen: boolean;
    onClose: () => void;
    equipmentList: any[];
    onSelect: (buildingId: string, equipmentId: string) => void;
}

const SelectEquipmentIncidentModal = ({ isOpen, onClose, equipmentList, onSelect }: SelectEquipmentIncidentModalProps) => {
    const [selectedBuilding, setSelectedBuilding] = React.useState<any | null>(null);
    const [selectedEquipment, setSelectedEquipment] = React.useState<any | null>(null);

    const handleBuildingChange = (buildingId: string) => {
        const building = equipmentList.find(build => build._id === buildingId);
        setSelectedBuilding(building);
        setSelectedEquipment(null);
    };

    const handleEquipmentChange = (equipmentId: string) => {
        const equipment = selectedBuilding?.equipments.find((e: any) => e._id === equipmentId);
        setSelectedEquipment(equipment);
    };

    const handleSelect = () => {
        if (selectedBuilding && selectedEquipment) {
            onSelect(selectedBuilding, selectedEquipment);
            onClose(); 
        }
    };

    return (
        <div className={`fixed inset-0 flex items-center justify-center z-50 ${isOpen ? 'block' : 'hidden'}`}>
            <div className="modal-background fixed inset-0 bg-gray-600 bg-opacity-50" onClick={onClose}></div>
            <div className="modal-content bg-white rounded-lg shadow-lg w-96 p-6 relative">
                <h3 className="text-lg font-semibold mb-4 text-black">Seleccionar Edificio y Equipo</h3>
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Edificio</label>
                    <select onChange={(e) => handleBuildingChange(e.target.value)} className="border border-gray-300 p-2 w-full rounded text-gray-700">
                        <option value="">Selecciona un edificio</option>
                        {equipmentList.map(building => (
                            <option key={building._id} value={building._id}>
                                {building.name}
                            </option>
                        ))}
                    </select>
                </div>
                {selectedBuilding && (
                    <div className="mt-4">
                        <label className="block mb-2 text-sm font-medium text-gray-700">Equipo</label>
                        <select 
                            onChange={(e) => handleEquipmentChange(e.target.value)} 
                            className="border border-gray-300 p-2 w-full rounded text-gray-700"
                        >
                            <option value="">Selecciona un equipo</option>
                            {selectedBuilding.equipments.map((equipment: any) => (
                                <option key={equipment._id} value={equipment._id}>
                                    {equipment.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
                <button 
                    className={`mt-4 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 ${!selectedEquipment ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={handleSelect} 
                    disabled={!selectedEquipment}
                >
                    Seleccionar
                </button>
                <button 
                    className="modal-close absolute top-2 right-2 text-gray-600 hover:text-gray-800" 
                    aria-label="close" 
                    onClick={onClose}
                >
                    &times;
                </button>
            </div>
        </div>
    );
};

export default SelectEquipmentIncidentModal;

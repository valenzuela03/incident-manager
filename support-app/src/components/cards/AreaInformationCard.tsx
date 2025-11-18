import React, { useState, useEffect } from 'react';
import AddEquipmentModal from './../modals/AddEquipmentModal';
import EquipmentDetailModal from './../modals/EquipmentInfoModal';
import Cookies from 'js-cookie';
import { BuildingsAreasComponentProps, EquipmentProps } from '@/utils/types';

interface AreaInformationCardProps {
  areas: BuildingsAreasComponentProps[];
  onUpdateAreas: (updatedAreas: BuildingsAreasComponentProps[]) => void;
}

const AreaInformationCard = ({ areas: initialAreas, onUpdateAreas }: AreaInformationCardProps) => {
  const [areas, setAreas] = useState<BuildingsAreasComponentProps[]>(initialAreas);
  const [showDetails, setShowDetails] = useState<{ [key: number]: boolean }>({});
  const [showModal, setShowModal] = useState(false);
  const [showEquipmentModal, setShowEquipmentModal] = useState(false);
  const [currentAreaIndex, setCurrentAreaIndex] = useState<number | null>(null);
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentProps | null>(null);

  const toggleDetails = (index: number) => {
    setShowDetails((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  useEffect(() => {
    setAreas(initialAreas);
  }, [initialAreas]);

  const openModal = (areaIndex: number) => {
    setCurrentAreaIndex(areaIndex);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentAreaIndex(null);
  };

  const openEquipmentModal = (equipment: EquipmentProps) => {
    setSelectedEquipment(equipment);
    setShowEquipmentModal(true);
  };

  const closeEquipmentModal = () => {
    setShowEquipmentModal(false);
    setSelectedEquipment(null);
  };

  const handleSubmitEquipment = async (newEquipment: EquipmentProps) => {
    const token = Cookies.get('authToken');
    if (currentAreaIndex === null) return;

    const currentArea = areas[currentAreaIndex];

    try {
      const response = await fetch('http://localhost:8080/equipment/createEquipment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...newEquipment,
          areaId: currentArea._id,
        }),
      });

      if (!response.ok) {
        throw new Error('No se pudo añadir el equipo.');
      }

      const data = await response.json();

      const updatedAreas = [...areas];
      updatedAreas[currentAreaIndex] = {
        ...currentArea,
        equipments: [...(currentArea.equipments || []), data.data],
      };
      setAreas(updatedAreas);
      onUpdateAreas(updatedAreas);

    } catch (error) {
      console.error(error);
    }
  };

  const addArea = (newArea: BuildingsAreasComponentProps) => {
    setAreas((prevAreas) => [...prevAreas, newArea]);
    onUpdateAreas([...areas, newArea]);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg">
      {areas.length === 0 ? (
        <p>No hay áreas disponibles.</p>
      ) : (
        areas.map((area, areaIndex) => (
          <div key={area._id} className="border-b border-gray-300 py-4">
            <strong className="block text-lg">{area.name}</strong>
            <p className="block text-lg">Número de tareas: {area.tasks?.length}</p>
            <p className="block text-lg">Número de equipos: {area.equipments?.length}</p>
            <button
              className="mt-2 text-blue-500"
              onClick={() => toggleDetails(areaIndex)}
            >
              {showDetails[areaIndex] ? 'Ocultar detalles' : 'Mostrar detalles'}
            </button>

            {showDetails[areaIndex] && (
              <div>
                {area.tasks && area.tasks.length > 0 && (
                  <ul className="list-disc pl-5">
                    {area.tasks.map((task, taskIndex) => (
                      <li key={taskIndex} className="text-gray-600">
                        {task}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-4">
                  <strong className="block text-lg mb-2">Equipos</strong>

                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded mb-4"
                    onClick={() => openModal(areaIndex)}
                  >
                    Añadir equipo
                  </button>

                  {area.equipments && area.equipments.length > 0 ? (
                    <ul className
="space-y-2">
                      {area.equipments.map((equipment, equipmentIndex) => (
                        <li
                          key={equipmentIndex}
                          onClick={() => openEquipmentModal(equipment)}
                          className="bg-gray-100 p-3 rounded-lg flex justify-between items-center cursor-pointer"
                        >
                          <div>
                            <span className="font-semibold">{equipment.name}</span> ({equipment.type})
                            {equipment.operatingSystem && (
                              <span> - {equipment.operatingSystem}</span>
                            )}
                            {equipment.available ? (
                              <span className="text-green-500"> - Disponible</span>
                            ) : (
                              <span className="text-red-500"> - No disponible</span>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No hay equipos disponibles.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        ))
      )}

      <AddEquipmentModal isOpen={showModal} onClose={closeModal} onSave={handleSubmitEquipment} />

      <EquipmentDetailModal
        isOpen={showEquipmentModal}
        onClose={closeEquipmentModal}
        selectedEquipment={selectedEquipment}
      />
    </div>
  );
};

export default AreaInformationCard;

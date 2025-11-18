import React, { useState } from "react";
import Cookies from "js-cookie";
import AreaInformationCard from "./AreaInformationCard";
import { BuildingsAreasComponentProps } from "@/utils/types";

interface BuildingsComponentProps {
  name: string;
  userName: string;
  areas: BuildingsAreasComponentProps[];
  buildingId: string;
  onAddArea: (buildingIndex: number, newArea: BuildingsAreasComponentProps) => void;
}

const BuildingCard: React.FC<BuildingsComponentProps & { index: number }> = ({
  name,
  areas: initialAreas,
  index,
  buildingId,
  userName,
  onAddArea,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [newAreaName, setNewAreaName] = useState("");
  const [areas, setAreas] = useState(initialAreas);

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  const handleAddArea = async () => {
    if (newAreaName) {
      const token = Cookies.get('authToken');

      try {
        const response = await fetch(`http://localhost:8080/department/${buildingId}/createArea`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: newAreaName,
            tasks: [],
            equipments: [],
          }),
        });
  
        const data = await response.json();
        if (data.success) {
          const newAreaWithId: BuildingsAreasComponentProps = {
            _id: data.data.areaId,
            name: newAreaName,
            tasks: [],
            equipments: [],
          };
          
          onAddArea(index, newAreaWithId);
          setAreas([...areas, newAreaWithId]); 
          setNewAreaName("");
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("Error adding area:", error);
      }
    }
  };

  const handleUpdateAreas = (updatedAreas: BuildingsAreasComponentProps[]) => {
    setAreas(updatedAreas);
  };

  return (
    <div className="border rounded-md p-4 shadow hover:shadow-lg transition">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="font-medium text-black font-bold italic text-xl">{name}</h4>
          <p className="text-gray-600">Encargado: {userName}</p>
          <p className="text-gray-600">Número de Áreas: {areas.length}</p>
        </div>
        <button className="mt-2 text-blue-600 hover:underline" onClick={handleToggle}>
          {expanded ? "Reducir" : "Ampliar"}
        </button>
      </div>
      {expanded && (
        <div className="mt-2 text-gray-700">
          <div className="mt-4">
            <h5 className="font-semibold">Agregar Área:</h5>
            <input
              type="text"
              value={newAreaName}
              onChange={(e) => setNewAreaName(e.target.value)}
              className="border rounded-md p-2 mb-2 w-full"
              placeholder="Nombre del área"
            />
            <button
              onClick={handleAddArea}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
            >
              Agregar Área
            </button>
          </div>
          <p className="text-black font-bold text-xl">Áreas:</p>
          <AreaInformationCard areas={areas} onUpdateAreas={handleUpdateAreas} />
        </div>
      )}
    </div>
  );
};

export default BuildingCard;

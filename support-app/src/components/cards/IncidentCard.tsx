import React, { useState } from 'react';
import { TaskProps, UserProps } from '@/utils/types';
import IncidentManagementModal from '@/components/modals/IncidentManagementModal';

interface CardProps {
  task: TaskProps;
  user?: UserProps[];
  onUpdatedTask: (updatedTask: string) => void;
}

const IncidentCard = ({ task, user, onUpdatedTask }: CardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 w-full flex flex-col">
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{task.subject}</h3>
      <p className="text-sm font-semibold mb-2 text-gray-400">{task.message}</p>
      <p className="text-gray-600 mb-4">Estado: {task.status === "pending" ? "pendiente" : ""}</p>
      <div className="flex justify-start mt-auto">
        <button
          onClick={handleOpenModal}
          className="bg-gradient-to-r from-blue-700 to-blue-500 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:shadow-lg"
        >
          Administrar
        </button>
      </div>

      <IncidentManagementModal isOpen={isModalOpen} onClose={handleCloseModal} task={task} user={user} onUpdatedTask={onUpdatedTask} />
    </div>
  );
};

export default IncidentCard;

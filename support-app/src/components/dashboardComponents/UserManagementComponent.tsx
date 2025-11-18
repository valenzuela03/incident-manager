import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { UserProps } from '@/utils/types';
import ConfirmModal from '@/components/modals/ConfirmModal';
import SpecialtyModal from '@/components/modals/SpecialityModal';

const UserManagementComponent = () => {
  const [users, setUsers] = useState<UserProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [pendingAction, setPendingAction] = useState<() => void>(() => {});

  const [isSpecialtyModalOpen, setIsSpecialtyModalOpen] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [userToUpdate, setUserToUpdate] = useState<string | null>(null);

  useEffect(() => {
    const token = Cookies.get('authToken');
    if (token) {
      setLoading(true);
      setError(null);
      fetch('http://localhost:8080/user/getAllUsers', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
          }
          return response.json();
        })
        .then((data) => {
          setUsers(data.users);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching users:', error);
          setError(error.message);
          setLoading(false);
        });
    } else {
      setError('Authentication token not found');
    }
  }, []);

  const handleRoleChange = (userId: string, newRole: string) => {
    if (newRole === 'supporter') {
      setUserToUpdate(userId);
      setModalMessage(
        `¿Estás seguro de cambiar el rol del usuario a "soporte"? Por favor selecciona su especialidad.`
      );
      setIsSpecialtyModalOpen(true);
    } else {
      // Si no es supporter, simplemente cambia el rol
      setPendingAction(() => {
        return () => updateRole(userId, newRole);
      });
      setIsConfirmModalOpen(true);
    }
  };

  const handleSpecialtyConfirm = (specialty: string) => {
    if (userToUpdate) {
      // Actualizar el rol y la especialidad en el backend
      updateRole(userToUpdate, 'supporter', specialty);
      setIsSpecialtyModalOpen(false);
    }
  };

  const handleConfirm = () => {
    if (pendingAction) {
      pendingAction();
      setIsConfirmModalOpen(false);
    }
  };

  const handleCancel = () => {
    setIsConfirmModalOpen(false);
    setIsSpecialtyModalOpen(false);
    setUserToUpdate(null);
    setSelectedSpecialty(null);
  };

  const updateRole = (userId: string, newRole: string, specialty?: string) => {
    const token = Cookies.get('authToken');
    if (token) {
      fetch(`http://localhost:8080/user/updateRolUser/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          role: newRole,
          specialty: specialty,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to update role');
          }
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user._id === userId ? { ...user, role: newRole } : user
            )
          );
        })
        .catch((error) => console.error('Error updating role:', error));
    } else {
      console.error('Authentication token not found');
    }
  };

  return (
    <div className="p-4 md:p-8">
      <h1 className="font-black text-black text-xl">ADMINISTRACION DE USUARIOS</h1>
      <p className="text-black mb-4">AQUI PUEDES ADMINISTRAR A LOS USUARIOS.</p>
      {error && <p className="text-red-500">Error: {error}</p>}
      {loading ? (
        <p className="text-black">Loading...</p>
      ) : users.length > 0 ? (
        <div className="flex flex-col">
          {users.map((user) => (
            <div
              key={user._id}
              className="flex items-center justify-between bg-white p-4 shadow-md rounded-md mb-4"
            >
              <div>
                <p className="font-bold text-black">{user.name}</p>
                <p className="text-black">{user.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role:
                </label>
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user._id, e.target.value)}
                  className="p-2 rounded-md border border-gray-300"
                >
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                  <option value="supporter">Soporte</option>
                  <option value="inCharge">Encargado</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-black">No users found.</p>
      )}

      {/* Modal de confirmación */}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        message={modalMessage}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />

      {/* Modal de especialidad */}
      <SpecialtyModal
        isOpen={isSpecialtyModalOpen}
        onConfirm={handleSpecialtyConfirm}
        onCancel={handleCancel}
        message="Seleccione la especialidad para el rol de soporte"
      />
    </div>
  );
};

export default UserManagementComponent;

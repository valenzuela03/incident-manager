import React, { useState, useEffect } from 'react';
import { TaskProps, UserProps } from '@/utils/types';
import IncidentCard from '../cards/IncidentCard';
import Cookies from 'js-cookie';

const IncidentManagerComponent = () => {
  const [tasks, setTasks] = useState<TaskProps[] | null>(null);
  const [users, setUsers] = useState<UserProps[] | null>(null);

  useEffect(() => {
    const token = Cookies.get('authToken');

    const fetchTasks = async () => {
      try {
        const response = await fetch("http://localhost:8080/task/getAllUnauthorize", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Error al obtener las tareas");
        }
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error("Error al obtener las tareas:", error);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:8080/user/getAllTechnicians", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Error al obtener los usuarios");
        }
        const data = await response.json();
        setUsers(data.users);
      } catch (error) {
        console.error("Error al obtener los usuarios:", error);
      }
    };

    fetchTasks();
    fetchUsers();
  }, []);

  const onUpdatedTask = (taskId: string) => {
    setTasks((prevTasks) => prevTasks?.filter(task => task._id !== taskId) || null);
  };

  return (
    <div className="flex flex-col gap-4">
      <p className='text-black text-xl'>AQUI PUEDES GESTIONAR LAS INCIDENCIAS GENERADAS</p>
      {tasks && tasks.length > 0 ? (
        tasks.map((task) => (
          <IncidentCard key={task._id} task={task} user={users ?? undefined} onUpdatedTask={onUpdatedTask}/>
        ))
      ) : (
        <div className="flex justify-center items-center py-6 bg-gray-100 rounded-lg shadow-md">
          <p className="text-lg text-gray-700 font-semibold">No hay incidencias por administrar</p>
        </div>
      )}
    </div>
  );
};

export default IncidentManagerComponent;
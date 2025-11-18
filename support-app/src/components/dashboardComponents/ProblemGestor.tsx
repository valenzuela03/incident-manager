import React, { useState, useEffect } from 'react';
import { TaskProps, UserProps, ProblemProps } from '@/utils/types';
import Cookies from 'js-cookie';

const ProblemGestor= () => {
  const [tasks, setTasks] = useState<TaskProps[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<TaskProps[]>([]);
  const [selectedTask, setSelectedTask] = useState<TaskProps | null>(null);
  const [technicians, setTechnicians] = useState<UserProps[]>([]);
  const [filteredTechnicians, setFilteredTechnicians] = useState<UserProps[]>([]);
  const [selectedTechnician, setSelectedTechnician] = useState<string>('');
  const [problems, setProblems] = useState<ProblemProps[]>([]);
  const [newProblem, setNewProblem] = useState<ProblemProps | null>(null);

  // Filtros
  const [priorityFilter, setPriorityFilter] = useState<string>('');
  const [equipmentFilter, setEquipmentFilter] = useState<string>('');
  const [technicianFilter, setTechnicianFilter] = useState<string>('');

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await fetch('http://localhost:8080/task/getAllCompletedTasks', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Cookies.get('authToken')}`,
        },
      });
      const data = await response.json();
      console.log('Tareas:', data);
      setTasks(data);
      setFilteredTasks(data);
    };

    fetchTasks();
  }, []);

  useEffect(() => {
    const fetchProblems = async () => {
      const response = await fetch('http://localhost:8080/problem/all', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Cookies.get('authToken')}`,
        },
      });
      const data = await response.json();
      console.log('Problemas:', data.data.problems);
      setProblems(data.data.problems);
    };

    fetchProblems();
  }
  , []);


  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        const response = await fetch("http://localhost:8080/user/getAllTechnicians", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("authToken")}`,
          },
        });
        const data = await response.json();
        console.log("Técnicos:", data.users);
        setTechnicians(data.users);
      } catch (error) {
        console.error("Error al obtener los técnicos:", error);
      }
    };

    fetchTechnicians();
  }, []);
  useEffect(() => {
    let filtered = tasks;

    if (priorityFilter) {
      filtered = filtered.filter((task) => task.priority === priorityFilter);
    }

    if (equipmentFilter) {
      filtered = filtered.filter(
        (task) =>
          task.assignedEquipment &&
          task.assignedEquipment.name.toLowerCase().includes(equipmentFilter.toLowerCase())
      );
    }

    if (technicianFilter) {
      filtered = filtered.filter(
        (task) =>
          task.assignedTo &&
          task.assignedTo.name.toLowerCase().includes(technicianFilter.toLowerCase())
      );
    }

    setFilteredTasks(filtered);
  }, [priorityFilter, equipmentFilter, technicianFilter, tasks]);

  useEffect(() => {
    if (selectedTask) {
      const relevantTechnicians = technicians.filter(
        (tech) => tech.speciality === selectedTask.type
      );
      setFilteredTechnicians(relevantTechnicians);
    } else {
      setFilteredTechnicians([]);
    }
  }, [selectedTask, technicians]);

  const registerProblem = async () => {
    if (!selectedTask || !selectedTechnician) {
      alert('Por favor selecciona una incidencia y un técnico.');
      return;
    }
  
    try {
      const response = await fetch("http://localhost:8080/problem/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("authToken")}`,
        },
        body: JSON.stringify({
          equipment: selectedTask.assignedEquipment._id,
          assignedTo: selectedTechnician,
        }),
      });
  
      const data = await response.json();
      console.log("Nuevo problema:", data);
      setNewProblem(data.problem);
      setProblems((prevProblems) => [...prevProblems, data.populatedProblem]);
      alert('Incidencia registrada en la base de conocimiento.');
    } catch (error) {
      console.error("Error al registrar el problema:", error);
      alert('Ocurrió un error al registrar el problema.');
    }
  };
  

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Gestión de Problemas</h1>

      {/* Filtros */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Filtros</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block font-medium mb-1">Prioridad</label>
            <select
              className="border rounded-md p-2 w-full"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="">Todas</option>
              <option value="low">Baja</option>
              <option value="medium">Media</option>
              <option value="high">Alta</option>
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1">Equipo Asignado</label>
            <input
              type="text"
              className="border rounded-md p-2 w-full"
              placeholder="Buscar por equipo"
              value={equipmentFilter}
              onChange={(e) => setEquipmentFilter(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Técnico</label>
            <input
              type="text"
              className="border rounded-md p-2 w-full"
              placeholder="Buscar por técnico"
              value={technicianFilter}
              onChange={(e) => setTechnicianFilter(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Incidents List */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Incidencias Completadas</h2>
        <ul className="mt-4 border rounded-md divide-y">
          {filteredTasks.map((task) => (
            <li
              key={task._id}
              onClick={() => setSelectedTask(task)}
              className={`p-4 cursor-pointer ${
                selectedTask?._id === task._id
                  ? 'bg-blue-100'
                  : 'hover:bg-gray-100'
              }`}
            >
              {task.subject }
              {task.message && <p className="text-sm text-gray-500">{task.message}</p>}
              {task.assignedEquipment && ( <p className="text-sm text-gray-500">Equipo : {task.assignedEquipment.name}</p> )}
              {task.assignedTo && (
                <p className="text-sm text-gray-500">Tecnico : {task.assignedTo.name} </p>
              )}
              {task.type && ( <p className="text-sm text-gray-500">Especialidad : {task.type}</p> )}

            </li>
          ))}
        </ul>
      </div>

      {/* Technician Selection */}
      <div className="mb-6">
        <label className="block text-lg font-semibold mb-2">
          Seleccionar Técnico
        </label>
        <select
          className="border rounded-md p-2 w-full"
          value={selectedTechnician}
          onChange={(e) => setSelectedTechnician(e.target.value)}
          disabled={!selectedTask}
        >
          <option value="">Selecciona un técnico</option>
          {filteredTechnicians.map((tech) => (
            <option key={tech._id} value={tech._id}>
              {tech.name} - {tech.speciality}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={registerProblem}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Registrar Problema
      </button>

      {/* Problems Table */}
<div className="mt-8">
  <h2 className="text-lg font-semibold mb-4">Problemas Registrados</h2>
  <div className="overflow-x-auto">
    <table className="table-auto w-full border-collapse border border-gray-300">
      <thead>
        <tr className="bg-gray-200">
          <th className="border border-gray-300 px-4 py-2">Equipo</th>
          <th className="border border-gray-300 px-4 py-2">Asignado a</th>
          <th className="border border-gray-300 px-4 py-2">Causa raiz</th>
          <th className="border border-gray-300 px-4 py-2">Error conocido</th>
          <th className="border border-gray-300 px-4 py-2">Solucion</th>
          <th className="border border-gray-300 px-4 py-2">Fecha de Creación</th>
          <th className='border border-gray-300 px-4 py-2'>Finalizado</th>
        </tr>
      </thead>
      <tbody>
        {problems.length > 0 && problems.map((problem) => (
          <tr key={problem._id} className="hover:bg-gray-100">
            <td className="border border-gray-300 px-4 py-2">
              {problem.equipment.name || "No especificado"}
            </td>
            <td className="border border-gray-300 px-4 py-2">
              {problem.assignedTo.name || "No asignado"}
            </td>
            <td className="border border-gray-300 px-4 py-2">
              {problem.rootCause || "No especificado"}
            </td>
            <td className="border border-gray-300 px-4 py-2">
              {problem.knownError || "No especificado"}
            </td>
            <td className="border border-gray-300 px-4 py-2">
              {problem.solution || "No especificado"}
            </td>
            <td className="border border-gray-300 px-4 py-2">
              {new Date(problem.startDate).toLocaleDateString()}
            </td>
            <td className="border border-gray-300 px-4 py-2">
              {problem.solutionDate ? new Date(problem.solutionDate).toLocaleDateString() : "No finalizado"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

    </div>
  );
};

export default ProblemGestor;

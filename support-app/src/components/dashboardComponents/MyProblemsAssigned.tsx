import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { ProblemProps } from "@/utils/types";

const MyProblemsAssigned = () => {
  const [problems, setProblems] = useState<ProblemProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProblem, setSelectedProblem] = useState<ProblemProps>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/problem/myAssigned",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${Cookies.get("authToken")}`,
            },
          }
        );

    
        const data = await response.json();
        console.log(data);
        setProblems(data.data.problems);
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  const handleEdit = (problem: ProblemProps) => {
    setSelectedProblem(problem);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedProblem(undefined);
    setIsModalOpen(false);
  };

  const handleSubmit = async (updatedProblem: Partial<ProblemProps>) => {
    try {
        const id = selectedProblem?._id;
      const response = await fetch(
        `http://localhost:8080/problem/update/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("authToken")}`,
          },
          body: JSON.stringify(updatedProblem),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update problem");
      }

      const data = await response.json();
      setProblems((prev) =>
        prev.filter((problem) => problem._id !== data.data.problem._id)
      );
      handleCloseModal();
    } catch (err: any) {
      alert("Failed to update problem: " + err.message);
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error)
    return <div className="text-center mt-10 text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Problemas a resolver.</h1>
      {problems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {problems.map((problem) => (
            <div
              key={problem._id}
              className="bg-white shadow-lg rounded-lg p-4 border hover:shadow-xl transition-shadow"
            >
              {problem.equipment && (
                <div className="bg-gray-100 rounded-lg p-4 mb-4 shadow-inner">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Detalles del equipo
                  </h3>
                  <p className="text-gray-600">
                    <span className="font-medium text-gray-800">Nombre:</span>{" "}
                    {problem.equipment.name}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium text-gray-800">
                      Sistema Operativo:
                    </span>{" "}
                    {problem.equipment.operatingSystem || "N/A"}
                  </p>
                </div>
              )}

              <div className="mt-4">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  onClick={() => handleEdit(problem)}
                >
                  Editar
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">
          No se te han asignado problemas
        </p>
      )}

      {isModalOpen && selectedProblem && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Problema</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();

                const rootCause = (e.target as any).rootCause.value.trim();
                const knownError = (e.target as any).knownError.value.trim();
                const solution = (e.target as any).solution.value.trim();

                if (!rootCause) {
                  alert("La causa raíz es obligatoria.");
                  return;
                }

                if (!solution) {
                  alert("La solución es obligatoria.");
                  return;
                }
                handleSubmit({ rootCause, knownError, solution });
              }}
            >
              <div className="mb-4">
                <label
                  htmlFor="rootCause"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Causa raiz
                </label>
                <input
                  type="text"
                  name="rootCause"
                  defaultValue={selectedProblem.rootCause || ""}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="knownError"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Error conocido
                </label>
                <input
                  type="text"
                  name="knownError"
                  defaultValue={selectedProblem.knownError || ""}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="solution"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Solucion
                </label>
                <input
                  type="text"
                  name="solution"
                  defaultValue={selectedProblem.solution || ""}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="mr-4 px-4 py-2 text-gray-700 hover:bg-gray-200 rounded"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProblemsAssigned;

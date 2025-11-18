import React, { useState } from 'react';
import { AiOutlineUser, AiOutlineFileText, AiOutlineHome, AiOutlineDesktop, AiOutlineSetting, AiOutlineTeam, AiOutlineBarChart } from 'react-icons/ai';

interface SideNavComponentProps {
  setController: (controller: string) => void;
  user: any;
}

const SideNavComponent = ({ setController, user }: SideNavComponentProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        className="md:hidden p-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? 'Cerrar Menú' : 'Abrir Menú'}
      </button>

      <nav 
        className={`absolute md:static bg-white shadow-lg rounded-lg m-4 transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 
        h-[80vh] max-h-[72vh] md:h-auto md:max-h-none overflow-y-auto`}
      >
        <ul className="p-4 space-y-4">
          
        <li className="flex items-center border border-gray-200 rounded-md p-3 bg-gray-50 hover:bg-gray-100 transition">
            <AiOutlineFileText className="text-blue-600 mr-2" />
            <a 
              className="text-blue-600 hover:text-blue-800 hover:underline transition duration-300 cursor-pointer"
              onClick={() => { setController('profile'); setIsOpen(false); }}
            >
              <p className="font-black">MI PERFIL</p>
            </a>
          </li>
          <li className="flex items-center border border-gray-200 rounded-md p-3 bg-gray-50 hover:bg-gray-100 transition">
            <AiOutlineFileText className="text-blue-600 mr-2" />
            <a 
              className="text-blue-600 hover:text-blue-800 hover:underline transition duration-300 cursor-pointer"
              onClick={() => { setController('incidents'); setIsOpen(false); }}
            >
              <p className="font-black">GENERAR INCIDENCIA</p>
            </a>
          </li>
          <li className="flex items-center border border-gray-200 rounded-md p-3 bg-gray-50 hover:bg-gray-100 transition">
            <AiOutlineFileText className="text-blue-600 mr-2" />
            <a 
              className="text-blue-600 hover:text-blue-800 hover:underline transition duration-300 cursor-pointer"
              onClick={() => { setController('myGeneratedIncidents'); setIsOpen(false); }}
            >
              <p className="font-black">INCIDENCIAS GENERADAS</p>
            </a>
          </li>
            {(user.role === "inCharge" || user.role === "admin") && (
              <>
                <div className="border-t border-gray-300 my-4"></div>
              <p className="text-gray-500 text-sm font-semibold uppercase mb-2 pl-2 tracking-wide">ENCARGADO AREA</p>

    
            <li className="flex items-center border border-gray-200 rounded-md p-3 bg-gray-50 hover:bg-gray-100 transition">
              <AiOutlineHome className="text-blue-600 mr-2" />
              <a 
                className="text-blue-600 hover:text-blue-800 hover:underline transition duration-300 cursor-pointer"
                onClick={() => { setController('buildings'); setIsOpen(false); }}
              >
                <p className="font-black">MIS EDIFICIOS</p>
              </a>
            </li>
            </>
          )}
         

          {user.role === "supporter" &&(
            <>
              <div className="border-t border-gray-300 my-4"></div>
              <p className="text-gray-500 text-sm font-semibold uppercase mb-2 pl-2 tracking-wide">SOPORTE TÉCNICO</p>
              <li className="flex items-center border border-gray-200 rounded-md p-3 bg-gray-50 hover:bg-gray-100 transition">
                <AiOutlineFileText className="text-blue-600 mr-2" />
                <a 
                  className="text-blue-600 hover:text-blue-800 hover:underline transition duration-300 cursor-pointer"
                  onClick={() => { setController('myIncidents'); setIsOpen(false); }}
                >
                  <p className="font-black">MIS INCIDENCIAS ASIGNADAS</p>
                </a>
              </li>

              <li className="flex items-center border border-gray-200 rounded-md p-3 bg-gray-50 hover:bg-gray-100 transition">
                <AiOutlineFileText className="text-blue-600 mr-2" />
                <a 
                  className="text-blue-600 hover:text-blue-800 hover:underline transition duration-300 cursor-pointer"
                  onClick={() => { setController('incidentHistory'); setIsOpen(false); }}
                >
                  <p className="font-black">HISTORIAL DE INCIDENCIAS</p>
                </a>
              </li>


              <li className="flex items-center border border-gray-200 rounded-md p-3 bg-gray-50 hover:bg-gray-100 transition">
                <AiOutlineFileText className="text-blue-600 mr-2" />
                <a 
                  className="text-blue-600 hover:text-blue-800 hover:underline transition duration-300 cursor-pointer"
                  onClick={() => { setController('myProblemsAssigned'); setIsOpen(false); }}
                >
                  <p className="font-black">MIS PROBLEMAS ASIGNADOS</p>
                </a>
              </li>
              
            </>
          ) }

          {user.role === "admin" && (
            <>

              <div className="border-t border-gray-300 my-4"></div>
              <p className="text-gray-500 text-sm font-semibold uppercase mb-2 pl-2 tracking-wide">Opciones de Administrador</p>

              <li className="flex items-center border border-gray-200 rounded-md p-3 bg-gray-50 hover:bg-gray-100 transition">
                <AiOutlineTeam className="text-blue-600 mr-2" />
                <a 
                  className="text-blue-600 hover:text-blue-800 hover:underline transition duration-300 cursor-pointer"
                  onClick={() => { setController('userManagement'); setIsOpen(false); }}
                >
                  <p className="font-black">Gestión de Usuarios</p>
                </a>
              </li>
              <li className="flex items-center border border-gray-200 rounded-md p-3 bg-gray-50 hover:bg-gray-100 transition">
                <AiOutlineFileText className="text-blue-600 mr-2" />
                <a 
                  className="text-blue-600 hover:text-blue-800 hover:underline transition duration-300 cursor-pointer"
                  onClick={() => { setController('incidentManager'); setIsOpen(false); }}
                >
                  <p className="font-black">Gestion de incidencias</p>
                </a>
              </li>
              <li className="flex items-center border border-gray-200 rounded-md p-3 bg-gray-50 hover:bg-gray-100 transition">
                <AiOutlineBarChart className="text-blue-600 mr-2" />
                <a 
                  className="text-blue-600 hover:text-blue-800 hover:underline transition duration-300 cursor-pointer"
                  onClick={() => { setController('changesGestor'); setIsOpen(false); }}
                >
                  <p className="font-black">Gesion de cambios</p>
                </a>
              </li>
              <li className="flex items-center border border-gray-200 rounded-md p-3 bg-gray-50 hover:bg-gray-100 transition">
                <AiOutlineBarChart className="text-blue-600 mr-2" />
                <a 
                  className="text-blue-600 hover:text-blue-800 hover:underline transition duration-300 cursor-pointer"
                  onClick={() => { setController('problemGestor'); setIsOpen(false); }}
                >
                  <p className="font-black">Gestion de problemas</p>
                </a>
              </li>
             
            </>
          )}
        </ul>
      </nav>
    </div>
  );
}

export default SideNavComponent;

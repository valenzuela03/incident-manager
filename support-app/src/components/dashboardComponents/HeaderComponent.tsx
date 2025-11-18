import React from 'react'
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

const HeaderComponent = ({ user, setUser }: any) => {
  const router = useRouter();
  
  const handleLogout = () => {
    Cookies.remove('authToken');
    Cookies.remove('userId');
    setUser(null);
    router.push('/');
  };

  return (
    <header className="bg-gradient-to-r from-blue-700 to-blue-500 p-4 text-white flex justify-between items-center shadow-lg border-b border-blue-300">
      <h1 className="text-2xl font-extrabold tracking-wide">Panel de Control</h1>
      
      <div className="flex items-center space-x-4">
        {user && (
          <p className="hidden md:block text-sm font-medium text-blue-100">
            Bienvenido, <span className="font-semibold">{user.name}</span>
          </p>
        )}
        <button
          onClick={handleLogout}
          className="px-5 py-2 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50 shadow-md"
        >
          Cerrar Sesión
        </button>
      </div>
    </header>
  )
}

export default HeaderComponent;

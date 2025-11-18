import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function LogIn() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
  
    try {
      const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Error en el inicio de sesión');
        return;
      }
  
      if (data.token) {
        console.log('Token:', data.token);
        Cookies.set('authToken', data.token, { expires: 7, sameSite: 'None', secure: true });
        router.push('/');
      } else {
        setError('Error desconocido. Inténtalo de nuevo.');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error al iniciar sesión. Inténtalo de nuevo.');
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-950">Iniciar Sesión</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="email">
            Correo Electrónico
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="text-gray-950 mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="password">
            Contraseña
          </label>
          <input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="text-gray-950 mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <div className="mb-4">
          <button
            type="submit"
            className="w-full py-2 mt-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
          >
            Iniciar Sesión
          </button>
          <p className="mt-2 text-center text-gray-600">
            ¿Aún no tienes cuenta?{" "}
            <Link href="/SignUpPage" className="text-blue-600 hover:underline">
              Regístrate aquí!
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}

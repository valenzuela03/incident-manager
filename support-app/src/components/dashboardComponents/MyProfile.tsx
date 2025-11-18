import React from "react";
import { UserProps } from "@/utils/types";
import Image from "next/image";
interface MyProfileProps {
  user: UserProps;
}

const MyProfile = ({ user }: MyProfileProps) => {
  console.log(user);
  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center space-x-6 mb-6">
        
        <Image
          src={user.profilePicture}
          alt="Profile"
          width={96}
          height={96}
          className="w-24 h-24 rounded-full shadow-md object-cover"
        />
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
          <p className="text-gray-500">{user.email}</p>
          <p className="text-sm text-gray-600 capitalize mt-1">{user.role}</p>
        </div>
      </div>
      {(user.role === "admin" || user.role == "inCharge") && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gray-100 p-4 rounded shadow">
            <h2 className="text-sm font-medium text-gray-600">Teléfono</h2>
            <p className="text-lg font-bold text-gray-800">{user.phone}</p>
          </div>
        </div>
      )}

      {user.role === "supporter" && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-100 p-4 rounded shadow">
              <h2 className="text-sm font-medium text-gray-600">Teléfono</h2>
              <p className="text-lg font-bold text-gray-800">{user.phone}</p>
            </div>
            <div className="bg-gray-100 p-4 rounded shadow">
              <h2 className="text-sm font-medium text-gray-600">
                Especialidad
              </h2>
              <p className="text-lg font-bold text-gray-800 capitalize">
                {user.speciality || "Sin especialidad"}
              </p>
            </div>
            <div className="bg-gray-100 p-4 rounded shadow">
              <h2 className="text-sm font-medium text-gray-600">
                Promedio de calificación
              </h2>
              <p className="text-lg font-bold text-gray-800">
                {user.averageRating
                  ? user.averageRating.toFixed(1)
                  : "No disponible"}{" "}
                ⭐
              </p>
            </div>
            <div className="bg-gray-100 p-4 rounded shadow">
              <h2 className="text-sm font-medium text-gray-600">
                Calificaciones recibidas
              </h2>
              <p className="text-lg font-bold text-gray-800">
                {user.ratings.length}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MyProfile;

"use client";

import { useEffect } from "react";
import { useAuth } from "@/store/auth";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { user, fetchUser, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) fetchUser();
  }, [user, fetchUser]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Panel de control</h1>
      {user ? (
        <div className="mb-4">
          <p className="text-gray-700">👤 Usuario: {user.username}</p>
          <p className="text-gray-700">🎭 Rol: {user.role_display}</p>
        </div>
      ) : (
        <p className="text-gray-500">Cargando usuario...</p>
      )}

      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Cerrar sesión
      </button>
    </div>
  );
}

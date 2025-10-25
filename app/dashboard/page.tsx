"use client";

import { useEffect } from "react";
import { useAuth } from "@/store/auth";
import { useRouter } from "next/navigation";

import { useDashboardStats } from "@/hooks/useDashboardStats";

export default function DashboardPage() {
  const { user, fetchUser, logout } = useAuth();
  const router = useRouter();
  const { data: stats, isLoading, error } = useDashboardStats();

  useEffect(() => {
    if (!user) fetchUser();
  }, [user, fetchUser]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (isLoading) return <p>Cargando resumen...</p>;
  if (error) return <p>Error al cargar estadísticas.</p>;

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Panel General</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Riesgos */}
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h2 className="text-gray-500 text-sm font-medium">
            Riesgos Registrados
          </h2>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {stats?.total_risks}
          </p>
        </div>

        {/* Controles */}
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h2 className="text-gray-500 text-sm font-medium">
            Controles de Seguridad
          </h2>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {stats?.total_controls}
          </p>
        </div>

        {/* Mitigaciones */}
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h2 className="text-gray-500 text-sm font-medium">
            Planes de Mitigación
          </h2>
          <p className="text-3xl font-bold text-yellow-600 mt-2">
            {stats?.total_mitigations}
          </p>
        </div>

        {/* Incidentes */}
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h2 className="text-gray-500 text-sm font-medium">
            Incidentes Totales
          </h2>
          <p className="text-3xl font-bold text-red-600 mt-2">
            {stats?.total_incidents}
          </p>
        </div>
      </div>

      {/* Estado de incidentes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">
            Incidentes Abiertos
          </h3>
          <p className="text-4xl font-bold text-orange-500">
            {stats?.open_incidents}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">
            Incidentes Cerrados
          </h3>
          <p className="text-4xl font-bold text-gray-700">
            {stats?.closed_incidents}
          </p>
        </div>
      </div>
    </div>
  );
}

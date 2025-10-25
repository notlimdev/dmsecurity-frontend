"use client";

import { useRisks } from "@/hooks/useRisks";
import { useState } from "react";

export default function RiskPage() {
  const { data: risks, isLoading, error, addRisk } = useRisks();
  const [form, setForm] = useState({
    title: "",
    description: "",
    likelihood: 1,
    impact: 1,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addRisk.mutateAsync({
      ...form,
      status: "IDENTIFIED",
      identified_by: 1, // 👈 puedes cambiarlo según usuario logueado
    });
    setForm({ title: "", description: "", likelihood: 1, impact: 1 });
  };

  if (isLoading) return <p>Cargando riesgos...</p>;
  if (error) return <p>Error al cargar riesgos.</p>;

  return (
    <div>
      <h1 className="text-2xl text-gray-400 font-semibold mb-4">
        Gestión de Riesgos
      </h1>

      {/* Formulario */}
      <form
        onSubmit={handleSubmit}
        className="bg-white text-gray-400 rounded-lg p-4 shadow mb-6 grid grid-cols-2 gap-3"
      >
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Título"
          className="text-gray-900 border border-gray-400 p-2 rounded col-span-2"
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Descripción"
          className="text-gray-900 border border-gray-400 p-2 rounded col-span-2"
        />
        <input
          name="likelihood"
          type="number"
          min={1}
          max={5}
          value={form.likelihood}
          onChange={handleChange}
          placeholder="Probabilidad"
          className="text-gray-900 border border-gray-400 p-2 rounded"
        />
        <input
          name="impact"
          type="number"
          min={1}
          max={5}
          value={form.impact}
          onChange={handleChange}
          placeholder="Impacto"
          className="text-gray-900 border border-gray-400 p-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded col-span-2 hover:bg-blue-700"
        >
          Agregar Riesgo
        </button>
      </form>

      {/* Tabla */}
      <div className="bg-white text-gray-700 rounded-lg shadow p-4">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border-b">Título</th>
              <th className="p-2 border-b">Probabilidad</th>
              <th className="p-2 border-b">Impacto</th>
              <th className="p-2 border-b">Nivel</th>
              <th className="p-2 border-b">Estado</th>
            </tr>
          </thead>
          <tbody>
            {risks?.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="p-2 border-b">{r.title}</td>
                <td className="p-2 border-b">{r.likelihood}</td>
                <td className="p-2 border-b">{r.impact}</td>
                <td className="p-2 border-b">
                  <span
                    className={`px-2 py-1 text-sm rounded ${
                      r.risk_level_name === "Alto"
                        ? "bg-red-100 text-red-600"
                        : r.risk_level_name === "Medio"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-green-100 text-green-600"
                    }`}
                  >
                    {r.risk_level_name}
                  </span>
                </td>
                <td className="p-2 border-b">{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

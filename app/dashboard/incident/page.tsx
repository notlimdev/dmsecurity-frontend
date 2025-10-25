"use client";

import { useIncidents } from "@/hooks/useIncidents";
import { useState } from "react";

export default function IncidentPage() {
  const { data: incidents, isLoading, error, addIncident } = useIncidents();
  const [form, setForm] = useState({
    title: "",
    description: "",
    severity: "LOW",
    occurred_at: "",
    risk: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      title: form.title,
      description: form.description,
      severity: form.severity,
      occurred_at: form.occurred_at,
      reported_by: 1, // usuario autenticado
      risk: form.risk ? Number(form.risk) : null,
      status: "OPEN",
    };

    await addIncident.mutateAsync(payload);

    setForm({
      title: "",
      description: "",
      severity: "LOW",
      occurred_at: "",
      risk: "",
    });
  };

  if (isLoading) return <p>Cargando incidentes...</p>;
  if (error) return <p>Error al cargar incidentes.</p>;

  return (
    <div>
      <h1 className="text-blue-500 text-2xl font-semibold mb-4">
        Gestión de Incidentes
      </h1>

      {/* Formulario */}
      <form
        onSubmit={handleSubmit}
        className="text-gray-900 bg-white rounded-lg p-4 shadow mb-6 grid grid-cols-2 gap-3"
      >
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Título del incidente"
          className="border p-2 rounded col-span-2"
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Descripción"
          className="border p-2 rounded col-span-2"
        />
        <select
          name="severity"
          value={form.severity}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="LOW">Bajo</option>
          <option value="MEDIUM">Medio</option>
          <option value="HIGH">Alto</option>
          <option value="CRITICAL">Crítico</option>
        </select>
        <input
          name="occurred_at"
          type="datetime-local"
          value={form.occurred_at}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          name="risk"
          type="number"
          value={form.risk}
          onChange={handleChange}
          placeholder="ID del riesgo asociado"
          className="border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded col-span-2 hover:bg-blue-700"
        >
          Registrar Incidente
        </button>
      </form>

      {/* Tabla */}
      <div className="text-gray-900 bg-white rounded-lg shadow p-4">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border-b">Título</th>
              <th className="p-2 border-b">Severidad</th>
              <th className="p-2 border-b">Estado</th>
              <th className="p-2 border-b">Fecha</th>
              <th className="p-2 border-b">Riesgo</th>
            </tr>
          </thead>
          <tbody>
            {incidents?.map((i) => (
              <tr key={i.id} className="hover:bg-gray-50">
                <td className="p-2 border-b">{i.title}</td>
                <td className="p-2 border-b">{i.severity}</td>
                <td className="p-2 border-b">{i.status}</td>
                <td className="p-2 border-b">
                  {new Date(i.occurred_at).toLocaleString()}
                </td>
                <td className="p-2 border-b">{i.risk ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

"use client";

import { useMitigationPlans } from "@/hooks/useMitigations";
import { useState } from "react";

export default function MitigationPage() {
  const { data: plans, isLoading, error, addMitigation } = useMitigationPlans();
  const [form, setForm] = useState({
    action: "",
    due_date: "",
    progress: 0,
    risk: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Convertir campos numéricos que vienen como string desde los inputs
    const payload = {
      action: form.action,
      due_date: form.due_date,
      progress: Number(form.progress) || 0,
      risk: Number(form.risk) || null, // usa null si no hay ID válido
      responsible: 1, // ajustar luego para tomar el usuario real
      status: "IN_PROGRESS",
    };

    // Si risk es null/NaN, evita enviar o muestra error
    if (!payload.risk) {
      alert("Debes indicar un ID de riesgo válido.");
      return;
    }

    await addMitigation.mutateAsync(payload);
    setForm({ action: "", due_date: "", progress: 0, risk: "" });
  };
  if (isLoading) return <p>Cargando planes de mitigación...</p>;
  if (error) return <p>Error al cargar planes.</p>;

  return (
    <div>
      <h1 className="text-blue-500 text-2xl font-semibold mb-4">
        Planes de Mitigación
      </h1>

      {/* Formulario */}
      <form
        onSubmit={handleSubmit}
        className="text-gray-900 bg-white rounded-lg p-4 shadow mb-6 grid grid-cols-2 gap-3"
      >
        <input
          name="action"
          value={form.action}
          onChange={handleChange}
          placeholder="Acción de mitigación"
          className="border p-2 rounded col-span-2"
        />
        <input
          name="due_date"
          type="date"
          value={form.due_date}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          name="progress"
          type="number"
          min={0}
          max={100}
          value={form.progress}
          onChange={handleChange}
          placeholder="Progreso (%)"
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
          Agregar Plan
        </button>
      </form>

      {/* Tabla */}
      <div className="text-gray-900 bg-white rounded-lg shadow p-4">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border-b">Acción</th>
              <th className="p-2 border-b">Riesgo</th>
              <th className="p-2 border-b">Fecha límite</th>
              <th className="p-2 border-b">Progreso</th>
              <th className="p-2 border-b">Estado</th>
            </tr>
          </thead>
          <tbody>
            {plans?.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="p-2 border-b">{p.action}</td>
                <td className="p-2 border-b">{p.risk}</td>
                <td className="p-2 border-b">{p.due_date}</td>
                <td className="p-2 border-b">{p.progress}%</td>
                <td className="p-2 border-b">{p.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

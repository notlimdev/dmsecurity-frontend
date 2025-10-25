"use client";

import { useSecurity } from "@/hooks/useSecurity";
import { useState } from "react";

export default function SecurityPage() {
  const { data: securities, isLoading, error, addSecurity } = useSecurity();
  const [form, setForm] = useState({
    name: "",
    description: "",
    control_type: "PREVENTIVE",
    effectiveness: 3,
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
    await addSecurity.mutateAsync({
      ...form,
      status: "ACTIVE",
      implemented_by: 1,
    });
    setForm({
      name: "",
      description: "",
      control_type: "PREVENTIVE",
      effectiveness: 3,
    });
  };

  if (isLoading) return <p>Cargando controles...</p>;
  if (error) return <p>Error al cargar controles.</p>;

  return (
    <div>
      <h1 className="text-gray-900 text-2xl font-semibold mb-4">
        Controles de Seguridad
      </h1>

      {/* Formulario */}
      <form
        onSubmit={handleSubmit}
        className="text-gray-900 bg-white rounded-lg p-4 shadow mb-6 grid grid-cols-2 gap-3"
      >
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Nombre del control"
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
          name="control_type"
          value={form.control_type}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="PREVENTIVE">Preventivo</option>
          <option value="DETECTIVE">Detectivo</option>
          <option value="CORRECTIVE">Correctivo</option>
        </select>
        <input
          name="effectiveness"
          type="number"
          min={1}
          max={5}
          value={form.effectiveness}
          onChange={handleChange}
          placeholder="Efectividad"
          className="border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded col-span-2 hover:bg-blue-700"
        >
          Agregar Control
        </button>
      </form>

      {/* Tabla */}
      <div className="text-gray-900 bg-white rounded-lg shadow p-4">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border-b">Nombre</th>
              <th className="p-2 border-b">Tipo</th>
              <th className="p-2 border-b">Efectividad</th>
              <th className="p-2 border-b">Estado</th>
            </tr>
          </thead>
          <tbody>
            {securities?.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="p-2 border-b">{s.name}</td>
                <td className="p-2 border-b">{s.control_type}</td>
                <td className="p-2 border-b">{s.effectiveness}</td>
                <td className="p-2 border-b">{s.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

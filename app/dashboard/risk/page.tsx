"use client";

import { useRisks } from "@/hooks/useRisks";
import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";

export default function RiskPage() {
  const {
    data: risks,
    isLoading,
    error,
    addRisk,
    generateMitigations,
  } = useRisks();
  const [form, setForm] = useState({
    title: "",
    description: "",
    likelihood: 1,
    impact: 1,
  });
  const [selectedRisk, setSelectedRisk] = useState<number | null>(null);
  const [aiRecommendations, setAiRecommendations] = useState<any>(null);

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
      identified_by: 1,
    });
    setForm({ title: "", description: "", likelihood: 1, impact: 1 });
  };

  const handleGenerateAI = async (riskId: number) => {
    setSelectedRisk(riskId);
    setAiRecommendations(null);

    try {
      const result = await generateMitigations.mutateAsync(riskId);
      setAiRecommendations(result);
    } catch (error) {
      console.error("Error generando recomendaciones:", error);
    }
  };

  if (isLoading) return <p>Cargando riesgos...</p>;
  if (error) return <p>Error al cargar riesgos.</p>;

  return (
    <div>
      <h1 className="text-2xl text-gray-900 font-semibold mb-4">
        Gestión de Riesgos
      </h1>

      {/* Formulario */}
      <form
        onSubmit={handleSubmit}
        className="bg-white text-gray-900 rounded-lg p-4 shadow mb-6 grid grid-cols-2 gap-3"
      >
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Título"
          className="border border-gray-400 p-2 rounded col-span-2"
          required
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Descripción"
          className="border border-gray-400 p-2 rounded col-span-2"
          required
        />
        <input
          name="likelihood"
          type="number"
          min={1}
          max={5}
          value={form.likelihood}
          onChange={handleChange}
          placeholder="Probabilidad"
          className="border border-gray-400 p-2 rounded"
        />
        <input
          name="impact"
          type="number"
          min={1}
          max={5}
          value={form.impact}
          onChange={handleChange}
          placeholder="Impacto"
          className="border border-gray-400 p-2 rounded"
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
              <th className="p-2 border-b">Acciones IA</th>
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
                <td className="p-2 border-b">
                  <button
                    onClick={() => handleGenerateAI(r.id)}
                    disabled={
                      generateMitigations.isPending && selectedRisk === r.id
                    }
                    className="flex items-center gap-2 bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700 disabled:bg-gray-400"
                  >
                    {generateMitigations.isPending && selectedRisk === r.id ? (
                      <>
                        <Loader2 className="animate-spin" size={16} />
                        Generando...
                      </>
                    ) : (
                      <>
                        <Sparkles size={16} />
                        IA
                      </>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Panel de Recomendaciones IA */}
      {aiRecommendations && (
        <div className="mt-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 shadow-lg border-2 border-purple-200">
          <h3 className="text-xl font-bold text-purple-900 mb-4 flex items-center gap-2">
            <Sparkles className="text-purple-600" />
            Recomendaciones de IA
          </h3>
          <div className="space-y-3">
            {aiRecommendations.recommendations?.map((rec: any, idx: number) => (
              <div key={idx} className="bg-white p-4 rounded-lg shadow">
                <h4 className="font-semibold text-gray-800 mb-2">
                  {idx + 1}. {rec.action}
                </h4>
                <div className="flex gap-4 text-sm text-gray-600">
                  <span className="bg-blue-100 px-2 py-1 rounded">
                    📅 {rec.due_days} días
                  </span>
                  <span
                    className={`px-2 py-1 rounded ${
                      rec.priority === "alta"
                        ? "bg-red-100 text-red-700"
                        : rec.priority === "media"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                    }`}
                  >
                    Prioridad: {rec.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

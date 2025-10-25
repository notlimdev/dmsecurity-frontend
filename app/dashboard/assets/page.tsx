"use client";

import { useState } from "react";
import { useAssets, Asset } from "@/hooks/useAssets";

export default function AssetsPage() {
  const {
    data: assets,
    isLoading,
    isError,
    addAsset,
    deleteAsset,
  } = useAssets();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [assetType, setAssetType] = useState("");
  const [criticality, setCriticality] = useState(1);

  const handleAddAsset = (e: React.FormEvent) => {
    e.preventDefault();
    addAsset.mutate({
      name,
      description,
      asset_type: assetType,
      criticality,
    });
    setName("");
    setDescription("");
    setAssetType("");
    setCriticality(1);
  };

  const handleDelete = (id: number) => {
    deleteAsset.mutate(id);
  };

  if (isLoading) return <p>Cargando activos...</p>;
  if (isError) return <p>Error cargando los activos.</p>;

  return (
    <div className="p-4">
      <h1 className="text-blue-500 text-2xl font-bold mb-4">
        Gestión de Activos
      </h1>

      <form onSubmit={handleAddAsset} className="text-gray-900 mb-6">
        <input
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="border p-2 mr-2"
        />
        <input
          type="text"
          placeholder="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="border p-2 mr-2"
        />
        <input
          type="text"
          placeholder="Tipo de activo"
          value={assetType}
          onChange={(e) => setAssetType(e.target.value)}
          required
          className="border p-2 mr-2"
        />
        <input
          type="number"
          placeholder="Criticidad"
          value={criticality}
          onChange={(e) => setCriticality(Number(e.target.value))}
          min={1}
          max={5}
          required
          className="border p-2 mr-2 w-20"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2">
          Agregar
        </button>
      </form>

      <table className="text-gray-900 w-full border">
        <thead>
          <tr>
            <th className="border p-2">Nombre</th>
            <th className="border p-2">Descripción</th>
            <th className="border p-2">Tipo</th>
            <th className="border p-2">Criticidad</th>
            <th className="border p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {assets?.map((asset: Asset) => (
            <tr key={asset.id}>
              <td className="border p-2">{asset.name}</td>
              <td className="border p-2">{asset.description}</td>
              <td className="border p-2">{asset.asset_type}</td>
              <td className="border p-2">{asset.criticality}</td>
              <td className="border p-2">
                <button
                  onClick={() => handleDelete(asset.id)}
                  className="bg-red-500 text-white px-2 py-1"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

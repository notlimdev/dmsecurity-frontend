import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export interface Asset {
  id: number;
  name: string;
  description: string;
  asset_type: string;
  criticality: number;
  created_at: string;
  updated_at: string;
}

export function useAssets() {
  const queryClient = useQueryClient();

  // Obtener todos los activos
  const assetsQuery = useQuery<Asset[]>({
    queryKey: ["assets"],
    queryFn: async () => {
      const res = await api.get("/asset/assets/");
      return res.data;
    },
  });

  // Crear un nuevo activo
  const addAsset = useMutation({
    mutationFn: async (data: Partial<Asset>) => {
      const res = await api.post("/asset/assets/", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
    },
  });

  // Eliminar activo
  const deleteAsset = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/assets/${id}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
    },
  });

  return { ...assetsQuery, addAsset, deleteAsset };
}

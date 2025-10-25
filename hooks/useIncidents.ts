import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export interface Incident {
  id: number;
  title: string;
  description: string;
  severity: string;
  status: string;
  reported_by: number;
  risk: number | null;
  occurred_at: string;
  created_at: string;
}

export function useIncidents() {
  const queryClient = useQueryClient();

  const incidentsQuery = useQuery<Incident[]>({
    queryKey: ["incidents"],
    queryFn: async () => {
      const res = await api.get("/incident/incidents/");
      return res.data;
    },
  });

  const addIncident = useMutation({
    mutationFn: async (data: Partial<Incident>) => {
      const res = await api.post("/incident/incidents/", data);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["incidents"] }),
  });

  return { ...incidentsQuery, addIncident };
}

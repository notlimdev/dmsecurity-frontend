import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export interface Risk {
  id: number;
  title: string;
  description: string;
  likelihood: number;
  impact: number;
  risk_level: number;
  risk_level_name: string;
  status: string;
  identified_by_name?: string;
  created_at: string;
}

export function useRisks() {
  const queryClient = useQueryClient();

  const risksQuery = useQuery<Risk[]>({
    queryKey: ["risks"],
    queryFn: async () => {
      const res = await api.get("/risk/risks/");
      return res.data;
    },
  });

  const addRisk = useMutation({
    mutationFn: async (data: Partial<Risk>) => {
      const res = await api.post("/risk/risks/", data);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["risks"] }),
  });

  return { ...risksQuery, addRisk };
}

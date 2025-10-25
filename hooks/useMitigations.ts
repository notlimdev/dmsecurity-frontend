import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export interface MitigationPlan {
  id: number;
  action: string;
  due_date: string;
  progress: number;
  status: string;
  risk: number | null;
  responsible: number;
  created_at: string;
}

export function useMitigationPlans() {
  const queryClient = useQueryClient();

  const mitigationQuery = useQuery<MitigationPlan[]>({
    queryKey: ["mitigationPlans"],
    queryFn: async () => {
      const res = await api.get("/mitigation/plans/");
      return res.data;
    },
  });

  const addMitigation = useMutation({
    mutationFn: async (data: Partial<MitigationPlan>) => {
      const res = await api.post("/mitigation/plans/", data);
      return res.data;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["mitigationPlans"] }),
  });

  return { ...mitigationQuery, addMitigation };
}

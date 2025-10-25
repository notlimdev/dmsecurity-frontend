import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export interface Security {
  id: number;
  name: string;
  description: string;
  control_type: string;
  effectiveness: number;
  status: string;
  implemented_by_name?: string;
  implemented_by: number;
  created_at: string;
}

export function useSecurity() {
  const queryClient = useQueryClient();

  const securityQuery = useQuery<Security[]>({
    queryKey: ["securities"],
    queryFn: async () => {
      const res = await api.get("/security/securities/");
      return res.data;
    },
  });

  const addSecurity = useMutation({
    mutationFn: async (data: Partial<Security>) => {
      const res = await api.post("/security/securities/", data);
      return res.data;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["securities"] }),
  });

  return { ...securityQuery, addSecurity };
}

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export interface DashboardStats {
  total_risks: number;
  total_controls: number;
  total_mitigations: number;
  total_incidents: number;
  open_incidents: number;
  closed_incidents: number;
}

export function useDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: ["dashboardStats"],
    queryFn: async () => {
      // Podrías tener un endpoint dedicado, pero aquí combinamos las peticiones existentes
      const [risks, securities, mitigations, incidents] = await Promise.all([
        api.get("/risk/risks/"),
        api.get("/security/securities/"),
        api.get("/mitigation/plans/"),
        api.get("/incident/incidents/"),
      ]);

      return {
        total_risks: risks.data.length,
        total_controls: securities.data.length,
        total_mitigations: mitigations.data.length,
        total_incidents: incidents.data.length,
        open_incidents: incidents.data.filter((i: any) => i.status === "OPEN")
          .length,
        closed_incidents: incidents.data.filter(
          (i: any) => i.status === "CLOSED",
        ).length,
      };
    },
  });
}

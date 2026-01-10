import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { z } from "zod";

// Types derived directly from schema
type DashboardData = z.infer<typeof api.dashboard.responses[200]>;

export function useDashboard() {
  return useQuery({
    queryKey: [api.dashboard.path],
    queryFn: async () => {
      const res = await fetch(api.dashboard.path);
      if (res.status === 401) throw new Error("Unauthorized");
      if (!res.ok) throw new Error("Failed to fetch dashboard data");
      return api.dashboard.responses[200].parse(await res.json());
    },
    // Refresh frequently for financial data
    refetchInterval: 30000, 
  });
}

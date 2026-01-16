import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";

// Types derived directly from schema
type DashboardData = z.infer<typeof api.dashboard.responses[200]>;

export function useDashboard() {
  return useQuery({
    queryKey: [api.dashboard.path],
    queryFn: async () => {
      const res = await apiRequest("GET", api.dashboard.path);
      return api.dashboard.responses[200].parse(await res.json());
    },
    // Refresh frequently for financial data
    refetchInterval: 30000, 
  });
}

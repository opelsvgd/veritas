import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { apiRequest } from "@/lib/queryClient";
import { type InsertInvestment } from "@shared/schema";

export function usePlans() {
  return useQuery({
    queryKey: [api.plans.list.path],
    queryFn: async () => {
      const res = await apiRequest("GET", api.plans.list.path);
      return api.plans.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateInvestment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: InsertInvestment) => {
      const res = await apiRequest("POST", api.investments.create.path, data);
      return api.investments.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.dashboard.path] });
    },
  });
}

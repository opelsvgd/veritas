import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type InsertInvestment } from "@shared/routes";

export function usePlans() {
  return useQuery({
    queryKey: [api.plans.list.path],
    queryFn: async () => {
      const res = await fetch(api.plans.list.path);
      if (!res.ok) throw new Error("Failed to fetch plans");
      return api.plans.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateInvestment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: InsertInvestment) => {
      const res = await fetch(api.investments.create.path, {
        method: api.investments.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        if (res.status === 401) throw new Error("Please login first");
        if (res.status === 400) {
          const err = await res.json();
          throw new Error(err.message || "Invalid input");
        }
        throw new Error("Investment failed");
      }

      return api.investments.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.dashboard.path] });
    },
  });
}

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { apiRequest } from "@/lib/queryClient";
import { type InsertWithdrawalRequest } from "@shared/schema";

export function useWithdrawals() {
  return useQuery({
    queryKey: [api.withdrawals.list.path],
    queryFn: async () => {
      const res = await apiRequest("GET", api.withdrawals.list.path);
      return api.withdrawals.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateWithdrawal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: InsertWithdrawalRequest) => {
      const res = await apiRequest("POST", api.withdrawals.create.path, data);
      return api.withdrawals.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.withdrawals.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.dashboard.path] });
    },
  });
}

// Admin Hooks
export function usePendingWithdrawals() {
  return useQuery({
    queryKey: [api.admin.withdrawals.pending.path],
    queryFn: async () => {
      const res = await apiRequest("GET", api.admin.withdrawals.pending.path);
      return api.admin.withdrawals.pending.responses[200].parse(await res.json());
    },
  });
}

export function useApproveWithdrawal() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, txHash }: { id: number; txHash: string }) => {
      const url = buildUrl(api.admin.withdrawals.approve.path, { id });
      const res = await apiRequest("POST", url, { txHash });
      return api.admin.withdrawals.approve.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.admin.withdrawals.pending.path] });
    },
  });
}

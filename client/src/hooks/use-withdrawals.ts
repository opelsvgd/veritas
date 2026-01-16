import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type InsertWithdrawalRequest } from "@shared/routes";

export function useWithdrawals() {
  return useQuery({
    queryKey: [api.withdrawals.list.path],
    queryFn: async () => {
      const res = await fetch(api.withdrawals.list.path);
      if (res.status === 401) throw new Error("Unauthorized");
      if (!res.ok) throw new Error("Failed to fetch withdrawals");
      return api.withdrawals.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateWithdrawal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: InsertWithdrawalRequest) => {
      const res = await fetch(api.withdrawals.create.path, {
        method: api.withdrawals.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Withdrawal failed");
      }
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
      const res = await fetch(api.admin.withdrawals.pending.path);
      if (!res.ok) throw new Error("Failed to fetch pending withdrawals");
      return api.admin.withdrawals.pending.responses[200].parse(await res.json());
    },
  });
}

export function useApproveWithdrawal() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, txHash }: { id: number; txHash: string }) => {
      const url = buildUrl(api.admin.withdrawals.approve.path, { id });
      const res = await fetch(url, {
        method: api.admin.withdrawals.approve.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ txHash }),
      });

      if (!res.ok) throw new Error("Approval failed");
      return api.admin.withdrawals.approve.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.admin.withdrawals.pending.path] });
    },
  });
}

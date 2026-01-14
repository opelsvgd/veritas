import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useUser() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: [api.me.path],
    queryFn: async () => {
      const baseUrl = "https://veritas-9pwj.onrender.com";
      const res = await fetch(`${baseUrl}${api.me.path}`, {
        credentials: "include"
      });
      if (res.status === 401) return null;
      if (!res.ok) throw new Error("Failed to fetch user");
      return api.me.responses[200].parse(await res.json());
    },
    retry: false,
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    error
  };
}

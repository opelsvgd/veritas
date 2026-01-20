import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useUser() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: [api.me.path],
    queryFn: async () => {
      const res = await fetch(`/api/me`, {
        credentials: "include"
      });
      if (res.status === 401) return null;
      if (!res.ok) throw new Error("Failed to fetch user");
      const user = await res.json();
      // Ensure we redirect if authenticated
      if (user && window.location.pathname === "/auth") {
        window.location.href = "/";
      }
      return user;
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

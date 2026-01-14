import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { queryClient } from "@/lib/queryClient";

export function useUser() {
  const { data: user, isLoading, error, refetch } = useQuery({
    queryKey: [api.me.path],
    queryFn: async () => {
      const baseUrl = "https://veritas-9pwj.onrender.com";
      const res = await fetch(`${baseUrl}/api/me`, {
        credentials: "include",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
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
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    error,
    refetch,
  };
}

export async function login(username: string, password: string) {
  const baseUrl = "https://veritas-9pwj.onrender.com";
  const res = await fetch(`${baseUrl}/api/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error("Login failed");
  const user = await res.json();
  // Update query cache
  queryClient.setQueryData([api.me.path], user);
  // Invalidate to ensure fresh data
  queryClient.invalidateQueries({ queryKey: [api.me.path] });
  return user;
}

export async function logout() {
  const baseUrl = "https://veritas-9pwj.onrender.com";
  const res = await fetch(`${baseUrl}/api/logout`, {
    method: "POST",
    credentials: "include",
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) throw new Error("Logout failed");
  // Clear query cache
  queryClient.setQueryData([api.me.path], null);
  return res.ok;
}

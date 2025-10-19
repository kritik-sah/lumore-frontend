import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // 👈 Prevents refetching when tab/window regains focus
      refetchOnReconnect: false, // 👈 Prevents refetching when internet reconnects
      retry: 1, // Optional: control retry behavior
      staleTime: 1000 * 60 * 5, // Optional: mark data fresh for 5 mins
    },
  },
});

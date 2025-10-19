"use client";
import { queryClient } from "@/service/query-client";
import { QueryClientProvider } from "@tanstack/react-query";

export function ReactQueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

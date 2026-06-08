import { useQuery } from "@tanstack/react-query";
import apiClient from "../config/apiClient";
import type { Dashboard } from "../types";

export const useDashboard = (userId?: number) =>
  useQuery({
    queryKey: ["dashboard", userId],
    queryFn: async (): Promise<Dashboard> =>
      (await apiClient.get(`/dashboard/${userId}`)).data,
    enabled: !!userId,
    retry: false,
  });

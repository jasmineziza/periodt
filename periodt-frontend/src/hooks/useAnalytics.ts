import { useQuery } from "@tanstack/react-query";
import apiClient from "../config/apiClient";
import type { Analytics } from "../types";

export const useAnalytics = (userId?: number) =>
  useQuery({
    queryKey: ["analytics", userId],
    queryFn: async (): Promise<Analytics> =>
      (await apiClient.get(`/analytics/analytics/${userId}`)).data,
    enabled: !!userId,
    retry: false,
  });

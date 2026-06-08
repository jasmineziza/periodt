import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../config/apiClient";
import type { Cycle, Prediction } from "../types";

export const useCycles = (userId?: number) =>
  useQuery({
    queryKey: ["cycles", userId],
    queryFn: async (): Promise<Cycle[]> =>
      (await apiClient.get(`/cycles/${userId}`)).data,
    enabled: !!userId,
  });

export const usePrediction = (userId?: number) =>
  useQuery({
    queryKey: ["prediction", userId],
    queryFn: async (): Promise<Prediction> =>
      (await apiClient.get(`/cycles/prediction/${userId}`)).data,
    enabled: !!userId,
    retry: false,
  });

interface CyclePayload {
  user_id: number;
  start_date: string;
  end_date: string;
}

export const useCreateCycle = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CyclePayload): Promise<Cycle> =>
      (await apiClient.post(`/cycles/`, payload)).data,
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["cycles", vars.user_id] });
      qc.invalidateQueries({ queryKey: ["prediction", vars.user_id] });
      qc.invalidateQueries({ queryKey: ["dashboard", vars.user_id] });
    },
  });
};

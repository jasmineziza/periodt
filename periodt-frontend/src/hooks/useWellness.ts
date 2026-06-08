import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../config/apiClient";
import type { Mood, Symptom } from "../types";

export const useMoods = (userId?: number) =>
  useQuery({
    queryKey: ["moods", userId],
    queryFn: async (): Promise<Mood[]> =>
      (await apiClient.get(`/moods/${userId}`)).data,
    enabled: !!userId,
  });

export const useSymptoms = (userId?: number) =>
  useQuery({
    queryKey: ["symptoms", userId],
    queryFn: async (): Promise<Symptom[]> =>
      (await apiClient.get(`/symptoms/${userId}`)).data,
    enabled: !!userId,
  });

interface MoodPayload { user_id: number; mood: string; note: string }
interface SymptomPayload { user_id: number; symptom: string; severity: string }

export const useCreateMood = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (p: MoodPayload): Promise<Mood> =>
      (await apiClient.post(`/moods/`, p)).data,
    onSuccess: (_d, v) => {
      qc.invalidateQueries({ queryKey: ["moods", v.user_id] });
      qc.invalidateQueries({ queryKey: ["dashboard", v.user_id] });
    },
  });
};

export const useCreateSymptom = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (p: SymptomPayload): Promise<Symptom> =>
      (await apiClient.post(`/symptoms/`, p)).data,
    onSuccess: (_d, v) => {
      qc.invalidateQueries({ queryKey: ["symptoms", v.user_id] });
      qc.invalidateQueries({ queryKey: ["dashboard", v.user_id] });
    },
  });
};

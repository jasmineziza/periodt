import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../config/apiClient";
import type { Reminder } from "../types";

export const useReminders = (userId?: number) =>
  useQuery({
    queryKey: ["reminders", userId],
    queryFn: async (): Promise<Reminder[]> =>
      (await apiClient.get(`/reminder/reminder/${userId}`)).data,
    enabled: !!userId,
  });

interface ReminderPayload { user_id: number; type: string; reminder_time: string }

export const useCreateReminder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (p: ReminderPayload): Promise<Reminder> =>
      (await apiClient.post(`/reminder/reminder`, p)).data,
    onSuccess: (_d, v) => qc.invalidateQueries({ queryKey: ["reminders", v.user_id] }),
  });
};

export const useDeleteReminder = (userId?: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (reminderId: number): Promise<void> => {
      await apiClient.delete(`/reminder/reminder/${reminderId}`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reminders", userId] }),
  });
};

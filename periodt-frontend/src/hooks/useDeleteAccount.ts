import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import ApiUrl from "../config/apiUrl";

const deleteAccount = async (): Promise<void> => {
  await axios.delete(`${ApiUrl()}/users/me`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
  });
};

export const useDeleteAccount = () => {
  return useMutation({
    mutationKey: ["deleteAccount"],
    mutationFn: deleteAccount,
  });
};

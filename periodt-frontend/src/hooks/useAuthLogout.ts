import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import ApiUrl from "../config/apiUrl";

const postLogout = async (): Promise<void> => {
  await axios.post(`${ApiUrl()}/auth/logout`);
};

export const useAuthLogout = () => {
  return useMutation({
    mutationKey: ["authLogout"],
    mutationFn: postLogout,
  });
};

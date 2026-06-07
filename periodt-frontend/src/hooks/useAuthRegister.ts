import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import ApiUrl from "../config/apiUrl";

interface RegisterPayload {
  email: string;
  name: string;
  password: string;
  date_of_birth?: string;
}

const postRegister = async (payload: RegisterPayload): Promise<void> => {
  await axios.post(`${ApiUrl()}/auth/register`, payload);
};

export const useAuthRegister = () => {
  return useMutation({
    mutationKey: ["authRegister"],
    mutationFn: postRegister,
  });
};

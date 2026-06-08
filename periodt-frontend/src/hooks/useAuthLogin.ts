import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import ApiUrl from "../config/apiUrl";

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
  token_type: string;
}

const postLogin = async (payload: LoginPayload): Promise<LoginResponse> => {
  const res = await axios.post(`${ApiUrl()}/auth/login`, payload);
  return res.data;
};

export const useAuthLogin = () => {
  return useMutation({
    mutationKey: ["authLogin"],
    mutationFn: postLogin,
  });
};

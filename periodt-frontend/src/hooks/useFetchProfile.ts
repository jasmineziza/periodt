import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import ApiUrl from "../config/apiUrl";
import type { User } from "../context/UserContext";

const fetchProfile = async (): Promise<User> => {
  const res = await axios.get(`${ApiUrl()}/users/me`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
  });
  return res.data;
};

export const useFetchProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
    enabled: !!localStorage.getItem("accessToken"),
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: false,
  });
};

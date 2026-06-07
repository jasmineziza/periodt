import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ApiUrl from "../config/apiUrl";
import type { User } from "../context/UserContext";

interface UpdatePayload {
  name?: string;
  date_of_birth?: string;
}

const putProfile = async (payload: UpdatePayload): Promise<User> => {
  const res = await axios.put(`${ApiUrl()}/users/me`, payload, {
    headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
  });
  return res.data;
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["updateProfile"],
    mutationFn: putProfile,
    onSuccess: () => {
      // Side-effect yang selalu sama: refresh cache profil (lihat Guide §5).
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};

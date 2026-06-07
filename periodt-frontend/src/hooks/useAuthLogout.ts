import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import ApiUrl from "../config/apiUrl";

// Logout di PERIODT bersifat client-side (hapus token). Endpoint dipanggil
// best-effort; token tetap dibersihkan di container apa pun hasilnya.
const postLogout = async (): Promise<void> => {
  await axios.post(`${ApiUrl()}/auth/logout`);
};

export const useAuthLogout = () => {
  return useMutation({
    mutationKey: ["authLogout"],
    mutationFn: postLogout,
  });
};

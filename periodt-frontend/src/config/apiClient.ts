import axios from "axios";
import ApiUrl from "./apiUrl";

const apiClient = axios.create({ baseURL: ApiUrl() });

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;

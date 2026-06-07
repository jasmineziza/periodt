// Base URL Auth & Gateway Service. Diambil dari .env (VITE_API_BASE_URL).
export default function ApiUrl(): string {
  return import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";
}

import { Navigate, Outlet } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { useFetchProfile } from "../hooks/useFetchProfile";
import NavbarView from "../ui/NavbarView";

export default function ProtectedLayout() {
  const token = localStorage.getItem("accessToken");
  const { data, isLoading, isError } = useFetchProfile();

  if (!token) return <Navigate to="/login" replace />;
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-gray-500">
        Memuat…
      </div>
    );
  }
  if (isError || !data) return <Navigate to="/login" replace />;

  return (
    <UserContext value={data}>
      <div className="min-h-screen bg-brand-light">
        <NavbarView />
        <Outlet />
      </div>
    </UserContext>
  );
}

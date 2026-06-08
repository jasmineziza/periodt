import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useAuthLogout } from "../hooks/useAuthLogout";
import Navbar from "../components/Navbar";

export default function NavbarView() {
  const navigate = useNavigate();
  const user = useUser();
  const logoutMutation = useAuthLogout();

  const handleLogout = () => {
    const cleanup = () => {
      localStorage.removeItem("accessToken");
      navigate("/login");
    };
    logoutMutation.mutate(undefined, { onSuccess: cleanup, onError: cleanup });
  };

  const links = [
    { label: "Dashboard", onClick: () => navigate("/") },
    { label: "Siklus", onClick: () => navigate("/cycle") },
    { label: "Mood & Gejala", onClick: () => navigate("/wellness") },
    { label: "Pengingat", onClick: () => navigate("/reminders") },
  ];

  return (
    <Navbar
      user={user}
      links={links}
      onLogout={handleLogout}
      onProfile={() => navigate("/profile")}
      onBrand={() => navigate("/")}
    />
  );
}

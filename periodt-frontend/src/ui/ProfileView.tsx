import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import { useUser } from "../context/UserContext";
import { useUpdateProfile } from "../hooks/useUpdateProfile";
import { useDeleteAccount } from "../hooks/useDeleteAccount";
import Profile from "../components/Profile";

export default function ProfileView() {
  const navigate = useNavigate();
  const user = useUser();
  const updateMutation = useUpdateProfile();
  const deleteMutation = useDeleteAccount();
  const [name, setName] = useState(user?.name ?? "");
  const [dateOfBirth, setDateOfBirth] = useState(user?.date_of_birth ?? "");
  const [message, setMessage] = useState<string>();

  if (!user) return null;

  const handleSave = () => {
    setMessage(undefined);
    updateMutation.mutate(
      {
        ...(name ? { name } : {}),
        ...(dateOfBirth ? { date_of_birth: dateOfBirth } : {}),
      },
      {
        onSuccess: () => setMessage("Profil berhasil diperbarui."),
        onError: (err) => {
          const detail = isAxiosError(err) ? err.response?.data?.detail : undefined;
          setMessage(detail ?? "Gagal memperbarui profil.");
        },
      },
    );
  };

  const handleDelete = () => {
    if (!window.confirm("Yakin mau menghapus akun? Tindakan ini permanen.")) return;
    deleteMutation.mutate(undefined, {
      onSuccess: () => {
        localStorage.removeItem("accessToken");
        navigate("/login");
      },
      onError: (err) => {
        const detail = isAxiosError(err) ? err.response?.data?.detail : undefined;
        setMessage(detail ?? "Gagal menghapus akun.");
      },
    });
  };

  return (
    <Profile
      user={user}
      name={name}
      dateOfBirth={dateOfBirth ?? ""}
      isSaving={updateMutation.isPending}
      message={message}
      onNameChange={setName}
      onDateOfBirthChange={setDateOfBirth}
      onSave={handleSave}
      onDelete={handleDelete}
      onBack={() => navigate("/")}
    />
  );
}

import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import Button from "../components/Button";

export default function Home() {
  const user = useUser();
  const navigate = useNavigate();

  return (
    <main className="mx-auto max-w-xl p-6">
      <h1 className="text-xl font-bold text-gray-800">
        Halo, {user?.name ?? "teman"}!
      </h1>
      <p className="mt-2 text-gray-600">Selamat datang di PERIODT.</p>

      <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="font-bold text-gray-800">Profil kamu</h2>
        <p className="mt-1 text-sm text-gray-500">
          Lihat dan ubah data akunmu di halaman profil.
        </p>
        <div className="mt-4">
          <Button onClick={() => navigate("/profile")}>Buka Profil</Button>
        </div>
      </div>
    </main>
  );
}

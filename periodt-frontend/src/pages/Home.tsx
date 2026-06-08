import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useDashboard } from "../hooks/useDashboard";
import { useAnalytics } from "../hooks/useAnalytics";
import Button from "../components/Button";

export default function Home() {
  const user = useUser();
  const navigate = useNavigate();
  const { data: dash } = useDashboard(user?.id);
  const { data: stats } = useAnalytics(user?.id);

  const card = "rounded-2xl bg-white p-5 shadow-sm";
  const hasCycle = !!dash && !dash.error;

  const Stat = ({ label, value }: { label: string; value: string | number | null | undefined }) => (
    <div className={card}>
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{label}</p>
      <p className="mt-1 text-lg font-bold text-gray-800">{value ?? "-"}</p>
    </div>
  );

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-xl font-bold text-gray-800">Halo, {user?.name ?? "teman"}!</h1>
      <p className="mt-1 text-gray-600">Ringkasan kesehatan siklusmu.</p>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Stat label="Haid berikutnya" value={hasCycle ? dash?.next_period : "Belum ada data"} />
        <Stat label="Perkiraan ovulasi" value={hasCycle ? dash?.ovulation_date : "-"} />
        <Stat label="Panjang siklus" value={hasCycle ? `${dash?.cycle_length} hari` : "-"} />
        <Stat label="Mood terakhir" value={dash?.latest_mood} />
        <Stat label="Gejala terakhir" value={dash?.latest_symptom} />
        <Stat label="Rata-rata siklus" value={stats ? `${stats.average_cycle} hari` : "-"} />
      </div>

      <h2 className="mt-8 text-sm font-bold uppercase tracking-wide text-gray-400">Menu</h2>
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className={card}>
          <h3 className="font-bold text-gray-800">Siklus</h3>
          <p className="mt-1 text-sm text-gray-500">Catat & lihat prediksi haid.</p>
          <div className="mt-3"><Button onClick={() => navigate("/cycle")}>Buka</Button></div>
        </div>
        <div className={card}>
          <h3 className="font-bold text-gray-800">Mood & Gejala</h3>
          <p className="mt-1 text-sm text-gray-500">Catat suasana hati & gejala.</p>
          <div className="mt-3"><Button onClick={() => navigate("/wellness")}>Buka</Button></div>
        </div>
        <div className={card}>
          <h3 className="font-bold text-gray-800">Pengingat</h3>
          <p className="mt-1 text-sm text-gray-500">Atur reminder harian.</p>
          <div className="mt-3"><Button onClick={() => navigate("/reminders")}>Buka</Button></div>
        </div>
      </div>
    </main>
  );
}

import { useState, type FormEvent } from "react";
import { useUser } from "../context/UserContext";
import { useCycles, usePrediction, useCreateCycle } from "../hooks/useCycle";
import Button from "../components/Button";

export default function Cycle() {
  const user = useUser();
  const uid = user?.id;
  const { data: cycles } = useCycles(uid);
  const { data: prediction } = usePrediction(uid);
  const createCycle = useCreateCycle();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [msg, setMsg] = useState<string>();

  const input =
    "mt-1 w-full rounded-lg border border-brand-light px-3 py-2 focus:border-brand focus:outline-none";
  const label = "mt-3 block text-sm font-semibold text-gray-500";

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!uid || !startDate || !endDate) return;
    setMsg(undefined);
    createCycle.mutate(
      { user_id: uid, start_date: startDate, end_date: endDate },
      {
        onSuccess: () => {
          setMsg("Siklus tersimpan.");
          setStartDate("");
          setEndDate("");
        },
        onError: () => setMsg("Gagal menyimpan siklus."),
      },
    );
  };

  const noPrediction = !prediction || "error" in prediction;

  return (
    <main className="mx-auto max-w-xl p-6">
      <h1 className="text-xl font-bold text-gray-800">Siklus</h1>

      <div className="mt-4 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="font-bold text-gray-800">Prediksi</h2>
        {noPrediction ? (
          <p className="mt-1 text-sm text-gray-500">
            Belum ada data siklus. Catat siklus pertamamu di bawah.
          </p>
        ) : (
          <div className="mt-2 space-y-1 text-sm text-gray-700">
            <p>Haid terakhir: <b>{prediction!.last_period}</b></p>
            <p>Perkiraan haid berikutnya: <b>{prediction!.next_period}</b></p>
            <p>Perkiraan ovulasi: <b>{prediction!.ovulation_date}</b></p>
          </div>
        )}
      </div>

      <form onSubmit={submit} className="mt-5 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="font-bold text-gray-800">Catat Siklus</h2>
        {msg && (
          <div className="mt-2 rounded-lg bg-blue-50 px-3 py-2 text-sm text-blue-700">{msg}</div>
        )}
        <label className={label}>Tanggal mulai</label>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={input} required />
        <label className={label}>Tanggal selesai</label>
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={input} required />
        <div className="mt-5">
          <Button type="submit" disabled={createCycle.isPending}>
            {createCycle.isPending ? "Menyimpan..." : "Simpan"}
          </Button>
        </div>
      </form>

      <div className="mt-5 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="font-bold text-gray-800">Riwayat Siklus</h2>
        {!cycles || cycles.length === 0 ? (
          <p className="mt-1 text-sm text-gray-500">Belum ada riwayat.</p>
        ) : (
          <ul className="mt-2 divide-y divide-gray-100">
            {cycles.map((c) => (
              <li key={c.id} className="py-2 text-sm text-gray-700">
                {c.start_date} &ndash; {c.end_date}{" "}
                <span className="text-gray-400">({c.cycle_length} hari)</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}

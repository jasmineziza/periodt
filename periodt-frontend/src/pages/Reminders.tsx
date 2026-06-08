import { useState, type FormEvent } from "react";
import { useUser } from "../context/UserContext";
import {
  useReminders,
  useCreateReminder,
  useDeleteReminder,
} from "../hooks/useReminders";
import Button from "../components/Button";

export default function Reminders() {
  const user = useUser();
  const uid = user?.id;
  const { data: reminders } = useReminders(uid);
  const createReminder = useCreateReminder();
  const deleteReminder = useDeleteReminder(uid);

  const [type, setType] = useState("minum_air");
  const [time, setTime] = useState("08:00");
  const [msg, setMsg] = useState<string>();

  const input =
    "mt-1 w-full rounded-lg border border-brand-light px-3 py-2 focus:border-brand focus:outline-none";
  const label = "mt-3 block text-sm font-semibold text-gray-500";

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!uid) return;
    setMsg(undefined);
    createReminder.mutate(
      { user_id: uid, type, reminder_time: time },
      {
        onSuccess: () => setMsg("Pengingat ditambahkan."),
        onError: () => setMsg("Gagal menambah pengingat (format jam harus HH:MM)."),
      },
    );
  };

  return (
    <main className="mx-auto max-w-xl p-6">
      <h1 className="text-xl font-bold text-gray-800">Pengingat</h1>

      <form onSubmit={submit} className="mt-4 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="font-bold text-gray-800">Tambah Pengingat</h2>
        {msg && (
          <div className="mt-2 rounded-lg bg-blue-50 px-3 py-2 text-sm text-blue-700">{msg}</div>
        )}
        <label className={label}>Jenis</label>
        <select value={type} onChange={(e) => setType(e.target.value)} className={input}>
          <option value="minum_air">Minum air</option>
          <option value="tidur">Tidur</option>
          <option value="olahraga">Olahraga</option>
          <option value="minum_obat">Minum obat</option>
        </select>
        <label className={label}>Jam (HH:MM)</label>
        <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className={input} required />
        <div className="mt-4">
          <Button type="submit" disabled={createReminder.isPending}>
            {createReminder.isPending ? "Menyimpan..." : "Tambah"}
          </Button>
        </div>
      </form>

      <div className="mt-5 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="font-bold text-gray-800">Daftar Pengingat</h2>
        {!reminders || reminders.length === 0 ? (
          <p className="mt-1 text-sm text-gray-500">Belum ada pengingat.</p>
        ) : (
          <ul className="mt-2 divide-y divide-gray-100">
            {reminders.map((r) => (
              <li key={r.id} className="flex items-center justify-between py-2 text-sm text-gray-700">
                <span><b>{r.type}</b> &middot; {r.reminder_time}</span>
                <button
                  onClick={() => deleteReminder.mutate(r.id)}
                  className="rounded-lg px-2 py-1 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50"
                >
                  Hapus
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}

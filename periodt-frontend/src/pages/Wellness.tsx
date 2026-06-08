import { useState, type FormEvent } from "react";
import { useUser } from "../context/UserContext";
import {
  useMoods,
  useSymptoms,
  useCreateMood,
  useCreateSymptom,
} from "../hooks/useWellness";
import Button from "../components/Button";

export default function Wellness() {
  const user = useUser();
  const uid = user?.id;
  const { data: moods } = useMoods(uid);
  const { data: symptoms } = useSymptoms(uid);
  const createMood = useCreateMood();
  const createSymptom = useCreateSymptom();

  const [mood, setMood] = useState("");
  const [note, setNote] = useState("");
  const [symptom, setSymptom] = useState("");
  const [severity, setSeverity] = useState("ringan");

  const input =
    "mt-1 w-full rounded-lg border border-brand-light px-3 py-2 focus:border-brand focus:outline-none";
  const label = "mt-3 block text-sm font-semibold text-gray-500";

  const submitMood = (e: FormEvent) => {
    e.preventDefault();
    if (!uid || !mood) return;
    createMood.mutate(
      { user_id: uid, mood, note },
      { onSuccess: () => { setMood(""); setNote(""); } },
    );
  };

  const submitSymptom = (e: FormEvent) => {
    e.preventDefault();
    if (!uid || !symptom) return;
    createSymptom.mutate(
      { user_id: uid, symptom, severity },
      { onSuccess: () => setSymptom("") },
    );
  };

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-xl font-bold text-gray-800">Mood &amp; Gejala</h1>

      <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2">

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <form onSubmit={submitMood}>
            <h2 className="font-bold text-gray-800">Catat Mood</h2>
            <label className={label}>Mood</label>
            <input value={mood} onChange={(e) => setMood(e.target.value)} placeholder="senang, sedih, lelah..." className={input} required />
            <label className={label}>Catatan</label>
            <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="opsional" className={input} />
            <div className="mt-4">
              <Button type="submit" disabled={createMood.isPending}>
                {createMood.isPending ? "Menyimpan..." : "Simpan Mood"}
              </Button>
            </div>
          </form>
          <h3 className="mt-5 text-sm font-bold text-gray-500">Riwayat Mood</h3>
          {!moods || moods.length === 0 ? (
            <p className="mt-1 text-sm text-gray-400">Belum ada.</p>
          ) : (
            <ul className="mt-1 divide-y divide-gray-100">
              {moods.map((m) => (
                <li key={m.id} className="py-2 text-sm text-gray-700">
                  <b>{m.mood}</b>{m.note ? ` - ${m.note}` : ""}
                </li>
              ))}
            </ul>
          )}
        </div>


        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <form onSubmit={submitSymptom}>
            <h2 className="font-bold text-gray-800">Catat Gejala</h2>
            <label className={label}>Gejala</label>
            <input value={symptom} onChange={(e) => setSymptom(e.target.value)} placeholder="kram, pusing, mual..." className={input} required />
            <label className={label}>Tingkat keparahan</label>
            <select value={severity} onChange={(e) => setSeverity(e.target.value)} className={input}>
              <option value="ringan">Ringan</option>
              <option value="sedang">Sedang</option>
              <option value="berat">Berat</option>
            </select>
            <div className="mt-4">
              <Button type="submit" disabled={createSymptom.isPending}>
                {createSymptom.isPending ? "Menyimpan..." : "Simpan Gejala"}
              </Button>
            </div>
          </form>
          <h3 className="mt-5 text-sm font-bold text-gray-500">Riwayat Gejala</h3>
          {!symptoms || symptoms.length === 0 ? (
            <p className="mt-1 text-sm text-gray-400">Belum ada.</p>
          ) : (
            <ul className="mt-1 divide-y divide-gray-100">
              {symptoms.map((s) => (
                <li key={s.id} className="py-2 text-sm text-gray-700">
                  <b>{s.symptom}</b> <span className="text-gray-400">({s.severity})</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}

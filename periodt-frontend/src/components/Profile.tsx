import Button from "./Button";
import type { User } from "../context/UserContext";

type ProfileProps = {
  user: User;
  name: string;
  dateOfBirth: string;
  isSaving: boolean;
  message?: string;
  onNameChange: (value: string) => void;
  onDateOfBirthChange: (value: string) => void;
  onSave: () => void;
  onDelete: () => void;
  onBack: () => void;
};

export default function Profile({
  user,
  name,
  dateOfBirth,
  isSaving,
  message,
  onNameChange,
  onDateOfBirthChange,
  onSave,
  onDelete,
  onBack,
}: ProfileProps) {
  const inputClass =
    "mt-1 w-full rounded-lg border border-brand-light px-3 py-2 focus:border-brand focus:outline-none";
  const labelClass = "mt-3 block text-sm font-semibold text-gray-500";

  return (
    <div className="mx-auto max-w-xl p-6">
      <button
        onClick={onBack}
        className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-brand transition-colors hover:text-brand-dark"
      >
        <span aria-hidden="true">&larr;</span> Kembali ke Dashboard
      </button>

      <h2 className="text-xl font-bold text-gray-800">Profil</h2>

      {message && (
        <div className="mt-3 rounded-lg bg-blue-50 px-3 py-2 text-sm text-blue-700">
          {message}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSave();
        }}
        className="mt-4 rounded-2xl bg-white p-6 shadow-sm"
      >
        <label className={labelClass}>Email</label>
        <input type="email" value={user.email} disabled className={`${inputClass} bg-gray-100`} />

        <label className={labelClass}>Nama</label>
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          className={inputClass}
        />

        <label className={labelClass}>Tanggal Lahir</label>
        <input
          type="date"
          value={dateOfBirth}
          onChange={(e) => onDateOfBirthChange(e.target.value)}
          className={inputClass}
        />

        <div className="mt-5">
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </div>
      </form>

      <div className="mt-5 rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
        <h3 className="font-bold text-red-600">Danger Zone</h3>
        <p className="mt-1 text-sm text-gray-500">
          Menghapus akun akan menghilangkan seluruh datamu secara permanen.
        </p>
        <div className="mt-4">
          <Button variant="danger" onClick={onDelete}>
            Hapus Akun
          </Button>
        </div>
      </div>
    </div>
  );
}

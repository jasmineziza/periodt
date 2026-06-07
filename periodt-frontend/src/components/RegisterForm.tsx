import Button from "./Button";

export type RegisterFormValues = {
  name: string;
  email: string;
  password: string;
  date_of_birth: string;
};

type RegisterFormProps = {
  values: RegisterFormValues;
  isPending: boolean;
  error?: string;
  onChange: (field: keyof RegisterFormValues, value: string) => void;
  onSubmit: () => void;
};

export default function RegisterForm({
  values,
  isPending,
  error,
  onChange,
  onSubmit,
}: RegisterFormProps) {
  const inputClass =
    "mt-1 w-full rounded-lg border border-brand-light px-3 py-2 focus:border-brand focus:outline-none";
  const labelClass = "mt-3 block text-sm font-semibold text-gray-500";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg"
    >
      <h1 className="text-center text-2xl font-extrabold tracking-widest text-brand">
        PERIODT
      </h1>
      <p className="mt-1 text-center text-sm text-gray-500">Buat akun baru</p>

      {error && (
        <div className="mt-4 rounded-lg bg-brand-light px-3 py-2 text-sm text-brand-dark">
          {error}
        </div>
      )}

      <label className={labelClass}>Nama</label>
      <input
        type="text"
        value={values.name}
        onChange={(e) => onChange("name", e.target.value)}
        required
        className={inputClass}
      />

      <label className={labelClass}>Email</label>
      <input
        type="email"
        value={values.email}
        onChange={(e) => onChange("email", e.target.value)}
        required
        className={inputClass}
      />

      <label className={labelClass}>Password</label>
      <input
        type="password"
        value={values.password}
        onChange={(e) => onChange("password", e.target.value)}
        required
        className={inputClass}
      />

      <label className={labelClass}>Tanggal Lahir (opsional)</label>
      <input
        type="date"
        value={values.date_of_birth}
        onChange={(e) => onChange("date_of_birth", e.target.value)}
        className={inputClass}
      />

      <div className="mt-6">
        <Button type="submit" disabled={isPending} full>
          {isPending ? "Memproses…" : "Daftar"}
        </Button>
      </div>

      <p className="mt-4 text-center text-sm text-gray-500">
        Sudah punya akun?{" "}
        <a href="/login" className="font-semibold text-brand hover:underline">
          Login
        </a>
      </p>
    </form>
  );
}

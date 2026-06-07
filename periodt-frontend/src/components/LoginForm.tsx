import Button from "./Button";

type LoginFormProps = {
  email: string;
  password: string;
  isPending: boolean;
  error?: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: () => void;
};

export default function LoginForm({
  email,
  password,
  isPending,
  error,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: LoginFormProps) {
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
      <p className="mt-1 text-center text-sm text-gray-500">Masuk ke akunmu</p>

      {error && (
        <div className="mt-4 rounded-lg bg-brand-light px-3 py-2 text-sm text-brand-dark">
          {error}
        </div>
      )}

      <label className="mt-4 block text-sm font-semibold text-gray-500">Email</label>
      <input
        type="email"
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
        required
        className="mt-1 w-full rounded-lg border border-brand-light px-3 py-2 focus:border-brand focus:outline-none"
      />

      <label className="mt-3 block text-sm font-semibold text-gray-500">Password</label>
      <input
        type="password"
        value={password}
        onChange={(e) => onPasswordChange(e.target.value)}
        required
        className="mt-1 w-full rounded-lg border border-brand-light px-3 py-2 focus:border-brand focus:outline-none"
      />

      <div className="mt-6">
        <Button type="submit" disabled={isPending} full>
          {isPending ? "Memproses…" : "Login"}
        </Button>
      </div>

      <p className="mt-4 text-center text-sm text-gray-500">
        Belum punya akun?{" "}
        <a href="/register" className="font-semibold text-brand hover:underline">
          Daftar
        </a>
      </p>
    </form>
  );
}

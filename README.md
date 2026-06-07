# Project Guide — PERIODT Auth & Gateway (Frontend)

> Dokumen ini adalah **kontrak kerja** untuk frontend service Auth & Gateway.
> Baca sebelum menulis satu baris kode pun. Tujuannya: siapa pun (manusia atau AI)
> yang membuka folder ini langsung paham di mana harus menulis apa, bagaimana
> caranya, dan mengapa aturannya seperti itu.
>
> Scope frontend ini **hanya fitur Auth & Gateway** (Login, Register, Profile,
> Logout). Fitur Cycle/Mood/Analytics/Reminder dikerjakan terpisah oleh anggota lain.

---

## Daftar Isi

1. [Tech Stack](#1-tech-stack)
2. [Arsitektur — Presentational & Container Pattern](#2-arsitektur--presentational--container-pattern)
3. [Struktur Folder](#3-struktur-folder)
4. [Aturan Penulisan Kode per Folder](#4-aturan-penulisan-kode-per-folder)
5. [Cara Pakai TanStack Query](#5-cara-pakai-tanstack-query)
6. [Autentikasi & Token](#6-autentikasi--token)
7. [Commit Message Convention](#7-commit-message-convention)
8. [Branch Naming Convention](#8-branch-naming-convention)
9. [Cara Prompt ke AI yang Benar](#9-cara-prompt-ke-ai-yang-benar)

---

## 1. Tech Stack

| Library | Versi | Fungsi |
|---|---|---|
| React | 19 | UI framework |
| TypeScript | ~5.7 | Type safety |
| Vite | 6 | Build tool & dev server |
| React Router DOM | 7 | Client-side routing |
| TanStack Query (React Query) | 5 | Server state management (fetch, cache, mutate) |
| Axios | 1 | HTTP client |
| Tailwind CSS | 4 | Utility-first styling |

Backend yang dikonsumsi: **Auth & Gateway Service** (FastAPI) di `http://localhost:8000`.

---

## 2. Arsitektur — Presentational & Container Pattern

Project ini menggunakan **Presentational & Container Components Pattern**. Ini
satu-satunya pola yang boleh dipakai. Jangan campur.

### Prinsip Dasar

```
Container (ui/)
    │  → tahu dari mana data berasal
    │  → memanggil hooks (useQuery, useMutation, useContext)
    │  → menangani business logic & event handler
    ▼
Presentational (components/)
    │  → tidak tahu data datang dari mana
    │  → hanya menerima data & callback lewat props
    │  → hanya bertanggung jawab pada tampilan (JSX + Tailwind)
    ▼
   DOM
```

### Aturan Wajib

| Aturan | Container (`ui/`) | Presentational (`components/`) |
|---|---|---|
| Boleh pakai `useQuery` / `useMutation` | **Ya** | **Tidak** |
| Boleh pakai `useContext` | **Ya** | **Tidak** |
| Boleh punya `useState` untuk logika bisnis | **Ya** | Hanya UI state murni (input lokal, toggle) |
| Boleh merender JSX langsung | Seminimal mungkin | **Ya, di sini tempatnya** |
| Menerima data via props dari parent | Tidak | **Ya** |

### Alur Data yang Benar (contoh: Login)

```
pages/Login.tsx
    └── ui/LoginView.tsx          ← container: useAuthLogin, simpan token, navigate
           └── components/LoginForm.tsx   ← presentational: render form dari props
```

---

## 3. Struktur Folder

```
periodt-frontend/
├── public/                     aset statis
└── src/
    ├── assets/                 gambar yang di-import langsung di kode
    │
    ├── config/                 konfigurasi global
    │   └── apiUrl.ts           ← base URL Auth & Gateway Service
    │
    ├── context/                React Context — shared state ringan
    │   └── UserContext.tsx     ← data user yang sedang login
    │
    ├── hooks/                  custom hooks — semua komunikasi API ada di sini
    │   ├── useAuthLogin.ts
    │   ├── useAuthRegister.ts
    │   ├── useAuthLogout.ts
    │   ├── useFetchProfile.ts
    │   ├── useUpdateProfile.ts
    │   └── useDeleteAccount.ts
    │
    ├── components/             PRESENTATIONAL ONLY — hanya terima props, render UI
    │   ├── Button.tsx
    │   ├── LoginForm.tsx
    │   ├── RegisterForm.tsx
    │   ├── Navbar.tsx
    │   └── Profile.tsx
    │
    ├── ui/                     CONTAINER ONLY — ambil data, siapkan props, render komponen
    │   ├── LoginView.tsx
    │   ├── RegisterView.tsx
    │   ├── NavbarView.tsx
    │   └── ProfileView.tsx
    │
    ├── pages/                  route-level — hanya menyusun layout dari ui/
    │   ├── Login.tsx
    │   ├── Register.tsx
    │   └── Home.tsx            ← halaman setelah login (Navbar + Profile)
    │
    ├── App.tsx                 root component + routing
    ├── main.tsx                entry point + QueryClientProvider + BrowserRouter
    ├── index.css              global styles + Tailwind + tema brand
    └── vite-env.d.ts           tipe untuk import.meta.env
```

### Panduan Cepat: "File ini harus masuk folder mana?"

| Pertanyaan | Jawaban |
|---|---|
| Component yang fetch data sendiri? | `ui/` (container) |
| Component yang hanya render dari props? | `components/` (presentational) |
| Pemanggil `useQuery` / `useMutation`? | `hooks/` |
| Konfigurasi URL / env? | `config/` |
| Shared state antar component (mis. user login)? | `context/` |
| Halaman yang diakses lewat URL? | `pages/` |

---

## 4. Aturan Penulisan Kode per Folder

### `hooks/` — Custom Hooks

Setiap hook **membungkus satu operasi API**. Satu file = satu hook = satu operasi.

**Konvensi penamaan:**
- Fetch data: `useFetch[Resource].ts` → `useFetchProfile.ts`
- Mutation: `usePost`/`usePut`/`useDelete[Resource].ts` → `useUpdateProfile.ts`, `useDeleteAccount.ts`
- Auth: `useAuth[Action].ts` → `useAuthLogin.ts`, `useAuthRegister.ts`, `useAuthLogout.ts`

**Template GET (useQuery) — `useFetchProfile.ts`:**

```ts
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import ApiUrl from "../config/apiUrl";
import type { User } from "../context/UserContext";

// Fetcher WAJIB dipisah dari hook, bukan inline.
const fetchProfile = async (): Promise<User> => {
  const res = await axios.get(`${ApiUrl()}/users/me`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
  });
  return res.data;
};

export const useFetchProfile = () => {
  return useQuery({
    queryKey: ["profile"],                 // key unik untuk cache — gunakan noun
    queryFn: fetchProfile,
    enabled: !!localStorage.getItem("accessToken"),
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: false,
  });
};
```

**Template mutation (useMutation) — `useAuthLogin.ts`:**

```ts
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import ApiUrl from "../config/apiUrl";

interface LoginPayload { email: string; password: string; }
interface LoginResponse { access_token: string; token_type: string; }

const postLogin = async (payload: LoginPayload): Promise<LoginResponse> => {
  const res = await axios.post(`${ApiUrl()}/auth/login`, payload);
  return res.data;
};

export const useAuthLogin = () => {
  return useMutation({
    mutationKey: ["authLogin"],
    mutationFn: postLogin,
    // onSuccess/onError JANGAN di sini — taruh di container (ui/).
    // Kecuali side-effect yang selalu sama, mis. invalidate cache.
  });
};
```

---

### `components/` — Presentational Components

Aturan keras:
1. **Dilarang** import dari `hooks/`, `context/`
2. **Wajib** mendefinisikan type props secara eksplisit di atas component
3. Semua data & callback datang dari luar (props)
4. Boleh `useState` hanya untuk UI state murni

**Template — `Navbar.tsx`:**

```tsx
import type { User } from "../context/UserContext";

type NavbarProps = {
  user: User | null;
  onLogout: () => void;
};

export default function Navbar({ user, onLogout }: NavbarProps) {
  // TIDAK ADA useQuery / useContext / useMutation di sini.
  return (
    <nav className="...">
      {user && <span>{user.name}</span>}
      <button onClick={onLogout}>Logout</button>
    </nav>
  );
}
```

---

### `ui/` — Container Components

Aturan keras:
1. **Dilarang** menulis JSX banyak — idealnya hanya merender satu presentational component
2. **Wajib** menyiapkan semua data & handler sebelum `return`
3. Semua `onSuccess` / `onError` dari mutation ada di sini, bukan di `hooks/`

**Template — `LoginView.tsx`:**

```tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import { useAuthLogin } from "../hooks/useAuthLogin";
import LoginForm from "../components/LoginForm";

export default function LoginView() {
  const navigate = useNavigate();
  const loginMutation = useAuthLogin();          // 1. ambil hook
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>();

  const handleSubmit = () => {                    // 2. siapkan handler
    loginMutation.mutate(
      { email, password },
      {
        onSuccess: (data) => {
          localStorage.setItem("accessToken", data.access_token);
          navigate("/");
        },
        onError: (err) => {
          const detail = isAxiosError(err) ? err.response?.data?.detail : undefined;
          setError(detail ?? "Login gagal. Coba lagi.");
        },
      },
    );
  };

  return (                                        // 3. render satu presentational
    <LoginForm
      email={email}
      password={password}
      isPending={loginMutation.isPending}
      error={error}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onSubmit={handleSubmit}
    />
  );
}
```

---

### `pages/` — Page Components

Aturan keras:
1. **Hanya** menyusun layout dari container (`ui/`)
2. **Dilarang** menulis logika bisnis atau memanggil hook API langsung
3. Boleh memanggil hook "page-level setup" seperti `useFetchProfile` untuk menyediakan Context

**Template — `Home.tsx`:**

```tsx
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { useFetchProfile } from "../hooks/useFetchProfile";
import NavbarView from "../ui/NavbarView";
import ProfileView from "../ui/ProfileView";

export default function Home() {
  const token = localStorage.getItem("accessToken");
  const { data, isLoading, isError } = useFetchProfile();   // setup context

  if (!token) return <Navigate to="/login" replace />;       // guard
  if (isLoading) return <div>Memuat…</div>;
  if (isError || !data) return <Navigate to="/login" replace />;

  return (
    <UserContext value={data}>
      <NavbarView />
      <ProfileView />
    </UserContext>
  );
}
```

---

### `context/` — React Context

Hanya untuk **state ringan yang diakses banyak container** — di sini: data user
yang sedang login.

```tsx
import { createContext, useContext } from "react";

export type User = {
  id: number;
  email: string;
  name: string;
  date_of_birth?: string | null;
  created_at?: string;
};

export const UserContext = createContext<User | null>(null);
export const useUser = () => useContext(UserContext);
```

---

### `config/` — Konfigurasi Global

```ts
// config/apiUrl.ts
export default function ApiUrl(): string {
  return import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";
}
```

Buat `.env` di root folder ini (salin dari `.env.example`):

```env
VITE_API_BASE_URL=http://localhost:8000
```

---

## 5. Cara Pakai TanStack Query

### Setup (`main.tsx`)

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000 },
  },
});

// <QueryClientProvider client={queryClient}> ... </QueryClientProvider>
```

### useQuery — Mengambil Data (GET)

Dipakai di dalam `hooks/`, hasilnya dipakai di container (`ui/`).

```tsx
const { data, isLoading, isError, refetch } = useFetchProfile();
// data      → hasil fetch (undefined saat loading/error)
// isLoading → true saat fetch pertama
// isError   → true jika gagal
// refetch   → paksa fetch ulang
```

### useMutation — Mengubah Data (POST / PUT / DELETE)

`onSuccess` / `onError` ditaruh di container. Side-effect yang selalu sama
(mis. invalidate cache) boleh di hook:

```ts
// hooks/useUpdateProfile.ts
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["updateProfile"],
    mutationFn: putProfile,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["profile"] }),
  });
};
```

### Query Key Convention

```ts
queryKey: ["profile"]              // resource milik user yang login
queryKey: ["profile", userId]      // jika butuh per-user
```

**Aturan invalidasi:** jika mutation mengubah resource `X`, invalidate `["X"]`
di `onSuccess`. Contoh: `useUpdateProfile` meng-invalidate `["profile"]`.

---

## 6. Autentikasi & Token

- Login → backend mengembalikan `{ access_token }`. Token disimpan di
  `localStorage` dengan key **`accessToken`**.
- Setiap request yang butuh auth mengirim header
  `Authorization: Bearer <accessToken>`.
- Logout → hapus `accessToken` dari `localStorage` lalu arahkan ke `/login`.
- Halaman terproteksi (`Home`) mengecek token + hasil `useFetchProfile`; jika
  tidak valid → redirect ke `/login`.

| Aksi | Endpoint | Hook |
|---|---|---|
| Register | `POST /auth/register` | `useAuthRegister` |
| Login | `POST /auth/login` | `useAuthLogin` |
| Logout | `POST /auth/logout` | `useAuthLogout` |
| Lihat profil | `GET /users/me` | `useFetchProfile` |
| Update profil | `PUT /users/me` | `useUpdateProfile` |
| Hapus akun | `DELETE /users/me` | `useDeleteAccount` |

---

## 7. Commit Message Convention

Format: `<type>(<scope>): <deskripsi singkat>` — imperatif, lowercase, tanpa titik, maks 72 karakter.

| Type | Kapan Dipakai |
|---|---|
| `feat` | Menambahkan fitur baru |
| `fix` | Memperbaiki bug |
| `style` | Perubahan tampilan/CSS saja |
| `refactor` | Menyusun ulang kode tanpa ubah perilaku |
| `chore` | Konfigurasi, dependency, tooling |
| `docs` | Perubahan dokumentasi saja |

Contoh benar:

```
feat(auth): add login page with tanstack query
fix(profile): token not attached on update request
refactor(login): split LoginView into container and presentational
style(navbar): use brand color for logout button
docs: add frontend project guide
```

Contoh salah: `update`, `fix bug`, `Feat: Add login.`, `feat: add login + fix navbar`.

---

## 8. Branch Naming Convention

Format: `<type>/<short-description>` — **kebab-case**.

```
feat/auth-frontend
feat/profile-page
fix/token-not-saved-after-login
refactor/split-login-container
style/login-responsive
docs/add-frontend-guide
```

Aturan: branch dibuat dari `main`, jangan kerja langsung di `main`, hapus branch
setelah merge lewat Pull Request.

### Alur Kerja Singkat

```
main
 └── feat/auth-frontend          ← buat branch dari main
      └── (kerjakan fitur)
      └── push + buat Pull Request ke main
      └── review anggota tim
      └── merge ke main → hapus branch
```

---

## 9. Cara Prompt ke AI yang Benar

Tujuannya: AI tidak menghasilkan kode yang campur aduk dengan pola.

**Berikan konteks folder:**

```
buatkan presentational component di src/components/Profile.tsx yang menerima props:
user, name, dateOfBirth, onNameChange, onSave, onDelete.
Jangan panggil hook atau context apa pun di file ini.
```

**Tunjukkan pattern yang sudah ada:**

```
buat hook baru di src/hooks/useDeleteAccount.ts mengikuti pola useUpdateProfile.ts:
pisahkan fungsi axios dari hook, gunakan useMutation, kirim header Authorization Bearer.
```

**Batasi scope:**

```
ubah hanya src/ui/ProfileView.tsx. Tambahkan handler hapus akun yang memanggil
useDeleteAccount, taruh onSuccess/onError di sini. Jangan ubah file lain.
```

**Template prompt fitur baru:**

```
Saya ingin membuat fitur [nama fitur] untuk frontend Auth & Gateway.

Konteks project:
- Pattern: Presentational & Container
- components/ = presentational (props only, tanpa hook API/context)
- ui/ = container (fetch data + handle logic)
- hooks/ = custom hook dengan useQuery/useMutation
- pages/ = hanya menyusun layout dari ui/
- token disimpan di localStorage key "accessToken", header Authorization Bearer

File yang perlu dibuat/diubah:
1. src/hooks/use[Nama].ts      → [GET atau POST apa, ke endpoint mana]
2. src/components/[Nama].tsx   → [tampilkan apa, props apa]
3. src/ui/[Nama]View.tsx       → [pakai hook apa, render component apa]

Jangan ubah file di luar daftar di atas.
```
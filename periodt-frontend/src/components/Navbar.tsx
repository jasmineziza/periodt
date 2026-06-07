import type { User } from "../context/UserContext";

type NavbarProps = {
  user: User | null;
  onLogout: () => void;
  onProfile: () => void;
  onBrand: () => void;
};

export default function Navbar({ user, onLogout, onProfile, onBrand }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-10 flex items-center justify-between bg-white px-7 py-4 shadow-sm">
      <button onClick={onBrand} className="font-extrabold tracking-widest text-brand">
        PERIODT
      </button>
      <div className="flex items-center gap-3 text-sm">
        {user && (
          <button
            onClick={onProfile}
            className="flex items-center gap-2 rounded-lg px-2 py-1 font-semibold text-gray-700 transition-colors hover:bg-brand-light"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand font-bold text-white">
              {user.name.charAt(0).toUpperCase()}
            </span>
            <span>{user.name}</span>
          </button>
        )}
        <button
          onClick={onLogout}
          className="rounded-lg bg-brand px-3 py-1.5 font-semibold text-white transition-colors hover:bg-brand-dark"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

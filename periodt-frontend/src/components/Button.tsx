type ButtonProps = {
  children: React.ReactNode;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "danger" | "ghost";
  full?: boolean;
};

const styles: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "bg-brand text-white hover:bg-brand-dark",
  danger: "bg-red-600 text-white hover:bg-red-700",
  ghost: "bg-transparent text-brand hover:bg-brand-light",
};

export default function Button({
  children,
  type = "button",
  onClick,
  disabled = false,
  variant = "primary",
  full = false,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-60 ${
        styles[variant]
      } ${full ? "w-full" : ""}`}
    >
      {children}
    </button>
  );
}

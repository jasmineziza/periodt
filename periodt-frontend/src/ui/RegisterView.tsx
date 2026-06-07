import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import { useAuthRegister } from "../hooks/useAuthRegister";
import RegisterForm, { type RegisterFormValues } from "../components/RegisterForm";

export default function RegisterView() {
  const navigate = useNavigate();
  const registerMutation = useAuthRegister();
  const [values, setValues] = useState<RegisterFormValues>({
    name: "",
    email: "",
    password: "",
    date_of_birth: "",
  });
  const [error, setError] = useState<string>();

  const handleChange = (field: keyof RegisterFormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    setError(undefined);
    const payload = {
      name: values.name,
      email: values.email,
      password: values.password,
      ...(values.date_of_birth ? { date_of_birth: values.date_of_birth } : {}),
    };
    registerMutation.mutate(payload, {
      onSuccess: () => navigate("/login"),
      onError: (err) => {
        const detail = isAxiosError(err) ? err.response?.data?.detail : undefined;
        setError(detail ?? "Registrasi gagal. Coba lagi.");
      },
    });
  };

  return (
    <RegisterForm
      values={values}
      isPending={registerMutation.isPending}
      error={error}
      onChange={handleChange}
      onSubmit={handleSubmit}
    />
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import { useAuthLogin } from "../hooks/useAuthLogin";
import LoginForm from "../components/LoginForm";

export default function LoginView() {
  const navigate = useNavigate();
  const loginMutation = useAuthLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>();

  const handleSubmit = () => {
    setError(undefined);
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

  return (
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

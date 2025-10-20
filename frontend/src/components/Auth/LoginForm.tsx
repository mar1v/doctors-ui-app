import React, { useState } from "react";
import { loginUser, registerUser } from "../../api/authApi";
import AuthButton from "./AuthButton";
import AuthInput from "./AuthInput";
import AuthMessage from "./AuthMessage";
import AuthToggle from "./AuthToggle";

interface Props {
  onLogin: (token: string) => void;
}

export const LoginForm: React.FC<Props> = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isRegister) {
        await registerUser(email, password);
        setMessage("Реєстрація успішна. Тепер увійдіть.");
        setIsRegister(false);
      } else {
        const { token } = await loginUser(email, password);
        onLogin(token);
      }
    } catch (err) {
      console.error("handleSubmit error:", err);
      setMessage((err as Error).message || "Помилка");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold text-green-900 mb-6 text-center">
          {isRegister ? "Реєстрація" : "Вхід"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <AuthInput
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <AuthInput
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <AuthButton text={isRegister ? "Зареєструватися" : "Увійти"} />
        </form>

        <AuthToggle
          isRegister={isRegister}
          onToggle={() => setIsRegister(!isRegister)}
        />
        <AuthMessage message={message} />
      </div>
    </div>
  );
};

export default LoginForm;

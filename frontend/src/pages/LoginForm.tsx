import React, { useState } from "react";
import { loginUser, registerUser } from "../api/authApi";

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
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <button
            type="submit"
            className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            {isRegister ? "Зареєструватися" : "Увійти"}
          </button>
        </form>
        <p
          className="mt-4 text-blue-600 text-center cursor-pointer hover:underline"
          onClick={() => setIsRegister(!isRegister)}
        >
          {isRegister ? "Вже маєте акаунт?" : "Створити акаунт"}
        </p>
        {message && (
          <p className="mt-3 text-center text-red-500 font-medium">{message}</p>
        )}
      </div>
    </div>
  );
};

export default LoginForm;

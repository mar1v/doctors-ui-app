import Lottie from "lottie-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { loginUser, registerUser } from "../../api/authApi";
import greenLogo from "../../assets/green.json";
import AuthButton from "./AuthButton";
import AuthInput from "./AuthInput";
import AuthToggle from "./AuthToggle";

interface Props {
  onLogin: (token: string) => void;
}

const LoginForm: React.FC<Props> = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);

  const validateForm = () => {
    if (!email.trim() || !password.trim()) {
      toast.error("Заповніть усі поля");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Некоректний email");
      return false;
    }
    if (password.length < 6) {
      toast.error("Пароль має бути не менше 6 символів");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (isRegister) {
        await registerUser(email, password);
        toast.success("Реєстрація успішна! Тепер увійдіть.");
        setIsRegister(false);
      } else {
        const { token } = await loginUser(email, password);
        toast.success("Вхід виконано успішно!");
        onLogin(token);
      }
    } catch (err) {
      console.error("handleSubmit error:", err);
      toast.error("Помилка входу або реєстрації");
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-green-50">
      <div className="flex flex-col md:flex-row w-full max-w-[1200px] h-full md:h-[90vh] rounded-2xl overflow-hidden shadow-2xl bg-white">
        <div className="flex-[2] flex items-center justify-center bg-green-100 p-8 md:p-12 relative">
          <div className="w-64 h-64 sm:w-80 sm:h-80 md:w-[400px] md:h-[400px] xl:w-[500px] xl:h-[500px]">
            <Lottie animationData={greenLogo} loop={false} autoplay={true} />
          </div>
        </div>

        <div className="flex-[1] flex items-center justify-center p-6 sm:p-10 md:p-12 bg-white">
          <div className="w-full max-w-sm">
            <h2 className="text-3xl md:text-4xl font-semibold text-green-900 mb-8 text-center">
              {isRegister ? "Реєстрація" : "Вхід"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
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

            <div className="mt-6">
              <AuthToggle
                isRegister={isRegister}
                onToggle={() => setIsRegister(!isRegister)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;

import React from "react";

interface Props {
  isRegister: boolean;
  onToggle: () => void;
}

const AuthToggle: React.FC<Props> = ({ isRegister, onToggle }) => (
  <p
    className="mt-4 text-blue-600 text-center cursor-pointer hover:underline"
    onClick={onToggle}
  >
    {isRegister ? "Вже маєте акаунт?" : "Створити акаунт"}
  </p>
);

export default AuthToggle;

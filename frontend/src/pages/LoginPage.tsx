import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/Auth/LoginForm";
import { useAuth } from "../hooks/useAuth";

const LoginPage: React.FC = () => {
  const { login, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) navigate("/patients");
  }, [token, navigate]);
  return <LoginForm onLogin={login} />;
};

export default LoginPage;

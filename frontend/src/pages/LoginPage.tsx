import LoginForm from "#components/Auth/LoginForm";
import { useAuth } from "#hooks/useAuth";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) navigate("/patients");
  }, [token, navigate]);
  return <LoginForm />;
};

export default LoginPage;

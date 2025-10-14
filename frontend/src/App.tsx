import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setAuthToken } from "./api/examsApi";
import { AppRouter } from "./components/AppRouter";

const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = (newToken: string) => {
    setToken(newToken);
    setAuthToken(newToken);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-green-50 p-4">
      <AppRouter token={token} onLogin={handleLogin} />
    </div>
  );
};

export default App;

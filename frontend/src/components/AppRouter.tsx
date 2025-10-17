import { Route, Routes } from "react-router-dom";
import { CreateReportPage, LoginForm, PatientListPage } from "../pages";
import PrivateRoute from "./PrivateRoute";

interface AppRouterProps {
  token: string | null;
  onLogin?: (token: string) => void;
}

export const AppRouter: React.FC<AppRouterProps> = ({ token, onLogin }) => {
  return (
    <Routes>
      <Route
        path="/login"
        element={<LoginForm onLogin={onLogin || (() => {})} />}
      />

      <Route
        path="/patients"
        element={
          <PrivateRoute token={token}>
            <PatientListPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/create-report/:patientId"
        element={
          <PrivateRoute token={token}>
            <CreateReportPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/"
        element={
          <PrivateRoute token={token}>
            <PatientListPage />
          </PrivateRoute>
        }
      />

      <Route path="*" element={<h1>404</h1>} />
    </Routes>
  );
};

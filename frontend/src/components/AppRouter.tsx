import { Route, Routes } from "react-router-dom";
import {
  CreateReportPage,
  ErrorPage,
  LoginPage,
  NotFoundPage,
  PatientListPage,
} from "../pages";
import PrivateRoute from "./PrivateRoute";

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/patients"
        element={
          <PrivateRoute>
            <PatientListPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/create-report/:patientId"
        element={
          <PrivateRoute>
            <CreateReportPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <PatientListPage />
          </PrivateRoute>
        }
      />
      <Route path="/error" element={<ErrorPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

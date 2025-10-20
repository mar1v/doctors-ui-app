import { LoginPage, PatientListPage } from "../pages";

export const routes = [
  {
    path: "/",
    component: PatientListPage,
  },
  {
    path: "/login",
    component: LoginPage,
  },
];

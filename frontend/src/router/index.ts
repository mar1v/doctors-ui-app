import { LoginForm, PatientListPage } from "../pages";

export const routes = [
  {
    path: "/",
    component: PatientListPage,
  },
  {
    path: "/login",
    component: LoginForm,
  },
];

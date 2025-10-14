import { LoginForm, PatientList } from "../pages";

export const routes = [
  {
    path: "/",
    component: PatientList,
  },
  {
    path: "/login",
    component: LoginForm,
  },
];
